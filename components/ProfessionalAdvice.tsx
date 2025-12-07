"use client";

import React from "react";

interface ProfessionalAdviceProps {
  impactScore: number;
  painLevel: number;
  workDaysAffected: number;
  productivityLoss: number;
  locale: string;
  onBack: () => void;
  onUpgrade?: (targetMode: "detailed" | "medical") => void; // 新增：升级回调函数
  mode?: "simplified" | "detailed" | "medical"; // 新增：评估模式
}

// 国际化文本
const TEXTS = {
  zh: {
    title: "专业建议",
    subtitle: "基于您的评估结果，我们为您提供以下个性化建议",
    impactLevel: "影响等级",
    yourScore: "您的评分",
    recommendations: "建议措施",
    workplaceAdjustments: "职场调整建议",
    healthManagement: "健康管理方案",
    medicalAdvice: "医疗建议",
    backButton: "返回重新评估",
    disclaimer: "以上建议仅供参考，不构成医疗诊断。如有严重症状，请及时就医。",
    levels: {
      mild: "轻度影响",
      moderate: "中度影响",
      severe: "重度影响",
      critical: "严重影响",
    },
  },
  en: {
    title: "Professional Advice",
    subtitle:
      "Based on your assessment results, we provide the following personalized recommendations",
    impactLevel: "Impact Level",
    yourScore: "Your Score",
    recommendations: "Recommendations",
    workplaceAdjustments: "Workplace Adjustments",
    healthManagement: "Health Management",
    medicalAdvice: "Medical Advice",
    backButton: "Back to Re-assess",
    disclaimer:
      "These recommendations are for reference only and do not constitute medical diagnosis. Please seek medical attention for severe symptoms.",
    levels: {
      mild: "Mild Impact",
      moderate: "Moderate Impact",
      severe: "Severe Impact",
      critical: "Critical Impact",
    },
  },
};

