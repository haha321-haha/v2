import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return {
    title: "Debug - Stress Management | PeriodHub",
    description: "Debug page for stress management progress tracking",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function DebugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
