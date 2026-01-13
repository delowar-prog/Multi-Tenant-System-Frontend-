import { api } from "src/lib/api";

export type ProfileUser = {
  id: number;
  tenant_id: string | null;
  plan_id?: number | null;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  is_super_admin: number | boolean;
  plan?: ProfilePlan | null;
};

export type ProfilePlan = {
  id: number;
  name: string;
  price: string | number;
  duration_days: number;
  features?: string | Record<string, unknown>;
};

export type ProfileResponse = {
  user: ProfileUser;
  roles: string[];
  permissions: string[];
  plan?: ProfilePlan | null;
};

export const fetchProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get<ProfileResponse>("/profile");
  return response.data;
};
