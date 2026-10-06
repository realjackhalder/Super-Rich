import { TOP_100_COMPANIES } from "@/data/companies";
import CompaniesListClient from "@/components/CompaniesListClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Top 100 Most Valued Companies Worldwide | SuperRich",
  description:
    "Real-time market capitalization leaderboard of the world's 100 most valuable public companies, tracking share prices, daily net worth changes, and billionaire shareholders.",
};

export default function CompaniesPage() {
  return <CompaniesListClient initialCompanies={TOP_100_COMPANIES} />;
}
