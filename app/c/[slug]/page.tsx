import { notFound } from "next/navigation";
import { getCompanyBySlug } from "@/data/companies";
import CompanyProfileClient from "@/components/CompanyProfileClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const company = getCompanyBySlug(params.slug);
  if (!company) {
    return {
      title: "Company Not Found | SuperRich",
    };
  }

  const val =
    company.marketCapBillion >= 1000
      ? `$${(company.marketCapBillion / 1000).toFixed(2)} Trillion`
      : `$${company.marketCapBillion.toFixed(1)} Billion`;

  return {
    title: `${company.name} (${company.ticker}) Valuation & Dossier | SuperRich`,
    description: `${company.name} market capitalization: ${val}. Real-time share price, leadership, key divisions, and billionaire stakeholders on SuperRich Index.`,
  };
}

export default async function CompanyProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const company = getCompanyBySlug(params.slug);

  if (!company) {
    notFound();
  }

  return <CompanyProfileClient company={company} />;
}
