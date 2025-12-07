"use client";

import React from "react";
import { Shield, AlertCircle, UserCheck } from "lucide-react";

interface MedicalDisclaimerProps {
  locale: string;
}

export default function MedicalDisclaimer({ locale }: MedicalDisclaimerProps) {
  const isZh = locale === "zh";

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
      <div className="flex items-center mb-4">
        <Shield className="w-5 h-5 text-red-600 mr-2" />
        <h3 className="text-lg font-semibold text-red-700">
          {isZh ? "⚕️ 医疗声明" : "⚕️ Medical Disclaimer"}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div>
          <p className="font-medium text-gray-800 mb-3">
            {isZh ? "重要提醒：" : "Important Notice:"}
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                <span className="text-red-600 font-medium">
                  {isZh
                    ? "镁剂安全上限：400mg/日"
                    : "Magnesium safety limit: 400mg/day"}
                </span>
                {isZh ? "（超量可能导致腹泻）" : " (excess may cause diarrhea)"}
              </span>
            </li>
            <li className="flex items-start">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                {isZh
                  ? "剧痛伴呕吐可能提示子宫内膜异位症"
                  : "Severe pain with vomiting may indicate endometriosis"}
              </span>
            </li>
            <li className="flex items-start">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                {isZh
                  ? "青少年(<18岁)请在医生指导下使用"
                  : "Teens (<18yr) require medical supervision"}
              </span>
            </li>
            <li className="flex items-start">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                {isZh
                  ? "肾功能障碍者禁用高剂量镁剂"
                  : "Kidney disease patients avoid high-dose Mg"}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <div className="mb-4">
            <p className="font-medium text-gray-800 mb-2 flex items-center">
              <UserCheck className="w-4 h-4 text-blue-600 mr-2" />
              {isZh ? "医学审核：" : "Medical Review:"}
            </p>
            <p className="text-gray-700">
              Dr. Sarah Chen, MD ({isZh ? "妇产科主治医师" : "OB/GYN"})*
            </p>
            <p className="text-xs text-gray-500 mt-1">
              *
              {isZh
                ? "审核员资质认证中，如有疑问请咨询你的医生"
                : "Credential verification pending"}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-xs text-blue-800 font-medium mb-1">
              {isZh ? "参考文献：" : "References:"}
            </p>
            <p className="text-xs text-blue-700">
              [1] Dawood MY. Prostaglandins and menstruation. Ann N Y Acad Sci.
              1994;734:426-30.
            </p>
            <p className="text-xs text-blue-700">
              [2] Seifert B, et al. Magnesium - a new therapeutic alternative in
              primary dysmenorrhea. Zentralbl Gynakol. 1989;111(11):755-60.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 pt-4 mt-6 text-center">
        <p className="text-xs text-gray-600">
          {isZh
            ? "本内容仅供教育用途，不替代专业医疗建议。如有疑问请咨询医生。"
            : "Content for educational purposes only. Consult healthcare provider for medical advice."}
        </p>
      </div>
    </div>
  );
}
