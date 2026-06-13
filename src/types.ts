export interface Profile {
  id: string;
  full_name: string;
  email: string | null;
  bringing_guest: boolean;
  guest_name: string | null;
  is_admin: boolean;
  /** null = ainda não respondeu; true/false = vai / não vai. */
  attending: boolean | null;
}

export interface Companion {
  id: string;
  profile_id: string;
  full_name: string;
  attending: boolean;
}

export interface GiftProgress {
  id: string;
  category: string;
  title: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  target_amount: number;
  sort_order: number;
  raised_amount: number;
  is_complete: boolean;
}

export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
  companions: string[];
}
