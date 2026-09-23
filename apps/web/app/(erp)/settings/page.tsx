"use client";

import * as React from "react";
import {
  Bell,
  Building2,
  CheckCircle2,
  FileText,
  Globe,
  Key,
  Layers,
  Lock,
  Plus,
  RefreshCw,
  Save,
  Shield,
  ShieldAlert,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useShell } from "@/components/shell";
import {
  auditApi,
  farmsApi,
  formatApiErrorMessage,
  isApiProblemError,
  organizationsApi,
  rolesApi,
  usersApi,
  type AuditRecordView,
  type FarmView,
  type OrganizationView,
  type RoleView,
  type UserView,
} from "@/lib/api";

export default function SettingsPage() {
  const { organization, farms, currentFarm } = useShell();
  const { auth } = useShell();
  const tenantId = auth.tenant?.id;
  const hasPermission = auth.hasPermission;
  const refreshSession = auth.refreshSession;
  const [activeTab, setActiveTab] = React.useState("org");
  const [savedNotice, setSavedNotice] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSave = (e: React.FormEvent) => {
  // Tab 1: Organization State
  const [orgData, setOrgData] = React.useState<OrganizationView | null>(null);
  const [orgEtag, setOrgEtag] = React.useState<string | null>(null);
  const [orgDisplayName, setOrgDisplayName] = React.useState("");
  const [isLoadingOrg, setIsLoadingOrg] = React.useState(false);
  const [isSavingOrg, setIsSavingOrg] = React.useState(false);

  // Tab 2: Farms State
  const [farmsList, setFarmsList] = React.useState<FarmView[]>([]);
  const [isLoadingFarms, setIsLoadingFarms] = React.useState(false);
  const [createFarmModalOpen, setCreateFarmModalOpen] = React.useState(false);
  const [editFarmModalOpen, setEditFarmModalOpen] = React.useState(false);
  const [editingFarm, setEditingFarm] = React.useState<FarmView | null>(null);
  const [newFarmCode, setNewFarmCode] = React.useState("");
  const [newFarmName, setNewFarmName] = React.useState("");
  const [newFarmTimezone, setNewFarmTimezone] = React.useState("Asia/Dhaka");
  const [editFarmName, setEditFarmName] = React.useState("");
  const [editFarmTimezone, setEditFarmTimezone] = React.useState("");
  const [isSubmittingFarm, setIsSubmittingFarm] = React.useState(false);

  // Tab 3: Users & Roles State
  const [usersList, setUsersList] = React.useState<UserView[]>([]);
  const [rolesList, setRolesList] = React.useState<RoleView[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(false);
  const [createUserModalOpen, setCreateUserModalOpen] = React.useState(false);
  const [assignRoleModalOpen, setAssignRoleModalOpen] = React.useState(false);
  const [assignFarmModalOpen, setAssignFarmModalOpen] = React.useState(false);
  const [targetUser, setTargetUser] = React.useState<UserView | null>(null);
  const [newEmail, setNewEmail] = React.useState("");
  const [newDisplayName, setNewDisplayName] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [selectedRoleId, setSelectedRoleId] = React.useState("");
  const [selectedFarmId, setSelectedFarmId] = React.useState("");
  const [isSubmittingUserAction, setIsSubmittingUserAction] = React.useState(false);

  // Tab 4: Audit State
  const [auditRecords, setAuditRecords] = React.useState<AuditRecordView[]>([]);
  const [isLoadingAudit, setIsLoadingAudit] = React.useState(false);

  // Prototype preference notice
  const [prototypeSaved, setPrototypeSaved] = React.useState(false);

  const showStatus = (text: string, type: "success" | "error" = "success") => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // Load Organization
  const loadOrganization = React.useCallback(async () => {
    if (!tenantId || !hasPermission("organization.read")) return;
    setIsLoadingOrg(true);
    try {
      const response = await organizationsApi.get(tenantId);
      setOrgData(response.data);
      setOrgDisplayName(response.data.displayName);
      setOrgEtag(response.etag || `"${response.data.version}"`);
    } catch (err) {
      showStatus(formatApiErrorMessage(err, "Failed to load organization settings"), "error");
    } finally {
      setIsLoadingOrg(false);
    }
  }, [tenantId, hasPermission]);

  // Load Farms
  const loadFarms = React.useCallback(async () => {
    if (!hasPermission("farm.read")) return;
    setIsLoadingFarms(true);
    try {
      const response = await farmsApi.list({ pageSize: 100 });
      setFarmsList(response.items);
    } catch (err) {
      showStatus(formatApiErrorMessage(err, "Failed to load farms"), "error");
    } finally {
      setIsLoadingFarms(false);
    }
  }, [hasPermission]);

  // Load Users & Roles
  const loadUsersAndRoles = React.useCallback(async () => {
    if (hasPermission("users.read")) {
      setIsLoadingUsers(true);
      try {
        const users = await usersApi.list();
        setUsersList(users);
      } catch (err) {
        showStatus(formatApiErrorMessage(err, "Failed to load users"), "error");
      } finally {
        setIsLoadingUsers(false);
      }
    }
    if (hasPermission("roles.read")) {
      try {
        const roles = await rolesApi.list();
        setRolesList(roles);
      } catch {
        // Ignore roles fetch failure
      }
    }
  }, [hasPermission]);

  // Load Audit
  const loadAudit = React.useCallback(async () => {
    if (!hasPermission("users.read")) return;
    setIsLoadingAudit(true);
    try {
      const logs = await auditApi.list(50);
      setAuditRecords(logs);
    } catch (err) {
      showStatus(formatApiErrorMessage(err, "Failed to load audit logs"), "error");
    } finally {
      setIsLoadingAudit(false);
    }
  }, [hasPermission]);

  // Initial load depending on active tab
  React.useEffect(() => {
    if (activeTab === "org") void loadOrganization();
    if (activeTab === "farms") void loadFarms();
    if (activeTab === "users") void loadUsersAndRoles();
    if (activeTab === "audit") void loadAudit();
  }, [activeTab, loadOrganization, loadFarms, loadUsersAndRoles, loadAudit]);

  // Organization update handler
  const handleSaveOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
    if (!orgData || !orgEtag || !auth.hasPermission("organization.manage")) return;
    setIsSavingOrg(true);
    try {
      const response = await organizationsApi.update(orgData.id, orgEtag, {
        displayName: orgDisplayName.trim(),
      });
      setOrgData(response.data);
      setOrgEtag(response.etag || `"${response.data.version}"`);
      await auth.refreshSession();
      showStatus("Organization settings updated successfully.");
    } catch (err) {
      if (isApiProblemError(err) && err.status === 412) {
        showStatus("Concurrency Conflict: Organization was modified by another session. Refreshing...", "error");
        await loadOrganization();
      } else {
        showStatus(formatApiErrorMessage(err, "Failed to update organization"), "error");
      }
    } finally {
      setIsSavingOrg(false);
    }
  };

  // Create Farm handler
  const handleCreateFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.tenant?.id || !auth.hasPermission("farm.create")) return;
    setIsSubmittingFarm(true);
    try {
      await farmsApi.create({
        organizationId: auth.tenant.id,
        code: newFarmCode.trim().toUpperCase(),
        displayName: newFarmName.trim(),
        timezone: newFarmTimezone.trim(),
      });
      setCreateFarmModalOpen(false);
      setNewFarmCode("");
      setNewFarmName("");
      await loadFarms();
      await auth.refreshSession();
      showStatus("Farm created successfully.");
    } catch (err) {
      showStatus(formatApiErrorMessage(err, "Failed to create farm"), "error");
    } finally {
      setIsSubmittingFarm(false);
    }
  };

  // Edit Farm handler
  const handleEditFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFarm || !auth.hasPermission("farm.update")) return;
    setIsSubmittingFarm(true);
    try {
      await farmsApi.update(editingFarm.id, `"${editingFarm.version}"`, {
        displayName: editFarmName.trim(),
        timezone: editFarmTimezone.trim(),
      });
      setEditFarmModalOpen(false);
      setEditingFarm(null);
      await loadFarms();
      await auth.refreshSession();
      showStatus("Farm updated successfully.");
    } catch (err) {
      showStatus(formatApiErrorMessage(err, "Failed to update farm"), "error");
    } finally {
      setIsSubmittingFarm(false);
    }
  };

  // Create User handler
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.hasPermission("users.manage")) return;
    setIsSubmittingUserAction(true);
    try {
      await usersApi.create({
        email: newEmail.trim().toLowerCase(),
        displayName: newDisplayName.trim(),
        temporaryPassword: newPassword,
      });
      setCreateUserModalOpen(false);
      setNewEmail("");
      setNewDisplayName("");
      setNewPassword("");
      await loadUsersAndRoles();
      showStatus("Team member added successfully.");
    } catch (err) {
      showStatus(formatApiErrorMessage(err, "Failed to create user"), "error");
    } finally {
      setIsSubmittingUserAction(false);
    }
  };

  // Assign Role handler
  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser || !selectedRoleId || !auth.hasPermission("roles.manage")) return;
    setIsSubmittingUserAction(true);
    try {
      await usersApi.assignRole(targetUser.id, { roleId: selectedRoleId });
      setAssignRoleModalOpen(false);
      setTargetUser(null);
      setSelectedRoleId("");
      await loadUsersAndRoles();
      showStatus("Role assigned successfully.");
    } catch (err) {
      showStatus(formatApiErrorMessage(err, "Failed to assign role"), "error");
    } finally {
      setIsSubmittingUserAction(false);
    }
  };

  // Assign Farm handler
  const handleAssignFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser || !selectedFarmId || !auth.hasPermission("users.manage")) return;
    setIsSubmittingUserAction(true);
    try {
      await usersApi.assignFarm(targetUser.id, { farmId: selectedFarmId });
      setAssignFarmModalOpen(false);
      setTargetUser(null);
      setSelectedFarmId("");
      await loadUsersAndRoles();
      showStatus("Farm assignment created successfully.");
    } catch (err) {
      showStatus(formatApiErrorMessage(err, "Failed to assign farm"), "error");
    } finally {
      setIsSubmittingUserAction(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            System & Enterprise Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage organization profile, team permissions, farm configurations, and notification policies
            Manage organization identity, operational farms, access control, and tenant audit trails
          </p>
        </div>

        {savedNotice && (
        {statusMessage && (
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-in fade-in ${
              statusMessage.type === "success"
                ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                : "text-rose-700 bg-rose-50 border border-rose-200"
            }`}
          >
            {statusMessage.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
            {statusMessage.text}
          </span>
        )}

        {prototypeSaved && (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4" />
            Preferences Saved (Local Prototype)
          </span>
        )}
      </div>

      {/* Settings Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b border-slate-200 pb-3">
          <TabsList className="bg-slate-100 p-1">
          <TabsList className="bg-slate-100 p-1 flex-wrap">
            <TabsTrigger value="org">Organization</TabsTrigger>
            <TabsTrigger value="farms">Farms ({farms.length})</TabsTrigger>
            <TabsTrigger value="farms">Farms ({farmsList.length || auth.accessibleFarms.length})</TabsTrigger>
            <TabsTrigger value="users">Users & Roles</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
            <TabsTrigger value="preferences">Units & Locale</TabsTrigger>
            <TabsTrigger value="notifications">Alert Rules</TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: ORGANIZATION */}
        <TabsContent value="org" className="space-y-4 pt-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-emerald-600" />
                Legal Entity & Organization Information
              </CardTitle>
              <CardDescription>
                Primary business entity context for multi-farm tenant billing and consolidation
              </CardDescription>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-emerald-600" />
                    Legal Entity & Organization Information
                  </CardTitle>
                  <CardDescription>
                    Authoritative SaaS tenant profile backed by PostgreSQL
                  </CardDescription>
                </div>
                <Button size="sm" variant="ghost" onClick={loadOrganization} isLoading={isLoadingOrg}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Organization Name" defaultValue={organization.name} required />
                  <Input label="Country / Jurisdiction" defaultValue={organization.country} required />
                  <Input label="Base Reporting Currency" defaultValue={organization.currency} required />
                  <Input label="Default Timezone" defaultValue={organization.timezone} required />
              {isLoadingOrg && !orgData ? (
                <div className="space-y-3">
                  <LoadingSkeleton height="h-10" />
                  <LoadingSkeleton height="h-10" />
                </div>
                <div className="pt-2 flex justify-end">
                  <Button type="submit" size="sm">
                    <Save className="h-4 w-4 mr-1.5" />
                    Save Organization Settings
                  </Button>
                </div>
              </form>
              ) : orgData ? (
                <form onSubmit={handleSaveOrganization} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Organization Display Name"
                      value={orgDisplayName}
                      onChange={(e) => setOrgDisplayName(e.target.value)}
                      disabled={!auth.hasPermission("organization.manage")}
                      required
                    />
                    <Input
                      label="Tenant Code"
                      value={orgData.code}
                      disabled
                      helperText="Tenant identifier code assigned at creation."
                    />
                    <Input
                      label="Tenant Status"
                      value={orgData.status}
                      disabled
                      helperText="System lifecycle status."
                    />
                    <Input
                      label="Record Version (ETag)"
                      value={String(orgData.version)}
                      disabled
                      helperText="Concurrency control version number."
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Created: {new Date(orgData.createdAt).toLocaleDateString()}
                    </span>

                    {auth.hasPermission("organization.manage") ? (
                      <Button type="submit" size="sm" isLoading={isSavingOrg}>
                        <Save className="h-4 w-4 mr-1.5" />
                        Save Organization Settings
                      </Button>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        Requires organization.manage permission to edit
                      </span>
                    )}
                  </div>
                </form>
              ) : (
                <EmptyState
                  icon={Building2}
                  title="Organization details unavailable"
                  description="Unable to load tenant information or you lack organization.read permission."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: FARMS */}
        <TabsContent value="farms" className="space-y-4 pt-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Operational Farm Sites</CardTitle>
              <CardDescription>Active and planned agricultural sites</CardDescription>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Layers className="h-4 w-4 text-emerald-600" />
                    Operational Farm Sites
                  </CardTitle>
                  <CardDescription>
                    Physical production locations within this tenant organization
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={loadFarms} isLoading={isLoadingFarms}>
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                    Refresh
                  </Button>
                  {auth.hasPermission("farm.create") && (
                    <Button size="sm" onClick={() => setCreateFarmModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-1.5" />
                      Add Farm
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Farm Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {farms.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell className="font-bold text-slate-900">{f.name}</TableCell>
                      <TableCell className="font-mono text-xs text-slate-500">{f.code}</TableCell>
                      <TableCell className="text-xs text-slate-600">{f.location}</TableCell>
                      <TableCell className="text-xs font-semibold text-slate-800">
                        {f.totalCapacity.toLocaleString()} birds
                      </TableCell>
                      <TableCell>
                        <Badge variant={f.status === "ACTIVE" ? "success" : "secondary"}>
                          {f.status}
                        </Badge>
                      </TableCell>
              {isLoadingFarms && farmsList.length === 0 ? (
                <div className="space-y-2">
                  <LoadingSkeleton height="h-8" />
                  <LoadingSkeleton height="h-8" />
                  <LoadingSkeleton height="h-8" />
                </div>
              ) : farmsList.length === 0 ? (
                <EmptyState
                  icon={Layers}
                  title="No farms registered"
                  description="Create your first farm site to begin tracking production operations."
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Farm Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Timezone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                  </TableHeader>
                  <TableBody>
                    {farmsList.map((f) => (
                      <TableRow key={f.id}>
                        <TableCell className="font-bold text-slate-900">{f.displayName}</TableCell>
                        <TableCell className="font-mono text-xs text-slate-600">{f.code}</TableCell>
                        <TableCell className="text-xs text-slate-600">{f.timezone}</TableCell>
                        <TableCell>
                          <Badge variant={f.status === "ACTIVE" ? "success" : "secondary"}>
                            {f.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-slate-400">v{f.version}</TableCell>
                        <TableCell className="text-right">
                          {auth.hasPermission("farm.update") && (
                            <button
                              onClick={() => {
                                setEditingFarm(f);
                                setEditFarmName(f.displayName);
                                setEditFarmTimezone(f.timezone);
                                setEditFarmModalOpen(true);
                              }}
                              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                            >
                              Edit
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: USERS & ROLES */}
        <TabsContent value="users" className="space-y-4 pt-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-600" />
                    Team Members & Role-Based Access (RBAC)
                    Team Members & Access Control
                  </CardTitle>
                  <CardDescription>
                    Assigned operational permissions across production, inventory, and finance
                    Real tenant memberships, role permissions, and farm scopes
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline">
                  + Invite User

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={loadUsersAndRoles} isLoading={isLoadingUsers}>
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                    Refresh
                  </Button>
                  {auth.hasPermission("users.manage") && (
                    <Button size="sm" onClick={() => setCreateUserModalOpen(true)}>
                      <UserPlus className="h-4 w-4 mr-1.5" />
                      Add Member
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingUsers && usersList.length === 0 ? (
                <div className="space-y-2">
                  <LoadingSkeleton height="h-8" />
                  <LoadingSkeleton height="h-8" />
                </div>
              ) : usersList.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No users found"
                  description="You may lack users.read permission to view tenant members."
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Owner Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersList.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-semibold text-slate-900">{u.displayName}</TableCell>
                        <TableCell className="text-xs text-slate-600">{u.email}</TableCell>
                        <TableCell>
                          <Badge variant={u.status === "ACTIVE" ? "success" : "secondary"}>
                            {u.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {u.isTenantOwner ? (
                            <Badge variant="primary">Tenant Owner</Badge>
                          ) : (
                            <span className="text-xs text-slate-400">Member</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          {auth.hasPermission("roles.manage") && (
                            <button
                              onClick={() => {
                                setTargetUser(u);
                                setSelectedRoleId(rolesList[0]?.id || "");
                                setAssignRoleModalOpen(true);
                              }}
                              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                            >
                              Assign Role
                            </button>
                          )}
                          {auth.hasPermission("users.manage") && (
                            <button
                              onClick={() => {
                                setTargetUser(u);
                                setSelectedFarmId(farmsList[0]?.id || auth.accessibleFarms[0]?.id || "");
                                setAssignFarmModalOpen(true);
                              }}
                              className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline"
                            >
                              Assign Farm
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {/* Roles Available */}
              {rolesList.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Configured Tenant Roles
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {rolesList.map((role) => (
                      <div
                        key={role.id}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs"
                      >
                        <span className="font-semibold text-slate-900">{role.displayName}</span>
                        <span className="ml-1.5 font-mono text-[10px] text-slate-400">({role.code})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: AUDIT LOG */}
        <TabsContent value="audit" className="space-y-4 pt-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-600" />
                    Immutable Tenant Audit Trail
                  </CardTitle>
                  <CardDescription>
                    Chronological record of critical domain mutations and administrative events
                  </CardDescription>
                </div>
                <Button size="sm" variant="ghost" onClick={loadAudit} isLoading={isLoadingAudit}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name & Email</TableHead>
                    <TableHead>Role Title</TableHead>
                    <TableHead>Assigned Farm</TableHead>
                    <TableHead>Access Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      name: "Mahin",
                      email: "mahin@exampleagro.com",
                      role: "Farm Operations Manager",
                      farm: "North Integrated Farm",
                      access: "Full Operational Authority",
                    },
                    {
                      name: "David Wachira",
                      email: "david@exampleagro.com",
                      role: "Managing Director / Owner",
                      farm: "All Farms",
                      access: "Tenant Administrator",
                    },
                    {
                      name: "Alice Mwangi",
                      email: "alice@exampleagro.com",
                      role: "Storekeeper",
                      farm: "North Integrated Farm",
                      access: "Stock & PO Receipt",
                    },
                    {
                      name: "John Kiprono",
                      email: "john@exampleagro.com",
                      role: "House Operator",
                      farm: "North Integrated Farm",
                      access: "Field Fast-Log Only",
                    },
                    {
                      name: "Dr. Paul Kariuki",
                      email: "dr.paul@exampleagro.com",
                      role: "Attending Vet",
                      farm: "All Farms",
                      access: "Health & Prescription",
                    },
                  ].map((user, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-semibold text-slate-900">
                        <div>{user.name}</div>
                        <span className="text-xs text-slate-400 font-normal">{user.email}</span>
                      </TableCell>
                      <TableCell className="text-xs text-slate-700">{user.role}</TableCell>
                      <TableCell className="text-xs text-slate-600">{user.farm}</TableCell>
                      <TableCell>
                        <Badge variant="primary">{user.access}</Badge>
                      </TableCell>
              {isLoadingAudit && auditRecords.length === 0 ? (
                <div className="space-y-2">
                  <LoadingSkeleton height="h-8" />
                  <LoadingSkeleton height="h-8" />
                  <LoadingSkeleton height="h-8" />
                </div>
              ) : auditRecords.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No audit entries recorded"
                  description="Audit entries will appear as tenant and user modifications occur."
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Occurred At</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity Type</TableHead>
                      <TableHead>Entity ID</TableHead>
                      <TableHead>Source</TableHead>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                  </TableHeader>
                  <TableBody>
                    {auditRecords.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                          {new Date(log.occurredAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-mono text-xs font-semibold text-slate-800">
                          {log.action}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">{log.entityType}</TableCell>
                        <TableCell className="font-mono text-[11px] text-slate-500 truncate max-w-[120px]">
                          {log.entityId}
                        </TableCell>
                        <TableCell className="text-xs">
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono">
                            {log.source}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: PREFERENCES & UNITS */}
        {/* TAB 5: PREFERENCES & UNITS (Prototype) */}
        <TabsContent value="preferences" className="space-y-4 pt-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-emerald-600" />
                Units of Measure & Localization Preferences
              </CardTitle>
              <CardDescription>
                System defaults for weighing, temperature scales, and date formatting
                Workstation defaults for weighing, temperature scales, and date formatting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setPrototypeSaved(true);
                  setTimeout(() => setPrototypeSaved(false), 2000);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Select label="Weight Unit System" defaultValue="METRIC_KG">
                    <option value="METRIC_KG">Metric (Kilograms / Grams)</option>
                    <option value="IMPERIAL_LBS">Imperial (Pounds / Ounces)</option>
                  </Select>
                  <Select label="Temperature Scale" defaultValue="CELSIUS">
                    <option value="CELSIUS">Celsius (°C)</option>
                    <option value="FAHRENHEIT">Fahrenheit (°F)</option>
                  </Select>
                  <Select label="Date Format" defaultValue="YYYY_MM_DD">
                    <option value="YYYY_MM_DD">YYYY-MM-DD (ISO 8601)</option>
                    <option value="DD_MM_YYYY">DD/MM/YYYY</option>
                    <option value="MM_DD_YYYY">MM/DD/YYYY</option>
                  </Select>
                </div>
                <div className="pt-2 flex justify-end">
                  <Button type="submit" size="sm">
                    <Save className="h-4 w-4 mr-1.5" />
                    Save Localization Defaults
                    Save Local Preferences
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: ALERT RULES */}
        {/* TAB 6: ALERT RULES (Prototype) */}
        <TabsContent value="notifications" className="space-y-4 pt-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4 text-emerald-600" />
                Deterministic Alert Rule Thresholds
              </CardTitle>
              <CardDescription>
                Configurable threshold limits triggering automated operational alarms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div>
                  <p className="font-bold text-slate-900">Daily Mortality Alarm Threshold</p>
                  <p className="text-slate-500">Alert if single-day house mortality exceeds threshold</p>
                </div>
                <span className="font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md">
                  &gt; 0.25% of flock
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div>
                  <p className="font-bold text-slate-900">Feed Stock Minimum Safety Buffer</p>
                  <p className="text-slate-500">Alert if available feed falls below days of consumption</p>
                </div>
                <span className="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                  &lt; 3.0 days supply
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div>
                  <p className="font-bold text-slate-900">Vaccine Expiry Warning Horizon</p>
                  <p className="text-slate-500">Flag inventory lots approaching manufacturer expiry</p>
                </div>
                <span className="font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
                  &le; 14 days
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* MODAL: CREATE FARM */}
      <Modal
        isOpen={createFarmModalOpen}
        onClose={() => setCreateFarmModalOpen(false)}
        title="Add Operational Farm"
        description="Register a new agricultural site under this tenant organization."
      >
        <form onSubmit={handleCreateFarm} className="space-y-4">
          <Input
            label="Farm Code"
            value={newFarmCode}
            onChange={(e) => setNewFarmCode(e.target.value)}
            placeholder="e.g. NORTH-02"
            helperText="Uppercase alphanumeric identifier (2-32 chars)."
            required
          />
          <Input
            label="Farm Display Name"
            value={newFarmName}
            onChange={(e) => setNewFarmName(e.target.value)}
            placeholder="e.g. North Integrated Farm Unit 2"
            required
          />
          <Input
            label="Timezone"
            value={newFarmTimezone}
            onChange={(e) => setNewFarmTimezone(e.target.value)}
            placeholder="e.g. Asia/Dhaka or UTC"
            required
          />
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setCreateFarmModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmittingFarm}>
              Create Farm
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: EDIT FARM */}
      <Modal
        isOpen={editFarmModalOpen}
        onClose={() => {
          setEditFarmModalOpen(false);
          setEditingFarm(null);
        }}
        title={`Edit Farm: ${editingFarm?.displayName || ""}`}
        description="Update operational farm site attributes."
      >
        <form onSubmit={handleEditFarm} className="space-y-4">
          <Input
            label="Farm Display Name"
            value={editFarmName}
            onChange={(e) => setEditFarmName(e.target.value)}
            required
          />
          <Input
            label="Timezone"
            value={editFarmTimezone}
            onChange={(e) => setEditFarmTimezone(e.target.value)}
            required
          />
          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setEditFarmModalOpen(false);
                setEditingFarm(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmittingFarm}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: CREATE USER */}
      <Modal
        isOpen={createUserModalOpen}
        onClose={() => setCreateUserModalOpen(false)}
        title="Add Team Member"
        description="Provision a new user account with temporary credentials."
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input
            label="Work Email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="worker@example.com"
            required
          />
          <Input
            label="Display Name"
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
            placeholder="John Kiprono"
            required
          />
          <Input
            label="Temporary Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            required
          />
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setCreateUserModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmittingUserAction}>
              Create User
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ASSIGN ROLE */}
      <Modal
        isOpen={assignRoleModalOpen}
        onClose={() => {
          setAssignRoleModalOpen(false);
          setTargetUser(null);
        }}
        title={`Assign Role to ${targetUser?.displayName || "User"}`}
        description="Assign a tenant role to grant operational permissions."
      >
        <form onSubmit={handleAssignRole} className="space-y-4">
          <Select
            label="Select Role"
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            required
          >
            {rolesList.map((r) => (
              <option key={r.id} value={r.id}>
                {r.displayName} ({r.code})
              </option>
            ))}
          </Select>
          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setAssignRoleModalOpen(false);
                setTargetUser(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmittingUserAction}>
              Assign Role
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ASSIGN FARM */}
      <Modal
        isOpen={assignFarmModalOpen}
        onClose={() => {
          setAssignFarmModalOpen(false);
          setTargetUser(null);
        }}
        title={`Assign Farm to ${targetUser?.displayName || "User"}`}
        description="Grant user access to a specific operational farm site."
      >
        <form onSubmit={handleAssignFarm} className="space-y-4">
          <Select
            label="Select Farm"
            value={selectedFarmId}
            onChange={(e) => setSelectedFarmId(e.target.value)}
            required
          >
            {farmsList.map((f) => (
              <option key={f.id} value={f.id}>
                {f.displayName} ({f.code})
              </option>
            ))}
          </Select>
          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setAssignFarmModalOpen(false);
                setTargetUser(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmittingUserAction}>
              Assign Farm
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

