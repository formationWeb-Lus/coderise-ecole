import ClientLayout from "../ClientLayout";

export const metadata = {
  title: "Coderise-École",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
