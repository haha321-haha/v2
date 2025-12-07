"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  const locale = useLocale();
  const t = useTranslations("common.breadcrumb");

  const breadcrumbData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: t("home"),
          item: `${
            process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
          }/${locale}`,
        },
        ...items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 2,
          name: item.label,
          ...(item.href && {
            item: `${
              process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health"
            }${item.href}`,
          }),
        })),
      ],
    }),
    [t, locale, items],
  );

  // 使用 useEffect 在客户端动态插入结构化数据脚本到 document.head
  // 这样可以避免服务器端和客户端渲染不一致导致的 hydration 错误
  useEffect(() => {
    // 生成唯一的 ID 来标识这个面包屑的脚本
    const scriptId = `breadcrumb-script-${locale}-${items
      .map((i) => i.label)
      .join("-")}`;

    // 检查是否已经存在相同的脚本
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(breadcrumbData);
      document.head.appendChild(script);
    } else {
      // 如果脚本已存在，更新其内容
      existingScript.textContent = JSON.stringify(breadcrumbData);
    }

    // 清理函数：组件卸载时移除脚本
    return () => {
      const script = document.getElementById(scriptId);
      if (script) {
        script.remove();
      }
    };
  }, [breadcrumbData, locale, items]);

  return (
    <>
      {/* 面包屑导航 */}
      <nav aria-label="Breadcrumb" className={`mb-6 ${className}`}>
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link
              href={`/${locale}`}
              className="flex items-center hover:text-primary-600 transition-colors"
              suppressHydrationWarning={true}
            >
              <Home className="w-4 h-4 mr-1" />
              {t("home")}
            </Link>
          </li>

          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-primary-600 transition-colors"
                  suppressHydrationWarning={true}
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
