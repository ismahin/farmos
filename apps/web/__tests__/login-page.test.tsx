import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/(auth)/login/page";
import { ApiProblemError } from "@/lib/api";

const mockLogin = jest.fn();
const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock("@/components/shell/auth-context", () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
    isLoadingSession: false,
  }),
}));

describe("LoginPage Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form controls and test pre-fills", () => {
    render(<LoginPage />);

    expect(screen.getByRole("heading", { name: /sign in to farmos/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/work email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in to farm workspace/i })).toBeInTheDocument();
    expect(screen.getByText("Tenant Owner")).toBeInTheDocument();
  });

  test("populates credentials on quick fill button click", () => {
    render(<LoginPage />);

    const tenantOwnerBtn = screen.getByText("Tenant Owner");
    fireEvent.click(tenantOwnerBtn);

    const emailInput = screen.getByLabelText(/work email/i) as HTMLInputElement;
    expect(emailInput.value).toBe("owner@example.com");
  });

  test("submits login form and invokes auth login", async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/work email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitBtn = screen.getByRole("button", { name: /sign in to farm workspace/i });

    fireEvent.change(emailInput, { target: { value: "operator@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "SecretPass123!" } });
    fireEvent.submit(screen.getByTestId("login-form"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "operator@example.com",
        password: "SecretPass123!",
      });
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  test("displays RFC 9457 error message and correlation ID on failure", async () => {
    const error = new ApiProblemError({
      status: 401,
      code: "AUTHENTICATION_FAILED",
      title: "Authentication Failed",
      message: "Invalid email or password",
      correlationId: "corr-login-fail-101",
    });
    mockLogin.mockRejectedValueOnce(error);

    render(<LoginPage />);

    fireEvent.submit(screen.getByTestId("login-form"));

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
      expect(screen.getByText(/corr-login-fail-101/)).toBeInTheDocument();
    });
  });
});
