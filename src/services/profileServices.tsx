import { api } from "src/lib/api";

export type ProfileUser = {
  id: number;
  tenant_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  is_super_admin: number | boolean;
};

export type ProfileResponse = {
  user: ProfileUser;
  roles: string[];
  permissions: string[];
};

export const fetchProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get<ProfileResponse>("/profile");
  return response.data;
};
