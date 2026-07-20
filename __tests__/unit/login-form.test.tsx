/**
 * Component Tests — LoginForm
 * Menguji rendering, validasi, dan interaksi form login
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/components/auth/login-form";

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

import { signIn } from "next-auth/react";
const mockSignIn = signIn as jest.Mock;

describe("LoginForm", () => {
  beforeEach(() => {
    mockSignIn.mockClear();
  });

  it("renders login form with all fields", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /masuk/i })).toBeInTheDocument();
  });

  it("shows validation error when submitting empty form", async () => {
    render(<LoginForm />);
    const submitBtn = screen.getByRole("button", { name: /masuk/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/username wajib diisi/i)).toBeInTheDocument();
    });
  });

  it("shows error for empty password", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/username/i), "admin");
    fireEvent.click(screen.getByRole("button", { name: /masuk/i }));

    await waitFor(() => {
      expect(screen.getByText(/password wajib diisi/i)).toBeInTheDocument();
    });
  });

  it("calls signIn with correct credentials on submit", async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce({ ok: true, error: null });

    render(<LoginForm />);

    await user.type(screen.getByLabelText(/username/i), "admin");
    await user.type(screen.getByLabelText(/password/i), "admin123");
    await user.click(screen.getByRole("button", { name: /masuk/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        username: "admin",
        password: "admin123",
        redirect: false,
      });
    });
  });

  it("shows error message on invalid credentials", async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce({ ok: false, error: "CredentialsSignin" });

    render(<LoginForm />);

    await user.type(screen.getByLabelText(/username/i), "wrong");
    await user.type(screen.getByLabelText(/password/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /masuk/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/username atau password salah/i)
      ).toBeInTheDocument();
    });
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    // Find toggle button by aria-label
    const toggleBtn = screen.getByLabelText(/tampilkan password/i);
    await user.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(screen.getByLabelText(/sembunyikan password/i));
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
