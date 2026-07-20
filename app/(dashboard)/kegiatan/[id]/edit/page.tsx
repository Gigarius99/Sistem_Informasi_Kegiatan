import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { ActivityForm } from "@/components/kegiatan/activity-form";
import type { Metadata } from "next";
import type { Role } from "@/types";

interface EditKegiatanPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Edit Kegiatan" };

export default async function EditKegiatanPage({ params }: EditKegiatanPageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userRole = (session.user as { role?: Role }).role ?? "PIMPINAN";
  if (userRole !== "ADMIN_KEGIATAN") redirect("/dashboard");

  const { id } = await params;
  const activity = await prisma.activity.findUnique({
    where: { id },
    include: { creator: { select: { id: true, name: true, username: true } } },
  });

  if (!activity) notFound();

  // Serialize for client component
  const serialized = {
    ...activity,
    activityDate: activity.activityDate,
    createdAt: activity.createdAt,
    updatedAt: activity.updatedAt,
  };

  return (
    <div className="fade-in">
      <ActivityForm mode="edit" initialData={serialized} />
    </div>
  );
}
