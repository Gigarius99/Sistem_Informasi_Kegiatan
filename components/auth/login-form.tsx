"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0])
          fieldErrors[issue.path[0] as string] = issue.message;
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
        setServerError("Username atau password salah.");
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
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {serverError && (
        <div style={{ borderRadius: "8px", background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)", padding: "12px", fontSize: "14px", color: "#DC2626" }}>
          {serverError}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label
          htmlFor="username"
          style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-text)" }}
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Masukkan username"
          className="input"
          style={{ borderColor: errors.username ? "#dc2626" : "var(--color-input-border)" }}
          disabled={isLoading}
        />
        {errors.username && (
          <p style={{ marginTop: "4px", fontSize: "12px", color: "#dc2626", margin: 0 }}>{errors.username}</p>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label
          htmlFor="password"
          style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-text)" }}
        >
          Password
        </label>
        <div style={{ position: "relative" }}>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Masukkan password"
            className="input"
            style={{ paddingRight: "40px", borderColor: errors.password ? "#dc2626" : "var(--color-input-border)" }}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: 0,
              display: "flex"
            }}
            tabIndex={-1}
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p style={{ marginTop: "4px", fontSize: "12px", color: "#dc2626", margin: 0 }}>{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary"
        style={{ marginTop: "8px", width: "100%", justifyContent: "center", padding: "12px 16px" }}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Memproses...
          </>
        ) : (
          "Masuk"
        )}
      </button>
    </form>
  );
}
