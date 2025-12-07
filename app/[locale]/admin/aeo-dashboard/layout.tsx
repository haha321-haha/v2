import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return {
    title: "AEO Dashboard | PeriodHub",
    description:
      "AEO monitoring dashboard for tracking and analyzing medical content references",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function AEODashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
