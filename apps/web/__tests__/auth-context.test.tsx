import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/components/shell/auth-context";
import { authApi } from "@/lib/api/auth";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/lib/api/auth", () => ({
  authApi: {
    getMe: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  },
}));

function ConsumerComponent() {
  const {
    user,
    tenant,
    isAuthenticated,
    isLoadingSession,
    hasPermission,
    currentFarm,
    logout,
  } = useAuth();

  if (isLoadingSession) {
    return <div>Loading session...</div>;
  }

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? "authenticated" : "unauthenticated"}</div>
      <div data-testid="user-name">{user?.displayName || "no-user"}</div>
      <div data-testid="tenant-name">{tenant?.displayName || "no-tenant"}</div>
      <div data-testid="has-farm-create">{hasPermission("farm.create") ? "yes" : "no"}</div>
      <div data-testid="current-farm">{currentFarm?.displayName || "no-farm"}</div>
      <button onClick={() => logout()} data-testid="logout-btn">
        Logout
      </button>
    </div>
  );
}

describe("AuthContext & AuthProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("bootstraps authenticated session from /me endpoint", async () => {
    (authApi.getMe as jest.Mock).mockResolvedValue({
      user: { id: "u-1", displayName: "Mahin Operations", email: "mahin@example.com" },
      tenant: { id: "t-1", displayName: "Integrated Agro Ltd." },
      permissions: ["farm.read", "farm.create", "users.read"],
      farmScope: {
        allFarms: false,
        accessibleFarms: [
          { id: "f-101", code: "NORTH-1", displayName: "North Farm Site" },
        ],
        truncated: false,
      },
    });

    render(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>
    );

    expect(screen.getByText("Loading session...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("authenticated");
    });

    expect(screen.getByTestId("user-name")).toHaveTextContent("Mahin Operations");
    expect(screen.getByTestId("tenant-name")).toHaveTextContent("Integrated Agro Ltd.");
    expect(screen.getByTestId("has-farm-create")).toHaveTextContent("yes");
    expect(screen.getByTestId("current-farm")).toHaveTextContent("North Farm Site");
  });

  test("handles unauthenticated state when /me returns 401", async () => {
    (authApi.getMe as jest.Mock).mockRejectedValue(new Error("Unauthorized"));

    render(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("unauthenticated");
    });

    expect(screen.getByTestId("user-name")).toHaveTextContent("no-user");
    expect(screen.getByTestId("current-farm")).toHaveTextContent("no-farm");
  });

  test("clears state upon logout", async () => {
    (authApi.getMe as jest.Mock).mockResolvedValue({
      user: { id: "u-1", displayName: "Mahin Operations", email: "mahin@example.com" },
      tenant: { id: "t-1", displayName: "Integrated Agro Ltd." },
      permissions: ["farm.read"],
      farmScope: {
        allFarms: false,
        accessibleFarms: [{ id: "f-1", code: "F1", displayName: "Farm 1" }],
        truncated: false,
      },
    });
    (authApi.logout as jest.Mock).mockResolvedValue(undefined);

    render(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("authenticated");
    });

    await act(async () => {
      screen.getByTestId("logout-btn").click();
    });

    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("unauthenticated");
    });
    expect(authApi.logout).toHaveBeenCalledTimes(1);
  });
});

