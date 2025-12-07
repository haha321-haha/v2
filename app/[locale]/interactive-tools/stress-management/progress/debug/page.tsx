"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getAllEntries,
  getStorageInfo,
  deleteOldestEntries,
  type ProgressEntry,
} from "@/lib/progressStorage";

export default function DebugPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [rawData, setRawData] = useState<string>("");
  const [parsedData, setParsedData] = useState<ProgressEntry[]>([]);
  const [error, setError] = useState<string>("");
  const [storageInfo, setStorageInfo] =
    useState<ReturnType<typeof getStorageInfo>>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const raw = localStorage.getItem("stress_progress_entries") || "[]";
      setRawData(raw);
      const parsed = JSON.parse(raw);
      setParsedData(parsed);
      setStorageInfo(getStorageInfo());
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const clearAllData = () => {
    if (
      confirm(
        "Are you sure you want to delete ALL progress data? This cannot be undone!",
      )
    ) {
      localStorage.removeItem("stress_progress_entries");
      loadData();
      alert("All data cleared!");
    }
  };

  const addTestData = () => {
    try {
      const testEntry = {
        date: new Date().toISOString(),
        stressLevel: Math.floor(Math.random() * 10) + 1,
        techniques: ["breathing", "meditation"],
        moodRating: Math.floor(Math.random() * 10) + 1,
        notes: "Test entry added at " + new Date().toLocaleTimeString(),
      };

      const entries = getAllEntries();
      const newEntry = {
        ...testEntry,
        id: `entry_${Date.now()}`,
        timestamp: Date.now(),
      };
      entries.push(newEntry);
      localStorage.setItem("stress_progress_entries", JSON.stringify(entries));
      loadData();
      alert("Test entry added!");
    } catch (err) {
      if (err instanceof Error && err.name === "QuotaExceededError") {
        alert("Storage is full! Please delete some old entries first.");
      } else {
        alert(
          "Failed to add test entry: " +
            (err instanceof Error ? err.message : "Unknown error"),
        );
      }
    }
  };

  const deleteOldEntries = () => {
    const count = prompt(
      "How many oldest entries do you want to delete?",
      "10",
    );
    if (!count) return;

    const numCount = parseInt(count, 10);
    if (isNaN(numCount) || numCount <= 0) {
      alert("Please enter a valid number");
      return;
    }

    const deleted = deleteOldestEntries(numCount);
    loadData();
    alert(`Deleted ${deleted} oldest entries`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-8 flex items-center gap-2">
          <Link href={`/${locale}`} className="hover:text-blue-600">
            Home
          </Link>
          <span>›</span>
          <Link
            href={`/${locale}/interactive-tools/stress-management`}
            className="hover:text-blue-600"
          >
            Stress Management
          </Link>
          <span>›</span>
          <Link
            href={`/${locale}/interactive-tools/stress-management/progress`}
            className="hover:text-blue-600"
          >
            Progress
          </Link>
          <span>›</span>
          <span className="text-gray-800">Debug</span>
        </nav>

        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🔧 Data Debug Tool
          </h1>
          <p className="text-gray-600">
            View and manage your progress tracking data
          </p>
        </header>

        {/* Actions */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={loadData}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              🔄 Refresh Data
            </button>
            <button
              onClick={addTestData}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              ➕ Add Test Entry
            </button>
            <button
              onClick={deleteOldEntries}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              🗂️ Delete Old Entries
            </button>
            <button
              onClick={clearAllData}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              🗑️ Clear All Data
            </button>
            <Link
              href={`/${locale}/interactive-tools/stress-management/progress`}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Back to Progress
            </Link>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 font-bold">❌ Error:</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Storage Info */}
        {storageInfo && (
          <div
            className={`rounded-lg p-6 mb-6 ${
              storageInfo.isFull
                ? "bg-red-50 border-2 border-red-300"
                : storageInfo.isNearFull
                  ? "bg-yellow-50 border-2 border-yellow-300"
                  : "bg-white"
            }`}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              💾 Storage Usage
              {storageInfo.isFull && " - ⚠️ FULL!"}
              {storageInfo.isNearFull &&
                !storageInfo.isFull &&
                " - ⚠️ Near Full"}
            </h2>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold">
                  {storageInfo.sizeInMB} MB / {storageInfo.maxSizeInMB} MB
                </span>
                <span
                  className={`font-bold ${
                    storageInfo.isFull
                      ? "text-red-600"
                      : storageInfo.isNearFull
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                >
                  {storageInfo.usagePercent}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all ${
                    storageInfo.isFull
                      ? "bg-red-600"
                      : storageInfo.isNearFull
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                  style={{
                    width: `${Math.min(storageInfo.usagePercent, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
            {(storageInfo.isFull || storageInfo.isNearFull) && (
              <div
                className={`p-4 rounded-lg ${
                  storageInfo.isFull ? "bg-red-100" : "bg-yellow-100"
                }`}
              >
                <p
                  className={`font-bold ${
                    storageInfo.isFull ? "text-red-700" : "text-yellow-700"
                  }`}
                >
                  {storageInfo.isFull
                    ? "⚠️ Storage is full!"
                    : "⚠️ Storage is almost full!"}
                </p>
                <p className="text-sm mt-1 text-gray-700">
                  {storageInfo.isFull
                    ? "You cannot add new entries. Please delete some old entries to free up space."
                    : "Consider deleting old entries to prevent storage issues."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📊 Statistics
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">
                {parsedData.length}
              </div>
              <div className="text-sm text-gray-600">Total Entries</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {storageInfo?.sizeInMB || 0} MB
              </div>
              <div className="text-sm text-gray-600">Data Size</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                {
                  parsedData.filter(
                    (e) => e.techniques && e.techniques.length > 0,
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">With Techniques</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">
                {parsedData.filter((e) => e.notes && e.notes.trim()).length}
              </div>
              <div className="text-sm text-gray-600">With Notes</div>
            </div>
          </div>
        </div>

        {/* Parsed Data */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📋 Parsed Data ({parsedData.length} entries)
          </h2>
          {parsedData.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {parsedData.map((entry, index) => (
                <div
                  key={entry.id || index}
                  className="border-2 border-gray-200 rounded-lg p-4"
                >
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-bold">ID:</span>{" "}
                      {entry.id || "❌ MISSING"}
                    </div>
                    <div>
                      <span className="font-bold">Date:</span>{" "}
                      {new Date(entry.date).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-bold">Stress:</span>{" "}
                      {entry.stressLevel}/10
                    </div>
                    <div>
                      <span className="font-bold">Mood:</span>{" "}
                      {entry.moodRating}/10
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-bold">Techniques:</span>{" "}
                      {entry.techniques && entry.techniques.length > 0
                        ? entry.techniques.join(", ")
                        : "❌ NONE"}
                    </div>
                    {entry.notes && (
                      <div className="md:col-span-2">
                        <span className="font-bold">Notes:</span> {entry.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data found</p>
          )}
        </div>

        {/* Raw Data */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            🔍 Raw localStorage Data
          </h2>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-xs">
            {rawData || "No data"}
          </pre>
        </div>
      </div>
    </div>
  );
}
