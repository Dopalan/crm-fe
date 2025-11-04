// src/api/auth.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";


export const api = axios.create({
  baseURL: API_BASE_URL,
  
});


api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        
      } catch {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);


export async function loginApi(email: string, password: string) {
  try {
    const response = await api.post("/auth/login", { email, password });

    const metadataData = response?.data?.metadata?.data ?? null;

    if (!metadataData) {
      throw new Error(response?.data?.message || "Đăng nhập thất bại");
    }

    const { accessToken, refreshToken } = metadataData;

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      api.defaults.headers.Authorization = `Bearer ${accessToken}`;
    }

    return metadataData; 
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || "Đăng nhập thất bại, vui lòng thử lại";
    throw new Error(message);
  }
}

export async function refreshTokenApi() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("Missing refresh token");

  const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
    refreshToken,
  });

  const metadataData = response?.data?.metadata?.data ?? {};
  const { accessToken, refreshToken: newRefresh } = metadataData;

  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (newRefresh) localStorage.setItem("refreshToken", newRefresh);

  api.defaults.headers.Authorization = `Bearer ${accessToken}`;

  return { accessToken, refreshToken: newRefresh };
}

export async function logoutApi() {
  const refreshToken = localStorage.getItem("refreshToken");
  await api.post("/auth/logout", { refreshToken });
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export async function registerApi(username: string, email: string, password: string) {
  try {
    const response = await api.post("/auth/register", { username, email, password });

    const metadataData = response?.data?.metadata?.data ?? null;
    if (metadataData?.accessToken && metadataData?.refreshToken) {
      const { accessToken, refreshToken } = metadataData;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      api.defaults.headers.Authorization = `Bearer ${accessToken}`;
      return { accessToken, refreshToken };
    }

    return metadataData ?? response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error?.message || "Đăng ký thất bại, vui lòng thử lại";
    throw new Error(message);
  }
}
