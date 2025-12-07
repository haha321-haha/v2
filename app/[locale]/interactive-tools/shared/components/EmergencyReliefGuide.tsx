"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, Phone } from "lucide-react";

export default function EmergencyReliefGuide() {
  const t = useTranslations("interactiveTools.emergencyRelief");
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-r from-red-50 via-pink-50 to-purple-50 border-l-4 border-red-500 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
          <h2 className="text-xl font-semibold text-red-800">{t("title")}</h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-red-600 hover:text-red-800 font-medium text-sm"
        >
          {isExpanded ? t("buttons.collapse") : t("buttons.expand")}
        </button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 中文版 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              🚨 立即缓解步骤：
            </h3>
            <ol className="space-y-3 text-sm">
              <li className="flex items-start">
                <span className="bg-red-100 text-red-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-gray-900">热敷：</strong>
                  <span className="text-gray-700">42°C热敷下腹部15-20分钟</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-red-100 text-red-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-gray-900">补镁：</strong>
                  <span className="text-gray-700">200-400mg（避免空腹，</span>
                  <span className="text-red-600 font-medium">日限400mg</span>
                  <span className="text-gray-700">）</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-red-100 text-red-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-gray-900">穴位：</strong>
                  <span className="text-gray-700">
                    按压三阴交穴（内踝上3寸）
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-red-100 text-red-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  4
                </span>
                <div>
                  <strong className="text-gray-900">姿势：</strong>
                  <span className="text-gray-700">膝胸位或侧卧位缓解</span>
                </div>
              </li>
            </ol>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-4">
              <div className="flex items-start">
                <Phone className="w-4 h-4 text-orange-600 mr-2 mt-0.5" />
                <div>
                  <strong className="text-orange-800 text-sm">
                    ⚠️ 紧急就医信号：
                  </strong>
                  <p className="text-orange-700 text-sm mt-1">
                    疼痛伴随呕吐、发烧(&gt;38°C)、剧烈头痛时请立即就医
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 英文版 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 flex items-center">
              🚨 Quick Relief Steps:
            </h3>
            <ol className="space-y-3 text-sm">
              <li className="flex items-start">
                <span className="bg-red-100 text-red-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-gray-900">Heat:</strong>
                  <span className="text-gray-700">
                    {" "}
                    Apply 42°C heat pad for 15-20min
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-red-100 text-red-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-gray-900">Magnesium:</strong>
                  <span className="text-gray-700"> 200-400mg (with food, </span>
                  <span className="text-red-600 font-medium">
                    max 400mg/day
                  </span>
                  <span className="text-gray-700">)</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-red-100 text-red-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-gray-900">Acupressure:</strong>
                  <span className="text-gray-700"> Press Sanyinjiao point</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-red-100 text-red-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  4
                </span>
                <div>
                  <strong className="text-gray-900">Position:</strong>
                  <span className="text-gray-700">
                    {" "}
                    Knee-chest or side lying
                  </span>
                </div>
              </li>
            </ol>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-4">
              <div className="flex items-start">
                <Phone className="w-4 h-4 text-orange-600 mr-2 mt-0.5" />
                <div>
                  <strong className="text-orange-800 text-sm">
                    ⚠️ Seek immediate care if:
                  </strong>
                  <p className="text-orange-700 text-sm mt-1">
                    Pain with vomiting, fever &gt;38°C, or severe headache
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 功能占位区 */}
      <div className="mt-6 text-center p-4 bg-white/70 border-2 border-dashed border-pink-300 rounded-lg">
        <p className="text-gray-600 text-sm">
          📱 <strong>个性化疼痛追踪器开发中</strong> | Pain Tracker Coming Soon
          (September 2024)
        </p>
        <p className="text-xs text-gray-500 mt-1">
          点击获取测试版本通知 |{" "}
          <a
            href="mailto:notify@periodhub.health?subject=Pain Tracker Beta"
            className="text-pink-600 hover:text-pink-800"
          >
            Get Beta Access
          </a>
        </p>
      </div>
    </div>
  );
}
