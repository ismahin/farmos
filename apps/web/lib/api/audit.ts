import { apiFetch } from "./client";
import type { AuditRecordView } from "./types";

export const auditApi = {
  async list(limit = 50): Promise<AuditRecordView[]> {
    const { data } = await apiFetch<AuditRecordView[]>(`/api/v1/audit?limit=${limit}`, {
      method: "GET",
    });
    return data;
  },
};

