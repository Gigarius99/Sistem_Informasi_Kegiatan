import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login — Sistem Informasi Agenda Kegiatan",
};

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo & Title */}
        <div className="text-center mb-4">
          <div className="flex justify-center mb-2">
            <img
              src="/Seal_of_Wonogiri_Regency.png"
              alt="Logo Kabupaten Wonogiri"
              className="w-16 h-auto drop-shadow-md"
            />
          </div>
          <h1
            className="text-xl lg:text-2xl font-black mb-0.5 leading-tight"
            style={{ color: "var(--color-text)" }}
          >
            Sistem Informasi
          </h1>
          <h1
            className="text-xl lg:text-2xl font-black leading-tight"
            style={{ color: "var(--color-text)" }}
          >
            Agenda Kegiatan
          </h1>
        </div>

        {/* Login Card */}
        <div
          className="rounded-2xl p-5 sm:p-6 shadow-xl"
          style={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-card-border)",
            boxShadow: "0 8px 32px var(--color-shadow)",
          }}
        >
          <h2
            className="text-xl font-bold mb-4 text-center"
            style={{ color: "var(--color-text)" }}
          >
            Silakan Masuk
          </h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
