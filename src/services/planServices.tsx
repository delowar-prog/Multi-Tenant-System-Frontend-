import { api } from "src/lib/api";

export interface LandingPlanApi {
  id: number;
  name: string;
  price: string | number;
  duration_days: number;
  features: string | Record<string, unknown>;
}

export const fetchLandingPlans = async (): Promise<LandingPlanApi[]> => {
  const response = await api.get("/landing/plans");
  const data = response.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};
