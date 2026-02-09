import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import ClientLayout from "../ClientLayout";

export const metadata = {
  title: "Coderise-École",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🔒 VÉRIFICATION SERVEUR
  const session = await getServerSession(authOptions);

  // ❌ PAS CONNECTÉ → LOGIN
  if (!session) {
    redirect("/auth/signin");
  }

  return <ClientLayout>{children}</ClientLayout>;
}

