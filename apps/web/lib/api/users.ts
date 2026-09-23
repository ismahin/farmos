import { apiFetch } from "./client";
import type {
  AssignFarmRequest,
  AssignRoleRequest,
  CreateUserRequest,
  UserView,
} from "./types";

export const usersApi = {
  async list(): Promise<UserView[]> {
    const { data } = await apiFetch<UserView[]>("/api/v1/users", {
      method: "GET",
    });
    return data;
  },

  async create(request: CreateUserRequest): Promise<UserView> {
    const { data } = await apiFetch<UserView>("/api/v1/users", {
      method: "POST",
      body: request,
    });
    return data;
  },

  async assignRole(userId: string, request: AssignRoleRequest): Promise<void> {
    await apiFetch<void>(`/api/v1/users/${userId}/role-assignments`, {
      method: "POST",
      body: request,
    });
  },

  async assignFarm(userId: string, request: AssignFarmRequest): Promise<void> {
    await apiFetch<void>(`/api/v1/users/${userId}/farm-assignments`, {
      method: "POST",
      body: request,
    });
  },
};

