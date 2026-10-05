import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth";
import { INITIAL_50_BILLIONAIRES } from "@/data/billionaires";
import { AdminManager } from "@/components/AdminManager";

export default async function AdminDashboardPage() {
  const session = await verifyAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminManager
      username={(session.username as string) || "Administrator"}
      initialBillionaires={INITIAL_50_BILLIONAIRES}
    />
  );
}

