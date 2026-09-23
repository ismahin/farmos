import { apiFetch } from "./client";
import type { RoleView } from "./types";

export const rolesApi = {
  async list(): Promise<RoleView[]> {
    const { data } = await apiFetch<RoleView[]>("/api/v1/roles", {
      method: "GET",
    });
    return data;
  },
};

