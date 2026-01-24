import { api } from "src/lib/api";

export type BranchPayload = {
  tenant_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
};

export const fetchBranches = async (page: number = 1, perPage: number = 15) => {
  const response = await api.get(`/branches?page=${page}&per_page=${perPage}`);
  return response.data;
};

export const createBranch = async (payload: BranchPayload) => {
  const response = await api.post("/branches", payload);
  return response.data;
};
