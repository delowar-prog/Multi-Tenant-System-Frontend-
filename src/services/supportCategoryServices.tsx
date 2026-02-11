import { api } from "src/lib/api";

export const createSupportCategory = async (data: { name: string }) => {
  const response = await api.post("/support-categories", data);
  return response.data;
};
