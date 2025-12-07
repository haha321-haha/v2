/**
 * HVsLYEp职场健康助手 - 营养建议组件
 * 基于HVsLYEp的NutritionAdvisorComponent函数设计
 */

"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Plus, ListChecks, Save, Trash2, BookOpen } from "lucide-react";
import {
  useNutrition,
  useWorkplaceWellnessActions,
} from "../hooks/useWorkplaceWellnessStore";
import { useLocale } from "next-intl";
import { getNutritionData } from "../data";
import { useTranslations } from "next-intl";
import { NutritionRecommendation } from "../types";
import { logInfo } from "@/lib/debug-logger";
import { useSimpleToast } from "./SimpleToast";
import {
  checkFoodCompatibility,
  optimizeFoodDistribution,
} from "../utils/foodCompatibility";
import { logError } from "@/lib/debug-logger";

export default function NutritionComponent() {
  const nutrition = useNutrition();
  const locale = useLocale();
  const { updateNutrition } = useWorkplaceWellnessActions();
  const t = useTranslations("workplaceWellness");
  const toast = useSimpleToast();

  const nutritionData = getNutritionData(locale);
  const [searchTerm, setSearchTerm] = useState("");
  const [mealPlan, setMealPlan] = useState<NutritionRecommendation[]>([]);
  const [generatedSuggestions, setGeneratedSuggestions] = useState<
    Record<string, string>
  >({});
  const [savedMealPlans, setSavedMealPlans] = useState<
    Array<{
      id: string;
      name: string;
      phase: string;
      foods: NutritionRecommendation[];
      suggestions: Record<string, string>;
      createdAt: Date;
    }>
  >([]);
  const [showSavedPlans, setShowSavedPlans] = useState(false);

  // 初始化默认建议
  useEffect(() => {
    // 如果没有生成的建议，则生成默认建议
    if (Object.keys(generatedSuggestions).length === 0) {
      const defaultSuggestions = (
        ["breakfast", "lunch", "dinner", "snack"] as const
      ).reduce(
        (acc, mealId) => {
          const phase = nutrition.selectedPhase || "menstrual"; // 默认为月经期
          const phaseSpecificKey = `nutrition.mealSuggestions.${phase}.${mealId}`;
          const genericKey = `nutrition.mealSuggestions.${mealId}`;

          try {
            const phaseSuggestion = t(phaseSpecificKey);
            acc[mealId] =
              phaseSuggestion === phaseSpecificKey
                ? t(genericKey)
                : phaseSuggestion;
          } catch {
            acc[mealId] = t(genericKey);
          }
          return acc;
        },
        {} as Record<string, string>,
      );

      setGeneratedSuggestions(defaultSuggestions);
    }
  }, [nutrition.selectedPhase, t, generatedSuggestions]);

  // 过滤营养数据 - 基于HVsLYEp的过滤逻辑
  const filteredFoods = useMemo(() => {
    return nutritionData.filter(
      (food) =>
        food.phase === nutrition.selectedPhase &&
        food.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [nutritionData, nutrition.selectedPhase, searchTerm]);

  // 添加到膳食计划
  const addToMealPlan = (food: NutritionRecommendation) => {
    setMealPlan((prev) => [...prev, food]);
  };

  // 从膳食计划中移除
  const removeFromMealPlan = (index: number) => {
    setMealPlan((prev) => prev.filter((_, i) => i !== index));
  };

  // 生成膳食计划
  const generateMealPlan = async (e: React.FormEvent) => {
    // 阻止默认行为和事件冒泡
    e.preventDefault();
    e.stopPropagation();

    try {
      // 检查是否有已选择的食物
      if (mealPlan.length === 0) {
        toast.addToast("warning", t("nutrition.noFoodsSelected"));
        return;
      }

      // 保存当前的体质类型和阶段到store
      updateNutrition({
        selectedPhase: nutrition.selectedPhase,
        constitutionType: nutrition.constitutionType,
      });

      // 等待一小段时间让持久化完成
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 检查食物兼容性
      const compatibility = checkFoodCompatibility(mealPlan, locale);

      // 如果有兼容性问题，显示警告
      if (!compatibility.compatible && compatibility.warnings.length > 0) {
        compatibility.warnings.forEach((warning) => {
          // 处理模板字符串格式的翻译键
          if (warning.includes("|")) {
            const [key, ...params] = warning.split("|");
            const paramObj: Record<string, string> = {};
            params.forEach((param) => {
              const [k, v] = param.split(":");
              paramObj[k] = v;
            });
            const translated = t(key, paramObj);
            toast.addToast("warning", translated);
          } else {
            toast.addToast("warning", t(warning));
          }
        });
        if (compatibility.suggestions.length > 0) {
          compatibility.suggestions.forEach((suggestion) => {
            toast.addToast("info", t(suggestion));
          });
        }
      }

      // 基于已选择的食物生成具体的膳食计划
      const meals = ["breakfast", "lunch", "dinner", "snack"] as const;
      const phase = nutrition.selectedPhase;

      // 使用优化的食物分配算法，避免寒热冲突
      const optimizedDistribution = optimizeFoodDistribution(mealPlan, meals);

      // 将已选择的食物分配到不同的餐次
      const suggestions: Record<string, string> = {};

      meals.forEach((meal) => {
        // 使用优化后的分配结果
        const mealFoods = optimizedDistribution[meal] || [];

        if (mealFoods.length > 0) {
          // 生成该餐次的具体食谱
          const foodNames = mealFoods.map((f) => f.name).join("、");
          const benefits = [...new Set(mealFoods.flatMap((f) => f.benefits))]
            .slice(0, 3)
            .join("、");

          // 检查该餐次的食物性质
          const natures = [...new Set(mealFoods.map((f) => f.holisticNature))];
          const natureText = natures
            .map((n) => t(`nutrition.holisticNature.${n}`))
            .join("、");

          // 获取阶段相关的建议作为补充说明
          const phaseSpecificKey = `nutrition.mealSuggestions.${phase}.${meal}`;
          let phaseTip = "";
          try {
            const tip = t(phaseSpecificKey);
            if (tip !== phaseSpecificKey) {
              phaseTip = `\n\n💡 ${tip}`;
            }
          } catch {
            // 忽略错误
          }

          // 添加性质信息
          const natureInfo = `\n\n🌿 ${t(
            "nutrition.foodNature",
          )}：${natureText}`;

          suggestions[meal] = `🍽️ ${t(
            "nutrition.recommendedFoods",
          )}：${foodNames}\n\n✨ ${t(
            "nutrition.mainBenefits",
          )}：${benefits}${natureInfo}${phaseTip}`;
        } else {
          // 如果该餐次没有食物，显示通用建议
          const phaseSpecificKey = `nutrition.mealSuggestions.${phase}.${meal}`;
          const genericKey = `nutrition.mealSuggestions.${meal}`;

          try {
            const phaseSuggestion = t(phaseSpecificKey);
            if (phaseSuggestion === phaseSpecificKey) {
              suggestions[meal] = t(genericKey);
            } else {
              suggestions[meal] = phaseSuggestion;
            }
          } catch {
            suggestions[meal] = t(genericKey);
          }
        }
      });

      // 保存生成的建议到状态
      setGeneratedSuggestions(suggestions);

      logInfo(
        "Generated meal plan for phase:",
        { phase, suggestions },
        "NutritionComponent",
      );

      // 显示成功提示
      toast.addToast("success", t("nutrition.planGenerated"));
    } catch (error) {
      logError("生成膳食计划时出错:", error, "NutritionComponent");
      toast.addToast("error", t("nutrition.generateError"));
    }
  };

  return (
    <div className="space-y-6">
      {/* 营养建议配置 - 基于HVsLYEp的NutritionAdvisorComponent */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
        <h3 className="text-xl font-semibold text-neutral-900 mb-4">
          {t("nutrition.title")}
        </h3>

        {/* 经期阶段选择 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-800 mb-3">
            {t("nutrition.phaseLabel")}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(["menstrual", "follicular", "ovulation", "luteal"] as const).map(
              (phase) => (
                <button
                  key={phase}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateNutrition({ selectedPhase: phase });
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className={`p-3 rounded-lg border-2 transition-colors duration-200 text-center relative z-10 cursor-pointer ${
                    nutrition.selectedPhase === phase
                      ? "border-primary-500 bg-primary-500/10"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                  style={{ pointerEvents: "auto" }}
                >
                  <div className="text-2xl mb-1">
                    {t(`nutrition.phaseIcons.${phase}`)}
                  </div>
                  <div className="text-sm font-medium">
                    {t(`nutrition.phases.${phase}`)}
                  </div>
                </button>
              ),
            )}
          </div>
        </div>

        {/* 体质类型选择 */}
        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-2">
            {t("nutrition.constitutionLabel")}
          </label>
          <select
            value={nutrition.constitutionType}
            onChange={(e) =>
              updateNutrition({
                constitutionType: e.target.value as
                  | "qi_deficiency"
                  | "yang_deficiency"
                  | "yin_deficiency"
                  | "blood_deficiency"
                  | "balanced",
              })
            }
            className="w-full px-3 py-2 border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {(
              [
                "qi_deficiency",
                "yang_deficiency",
                "yin_deficiency",
                "blood_deficiency",
                "balanced",
              ] as const
            ).map((type) => (
              <option key={type} value={type}>
                {t(`nutrition.constitutions.${type}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 推荐食物 - 基于HVsLYEp的食物展示逻辑 */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-neutral-900">
            {t("nutrition.foodTitle")}
          </h4>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-600 w-4 h-4" />
            <input
              type="text"
              placeholder={t("nutrition.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFoods.length > 0 ? (
            filteredFoods.map((food, index) => (
              <div
                key={index}
                className="p-4 border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <h5 className="font-semibold text-neutral-900 text-lg">
                    {food.name}
                  </h5>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      food.holisticNature === "warm"
                        ? "bg-red-100 text-red-800"
                        : "bg-neutral-100 text-neutral-800"
                    }`}
                  >
                    {t(`nutrition.holisticNature.${food.holisticNature}`)}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h6 className="text-sm font-medium text-neutral-800 mb-2">
                      {t("nutrition.benefitsLabel")}
                    </h6>
                    <div className="flex flex-wrap gap-1">
                      {food.benefits.map((benefit, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h6 className="text-sm font-medium text-neutral-800 mb-2">
                      {t("nutrition.nutrientsLabel")}
                    </h6>
                    <div className="flex flex-wrap gap-1">
                      {food.nutrients.map((nutrient, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800"
                        >
                          {nutrient}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => addToMealPlan(food)}
                    className="w-full rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 px-3 py-1.5 text-sm border border-primary-500 text-primary-600 hover:bg-primary-500/10"
                  >
                    <Plus className="w-4 h-4" /> {t("nutrition.addButton")}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-neutral-600 md:col-span-2">
              {t("nutrition.noResults")}
            </div>
          )}
        </div>
      </div>

      {/* 膳食计划 - 基于HVsLYEp的膳食计划展示 */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
        <h4 className="text-lg font-semibold text-neutral-900 mb-4">
          {t("nutrition.planTitle")}
        </h4>

        {/* 膳食建议 */}
        <div className="space-y-4 mb-6">
          {(["breakfast", "lunch", "dinner", "snack"] as const).map(
            (mealId) => {
              // 根据是否已生成建议来决定显示内容
              const hasGeneratedSuggestions =
                Object.keys(generatedSuggestions).length > 0;
              const suggestionText = hasGeneratedSuggestions
                ? generatedSuggestions[mealId]
                : (() => {
                    // 如果未生成，尝试显示当前阶段的建议，否则显示通用建议
                    const phase = nutrition.selectedPhase || "menstrual"; // 默认为月经期
                    const phaseSpecificKey = `nutrition.mealSuggestions.${phase}.${mealId}`;
                    const genericKey = `nutrition.mealSuggestions.${mealId}`;

                    try {
                      const phaseSuggestion = t(phaseSpecificKey);
                      // 如果返回的键名和输入相同，说明翻译不存在，使用通用建议
                      return phaseSuggestion === phaseSpecificKey
                        ? t(genericKey)
                        : phaseSuggestion;
                    } catch {
                      return t(genericKey);
                    }
                  })();

              return (
                <div key={mealId} className="p-4 bg-neutral-50 rounded-lg">
                  <h5 className="font-medium text-neutral-900 mb-2">
                    {t(`nutrition.meals.${mealId}`)}
                  </h5>
                  <p className="text-sm text-neutral-600 whitespace-pre-line">
                    {suggestionText}
                  </p>
                </div>
              );
            },
          )}
        </div>

        {/* 已选择的食物 */}
        {mealPlan.length > 0 && (
          <div className="mb-4">
            <h5 className="font-medium text-neutral-900 mb-2">
              {t("nutrition.selectedFoods")}
            </h5>
            <div className="space-y-2">
              {mealPlan.map((food, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-green-50 rounded-lg"
                >
                  <span className="text-sm text-neutral-800">{food.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFromMealPlan(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    {t("common.remove")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={generateMealPlan}
            className="flex-1 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 px-4 py-2 text-base bg-primary-500 hover:bg-primary-600 text-white"
          >
            <ListChecks className="w-4 h-4" /> {t("nutrition.generateButton")}
          </button>

          {Object.keys(generatedSuggestions).length > 0 && (
            <button
              type="button"
              onClick={() => {
                const planName =
                  locale === "zh"
                    ? `${t(
                        `nutrition.phases.${nutrition.selectedPhase}`,
                      )} - ${new Date().toLocaleDateString()}`
                    : `${t(
                        `nutrition.phases.${nutrition.selectedPhase}`,
                      )} - ${new Date().toLocaleDateString()}`;

                const newPlan = {
                  id: `plan-${Date.now()}`,
                  name: planName,
                  phase: nutrition.selectedPhase,
                  foods: [...mealPlan],
                  suggestions: { ...generatedSuggestions },
                  createdAt: new Date(),
                };

                setSavedMealPlans((prev) => [newPlan, ...prev]);
                toast.addToast("success", t("nutrition.planSaved"));
              }}
              className="px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white"
            >
              <Save className="w-4 h-4" />
              {t("nutrition.savePlan")}
            </button>
          )}

          {savedMealPlans.length > 0 && (
            <button
              type="button"
              onClick={() => setShowSavedPlans(!showSavedPlans)}
              className="px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-700"
            >
              <BookOpen className="w-4 h-4" />
              {savedMealPlans.length}
            </button>
          )}
        </div>

        {/* 已保存的食谱列表 */}
        {showSavedPlans && savedMealPlans.length > 0 && (
          <div className="mt-6 space-y-3">
            <h5 className="font-medium text-neutral-900 mb-3">
              {t("nutrition.savedPlans")}
            </h5>
            {savedMealPlans.map((plan) => (
              <div
                key={plan.id}
                className="p-4 bg-neutral-50 rounded-lg border border-neutral-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h6 className="font-medium text-neutral-900">
                      {plan.name}
                    </h6>
                    <p className="text-xs text-neutral-500 mt-1">
                      {plan.createdAt.toLocaleDateString()} -{" "}
                      {t(`nutrition.phases.${plan.phase}`)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSavedMealPlans((prev) =>
                        prev.filter((p) => p.id !== plan.id),
                      );
                      toast.addToast("success", t("nutrition.planDeleted"));
                    }}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 mb-3">
                  {Object.entries(plan.suggestions).map(
                    ([meal, suggestion]) => (
                      <div key={meal} className="text-sm">
                        <span className="font-medium text-neutral-700">
                          {t(`nutrition.meals.${meal}`)}:
                        </span>
                        <p className="text-neutral-600 mt-1 whitespace-pre-line text-xs">
                          {suggestion}
                        </p>
                      </div>
                    ),
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMealPlan([...plan.foods]);
                    setGeneratedSuggestions({ ...plan.suggestions });
                    setShowSavedPlans(false);
                    toast.addToast("info", t("nutrition.planLoaded"));
                  }}
                  className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                >
                  {t("nutrition.loadPlan")}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
