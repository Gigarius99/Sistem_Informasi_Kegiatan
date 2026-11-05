import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login — Sistem Informasi Agenda Kegiatan",
  description: "Masuk ke Sistem Informasi Agenda Kegiatan Kabupaten Wonogiri",
};

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backgroundColor: "var(--color-bg)",
        position: "relative"
      }}
    >
      {/* Garis aksen atas */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          backgroundColor: "var(--color-primary)"
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "4px",
          left: 0,
          right: 0,
          height: "2px",
          backgroundColor: "var(--color-accent)"
        }}
      />

      <div style={{ width: "100%", maxWidth: "440px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "var(--color-surface)",
                border: "2px solid var(--color-primary)",
                boxShadow: "var(--shadow-md)"
              }}
            >
              <img
                src="/Seal_of_Wonogiri_Regency.png"
                alt="Logo Kabupaten Wonogiri"
                style={{ width: "64px", height: "auto" }}
              />
            </div>
          </div>
          <h1
            style={{ fontSize: "32px", fontWeight: 800, color: "var(--color-primary)", margin: "0 0 4px 0", lineHeight: 1.2 }}
          >
            Sistem Informasi
          </h1>
          <p
            style={{ fontSize: "24px", fontWeight: 700, color: "var(--color-text)", margin: "0 0 4px 0" }}
          >
            Agenda Kegiatan
          </p>
          <p
            style={{ fontSize: "16px", color: "var(--color-text-muted)", margin: 0 }}
          >
            Kabupaten Wonogiri
          </p>
        </div>

        {/* Card login */}
        <div
          className="card animate-fade-in"
          style={{
            padding: "24px",
            boxShadow: "0 8px 32px var(--color-shadow)"
          }}
        >
          {/* Judul dengan aksen */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
            <h2
              style={{ fontSize: "20px", fontWeight: 700, color: "var(--color-text)", margin: 0, textAlign: "center" }}
            >
              Masuk ke Akun Anda
            </h2>
            <div
              style={{ width: "40px", height: "4px", borderRadius: "4px", backgroundColor: "var(--color-primary)" }}
            />
          </div>
          <LoginForm />
        </div>

        <p
          style={{ textAlign: "center", fontSize: "12px", color: "var(--color-text-muted)", marginTop: "16px" }}
        >
          © 2025 Pemerintah Kabupaten Wonogiri
        </p>
      </div>
    </div>
  );
}
