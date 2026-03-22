export type Trip = {
  id: number;
  name: string;
  description: string;
  country: string;
  city: string;
  start_date: string;
  end_date: string;
  owner_id: string;
  owner_name: string;
  member_count: number;
  created_at: string;
};

export type TripMember = {
  id: string;
  name: string;
  email: string;
  joined_at: string;
};

export type TripDetail = Trip & {
  members: TripMember[];
};

export type InviteCode = {
  code: string;
  expires_at: string;
};
