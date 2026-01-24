import { api } from "src/lib/api";

export const fetchOrganizations = async (page: number = 1, perPage: number = 10) => {
  const response = await api.get(`/all-tenant?page=${page}&per_page=${perPage}`);
  return response.data;
};

export const fetchTenants= async()=>{
  const response = await api.get(`/tenants`);
  return response.data;
};