export default function ProfessionalAdvice({
  impactScore,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  painLevel: _painLevel,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  workDaysAffected: _workDaysAffected,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  productivityLoss: _productivityLoss,
  locale,
  onBack,
  onUpgrade,
  mode = "simplified", // 默认为简化版
}: ProfessionalAdviceProps) {
  const t = TEXTS[locale as keyof typeof TEXTS] || TEXTS.zh;

  // 获取影响等级
  const getImpactLevel = (score: number) => {
    if (score <= 30) {
      return {
        level: t.levels.mild,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    }
    if (score <= 60) {
      return {
        level: t.levels.moderate,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      };
    }
    if (score <= 80) {
      return {
        level: t.levels.severe,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
      };
    }
    return {
      level: t.levels.critical,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    };
  };

  // 生成个性化建议
  const getAdvice = (score: number) => {
    const isZh = locale === "zh";

    if (score <= 30) {
      // 轻度影响
      return {
        workplace: isZh
          ? [
              "保持规律的工作作息，避免过度劳累",
              "在经期前后适当调整工作强度",
              "准备应急药物和热敷包在办公室",
              "与同事建立良好沟通，必要时寻求理解",
            ]
          : [
              "Maintain regular work schedule and avoid overwork",
              "Adjust work intensity before and during menstruation",
              "Keep emergency medication and heating pads at office",
              "Communicate with colleagues and seek understanding when needed",
            ],
        health: isZh
          ? [
              "保持适度运动，如瑜伽、散步等",
              "注意饮食均衡，减少咖啡因和盐分摄入",
              "保证充足睡眠，每晚7-8小时",
              "学习放松技巧，如深呼吸、冥想",
            ]
          : [
              "Maintain moderate exercise like yoga and walking",
              "Balance diet, reduce caffeine and salt intake",
              "Ensure adequate sleep, 7-8 hours per night",
              "Learn relaxation techniques like deep breathing and meditation",
            ],
        medical: isZh
          ? [
              "可以使用非处方止痛药（如布洛芬）",
              "尝试热敷缓解疼痛",
              "如症状持续加重，建议咨询医生",
              "记录症状日记，帮助医生诊断",
            ]
          : [
              "Over-the-counter pain relievers (like ibuprofen) may help",
              "Try heat therapy for pain relief",
              "Consult doctor if symptoms worsen",
              "Keep symptom diary to help with diagnosis",
            ],
      };
    }

    if (score <= 60) {
      // 中度影响
      return {
        workplace: isZh
          ? [
              "考虑申请弹性工作时间或远程办公",
              "在症状严重时适当请假休息",
              "调整工作计划，避免在经期安排重要会议",
              "与上级沟通，寻求工作安排上的支持",
              "准备完善的应急包（药物、热敷包、备用衣物）",
            ]
          : [
              "Consider flexible work hours or remote work options",
              "Take sick leave when symptoms are severe",
              "Adjust work schedule to avoid important meetings during menstruation",
              "Communicate with supervisor for work arrangement support",
              "Prepare comprehensive emergency kit (medication, heating pads, spare clothes)",
            ],
        health: isZh
          ? [
              "建立规律的运动习惯，每周3-4次",
              "采用抗炎饮食，增加omega-3脂肪酸摄入",
              "考虑补充维生素B、镁等营养素",
              "学习压力管理技巧，减少焦虑",
              "保持健康体重，避免过度肥胖或消瘦",
            ]
          : [
              "Establish regular exercise routine, 3-4 times per week",
              "Adopt anti-inflammatory diet, increase omega-3 intake",
              "Consider vitamin B and magnesium supplements",
              "Learn stress management techniques to reduce anxiety",
              "Maintain healthy weight, avoid obesity or being underweight",
            ],
        medical: isZh
          ? [
              "建议咨询妇科医生，进行全面检查",
              "可能需要处方药物治疗",
              "考虑整体健康调理或针灸治疗",
              "定期复查，监测症状变化",
              "排除子宫内膜异位症等疾病",
            ]
          : [
              "Consult gynecologist for comprehensive examination",
              "Prescription medication may be needed",
              "Consider Holistic Health therapy or acupuncture",
              "Regular follow-ups to monitor symptom changes",
              "Rule out conditions like endometriosis",
            ],
      };
    }

    if (score <= 80) {
      // 重度影响
      return {
        workplace: isZh
          ? [
              "强烈建议申请医疗假或病假",
              "与人力资源部门沟通，了解相关政策支持",
              "考虑短期工作调整或岗位调整",
              "寻求职业健康服务的支持",
              "必要时考虑长期工作安排调整",
              "保留医疗证明和诊断报告",
            ]
          : [
              "Strongly recommend applying for medical or sick leave",
              "Communicate with HR about policy support",
              "Consider short-term work adjustments or position changes",
              "Seek occupational health service support",
              "Consider long-term work arrangement adjustments if necessary",
              "Keep medical certificates and diagnostic reports",
            ],
        health: isZh
          ? [
              "立即建立全面的健康管理计划",
              "严格遵循医生的治疗方案",
              "考虑物理治疗或康复训练",
              "寻求心理咨询支持，应对情绪压力",
              "调整生活方式，优先考虑健康",
              "加入支持小组，获得情感支持",
            ]
          : [
              "Establish comprehensive health management plan immediately",
              "Strictly follow doctor's treatment plan",
              "Consider physical therapy or rehabilitation",
              "Seek psychological counseling for emotional stress",
              "Adjust lifestyle with health as priority",
              "Join support groups for emotional support",
            ],
        medical: isZh
          ? [
              "立即就医，进行全面妇科检查",
              "可能需要激素治疗或手术治疗",
              "定期进行超声检查和血液检查",
              "考虑专科医院或专家会诊",
              "制定长期治疗和管理计划",
              "了解所有治疗选项和风险",
            ]
          : [
              "Seek immediate medical attention for comprehensive gynecological examination",
              "Hormone therapy or surgery may be required",
              "Regular ultrasound and blood tests",
              "Consider specialist hospital or expert consultation",
              "Develop long-term treatment and management plan",
              "Understand all treatment options and risks",
            ],
      };
    }

    // 严重影响
    return {
      workplace: isZh
        ? [
            "紧急建议：立即申请病假，优先处理健康问题",
            "与雇主协商长期医疗假或工作调整",
            "了解残疾保险和医疗保险权益",
            "考虑申请工作能力评估",
            "寻求法律咨询，了解劳动权益保护",
            "必要时考虑职业转换或提前退休",
          ]
        : [
            "Urgent: Apply for sick leave immediately, prioritize health",
            "Negotiate long-term medical leave or work adjustments with employer",
            "Understand disability and medical insurance benefits",
            "Consider work capacity assessment",
            "Seek legal consultation for labor rights protection",
            "Consider career change or early retirement if necessary",
          ],
      health: isZh
        ? [
            "紧急就医，这是最优先事项",
            "可能需要住院治疗或密集医疗干预",
            "全面评估生活质量和功能状态",
            "寻求多学科团队支持（妇科、疼痛科、心理科）",
            "考虑参与临床试验或新疗法",
            "建立强大的社会支持网络",
          ]
        : [
            "Seek emergency medical care, this is top priority",
            "Hospitalization or intensive medical intervention may be needed",
            "Comprehensive assessment of quality of life and functional status",
            "Seek multidisciplinary team support (gynecology, pain management, psychology)",
            "Consider participating in clinical trials or new therapies",
            "Build strong social support network",
          ],
      medical: isZh
        ? [
            "立即前往医院急诊或专科门诊",
            "需要专家团队制定综合治疗方案",
            "可能需要手术治疗（如腹腔镜手术）",
            "考虑疼痛管理专科治疗",
            "定期随访和长期监测必不可少",
            "了解所有治疗选项，包括实验性治疗",
          ]
        : [
            "Go to hospital emergency or specialist clinic immediately",
            "Expert team needed for comprehensive treatment plan",
            "Surgery may be required (such as laparoscopy)",
            "Consider pain management specialist treatment",
            "Regular follow-ups and long-term monitoring essential",
            "Understand all treatment options including experimental treatments",
          ],
    };
  };

  const impactLevel = getImpactLevel(impactScore);
  const advice = getAdvice(impactScore);

  // 根据模式过滤建议数量
  const filterAdviceByMode = (adviceList: string[]) => {
    if (mode === "simplified") {
      // 简化版：只显示前3-5条建议
      return adviceList.slice(0, Math.min(5, adviceList.length));
    } else if (mode === "detailed") {
      // 详细版：显示所有建议
      return adviceList;
    } else {
      // 医疗专业版：显示所有建议（未来可以添加更多专业建议）
      return adviceList;
    }
  };

  const filteredAdvice = {
    workplace: filterAdviceByMode(advice.workplace),
    health: filterAdviceByMode(advice.health),
    medical: filterAdviceByMode(advice.medical),
  };

  return (
    <div className="mt-12 p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
      {/* 标题 */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">{t.title}</h2>
        <p className="text-lg text-gray-600">{t.subtitle}</p>
      </div>

      {/* 评分结果 */}
      <div
        className={`p-6 rounded-xl ${impactLevel.bgColor} border-2 ${impactLevel.borderColor} mb-8`}
      >
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 mb-2">
            {t.impactLevel}
          </p>
          <h3 className={`text-2xl font-bold ${impactLevel.color} mb-2`}>
            {impactLevel.level}
          </h3>
          <p className="text-sm text-gray-600">
            {t.yourScore}:{" "}
            <span className={`font-bold ${impactLevel.color}`}>
              {impactScore}/100
            </span>
          </p>
        </div>
      </div>

      {/* 建议内容 */}
      <div className="space-y-6 mb-8">
        {/* 职场调整建议 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-3">💼</span>
            {t.workplaceAdjustments}
          </h4>
          <ul className="space-y-3">
            {filteredAdvice.workplace.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-purple-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 健康管理方案 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-3">🏥</span>
            {t.healthManagement}
          </h4>
          <ul className="space-y-3">
            {filteredAdvice.health.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 医疗建议 */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-3">⚕️</span>
            {t.medicalAdvice}
          </h4>
          <ul className="space-y-3">
            {filteredAdvice.medical.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 模式升级提示 */}
      {mode === "simplified" && impactScore > 40 && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">💡</span>
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-2">
                {locale === "zh"
                  ? "建议升级到详细版评估"
                  : "Upgrade to Detailed Assessment"}
              </p>
              <p className="text-sm text-blue-800 mb-3">
                {locale === "zh"
                  ? "您的评估结果显示影响程度较高，建议进行更详细的评估以获得更全面的建议。"
                  : "Your assessment results show a higher impact level. We recommend a more detailed assessment for comprehensive advice."}
              </p>
              <ul className="text-sm text-blue-800 space-y-1 mb-3">
                <li>
                  •{" "}
                  {locale === "zh"
                    ? "多维度影响分析"
                    : "Multi-dimensional impact analysis"}
                </li>
                <li>
                  •{" "}
                  {locale === "zh"
                    ? "更具体的改善建议"
                    : "More specific improvement recommendations"}
                </li>
                <li>
                  •{" "}
                  {locale === "zh"
                    ? "心理和社交支持建议"
                    : "Psychological and social support advice"}
                </li>
              </ul>
              <button
                onClick={() => onUpgrade?.("detailed")}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-300"
              >
                {locale === "zh" ? "升级到详细版" : "Upgrade to Detailed"}
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === "detailed" && impactScore > 60 && (
        <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🏥</span>
            <div>
              <p className="text-sm font-semibold text-purple-900 mb-2">
                {locale === "zh"
                  ? "建议升级到医疗专业版评估"
                  : "Upgrade to Medical Professional Assessment"}
              </p>
              <p className="text-sm text-purple-800 mb-3">
                {locale === "zh"
                  ? "您的评估结果显示影响程度严重，建议进行专业评估以获得医疗指导。"
                  : "Your assessment results show severe impact. We recommend professional assessment for medical guidance."}
              </p>
              <ul className="text-sm text-purple-800 space-y-1 mb-3">
                <li>
                  •{" "}
                  {locale === "zh"
                    ? "临床级别的专业评估"
                    : "Clinical-level professional assessment"}
                </li>
                <li>
                  •{" "}
                  {locale === "zh"
                    ? "就医指导和专科推荐"
                    : "Medical guidance and specialist referrals"}
                </li>
                <li>
                  •{" "}
                  {locale === "zh"
                    ? "治疗方案建议"
                    : "Treatment plan recommendations"}
                </li>
                <li>
                  •{" "}
                  {locale === "zh"
                    ? "长期管理计划"
                    : "Long-term management plan"}
                </li>
              </ul>
              <button
                onClick={() => onUpgrade?.("medical")}
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition duration-300"
              >
                {locale === "zh"
                  ? "升级到医疗专业版"
                  : "Upgrade to Medical Professional"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 免责声明 */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <p className="text-sm text-yellow-800">⚠️ {t.disclaimer}</p>
      </div>

      {/* 返回按钮 */}
      <div className="text-center">
        <button
          onClick={onBack}
          className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-300"
        >
          {t.backButton}
        </button>
      </div>
    </div>
  );
}
