import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Masuk ke Sistem Informasi Agenda Kegiatan",
};

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Jika sudah login, redirect ke dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
