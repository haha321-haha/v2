"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type InteractionType = "view" | "hover" | "click";

type InteractionData = {
  scores: StressRadarChartProps["scores"];
  timestamp: string;
  detail?: string;
};

// type ScoreMetrics = StressRadarChartProps["scores"]; // Unused

function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

interface StressRadarChartProps {
  scores: {
    work: number; // 工作压力
    sleep: number; // 睡眠质量
    emotion: number; // 情绪状态
    physical: number; // 身体状况
    social: number; // 社交压力
  };
  className?: string;
  onInteraction?: (type: InteractionType, data?: InteractionData) => void;
}

export function StressRadarChart({
  scores,
  className = "",
  onInteraction,
}: StressRadarChartProps) {
  const t = useTranslations("interactiveTools.stressManagement.assessment");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState(300);

  // Day 4: 缓存计算结果，优化性能
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const normalizedScores = useMemo(
    () => [
      (scores.work / 3) * 100,
      (scores.sleep / 3) * 100,
      (scores.emotion / 3) * 100,
      (scores.physical / 3) * 100,
      (scores.social / 3) * 100,
    ],
    [scores],
  );

  useEffect(() => {
    if (onInteraction) {
      onInteraction("view", {
        scores,
        timestamp: new Date().toISOString(),
      });
    }
  }, [scores, onInteraction]);

  // Day 4: 响应式尺寸调整
  useEffect(() => {
    const updateSize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        const size = Math.min(container.clientWidth - 32, 300);
        setCanvasSize(size);
      }
    };

    updateSize();
    const handleResize = debounce(updateSize, 250);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 设置canvas尺寸
    const size = canvasSize;
    canvas.width = size;
    canvas.height = size;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 100;

    // 清空画布
    ctx.clearRect(0, 0, size, size);

    // 绘制背景网格
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;

    // 绘制同心圆
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius / 5) * i, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // 绘制轴线
    const labels = (t.raw("radar.labels") as string[]) || [];
    const angles = [0, 72, 144, 216, 288]; // 每72度一个点

    angles.forEach((angle, index) => {
      const radian = (angle * Math.PI) / 180;
      const x = centerX + Math.cos(radian) * radius;
      const y = centerY + Math.sin(radian) * radius;

      // 绘制轴线
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // 绘制标签
      const labelX = centerX + Math.cos(radian) * (radius + 30);
      const labelY = centerY + Math.sin(radian) * (radius + 30);

      ctx.fillStyle = "#374151";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(labels[index], labelX, labelY);
    });

    // 转换数据（将0-3的分数转换为0-100）
    const normalizedScores = [
      (scores.work / 3) * 100,
      (scores.sleep / 3) * 100,
      (scores.emotion / 3) * 100,
      (scores.physical / 3) * 100,
      (scores.social / 3) * 100,
    ];

    // 绘制数据多边形
    ctx.beginPath();
    // 使用缓存的normalizedScores，避免重复计算
    normalizedScores.forEach((score, index) => {
      const angle = (angles[index] * Math.PI) / 180;
      const distance = (score / 100) * radius;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();

    // 填充多边形
    ctx.fillStyle = "rgba(59, 130, 246, 0.3)";
    ctx.fill();

    // 描边多边形
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 绘制数据点
    normalizedScores.forEach((score, index) => {
      const angle = (angles[index] * Math.PI) / 180;
      const distance = (score / 100) * radius;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "#3b82f6";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // 添加数值标签
    ctx.fillStyle = "#1f2937";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    normalizedScores.forEach((score, index) => {
      const angle = (angles[index] * Math.PI) / 180;
      const distance = (score / 100) * radius;
      const x = centerX + Math.cos(angle) * (distance + 15);
      const y = centerY + Math.sin(angle) * (distance + 15);

      const value = Math.round((score / 100) * 3 * 10) / 10; // 转换回0-3范围
      ctx.fillText(value.toString(), x, y);
    });
  }, [scores, canvasSize, t]);

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        {t("radar.title")}
      </h3>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto"
          style={{ maxWidth: "300px", height: "300px" }}
        />
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">{t("radar.subtitle")}</p>
      </div>
    </div>
  );
}

// 数据转换工具函数
export function convertAnswersToRadarData(answers: number[]): {
  work: number;
  sleep: number;
  emotion: number;
  physical: number;
  social: number;
} {
  // 根据实际的问题映射到5个维度
  // 这里需要根据实际的问题内容来调整映射
  return {
    work: answers[0] || 0, // 第1题：工作压力
    sleep: answers[1] || 0, // 第2题：睡眠质量
    emotion: answers[2] || 0, // 第3题：情绪状态
    physical: answers[3] || 0, // 第4题：身体状况
    social: answers[4] || 0, // 第5题：社交压力
  };
}
