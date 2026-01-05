import { api } from "src/lib/api";

export const permissions = async (page: number = 1, perPage: number = 10) => {
  const response = await api.get(`/permissions?page=${page}&per_page=${perPage}`);
  return response.data;
};

export const fetchAllPermissions = async () => {
  const response = await api.get('/all-permissions');
  const data = response?.data?.data ?? response?.data ?? [];
  return Array.isArray(data) ? data : [];
};
