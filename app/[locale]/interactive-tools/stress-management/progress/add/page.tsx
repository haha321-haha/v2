"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { saveEntry } from "@/lib/progressStorage";
import { logError } from "@/lib/debug-logger";

export default function AddEntryPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  // Form state
  const [stressLevel, setStressLevel] = useState(5);
  const [techniques, setTechniques] = useState<string[]>([]);
  const [moodRating, setMoodRating] = useState(5);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Available techniques
  const availableTechniques = [
    { id: "breathing", label: "Deep Breathing", icon: "🫁" },
    { id: "meditation", label: "Meditation", icon: "🧘" },
    { id: "exercise", label: "Exercise", icon: "🏃" },
    { id: "yoga", label: "Yoga", icon: "🧘‍♀️" },
    { id: "music", label: "Music", icon: "🎵" },
    { id: "nature", label: "Nature Walk", icon: "🌳" },
    { id: "journaling", label: "Journaling", icon: "📝" },
    { id: "social", label: "Social Support", icon: "👥" },
  ];

  const toggleTechnique = (techniqueId: string) => {
    setTechniques((prev) =>
      prev.includes(techniqueId)
        ? prev.filter((t) => t !== techniqueId)
        : [...prev, techniqueId],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Create entry object (without id, saveEntry will add it)
      const entry = {
        date: new Date().toISOString(),
        stressLevel,
        techniques,
        moodRating,
        notes: notes.trim(),
      };

      // Save using the storage utility
      const result = saveEntry(entry);

      // Show success message
      if (result) {
        alert("Entry saved successfully!");
      } else {
        alert("Failed to save entry. Please try again.");
      }

      // Redirect back to progress page
      router.push(`/${locale}/interactive-tools/stress-management/progress`);
    } catch (error) {
      logError("Failed to save entry", error, "stressManagement/progress/add");

      // Show user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes("Storage is full")) {
          // Check if automatic cleanup was attempted
          if (error.message.includes("automatically deleted")) {
            alert(
              "⚠️ Storage was full, but we've automatically cleaned up old entries!\n\n" +
                "Your entry has been saved successfully. " +
                "We deleted some old entries to make space.\n\n" +
                "If this happens frequently, consider manually deleting old entries from the Progress page.",
            );
            // Still redirect since the save might have succeeded after cleanup
            router.push(
              `/${locale}/interactive-tools/stress-management/progress`,
            );
            return;
          } else {
            alert(
              "❌ Storage is full!\n\n" +
                "We tried to automatically free up space, but there's still not enough room. " +
                "Please go to the Progress page and manually delete some old entries.\n\n" +
                "Tip: Click the 'Debug Data' button on the Progress page to manage your data.",
            );
          }
        } else {
          alert("Failed to save entry: " + error.message);
        }
      } else {
        alert("Failed to save entry. Please try again.");
      }

      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-8 flex items-center gap-2">
          <Link href={`/${locale}`} className="hover:text-blue-600">
            Home
          </Link>
          <span>›</span>
          <Link
            href={`/${locale}/interactive-tools`}
            className="hover:text-blue-600"
          >
            Interactive Tools
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
            Progress Tracking
          </Link>
          <span>›</span>
          <span className="text-gray-800">Add Entry</span>
        </nav>

        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Add Progress Entry
          </h1>
          <p className="text-gray-600">
            Record your stress condition and techniques used today
          </p>
        </header>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {/* Stress Level */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              📊 Stress Level
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 w-16">Low (1)</span>
              <div className="flex-1 relative">
                {/* 渐变背景轨道 - 从绿色到红色 */}
                <div className="absolute inset-0 h-3 bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-red-500 rounded-lg"></div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={stressLevel}
                  onChange={(e) => setStressLevel(Number(e.target.value))}
                  className="relative w-full h-3 bg-transparent appearance-none cursor-pointer z-10 stress-slider"
                />
              </div>
              <span className="text-sm text-gray-600 w-20">High (10)</span>
            </div>
            <div className="text-center mt-2">
              <span className="text-3xl font-bold text-blue-600">
                {stressLevel}
              </span>
            </div>
            {/* 自定义滑块样式 */}
            <style jsx>{`
              .stress-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: #ffffff;
                border: 2px solid #6b7280;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                transition: all 0.2s ease;
              }

              .stress-slider::-webkit-slider-thumb:hover {
                border-color: #9333ea;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                transform: scale(1.1);
              }

              .stress-slider::-moz-range-thumb {
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: #ffffff;
                border: 2px solid #6b7280;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                transition: all 0.2s ease;
                -moz-appearance: none;
              }

              .stress-slider::-moz-range-thumb:hover {
                border-color: #9333ea;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                transform: scale(1.1);
              }

              .stress-slider::-moz-range-track {
                background: transparent;
                height: 12px;
              }
            `}</style>
          </div>

          {/* Techniques Used */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              🧘 Techniques Used
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Select all stress management techniques you used today
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableTechniques.map((technique) => (
                <button
                  key={technique.id}
                  type="button"
                  onClick={() => toggleTechnique(technique.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    techniques.includes(technique.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="text-2xl mb-1">{technique.icon}</div>
                  <div className="text-sm font-medium text-gray-800">
                    {technique.label}
                  </div>
                </button>
              ))}
            </div>
            {techniques.length > 0 && (
              <p className="text-sm text-blue-600 mt-2">
                Selected: {techniques.length} technique(s)
              </p>
            )}
          </div>

          {/* Mood Rating */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              😊 Mood Rating
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 w-16">Bad (1)</span>
              <div className="flex-1 relative">
                {/* 渐变背景轨道 - 从红色到绿色（情绪：差=红，好=绿） */}
                <div className="absolute inset-0 h-3 bg-gradient-to-r from-red-500 via-orange-400 via-yellow-400 to-green-400 rounded-lg"></div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={moodRating}
                  onChange={(e) => setMoodRating(Number(e.target.value))}
                  className="relative w-full h-3 bg-transparent appearance-none cursor-pointer z-10 mood-slider"
                />
              </div>
              <span className="text-sm text-gray-600 w-20">Great (10)</span>
            </div>
            <div className="text-center mt-2">
              <span className="text-3xl font-bold text-green-600">
                {moodRating}
              </span>
            </div>
            {/* 自定义滑块样式 */}
            <style jsx>{`
              .mood-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: #ffffff;
                border: 2px solid #6b7280;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                transition: all 0.2s ease;
              }

              .mood-slider::-webkit-slider-thumb:hover {
                border-color: #9333ea;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                transform: scale(1.1);
              }

              .mood-slider::-moz-range-thumb {
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: #ffffff;
                border: 2px solid #6b7280;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                transition: all 0.2s ease;
                -moz-appearance: none;
              }

              .mood-slider::-moz-range-thumb:hover {
                border-color: #9333ea;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                transform: scale(1.1);
              }

              .mood-slider::-moz-range-track {
                background: transparent;
                height: 12px;
              }
            `}</style>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              📝 Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling today? What helped? What didn't?"
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
              maxLength={500}
            />
            <p className="text-sm text-gray-500 mt-1">
              {notes.length}/500 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/${locale}/interactive-tools/stress-management/progress`,
                )
              }
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Entry"}
            </button>
          </div>
        </form>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mt-8 rounded-r-lg">
          <p className="font-bold">🔒 Your Privacy is Protected</p>
          <p className="text-sm mt-1">
            All data is stored locally on your device and never sent to any
            server.
          </p>
        </div>
      </div>
    </div>
  );
}
