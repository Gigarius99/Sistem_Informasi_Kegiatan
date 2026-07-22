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

      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "16px",
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
                style={{ width: "56px", height: "auto" }}
              />
            </div>
          </div>
          <h1
            style={{ fontSize: "24px", fontWeight: 800, color: "var(--color-primary)", margin: "0 0 4px 0", lineHeight: 1.2 }}
          >
            Sistem Informasi
          </h1>
          <p
            style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-text)", margin: "0 0 4px 0" }}
          >
            Agenda Kegiatan
          </p>
          <p
            style={{ fontSize: "14px", color: "var(--color-text-muted)", margin: 0 }}
          >
            Kabupaten Wonogiri
          </p>
        </div>

        {/* Card login */}
        <div
          className="card animate-fade-in"
          style={{
            padding: "32px",
            boxShadow: "0 8px 32px var(--color-shadow)"
          }}
        >
          {/* Judul dengan aksen */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <div
              style={{ width: "4px", height: "24px", borderRadius: "4px", backgroundColor: "var(--color-primary)" }}
            />
            <h2
              style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-text)", margin: 0 }}
            >
              Masuk ke Akun Anda
            </h2>
          </div>
          <LoginForm />
        </div>

        <p
          style={{ textAlign: "center", fontSize: "12px", color: "var(--color-text-muted)", marginTop: "24px" }}
        >
          © 2025 Pemerintah Kabupaten Wonogiri
        </p>
      </div>
    </div>
  );
}
