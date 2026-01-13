// lib/api.ts
import axios from "axios";
export const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: false,
});

// attach token for later calls
api.interceptors.request.use(cfg => {
  const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

const isGlobalAlertStatus = (status?: number) => {
  if (!status) return true;
  return status === 401 || status === 403 || status >= 500;
};

const getApiErrorText = (error: unknown) => {
  if (typeof error !== "object" || error === null) {
    return "Something went wrong. Please try again.";
  }

  const maybeResponse = error as {
    message?: string;
    response?: {
      status?: number;
      data?: {
        message?: string;
        error?: string;
        errors?: Record<string, string[]>;
      };
    };
  };

  const data = maybeResponse.response?.data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;

  if (data?.errors) {
    const firstKey = Object.keys(data.errors)[0];
    if (firstKey && data.errors[firstKey]?.length) {
      return data.errors[firstKey][0];
    }
  }

  if (maybeResponse.message) return maybeResponse.message;
  return "Something went wrong. Please try again.";
};

let isAlertOpen = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;

    if (typeof window !== "undefined" && !isAlertOpen && isGlobalAlertStatus(status)) {
      isAlertOpen = true;
      const message = getApiErrorText(error);

      const title = (() => {
        if (status === 401) return "Unauthorized";
        if (status === 403) return "Access denied";
        if (status && status >= 500) return "Server error";
        if (!status) return "Network error";
        return "Request failed";
      })();

      try {
        const { default: Swal } = await import("sweetalert2");
        await Swal.fire({
          icon: "error",
          title,
          text: message,
          confirmButtonColor: "#dc2626",
        });
      } catch (swalError) {
        console.error("Failed to show alert:", swalError);
      } finally {
        isAlertOpen = false;
      }
    }

    return Promise.reject(error);
  }
);
