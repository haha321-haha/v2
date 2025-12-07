"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Question } from "../../shared/types";

interface QuestionScreenProps {
  question: Question;
  answer?: string | string[];
  onAnswer: (questionId: string, answer: string | string[]) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}

export default function QuestionScreen({
  question,
  answer,
  onAnswer,
  onNext,
  onPrevious,
  isFirstQuestion,
  isLastQuestion,
}: QuestionScreenProps) {
  const handleOptionSelect = (optionValue: string) => {
    if (question.type === "multi") {
      const currentAnswers = Array.isArray(answer) ? answer : [];
      const newAnswers = currentAnswers.includes(optionValue)
        ? currentAnswers.filter((v) => v !== optionValue)
        : [...currentAnswers, optionValue];
      onAnswer(question.id, newAnswers);
    } else {
      onAnswer(question.id, optionValue);
    }
  };

  const isOptionSelected = (optionValue: string) => {
    if (question.type === "multi") {
      return Array.isArray(answer) && answer.includes(optionValue);
    } else {
      return answer === optionValue;
    }
  };

  const canProceed = () => {
    if (question.type === "multi") {
      return Array.isArray(answer) && answer.length > 0;
    } else {
      return answer !== undefined && answer !== "";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      {/* 问题内容 */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
          {question.title}
        </h2>
        {question.description && (
          <p className="text-gray-600 mb-6">{question.description}</p>
        )}
      </div>

      {/* 选项列表 */}
      <div className="space-y-3 mb-8">
        {question.options?.map((option) => (
          <button
            key={option.value}
            onClick={() => handleOptionSelect(String(option.value))}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
              isOptionSelected(String(option.value))
                ? "border-blue-500 bg-blue-50 text-blue-900"
                : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            <div className="flex items-start">
              <div
                className={`w-5 h-5 rounded-full border-2 mr-3 mt-0.5 flex-shrink-0 ${
                  isOptionSelected(String(option.value))
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                }`}
              >
                {isOptionSelected(String(option.value)) && (
                  <div className="w-full h-full rounded-full bg-white scale-50" />
                )}
              </div>
              <span className="text-sm md:text-base leading-relaxed">
                {option.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* 导航按钮 */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrevious}
          disabled={isFirstQuestion}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            isFirstQuestion
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          上一题
        </button>

        <button
          onClick={onNext}
          disabled={!canProceed()}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            canProceed()
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-105"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isLastQuestion ? "查看结果" : "下一题"}
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
}
