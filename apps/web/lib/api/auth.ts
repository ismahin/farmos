import { apiFetch } from "./client";
import type { LoginRequest, LoginResponse, MeResponse } from "./types";

export const authApi = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiFetch<LoginResponse>("/api/v1/auth/login", {
      method: "POST",
      sessionTransport: "cookie",
      body: request,
    });
    return data;
  },

  async logout(): Promise<void> {
    await apiFetch<void>("/api/v1/auth/logout", {
      method: "POST",
    });
  },

  async getMe(): Promise<MeResponse> {
    const { data } = await apiFetch<MeResponse>("/api/v1/me", {
      method: "GET",
    });
    return data;
  },
};

