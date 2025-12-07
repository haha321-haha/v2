/**
 * GEO地理位置Hook
 * Geographic Location Hook
 *
 * 客户端使用的地理位置检测Hook
 * Client-side geographic location detection hook
 */

import { useState, useEffect } from "react";
import type { GeoLocation } from "@/lib/geo/geoip-service";

interface UseGeoLocationResult {
  location: GeoLocation | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * 获取用户地理位置的Hook
 * Hook to get user's geographic location
 */
export function useGeoLocation(): UseGeoLocationResult {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/geo/location");
      const result = await response.json();

      if (result.success && result.data) {
        setLocation(result.data);
      } else {
        // 使用默认位置
        setLocation({
          country: "Unknown",
          countryCode: "XX",
          city: "Unknown",
          region: "Unknown",
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        });
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to fetch location");
      setError(error);
      // 设置默认位置
      setLocation({
        country: "Unknown",
        countryCode: "XX",
        city: "Unknown",
        region: "Unknown",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchLocation();
  }, []);

  return {
    location,
    loading,
    error,
    refetch: fetchLocation,
  };
}






