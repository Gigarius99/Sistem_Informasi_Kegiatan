"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, User, Lock } from "lucide-react";
import { loginSchema } from "@/lib/validations";

export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    // Client-side validation
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });

      if (response?.error) {
        setServerError(
          "Username atau password salah. Silakan coba lagi."
        );
      } else if (response?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setServerError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Server Error */}
      {serverError && (
        <div
          className="rounded-xl p-3 mb-4 flex items-start gap-3"
          style={{
            backgroundColor: "rgba(220,38,38,0.1)",
            border: "1px solid rgba(220,38,38,0.3)",
          }}
        >
          <span className="text-red-600 font-bold mt-0.5">!</span>
          <p style={{ color: "#DC2626", fontSize: "16px", fontWeight: 500 }}>
            {serverError}
          </p>
        </div>
      )}

      {/* Username Field */}
      <div className="mb-3">
        <label
          htmlFor="username"
          className="block font-semibold mb-1"
          style={{ color: "var(--color-text)", fontSize: "15px" }}
        >
          Username
        </label>
        <div className="relative">
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "var(--color-text-muted)" }}
          >
            <User size={20} />
          </div>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Masukkan username Anda"
            className="form-input pl-12"
            style={{
              borderColor: errors.username
                ? "#DC2626"
                : "var(--color-input-border)",
            }}
            disabled={isLoading}
            aria-describedby={errors.username ? "username-error" : undefined}
          />
        </div>
        {errors.username && (
          <p
            id="username-error"
            className="mt-2 font-medium"
            style={{ color: "#DC2626", fontSize: "15px" }}
          >
            {errors.username}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block font-semibold mb-1"
          style={{ color: "var(--color-text)", fontSize: "15px" }}
        >
          Password
        </label>
        <div className="relative">
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "var(--color-text-muted)" }}
          >
            <Lock size={20} />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Masukkan password Anda"
            className="form-input pl-12 pr-12"
            style={{
              borderColor: errors.password
                ? "#DC2626"
                : "var(--color-input-border)",
            }}
            disabled={isLoading}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2"
            style={{ color: "var(--color-text-muted)" }}
            onClick={() => setShowPassword((s) => !s)}
            tabIndex={-1}
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p
            id="password-error"
            className="mt-2 font-medium"
            style={{ color: "#DC2626", fontSize: "15px" }}
          >
            {errors.password}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="btn-primary w-full justify-center text-base py-2.5 mt-2"
        disabled={isLoading}
        id="login-submit"
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="spinner" />
            Memproses...
          </>
        ) : (
          "Masuk"
        )}
      </button>
    </form>
  );
}
