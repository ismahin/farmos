"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { authApi, farmsApi } from "@/lib/api";
import type {
  AccessibleFarmSummary,
  LoginRequest,
  MeResponse,
  TenantSummary,
  UserSummary,
} from "@/lib/api";
import { isApiProblemError } from "@/lib/api";

const SELECTED_FARM_KEY = "farmos_selected_farm_id";

export interface ForbiddenNotice {
  correlationId?: string;
  message: string;
  timestamp: Date;
}

export interface AuthContextType {
  user: UserSummary | null;
  tenant: TenantSummary | null;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  accessibleFarms: AccessibleFarmSummary[];
  currentFarm: AccessibleFarmSummary | null;
  currentFarmId: string | null;
  setCurrentFarmId: (farmId: string) => void;
  isAuthenticated: boolean;
  isLoadingSession: boolean;
  login: (request: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  forbiddenError: ForbiddenNotice | null;
  clearForbiddenError: () => void;
  setForbiddenError: (notice: ForbiddenNotice) => void;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = React.useState<UserSummary | null>(null);
  const [tenant, setTenant] = React.useState<TenantSummary | null>(null);
  const [permissions, setPermissions] = React.useState<string[]>([]);
  const [accessibleFarms, setAccessibleFarms] = React.useState<AccessibleFarmSummary[]>([]);
  const [currentFarmId, setCurrentFarmIdState] = React.useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoadingSession, setIsLoadingSession] = React.useState(true);
  const [forbiddenError, setForbiddenErrorState] = React.useState<ForbiddenNotice | null>(null);

  const resolveFarms = React.useCallback(async (me: MeResponse): Promise<AccessibleFarmSummary[]> => {
    let farms = me.farmScope.accessibleFarms || [];
    if (me.farmScope.truncated) {
      try {
        const fullList = await farmsApi.list({ pageSize: 100 });
        farms = fullList.items.map((f) => ({
          id: f.id,
          code: f.code,
          displayName: f.displayName,
        }));
      } catch {
        // Fallback to truncated scope from /me if fetch fails
      }
    }
    return farms;
  }, []);

  const selectInitialFarm = React.useCallback((farms: AccessibleFarmSummary[]) => {
    if (farms.length === 0) {
      setCurrentFarmIdState(null);
      return;
    }
    let preferredId: string | null = null;
    try {
      preferredId = localStorage.getItem(SELECTED_FARM_KEY);
    } catch {
      // LocalStorage might be disabled
    }
    const matched = farms.find((f) => f.id === preferredId);
    const chosen = matched ? matched.id : farms[0].id;
    setCurrentFarmIdState(chosen);
    try {
      localStorage.setItem(SELECTED_FARM_KEY, chosen);
    } catch {
      // LocalStorage might be disabled
    }
  }, []);

  const setCurrentFarmId = React.useCallback((farmId: string) => {
    setCurrentFarmIdState(farmId);
    try {
      localStorage.setItem(SELECTED_FARM_KEY, farmId);
    } catch {
      // Ignore
    }
  }, []);

  const setForbiddenError = React.useCallback((notice: ForbiddenNotice) => {
    setForbiddenErrorState(notice);
  }, []);

  const clearForbiddenError = React.useCallback(() => {
    setForbiddenErrorState(null);
  }, []);

  const refreshSession = React.useCallback(async () => {
    try {
      const me = await authApi.getMe();
      setUser(me.user);
      setTenant(me.tenant);
      setPermissions(me.permissions || []);
      const resolvedFarms = await resolveFarms(me);
      setAccessibleFarms(resolvedFarms);
      selectInitialFarm(resolvedFarms);
      setIsAuthenticated(true);
    } catch (err) {
      setUser(null);
      setTenant(null);
      setPermissions([]);
      setAccessibleFarms([]);
      setCurrentFarmIdState(null);
      setIsAuthenticated(false);
      try {
        localStorage.removeItem(SELECTED_FARM_KEY);
      } catch {
        // Ignore
      }
      if (isApiProblemError(err) && err.status === 403) {
        setForbiddenErrorState({
          correlationId: err.correlationId,
          message: err.message,
          timestamp: new Date(),
        });
      }
      throw err;
    }
  }, [resolveFarms, selectInitialFarm]);

  // Initial session bootstrap
  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const me = await authApi.getMe();
        if (!isMounted) return;
        setUser(me.user);
        setTenant(me.tenant);
        setPermissions(me.permissions || []);
        const resolvedFarms = await resolveFarms(me);
        if (!isMounted) return;
        setAccessibleFarms(resolvedFarms);
        selectInitialFarm(resolvedFarms);
        setIsAuthenticated(true);
      } catch {
        if (!isMounted) return;
        setUser(null);
        setTenant(null);
        setPermissions([]);
        setAccessibleFarms([]);
        setCurrentFarmIdState(null);
        setIsAuthenticated(false);
      } finally {
        if (isMounted) {
          setIsLoadingSession(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [resolveFarms, selectInitialFarm]);

  const login = React.useCallback(
    async (request: LoginRequest) => {
      await authApi.login(request);
      await refreshSession();
    },
    [refreshSession]
  );

  const logout = React.useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Revocation on server attempted; always clear local client state
    }
    setUser(null);
    setTenant(null);
    setPermissions([]);
    setAccessibleFarms([]);
    setCurrentFarmIdState(null);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(SELECTED_FARM_KEY);
    } catch {
      // Ignore
    }
    router.push("/login");
  }, [router]);

  const hasPermission = React.useCallback(
    (permission: string) => permissions.includes(permission),
    [permissions]
  );

  const hasAnyPermission = React.useCallback(
    (required: string[]) => required.some((perm) => permissions.includes(perm)),
    [permissions]
  );

  const currentFarm = React.useMemo(() => {
    if (!currentFarmId || accessibleFarms.length === 0) return null;
    return accessibleFarms.find((f) => f.id === currentFarmId) || accessibleFarms[0];
  }, [currentFarmId, accessibleFarms]);

  return (
    <AuthContext.Provider
      value={{
        user,
        tenant,
        permissions,
        hasPermission,
        hasAnyPermission,
        accessibleFarms,
        currentFarm,
        currentFarmId,
        setCurrentFarmId,
        isAuthenticated,
        isLoadingSession,
        login,
        logout,
        refreshSession,
        forbiddenError,
        clearForbiddenError,
        setForbiddenError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

