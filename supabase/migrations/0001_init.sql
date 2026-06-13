-- =====================================================================
-- Casamento Ana & Carlos — schema, RLS, trigger e seed
-- Aplicar via Supabase SQL Editor ou `supabase db push`
-- Postgres 15+ (security_invoker em views)
-- =====================================================================

-- ---------- PROFILES ----------------------------------------------------
create table if not exists public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  full_name       text not null,
  email           text,
  bringing_guest  boolean not null default false,
  guest_name      text,
  created_at      timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Profile criado automaticamente a partir do metadata do signUp.
-- security definer: roda com privilégio do owner, ignorando RLS no insert.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, bringing_guest, guest_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email,
    coalesce((new.raw_user_meta_data ->> 'bringing_guest')::boolean, false),
    nullif(new.raw_user_meta_data ->> 'guest_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- GIFTS -------------------------------------------------------
create table if not exists public.gifts (
  id             uuid primary key default gen_random_uuid(),
  category       text not null,
  title          text not null,
  description    text,
  icon           text,
  target_amount  numeric(10,2) not null check (target_amount > 0),
  sort_order     int not null default 0,
  created_at     timestamptz not null default now()
);

alter table public.gifts enable row level security;

drop policy if exists "gifts_select_auth" on public.gifts;
create policy "gifts_select_auth"
  on public.gifts for select
  to authenticated
  using (true);

-- ---------- CONTRIBUTIONS ----------------------------------------------
create table if not exists public.contributions (
  id               uuid primary key default gen_random_uuid(),
  gift_id          uuid not null references public.gifts (id) on delete cascade,
  user_id          uuid references auth.users (id) on delete set null,
  contributor_name text,
  amount           numeric(10,2) not null check (amount > 0),
  status           text not null default 'confirmed'
                     check (status in ('pending', 'confirmed')),
  txid             text,
  created_at       timestamptz not null default now()
);

alter table public.contributions enable row level security;

drop policy if exists "contrib_select_auth" on public.contributions;
create policy "contrib_select_auth"
  on public.contributions for select
  to authenticated
  using (true);

-- Só pode inserir contribuição em nome de si mesmo.
drop policy if exists "contrib_insert_own" on public.contributions;
create policy "contrib_insert_own"
  on public.contributions for insert
  to authenticated
  with check (auth.uid() = user_id);

create index if not exists idx_contrib_gift on public.contributions (gift_id);

-- ---------- VIEW DE PROGRESSO ------------------------------------------
-- security_invoker respeita a RLS de quem consulta (Postgres 15+).
create or replace view public.gift_progress
with (security_invoker = on) as
select
  g.id,
  g.category,
  g.title,
  g.description,
  g.icon,
  g.target_amount,
  g.sort_order,
  coalesce(sum(c.amount) filter (where c.status = 'confirmed'), 0)::numeric(10,2) as raised_amount,
  (coalesce(sum(c.amount) filter (where c.status = 'confirmed'), 0) >= g.target_amount) as is_complete
from public.gifts g
left join public.contributions c on c.gift_id = g.id
group by g.id;

-- ---------- SEED (idempotente) -----------------------------------------
insert into public.gifts (category, title, description, icon, target_amount, sort_order)
select * from (values
  ('Lar & Conforto', 'Jogo de Cama King Size',     'Jogo de cama bordado 1000 fios, 4 peças, na cor off-white',        '🛏️', 650.00,  1),
  ('Lar & Conforto', 'Toalhas de Banho Premium',   'Kit com 6 toalhas de algodão egípcio, cor champagne',             '🛁', 320.00,  2),
  ('Cozinha',        'Jogo de Panelas Le Creuset', 'Conjunto de panelas de ferro fundido esmaltado, 5 peças',         '🍲', 1890.00, 3),
  ('Cozinha',        'Cafeteira Nespresso',        'Cafeteira Nespresso Vertuo Next com 50 cápsulas',                 '☕', 780.00,  4),
  ('Experiências',   'Jantar Romântico',           'Jantar a dois em restaurante renomado em Lisboa',                 '🍽️', 400.00,  5),
  ('Experiências',   'Viagem de Lua de Mel',       'Contribuição para a lua de mel em Maldivas',                      '✈️', 5000.00, 6),
  ('Decoração',      'Quadro Autoral',             'Obra de arte para a sala do novo lar',                            '🖼️', 600.00,  7)
) as v(category, title, description, icon, target_amount, sort_order)
where not exists (select 1 from public.gifts);
