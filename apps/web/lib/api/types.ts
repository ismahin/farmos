export interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  code: string;
  message: string;
  correlationId?: string;
  fieldErrors?: Array<{ field: string; code: string; message: string }>;
  details?: Record<string, unknown>;
}

export interface UserSummary {
  id: string;
  displayName: string;
  email: string;
}

export interface TenantSummary {
  id: string;
  displayName: string;
}

export interface AccessibleFarmSummary {
  id: string;
  code: string;
  displayName: string;
}

export interface FarmScopeSummary {
  allFarms: boolean;
  accessibleFarms: AccessibleFarmSummary[];
  truncated: boolean;
}

export interface MeResponse {
  user: UserSummary;
  tenant: TenantSummary;
  permissions: string[];
  farmScope: FarmScopeSummary;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  authenticated: boolean;
  expiresAt?: string;
}

export interface OrganizationView {
  id: string;
  code: string;
  displayName: string;
  status: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationRequest {
  code: string;
  displayName: string;
  legalName: string;
  baseCurrency: string;
}

export interface UpdateOrganizationRequest {
  displayName: string;
}

export interface FarmView {
  id: string;
  organizationId: string;
  code: string;
  displayName: string;
  timezone: string;
  status: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFarmRequest {
  organizationId: string;
  code: string;
  displayName: string;
  timezone: string;
}

export interface UpdateFarmRequest {
  displayName: string;
  timezone: string;
}

export interface ListFarmsQuery {
  pageSize?: number;
  cursor?: string;
}

export interface ListFarmsResponse {
  items: FarmView[];
  page: {
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export interface UserView {
  id: string;
  email: string;
  displayName: string;
  status: string;
  isTenantOwner: boolean;
}

export interface CreateUserRequest {
  email: string;
  displayName: string;
  temporaryPassword: string;
}

export interface RoleView {
  id: string;
  code: string;
  displayName: string;
  version: number;
}

export interface AssignRoleRequest {
  roleId: string;
}

export interface AssignFarmRequest {
  farmId: string;
}

export interface AuditRecordView {
  id: string;
  tenantId: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  change: Record<string, unknown>;
  occurredAt: string;
  source: string;
}

