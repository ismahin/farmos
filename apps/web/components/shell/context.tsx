"use client";

import * as React from "react";
import { Farm, Organization, UserPersona } from "@/types";
import { mockFarms, mockOrganization } from "@/mocks/farms";
import { useAuth, type AuthContextType } from "./auth-context";

export interface ShellContextType {
  organization: Organization;
  farms: Farm[];
  currentFarm: Farm;
  setCurrentFarmId: (farmId: string) => void;
  currentUser: {
    id?: string;
    name: string;
    role: UserPersona;
    roleTitle: string;
    email: string;
  };
  setUserPersona: (role: UserPersona) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  unreadAlertCount: number;
  auth: AuthContextType;
}

const ShellContext = React.createContext<ShellContextType | null>(null);

const personas: Record<
  UserPersona,
  { name: string; role: UserPersona; roleTitle: string; email: string }
> = {
  FARM_MANAGER: {
    name: "Mahin",
    role: "FARM_MANAGER",
    roleTitle: "Farm Operations Manager",
    email: "mahin@exampleagro.com",
  },
  OWNER: {
    name: "David Wachira",
    role: "OWNER",
    roleTitle: "Managing Director / Owner",
    email: "david@exampleagro.com",
  },
  STOREKEEPER: {
    name: "Alice Mwangi",
    role: "STOREKEEPER",
    roleTitle: "Storekeeper & Logistics",
    email: "alice@exampleagro.com",
  },
  FIELD_WORKER: {
    name: "John Kiprono",
    role: "FIELD_WORKER",
    roleTitle: "Poultry House Operator",
    email: "john@exampleagro.com",
  },
  VET: {
    name: "Dr. Paul Kariuki",
    role: "VET",
    roleTitle: "Attending Veterinarian",
    email: "dr.paul@exampleagro.com",
  },
};

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [farms, setFarms] = React.useState<Farm[]>(mockFarms);
  const [currentFarmId, setCurrentFarmId] = React.useState<string>(mockFarms[0].id);
  const [currentPersona, setCurrentPersona] = React.useState<UserPersona>("FARM_MANAGER");
  const auth = useAuth();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);

  const currentFarm = farms.find((f) => f.id === currentFarmId) || farms[0];

  // Global keyboard shortcut for search (Cmd+K / Ctrl+K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const {
    user: authUser,
    tenant: authTenant,
    hasPermission: authHasPermission,
    accessibleFarms: authAccessibleFarms,
    currentFarm: authCurrentFarm,
    setCurrentFarmId: authSetCurrentFarmId,
  } = auth;

  // Map authoritative tenant into UI organization shape
  const organization: Organization = React.useMemo(() => {
    if (authTenant) {
      return {
        id: authTenant.id,
        name: authTenant.displayName,
        country: mockOrganization.country,
        currency: mockOrganization.currency,
        timezone: mockOrganization.timezone,
        status: "ACTIVE",
      };
    }
    return mockOrganization;
  }, [authTenant]);

  // Map authoritative accessible farms, enriching with fallback topology if needed for mock pages
  const farms: Farm[] = React.useMemo(() => {
    if (authAccessibleFarms.length > 0) {
      return authAccessibleFarms.map((af, idx) => {
        const mockMatch = mockFarms.find((mf) => mf.id === af.id || mf.code === af.code) || mockFarms[idx % mockFarms.length];
        return {
          id: af.id,
          organizationId: authTenant?.id || "org-01",
          name: af.displayName,
          code: af.code,
          location: mockMatch?.location || "Operational Site",
          timezone: mockMatch?.timezone || "UTC",
          status: "ACTIVE" as const,
          enabledEnterprises: mockMatch?.enabledEnterprises || ["POULTRY_BROILER"],
          houses: mockMatch?.houses || [],
          warehouses: mockMatch?.warehouses || [],
          totalCapacity: mockMatch?.totalCapacity || 10000,
          activeCycleCount: mockMatch?.activeCycleCount || 1,
          warningCount: mockMatch?.warningCount || 0,
          criticalCount: mockMatch?.criticalCount || 0,
        };
      });
    }
    return mockFarms;
  }, [authAccessibleFarms, authTenant]);

  // Select current farm safely
  const currentFarm: Farm = React.useMemo(() => {
    if (authCurrentFarm) {
      const found = farms.find((f) => f.id === authCurrentFarm.id);
      if (found) return found;
    }
    return farms[0] || mockFarms[0];
  }, [authCurrentFarm, farms]);

  // Map authoritative user into UI user shape
  const currentUser = React.useMemo(() => {
    if (authUser) {
      const isOwner = authHasPermission("organization.manage");
      const isManager = authHasPermission("farm.create");
      const role: UserPersona = isOwner ? "OWNER" : isManager ? "FARM_MANAGER" : "FIELD_WORKER";
      const roleTitle = isOwner ? "Tenant Administrator" : isManager ? "Farm Operations Manager" : "Field Operator";

      return {
        id: authUser.id,
        name: authUser.displayName,
        email: authUser.email,
        role,
        roleTitle,
      };
    }
    return {
      name: "Farm User",
      email: "",
      role: "FARM_MANAGER" as UserPersona,
      roleTitle: "Farm Operations Manager",
    };
  }, [authUser, authHasPermission]);

  // Persona switching is disabled/deprecated in real auth
  const setUserPersona = React.useCallback((_role: UserPersona) => {
    // In M04, persona switching is removed from authoritative auth.
    // UI behavior is derived from /api/v1/me permissions.
  }, []);

  return (
    <ShellContext.Provider
      value={{
        organization: mockOrganization,
        organization,
        farms,
        currentFarm,
        setCurrentFarmId,
        currentUser: personas[currentPersona],
        setUserPersona: setCurrentPersona,
        setCurrentFarmId: authSetCurrentFarmId,
        currentUser,
        setUserPersona,
        isSearchOpen,
        setIsSearchOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        unreadAlertCount: currentFarm.criticalCount + currentFarm.warningCount,
        auth,
      }}
    >
      {children}
    </ShellContext.Provider>
  );
}

export function useShell() {
  const context = React.useContext(ShellContext);
  if (!context) {
    throw new Error("useShell must be used within a ShellProvider");
  }
  return context;
}

