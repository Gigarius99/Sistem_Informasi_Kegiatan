import { redirect } from "next/navigation";

// Root page — redirect to dashboard
// Middleware juga menangani ini, tapi ini sebagai fallback
export default function HomePage() {
  redirect("/dashboard");
}
