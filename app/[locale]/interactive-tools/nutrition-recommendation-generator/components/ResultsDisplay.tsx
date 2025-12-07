"use client";

import type { Language } from "../types";
import type { ZIV1D3DRecommendationResult } from "../utils/recommendationEngine";
import "../styles/nutrition-generator.css";

interface ResultsDisplayProps {
  results: ZIV1D3DRecommendationResult;
  language: Language;
}

export default function ResultsDisplay({
  results,
  language,
}: ResultsDisplayProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-bold text-neutral-900 mb-4">
        {results.category}
      </h2>

      {results.items.map((data, index) => (
        <div
          key={`${data.title}-${index}`}
          className="result-card mb-6"
          style={{ animationDelay: data.delay }}
        >
          <h3 className="text-lg font-semibold mb-4 text-neutral-800 flex items-center gap-2">
            <svg
              className={`w-5 h-5 ${data.color}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {data.icon === "check-circle-2" && (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
              {data.icon === "x-circle" && (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
              {data.icon === "sparkles" && (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              )}
            </svg>
            {data.title}
          </h3>
          <ul className="space-y-3 text-neutral-800">
            {data.items.map((item, itemIndex) => (
              <li
                key={`${data.title}-${itemIndex}`}
                className="flex items-start gap-3"
              >
                <svg
                  className={`w-5 h-5 ${data.color} flex-shrink-0 mt-1`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {data.icon === "check-circle-2" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  )}
                  {data.icon === "x-circle" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  )}
                  {data.icon === "sparkles" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  )}
                </svg>
                <span>{item[language]}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {results.items.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.571M15 6.343A7.962 7.962 0 0112 4c-2.34 0-4.29 1.009-5.824 2.571"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            {language === "zh"
              ? "暂无推荐内容"
              : "No Recommendations Available"}
          </h3>
          <p className="text-neutral-500">
            {language === "zh"
              ? "请选择更多选项以获得更丰富的营养建议"
              : "Please select more options to get richer nutrition recommendations"}
          </p>
        </div>
      )}
    </div>
  );
}
