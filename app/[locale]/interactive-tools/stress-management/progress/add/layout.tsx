import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return {
    title: "Add Progress - Stress Management | PeriodHub",
    description: "Add progress entry for stress management",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function AddLayout({ children }: { children: React.ReactNode }) {
  return children;
}
