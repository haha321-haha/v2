"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { trackEvent } from "@/lib/analytics/posthog";

interface UpgradeButtonProps {
  plan: "monthly" | "yearly" | "oneTime";
  painPoint: string;
  assessmentScore: number;
  className?: string;
}

export default function UpgradeButton({
  plan,
  painPoint,
  assessmentScore,
  className = "",
}: UpgradeButtonProps) {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);

  const variantIds = {
    monthly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_MONTHLY!,
    yearly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_YEARLY!,
    oneTime: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ONETIME!,
  };

  const handleUpgrade = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/lemonsqueezy/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: variantIds[plan],
          painPoint,
          assessmentScore,
        }),
      });

      const data = await res.json();

      if (data.url) {
        trackEvent("redirecting_to_checkout", {
          plan,
          painPoint,
          platform: "lemonsqueezy",
        });
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      trackEvent("checkout_initiation_failed", {
        error: errorMessage,
        plan,
      });

      alert("Payment initialization failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <button onClick={handleUpgrade} disabled={loading} className={className}>
      {loading ? t("common.loading") : t("Pro.cta.upgrade")}
    </button>
  );
}
