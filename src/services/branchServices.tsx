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

export const fetchAllBranches = async () => {
  const response = await api.get("/branches?per_page=100");
  const payload = response.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export const createBranch = async (payload: BranchPayload) => {
  const response = await api.post("/branches", payload);
  return response.data;
};

export const fetchBranchSelect = async () => {
  const response = await api.get("/branches/select");
  return response.data;
};
