import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import ClientLayout from "../ClientLayout";
import BottomNav from "@/app/components/BottomNav";

export const metadata = {
  title: "Coderise-École",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🔒 Vérification serveur
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <ClientLayout>
      <div className="pb-20">
        {children}
        <BottomNav />
      </div>
    </ClientLayout>
  );
}
