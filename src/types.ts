export interface Profile {
  id: string;
  full_name: string;
  email: string | null;
  bringing_guest: boolean;
  guest_name: string | null;
}

export interface GiftProgress {
  id: string;
  category: string;
  title: string;
  description: string | null;
  icon: string | null;
  target_amount: number;
  sort_order: number;
  raised_amount: number;
  is_complete: boolean;
}

export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
  bringingGuest: boolean;
  guestName: string;
}
