import { apiFetch, generateIdempotencyKey, type ApiResponse } from "./client";
import type {
  CreateOrganizationRequest,
  OrganizationView,
  UpdateOrganizationRequest,
} from "./types";

export const organizationsApi = {
  async get(id: string): Promise<ApiResponse<OrganizationView>> {
    return apiFetch<OrganizationView>(`/api/v1/organizations/${id}`, {
      method: "GET",
    });
  },

  async create(
    request: CreateOrganizationRequest,
    idempotencyKey = generateIdempotencyKey()
  ): Promise<OrganizationView> {
    const { data } = await apiFetch<OrganizationView>("/api/v1/organizations", {
      method: "POST",
      idempotencyKey,
      body: request,
    });
    return data;
  },

  async update(
    id: string,
    etag: string,
    request: UpdateOrganizationRequest
  ): Promise<ApiResponse<OrganizationView>> {
    return apiFetch<OrganizationView>(`/api/v1/organizations/${id}`, {
      method: "PATCH",
      ifMatch: etag,
      body: request,
    });
  },
};

