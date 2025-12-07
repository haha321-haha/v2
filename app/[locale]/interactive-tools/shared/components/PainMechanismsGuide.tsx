"use client";

import React, { useState } from "react";
import { Brain, Zap, Flame, Pill, ChevronDown, ChevronUp } from "lucide-react";

interface PainMechanismsGuideProps {
  locale: string;
}

export default function PainMechanismsGuide({
  locale,
}: PainMechanismsGuideProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const isZh = locale === "zh";

  const mechanisms = [
    {
      id: "prostaglandin",
      icon: Flame,
      titleZh: "前列腺素释放",
      titleEn: "Prostaglandin Release",
      descZh: "子宫内膜脱落时释放PGF2α，引起子宫强烈收缩",
      descEn:
        "Endometrial shedding releases PGF2α, causing intense uterine contractions",
      detailZh:
        "前列腺素F2α（PGF2α）是导致痛经的主要生化因子。当子宫内膜准备脱落时，会大量释放这种炎症介质，导致子宫平滑肌强烈收缩，压迫血管，造成局部缺血和疼痛。",
      detailEn:
        "Prostaglandin F2α (PGF2α) is the primary biochemical factor causing dysmenorrhea. When the endometrium prepares to shed, it releases large amounts of this inflammatory mediator, causing intense uterine smooth muscle contractions, compressing blood vessels, and creating local ischemia and pain.",
    },
    {
      id: "nerve",
      icon: Zap,
      titleZh: "疼痛信号传导",
      titleEn: "Pain Signal Transmission",
      descZh: "通过脊髓传导至大脑痛觉中枢，闸门控制理论解释缓解机制",
      descEn:
        "Signals travel via spinal cord to brain pain centers; gate control theory explains relief",
      detailZh:
        '疼痛信号通过A-δ和C纤维从子宫传导至脊髓背角，再上行至丘脑和大脑皮层。根据闸门控制理论，非疼痛刺激（如热敷、按摩）可以"关闭疼痛闸门"，减少疼痛信号传递。',
      detailEn:
        'Pain signals travel through A-δ and C fibers from the uterus to the spinal cord dorsal horn, then ascend to the thalamus and cerebral cortex. According to gate control theory, non-painful stimuli (like heat, massage) can "close the pain gate," reducing pain signal transmission.',
    },
    {
      id: "inflammation",
      icon: Brain,
      titleZh: "炎症反应",
      titleEn: "Inflammatory Response",
      descZh: "局部炎症因子增加血管通透性，加重疼痛敏感性",
      descEn:
        "Local inflammatory factors increase vascular permeability, enhancing pain sensitivity",
      detailZh:
        "炎症级联反应释放组胺、白三烯等介质，增加血管通透性，导致组织水肿。同时激活痛觉感受器，降低疼痛阈值，使轻微刺激也能引起强烈疼痛感。",
      detailEn:
        "Inflammatory cascade releases mediators like histamine and leukotrienes, increasing vascular permeability and causing tissue edema. This also activates nociceptors, lowering pain threshold so mild stimuli can cause intense pain.",
    },
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl p-6 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {isZh
            ? "🧠 痛经疼痛的医学原理"
            : "🧠 Medical Mechanisms of Period Pain"}
        </h2>
        <p className="text-gray-600">
          {isZh
            ? "痛经的科学原理主要涉及三个生理过程："
            : "Period pain mechanisms involve three key physiological processes:"}
        </p>
      </div>

      <div className="space-y-4">
        {mechanisms.map((mechanism, index) => {
          const Icon = mechanism.icon;
          const isExpanded = expandedSection === mechanism.id;

          return (
            <div
              key={mechanism.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <button
                onClick={() => toggleSection(mechanism.id)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-2 rounded-lg mr-4">
                      <Icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {index + 1}.{" "}
                        {isZh ? mechanism.titleZh : mechanism.titleEn}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {isZh ? mechanism.descZh : mechanism.descEn}
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                    <p className="text-gray-700 leading-relaxed">
                      {isZh ? mechanism.detailZh : mechanism.detailEn}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 镁的作用机制专门说明 */}
      <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-l-4 border-green-400">
        <div className="flex items-center mb-3">
          <Pill className="w-5 h-5 text-green-600 mr-2" />
          <h4 className="text-lg font-semibold text-green-800">
            {isZh
              ? "💡 补镁缓解痛经的科学机制"
              : "💡 How Magnesium Relieves Period Pain"}
          </h4>
        </div>
        <div className="space-y-3 text-sm">
          <p className="text-gray-700">
            <strong className="text-green-700">
              {isZh
                ? "镁离子(Mg²⁺)作为天然的钙通道阻滞剂，能够："
                : "Magnesium ions (Mg²⁺) act as natural calcium channel blockers:"}
            </strong>
          </p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <span className="text-gray-700">
                {isZh
                  ? "阻断钙离子流入子宫平滑肌细胞，"
                  : "Block calcium influx into uterine smooth muscle cells, "}
                <span className="text-red-600 font-medium">
                  {isZh ? "减少肌肉痉挛" : "reducing muscle spasms"}
                </span>
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <span className="text-gray-700">
                {isZh
                  ? "激活副交感神经系统，促进肌肉放松"
                  : "Activate parasympathetic nervous system, promoting muscle relaxation"}
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <span className="text-gray-700">
                {isZh
                  ? "调节神经递质释放，"
                  : "Regulate neurotransmitter release, "}
                <span className="text-red-600 font-medium">
                  {isZh ? "降低痛觉敏感性" : "reducing pain sensitivity"}
                </span>
              </span>
            </li>
          </ul>
          <div className="bg-white/70 p-3 rounded border border-green-200 mt-4">
            <p className="text-xs text-green-700">
              <strong>
                {isZh ? "临床研究显示：" : "Clinical studies show: "}
              </strong>
              {isZh
                ? "每日200-400mg镁剂可将痛经强度降低40-60%"
                : "200-400mg daily magnesium reduces period pain intensity by 40-60%"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
