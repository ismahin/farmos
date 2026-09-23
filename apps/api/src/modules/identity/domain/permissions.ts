export const Permissions = {
  OrganizationRead: "organization.read",
  OrganizationManage: "organization.manage",
  FarmRead: "farm.read",
  FarmCreate: "farm.create",
  FarmUpdate: "farm.update",
  UsersRead: "users.read",
  UsersManage: "users.manage",
  RolesRead: "roles.read",
  RolesManage: "roles.manage",
} as const;

export const foundationPermissionCodes = Object.values(Permissions);
