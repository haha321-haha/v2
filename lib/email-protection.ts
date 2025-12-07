/**
 * Email Protection - 邮箱地址保护工具
 * 防止邮箱地址被爬虫抓取
 */

/**
 * 编码邮箱地址
 */
export function encodeEmail(email: string): string {
  return email
    .split("")
    .map((char) => `&#${char.charCodeAt(0)};`)
    .join("");
}

/**
 * 解码邮箱地址
 */
export function decodeEmail(encoded: string): string {
  const div = document.createElement("div");
  div.innerHTML = encoded;
  return div.textContent || div.innerText || "";
}

/**
 * 混淆邮箱地址（用于显示）
 */
export function obfuscateEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;

  const visibleChars = Math.min(3, Math.floor(local.length / 2));
  const obfuscatedLocal = local.substring(0, visibleChars) + "***";

  return `${obfuscatedLocal}@${domain}`;
}

/**
 * 生成 mailto 链接（带保护）
 */
export function createProtectedMailtoLink(
  email: string,
  subject?: string,
  body?: string,
): string {
  let mailto = `mailto:${email}`;
  const params: string[] = [];

  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);

  if (params.length > 0) {
    mailto += "?" + params.join("&");
  }

  return mailto;
}

/**
 * 创建受保护的邮箱链接处理器
 */
export function createEmailClickHandler(
  email: string,
  subject?: string,
  body?: string,
) {
  return (e: MouseEvent) => {
    e.preventDefault();
    const mailto = createProtectedMailtoLink(email, subject, body);
    if (typeof window !== "undefined") {
      window.location.href = mailto;
    }
  };
}

const CONTACT_EMAIL = "tiyibaofu@outlook.com";

export function generateMailtoLink(subject?: string, body?: string): string {
  return createProtectedMailtoLink(CONTACT_EMAIL, subject, body);
}

export function displayEmail(): string {
  return obfuscateEmail(CONTACT_EMAIL);
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
