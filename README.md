# Casamento Ana & Carlos

Site de casamento com área exclusiva para convidados, lista de presentes e
contribuição via **Pix estático (BR Code)**. Stack: **Vite + React + TS +
Supabase + Tailwind**.

## Setup

```bash
npm install
cp .env.example .env   # preencha as variáveis
npm run dev
```

### Supabase

1. Crie um projeto em supabase.com e copie `Project URL` e `anon key` para o `.env`.
2. No **SQL Editor**, rode `supabase/migrations/0001_init.sql`.
3. (Dev) Em **Authentication → Providers → Email**, desative "Confirm email"
   para testar o login imediatamente. Em produção, mantenha ativo.

O trigger `handle_new_user` cria o registro em `profiles` a partir do
`user_metadata` enviado no signup (nome, acompanhante). RLS garante que cada
convidado só lê/edita o próprio perfil.

### Pix

As variáveis `VITE_PIX_KEY`, `VITE_PIX_MERCHANT_NAME` e
`VITE_PIX_MERCHANT_CITY` definem o recebedor. A **chave Pix** (e-mail/CPF/etc.)
é o que vincula o pagamento à conta bancária do casal — o QR é gerado no
padrão EMV do Banco Central, sem PSP.

> **Limite do Pix estático:** não há confirmação automática de pagamento.
> A contribuição é registrada quando o convidado clica em "Confirmar
> Contribuição". Para conciliação automática, migrar para Pix dinâmico
> (Mercado Pago, Efí, Asaas…) com webhook — ver seção abaixo.

## Arquitetura

| Camada    | Responsável                                                      |
|-----------|-----------------------------------------------------------------|
| Auth      | `AuthContext` + Supabase Auth, `ProtectedRoute` protege as rotas |
| Dados     | `profiles`, `gifts`, `contributions` + view `gift_progress`      |
| Pix       | `lib/pix.ts` (EMV + CRC16) → `qrcode` renderiza o QR             |

## Evolução para Pix dinâmico (futuro)

Trocar `lib/pix.ts` por uma chamada a uma Edge Function que cria a cobrança no
PSP e retorna o `qrcode`/`txid`. Um webhook do PSP atualiza
`contributions.status` para `confirmed`, e a view de progresso passa a refletir
pagamentos reais sem ação do convidado.

## Testes

```bash
npm test   # valida CRC16 e o payload do BR Code
```
