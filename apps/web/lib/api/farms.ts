import { apiFetch, generateIdempotencyKey, type ApiResponse } from "./client";
import type {
  CreateFarmRequest,
  FarmView,
  ListFarmsQuery,
  ListFarmsResponse,
  UpdateFarmRequest,
} from "./types";

export const farmsApi = {
  async list(query?: ListFarmsQuery): Promise<ListFarmsResponse> {
    const params = new URLSearchParams();
    if (query?.pageSize) params.set("pageSize", String(query.pageSize));
    if (query?.cursor) params.set("cursor", query.cursor);
    const queryString = params.toString() ? `?${params.toString()}` : "";

    const { data } = await apiFetch<ListFarmsResponse>(`/api/v1/farms${queryString}`, {
      method: "GET",
    });
    return data;
  },

  async get(id: string): Promise<ApiResponse<FarmView>> {
    return apiFetch<FarmView>(`/api/v1/farms/${id}`, {
      method: "GET",
    });
  },

  async create(
    request: CreateFarmRequest,
    idempotencyKey = generateIdempotencyKey()
  ): Promise<FarmView> {
    const { data } = await apiFetch<FarmView>("/api/v1/farms", {
      method: "POST",
      idempotencyKey,
      body: request,
    });
    return data;
  },

  async update(
    id: string,
    etag: string,
    request: UpdateFarmRequest
  ): Promise<ApiResponse<FarmView>> {
    return apiFetch<FarmView>(`/api/v1/farms/${id}`, {
      method: "PATCH",
      ifMatch: etag,
      body: request,
    });
  },
};

