import { getBillionairesFromDB } from "@/lib/db-people";
import { getRTBLatestList } from "@/lib/rtb";
import BillionairesHomeClient from "@/components/BillionairesHomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch latest live data from Supabase Postgres with RTB fallback
  const [dbPeople, rtbData] = await Promise.all([
    getBillionairesFromDB(100),
    getRTBLatestList(),
  ]);

  return (
    <BillionairesHomeClient
      serverPeople={dbPeople}
      serverRtbData={rtbData}
    />
  );
}
