"use client";

import dynamic from "next/dynamic";

// Luna AI - Client component (must be dynamic import with ssr: false)
const LunaAI = dynamic(() => import("@/components/LunaAI"), {
  ssr: false,
});

export default function LunaAIWrapper() {
  return <LunaAI />;
}
