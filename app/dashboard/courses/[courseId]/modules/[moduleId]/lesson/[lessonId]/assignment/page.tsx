import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AssignmentClient from "./AssignmentClient";

export default async function AssignmentPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  return <AssignmentClient userId={Number(session.user.id)} />;
}
