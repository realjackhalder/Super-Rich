import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth";
import { getBillionairesFromDB } from "@/lib/db-people";
import { AdminManager } from "@/components/AdminManager";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await verifyAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const liveBillionaires = await getBillionairesFromDB(100);

  return (
    <AdminManager
      username={(session.username as string) || "Administrator"}
      initialBillionaires={liveBillionaires as any}
    />
  );
}

