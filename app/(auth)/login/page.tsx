import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login — Sistem Informasi Agenda Kegiatan",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-bg)]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/Seal_of_Wonogiri_Regency.png"
              alt="Logo Kabupaten Wonogiri"
              className="w-16 h-auto"
            />
          </div>
          <h1 className="text-lg font-semibold text-[var(--color-text)]">
            Sistem Informasi Agenda Kegiatan
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Kabupaten Wonogiri
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
          <h2 className="text-base font-semibold text-[var(--color-text)] mb-5 text-center">
            Masuk ke Akun Anda
          </h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
