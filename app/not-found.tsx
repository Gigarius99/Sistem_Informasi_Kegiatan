import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="text-center">
        <div
          className="text-9xl font-black mb-4"
          style={{ color: "var(--color-primary)" }}
        >
          404
        </div>
        <h1
          className="font-bold mb-3"
          style={{ fontSize: "28px", color: "var(--color-text)" }}
        >
          Halaman Tidak Ditemukan
        </h1>
        <p
          className="mb-8"
          style={{ fontSize: "18px", color: "var(--color-text-muted)" }}
        >
          Halaman yang Anda cari tidak tersedia.
        </p>
        <Link href="/dashboard" className="btn-primary">
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
