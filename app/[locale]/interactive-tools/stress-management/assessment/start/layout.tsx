import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return {
    title: "Start Assessment - Stress Management | PeriodHub",
    description: "Start stress management assessment",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function StartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
