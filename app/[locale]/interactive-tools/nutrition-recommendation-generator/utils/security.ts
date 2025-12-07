/**
 * 安全加固 - 基于ziV1d3d的安全措施
 * 提供生产环境的安全保护功能
 */

export type SelectionPayload = {
  menstrualPhase?: string;
  healthGoals?: Set<string>;
  holisticHealthConstitution?: Set<string>;
  [key: string]: unknown;
};

type SecurityRequest = {
  ip?: string;
  connection?: { remoteAddress?: string };
};

type SecurityResponse = {
  setHeader: (key: string, value: string | number) => void;
  status: (code: number) => { json: (body: unknown) => void };
};

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

// 基于ziV1d3d的安全配置
export const securityConfig = {
  // Content Security Policy
  csp: {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
    ],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "font-src": ["'self'", "https://fonts.gstatic.com"],
    "img-src": ["'self'", "data:", "https:"],
    "connect-src": ["'self'", "https://www.google-analytics.com"],
    "frame-src": ["'none'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
  },

  // HTTP安全头
  headers: {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  },

  // 输入验证
  validation: {
    maxInputLength: 1000,
    allowedCharacters: /^[a-zA-Z0-9\u4e00-\u9fa5\s\-_.,!?()]+$/,
    sanitizeHtml: true,
    preventXSS: true,
  },

  // 速率限制
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 每个IP最多100个请求
    message: "Too many requests from this IP, please try again later.",
  },
};

// 基于ziV1d3d的输入验证
export class InputValidator {
  // 验证用户输入
  static validateInput(input: string): {
    isValid: boolean;
    sanitized: string;
    error?: string;
  } {
    if (!input || typeof input !== "string") {
      return { isValid: false, sanitized: "", error: "Invalid input" };
    }

    if (input.length > securityConfig.validation.maxInputLength) {
      return { isValid: false, sanitized: "", error: "Input too long" };
    }

    if (!securityConfig.validation.allowedCharacters.test(input)) {
      return { isValid: false, sanitized: "", error: "Invalid characters" };
    }

    // 基于ziV1d3d的HTML清理
    const sanitized = this.sanitizeHtml(input);

    return { isValid: true, sanitized };
  }

  // 清理HTML标签
  static sanitizeHtml(input: string): string {
    if (!securityConfig.validation.sanitizeHtml) {
      return input;
    }

    // 移除危险标签
    const dangerousTags = /<script[^>]*>.*?<\/script>/gi;
    const dangerousAttributes = /on\w+\s*=/gi;

    const sanitized = input
      .replace(dangerousTags, "")
      .replace(dangerousAttributes, "")
      .replace(/javascript:/gi, "")
      .replace(/vbscript:/gi, "")
      .replace(/data:/gi, "");

    return sanitized;
  }

  // 验证选择数据
  static validateSelections(selections: SelectionPayload): {
    isValid: boolean;
    error?: string;
  } {
    if (!selections || typeof selections !== "object") {
      return { isValid: false, error: "Invalid selections" };
    }

    // 验证月经阶段
    if (
      selections.menstrualPhase &&
      typeof selections.menstrualPhase !== "string"
    ) {
      return { isValid: false, error: "Invalid menstrual phase" };
    }

    // 验证健康目标
    if (selections.healthGoals && !(selections.healthGoals instanceof Set)) {
      return { isValid: false, error: "Invalid health goals" };
    }

    // 验证整体健康体质
    if (
      selections.holisticHealthConstitution &&
      !(selections.holisticHealthConstitution instanceof Set)
    ) {
      return { isValid: false, error: "Invalid holistic health constitution" };
    }

    return { isValid: true };
  }
}

// 基于ziV1d3d的CSRF保护
export class CSRFProtection {
  private static tokens = new Map<string, string>();

  // 生成CSRF令牌
  static generateToken(sessionId: string): string {
    const token =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    this.tokens.set(sessionId, token);
    return token;
  }

  // 验证CSRF令牌
  static validateToken(sessionId: string, token: string): boolean {
    const storedToken = this.tokens.get(sessionId);
    return storedToken === token;
  }

  // 清除令牌
  static clearToken(sessionId: string): void {
    this.tokens.delete(sessionId);
  }
}

// 基于ziV1d3d的速率限制
export class RateLimiter {
  private static requests = new Map<string, RateLimitEntry>();

  // 检查速率限制
  static checkRateLimit(ip: string): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const windowMs = securityConfig.rateLimit.windowMs;
    const max = securityConfig.rateLimit.max;

    const requestData = this.requests.get(ip);

    if (!requestData || now > requestData.resetTime) {
      // 新的时间窗口
      this.requests.set(ip, { count: 1, resetTime: now + windowMs });
      return { allowed: true, remaining: max - 1, resetTime: now + windowMs };
    }

    if (requestData.count >= max) {
      return { allowed: false, remaining: 0, resetTime: requestData.resetTime };
    }

    requestData.count++;
    return {
      allowed: true,
      remaining: max - requestData.count,
      resetTime: requestData.resetTime,
    };
  }

  // 清理过期数据
  static cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.requests.entries());
    for (const [ip, data] of entries) {
      if (now > data.resetTime) {
        this.requests.delete(ip);
      }
    }
  }
}

// 基于ziV1d3d的安全头生成
export function generateSecurityHeaders(): Record<string, string> {
  const cspString = Object.entries(securityConfig.csp)
    .map(([key, value]) => `${key} ${value.join(" ")}`)
    .join("; ");

  return {
    ...securityConfig.headers,
    "Content-Security-Policy": cspString,
  };
}

// 基于ziV1d3d的安全中间件
export function securityMiddleware(
  req: SecurityRequest & Record<string, unknown>,
  res: SecurityResponse,
  next: () => void,
): void {
  // 添加安全头
  const headers = generateSecurityHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // 速率限制检查
  const ip = req.ip ?? req.connection?.remoteAddress ?? "0.0.0.0";
  const rateLimit = RateLimiter.checkRateLimit(ip);

  if (!rateLimit.allowed) {
    res.status(429).json({ error: securityConfig.rateLimit.message });
    return;
  }

  res.setHeader("X-RateLimit-Limit", securityConfig.rateLimit.max);
  res.setHeader("X-RateLimit-Remaining", rateLimit.remaining);
  res.setHeader("X-RateLimit-Reset", rateLimit.resetTime);

  next();
}
