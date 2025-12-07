"use client";

import React from "react";
import {
  ResponsiveTestPanel,
  PerformanceTest,
  useResponsive,
  useMobileOptimization,
  ResponsiveGrid,
  ResponsiveText,
  ResponsiveImage,
} from "../utils/responsiveTest";
import { Locale } from "../types/common";

interface ResponsiveTestPageProps {
  locale: Locale;
}

export default function ResponsiveTestPage({
  locale,
}: ResponsiveTestPageProps) {
  const { screenSize, dimensions } = useResponsive();
  const { isMobile, isTablet, isDesktop, isTouchDevice, minTouchTarget } =
    useMobileOptimization();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* 开发环境测试工具 */}
      {process.env.NODE_ENV === "development" && (
        <>
          <ResponsiveTestPanel />
          <PerformanceTest />
        </>
      )}

      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <ResponsiveText
            mobileSize="text-2xl"
            tabletSize="text-3xl"
            desktopSize="text-4xl"
            className="font-bold text-gray-800 mb-4"
          >
            {locale === "zh" ? "响应式测试页面" : "Responsive Test Page"}
          </ResponsiveText>
          <p className="text-gray-600">
            {locale === "zh"
              ? "测试伴侣沟通手册在不同设备上的显示效果"
              : "Test partner communication handbook display on different devices"}
          </p>
        </div>

        {/* 当前设备信息 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {locale === "zh" ? "当前设备信息" : "Current Device Info"}
          </h2>
          <ResponsiveGrid mobileCols={1} tabletCols={2} desktopCols={3}>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">
                {locale === "zh" ? "屏幕尺寸" : "Screen Size"}
              </h3>
              <p className="text-blue-700">{screenSize}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">
                {locale === "zh" ? "分辨率" : "Resolution"}
              </h3>
              <p className="text-green-700">
                {dimensions.width} × {dimensions.height}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-800 mb-2">
                {locale === "zh" ? "触控设备" : "Touch Device"}
              </h3>
              <p className="text-purple-700">{isTouchDevice ? "是" : "否"}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">
                {locale === "zh" ? "设备模式" : "Device Mode"}
              </h3>
              <p className="text-yellow-700">
                {isMobile
                  ? locale === "zh"
                    ? "移动"
                    : "Mobile"
                  : isTablet
                    ? locale === "zh"
                      ? "平板"
                      : "Tablet"
                    : isDesktop
                      ? locale === "zh"
                        ? "桌面"
                        : "Desktop"
                      : locale === "zh"
                        ? "未知"
                        : "Unknown"}
              </p>
            </div>
          </ResponsiveGrid>
        </div>

        {/* 测试组件展示 */}
        <div className="space-y-8">
          {/* 按钮测试 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {locale === "zh" ? "按钮测试" : "Button Test"}
            </h2>
            <ResponsiveGrid mobileCols={1} tabletCols={2} desktopCols={3}>
              <button className="btn-primary mobile-touch-target">
                {locale === "zh" ? "主要按钮" : "Primary Button"}
              </button>
              <button className="btn-secondary mobile-touch-target">
                {locale === "zh" ? "次要按钮" : "Secondary Button"}
              </button>
              <button className="btn-outline mobile-touch-target">
                {locale === "zh" ? "轮廓按钮" : "Outline Button"}
              </button>
            </ResponsiveGrid>
          </div>

          {/* 卡片测试 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {locale === "zh" ? "卡片测试" : "Card Test"}
            </h2>
            <ResponsiveGrid mobileCols={1} tabletCols={2} desktopCols={3}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="quiz-card">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {locale === "zh" ? `测试卡片 ${item}` : `Test Card ${item}`}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {locale === "zh"
                      ? "这是一个测试卡片，用于验证响应式布局效果。"
                      : "This is a test card to verify responsive layout effects."}
                  </p>
                </div>
              ))}
            </ResponsiveGrid>
          </div>

          {/* 文本测试 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {locale === "zh" ? "文本测试" : "Text Test"}
            </h2>
            <ResponsiveText
              mobileSize="text-sm"
              tabletSize="text-base"
              desktopSize="text-lg"
              className="text-gray-700 leading-relaxed"
            >
              {locale === "zh"
                ? "这是一段响应式文本，会根据设备屏幕大小自动调整字体大小。在移动设备上显示较小字体，在桌面设备上显示较大字体，确保最佳的可读性。"
                : "This is responsive text that automatically adjusts font size based on device screen size. It displays smaller fonts on mobile devices and larger fonts on desktop devices to ensure optimal readability."}
            </ResponsiveText>
          </div>

          {/* 图片测试 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {locale === "zh" ? "图片测试" : "Image Test"}
            </h2>
            <ResponsiveGrid mobileCols={1} tabletCols={2} desktopCols={3}>
              {[1, 2, 3].map((item) => (
                <div key={item} className="text-center">
                  <ResponsiveImage
                    src={`/images/placeholder-${item}.jpg`}
                    alt={`Test image ${item}`}
                    className="rounded-lg shadow-md"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    {locale === "zh"
                      ? `测试图片 ${item}`
                      : `Test Image ${item}`}
                  </p>
                </div>
              ))}
            </ResponsiveGrid>
          </div>

          {/* 表单测试 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {locale === "zh" ? "表单测试" : "Form Test"}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === "zh" ? "姓名" : "Name"}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mobile-touch-target"
                  placeholder={
                    locale === "zh" ? "请输入您的姓名" : "Enter your name"
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === "zh" ? "邮箱" : "Email"}
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mobile-touch-target"
                  placeholder={
                    locale === "zh" ? "请输入您的邮箱" : "Enter your email"
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === "zh" ? "消息" : "Message"}
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={
                    locale === "zh" ? "请输入您的消息" : "Enter your message"
                  }
                />
              </div>
              <button
                type="submit"
                className="btn-primary mobile-touch-target w-full sm:w-auto"
              >
                {locale === "zh" ? "提交" : "Submit"}
              </button>
            </form>
          </div>
        </div>

        {/* 测试总结 */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {locale === "zh" ? "测试总结" : "Test Summary"}
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">
                {locale === "zh" ? "最小触控目标" : "Min Touch Target"}:
              </span>
              <span className="font-medium">{minTouchTarget}px</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                {locale === "zh" ? "当前断点" : "Current Breakpoint"}:
              </span>
              <span className="font-medium">{screenSize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                {locale === "zh" ? "触控优化" : "Touch Optimization"}:
              </span>
              <span className="font-medium">
                {isTouchDevice ? "已启用" : "未启用"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
