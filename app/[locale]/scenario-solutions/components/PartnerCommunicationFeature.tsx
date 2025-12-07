"use client";

import Link from "next/link";

interface PartnerCommunicationFeatureProps {
  locale: string;
}

export default function PartnerCommunicationFeature({
  locale,
}: PartnerCommunicationFeatureProps) {
  const isZh = locale === "zh";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      {/* 伴侣沟通专区 */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* 左侧内容 */}
          <div className="flex-1 lg:w-2/3">
            {/* 标题区域 */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
              <div className="bg-purple-100 rounded-full p-2 mr-0 sm:mr-3 mb-2 sm:mb-0">
                <span className="text-purple-600 text-lg sm:text-xl">💕</span>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {isZh
                    ? "💕 伴侣沟通专区 💕"
                    : "💕 Partner Communication Zone 💕"}
                </h2>
                <p className="text-sm text-purple-600 font-medium">
                  {isZh
                    ? "专为伴侣设计的理解与支持空间"
                    : "A caring space designed for partners to understand and support"}
                </p>
              </div>
            </div>

            {/* 描述 */}
            <p className="text-gray-700 mb-4 md:mb-6 text-base sm:text-lg leading-relaxed">
              {isZh
                ? "当伴侣不理解痛经时，我们需要专业的沟通策略和情感支持技巧。这个专区包含理解测试、30天训练营和个性化指导，帮助您建立更好的理解和沟通。"
                : "When partners don't understand period pain, we need professional communication strategies and emotional support techniques. This zone includes understanding tests, 30-day training camps, and personalized guidance to help you build better understanding and communication."}
            </p>

            {/* 按钮组 */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href={`/${locale}/scenario-solutions/partnerCommunication`}
                className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105 text-sm sm:text-base"
              >
                {isZh ? "进入伴侣沟通专区" : "Enter Partner Communication Zone"}
                <svg
                  className="w-4 sm:w-5 h-4 sm:h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
              <Link
                href={`/${locale}/scenario-solutions/partnerCommunication`}
                className="inline-flex items-center justify-center bg-white text-purple-600 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium border-2 border-purple-200 hover:bg-purple-50 transition-colors text-sm sm:text-base"
              >
                {isZh ? "快速理解测试" : "Quick Understanding Test"}
              </Link>
            </div>
          </div>

          {/* 右侧功能展示 */}
          <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-purple-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-sm sm:text-base">
                <span className="text-purple-500 mr-2">💕</span>
                {isZh ? "我们能帮你什么？" : "How Can We Help?"}
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {[
                  {
                    icon: "🧠",
                    text: isZh ? "伴侣理解测试" : "Partner Understanding Test",
                  },
                  {
                    icon: "🏋️",
                    text: isZh ? "30天训练营" : "30-Day Training Camp",
                  },
                  {
                    icon: "💬",
                    text: isZh
                      ? "沟通技巧指导"
                      : "Communication Skills Guidance",
                  },
                  {
                    icon: "🎯",
                    text: isZh ? "个性化建议" : "Personalized Recommendations",
                  },
                  {
                    icon: "📖",
                    text: isZh ? "情感支持手册" : "Emotional Support Guide",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center text-xs sm:text-sm text-gray-600"
                  >
                    <span className="mr-2 sm:mr-3 text-base sm:text-lg">
                      {item.icon}
                    </span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
