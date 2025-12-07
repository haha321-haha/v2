/**
 * GEO地理位置服务
 * Geographic Location Service
 *
 * 提供真实的地理位置检测功能
 * Provides real geographic location detection
 */

import { logError } from "@/lib/debug-logger";

export interface GeoLocation {
  country: string;
  countryCode: string;
  city: string;
  region: string;
  timezone: string;
  latitude?: number;
  longitude?: number;
  isp?: string;
}

/**
 * 从IP地址获取地理位置信息
 * Get geographic location from IP address
 *
 * @param ip IP地址（可选，如果不提供则使用客户端IP）
 * @returns 地理位置信息
 */
export async function getLocationFromIP(ip?: string): Promise<GeoLocation> {
  // 优先使用环境变量配置的GeoIP服务
  const geoIPService = process.env.NEXT_PUBLIC_GEOIP_SERVICE || "ipapi";

  try {
    switch (geoIPService) {
      case "ipapi":
        return await getLocationFromIPAPI(ip);
      case "maxmind":
        return await getLocationFromMaxMind(ip);
      case "ipapi-co":
        return await getLocationFromIPAPICo(ip);
      default:
        return await getLocationFromIPAPI(ip);
    }
  } catch (error) {
    logError(
      "[GEO] Failed to get location from service",
      error,
      "GeoIPService",
    );
    // 返回默认值
    return getDefaultLocation();
  }
}

/**
 * 使用 ipapi.co 服务获取地理位置
 * Get location using ipapi.co service
 */
async function getLocationFromIPAPICo(ip?: string): Promise<GeoLocation> {
  const url = ip ? `https://ipapi.co/${ip}/json/` : "https://ipapi.co/json/";

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`IPAPI.co request failed: ${response.status}`);
  }

  const data = await response.json();
  return {
    country: data.country_name || "Unknown",
    countryCode: data.country_code || "XX",
    city: data.city || "Unknown",
    region: data.region || "Unknown",
    timezone: data.timezone || "UTC",
    latitude: data.latitude,
    longitude: data.longitude,
    isp: data.org,
  };
}

/**
 * 使用 ip-api.com 服务获取地理位置
 * Get location using ip-api.com service
 */
async function getLocationFromIPAPI(ip?: string): Promise<GeoLocation> {
  const url = ip
    ? `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,city,regionName,timezone,lat,lon,isp`
    : "http://ip-api.com/json/?fields=status,message,country,countryCode,city,regionName,timezone,lat,lon,isp";

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`IP-API request failed: ${response.status}`);
  }

  const data = await response.json();

  if (data.status === "fail") {
    throw new Error(`IP-API error: ${data.message}`);
  }

  return {
    country: data.country || "Unknown",
    countryCode: data.countryCode || "XX",
    city: data.city || "Unknown",
    region: data.regionName || "Unknown",
    timezone: data.timezone || "UTC",
    latitude: data.lat,
    longitude: data.lon,
    isp: data.isp,
  };
}

/**
 * 使用 MaxMind GeoIP2 服务获取地理位置
 * Get location using MaxMind GeoIP2 service
 *
 * 注意：这需要配置 MaxMind 账户和 API 密钥
 */
async function getLocationFromMaxMind(ip?: string): Promise<GeoLocation> {
  const apiKey = process.env.MAXMIND_LICENSE_KEY;

  if (!apiKey) {
    throw new Error("MaxMind API key not configured");
  }

  const url = ip
    ? `https://geoip.maxmind.com/geoip/v2.1/insights/${ip}`
    : "https://geoip.maxmind.com/geoip/v2.1/insights/me";

  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.MAXMIND_ACCOUNT_ID}:${apiKey}`,
      ).toString("base64")}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`MaxMind request failed: ${response.status}`);
  }

  const data = await response.json();

  return {
    country: data.country?.names?.en || "Unknown",
    countryCode: data.country?.iso_code || "XX",
    city: data.city?.names?.en || "Unknown",
    region: data.subdivisions?.[0]?.names?.en || "Unknown",
    timezone: data.location?.time_zone || "UTC",
    latitude: data.location?.latitude,
    longitude: data.location?.longitude,
    isp: data.traits?.isp,
  };
}

/**
 * 获取默认地理位置（当服务不可用时）
 * Get default location (when service is unavailable)
 */
function getDefaultLocation(): GeoLocation {
  // 尝试从浏览器时区推断
  if (typeof Intl !== "undefined" && Intl.DateTimeFormat) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const countryCode = timezone.includes("Asia") ? "CN" : "US";
    const country = timezone.includes("Asia") ? "China" : "United States";

    return {
      country,
      countryCode,
      city: "Unknown",
      region: "Unknown",
      timezone: timezone || "UTC",
    };
  }

  return {
    country: "Unknown",
    countryCode: "XX",
    city: "Unknown",
    region: "Unknown",
    timezone: "UTC",
  };
}

/**
 * 根据地理位置优化内容
 * Optimize content based on geographic location
 */
export function optimizeContentForLocation(
  location: GeoLocation,
  locale: string,
): {
  showLocalContent: boolean;
  preferredLanguage: string;
  currency?: string;
  dateFormat?: string;
} {
  // 根据国家代码优化内容
  const countryOptimizations: Record<
    string,
    {
      preferredLanguage: string;
      currency?: string;
      dateFormat?: string;
    }
  > = {
    CN: {
      preferredLanguage: "zh",
      currency: "CNY",
      dateFormat: "YYYY-MM-DD",
    },
    US: {
      preferredLanguage: "en",
      currency: "USD",
      dateFormat: "MM/DD/YYYY",
    },
    GB: {
      preferredLanguage: "en",
      currency: "GBP",
      dateFormat: "DD/MM/YYYY",
    },
    CA: {
      preferredLanguage: "en",
      currency: "CAD",
      dateFormat: "YYYY-MM-DD",
    },
    AU: {
      preferredLanguage: "en",
      currency: "AUD",
      dateFormat: "DD/MM/YYYY",
    },
  };

  const optimization = countryOptimizations[location.countryCode] || {
    preferredLanguage: locale,
  };

  return {
    showLocalContent: true,
    preferredLanguage: optimization.preferredLanguage,
    currency: optimization.currency,
    dateFormat: optimization.dateFormat,
  };
}
