import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login — Sistem Informasi Agenda Kegiatan",
  description: "Masuk ke Sistem Informasi Agenda Kegiatan Kabupaten Wonogiri",
};

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Garis aksen atas */}
      <div
        className="fixed top-0 left-0 right-0 h-1"
        style={{ backgroundColor: "var(--color-primary)" }}
      />
      <div
        className="fixed top-1 left-0 right-0 h-0.5"
        style={{ backgroundColor: "var(--color-accent)" }}
      />

      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "2px solid var(--color-primary)",
              }}
            >
              <img
                src="/Seal_of_Wonogiri_Regency.png"
                alt="Logo Kabupaten Wonogiri"
                className="w-14 h-auto"
              />
            </div>
          </div>
          <h1
            className="text-xl font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            Sistem Informasi
          </h1>
          <p
            className="text-base font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            Agenda Kegiatan
          </p>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-text-muted)" }}
          >
            Kabupaten Wonogiri
          </p>
        </div>

        {/* Card login */}
        <div
          className="rounded-2xl p-6 shadow-lg"
          style={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-card-border)",
            boxShadow: "0 4px 24px var(--color-shadow)",
          }}
        >
          {/* Judul dengan aksen */}
          <div className="flex items-center gap-2 mb-6">
            <div
              className="w-1 h-6 rounded-full"
              style={{ backgroundColor: "var(--color-primary)" }}
            />
            <h2
              className="text-base font-bold"
              style={{ color: "var(--color-text)" }}
            >
              Masuk ke Akun Anda
            </h2>
          </div>
          <LoginForm />
        </div>

        <p
          className="text-center text-xs mt-6"
          style={{ color: "var(--color-text-muted)" }}
        >
          © 2025 Pemerintah Kabupaten Wonogiri
        </p>
      </div>
    </div>
  );
}
