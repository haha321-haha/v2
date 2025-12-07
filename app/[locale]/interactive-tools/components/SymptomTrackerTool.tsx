"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface SymptomEntry {
  id: string;
  date: string;
  painLevel: number;
  symptoms: string[];
  mood: string;
  flow: string;
  medications: string[];
  notes: string;
}

interface SymptomTrackerToolProps {
  locale: string;
}

export default function SymptomTrackerTool({}: SymptomTrackerToolProps) {
  const t = useTranslations("interactiveTools.symptomTracker");
  const [currentEntry, setCurrentEntry] = useState<Omit<SymptomEntry, "id">>({
    date: new Date().toISOString().split("T")[0],
    painLevel: 0,
    symptoms: [],
    mood: "",
    flow: "",
    medications: [],
    notes: "",
  });
  const [entries, setEntries] = useState<SymptomEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [dateError, setDateError] = useState("");

  // Get today's date in YYYY-MM-DD format for date validation
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem("symptomEntries");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  const handleSymptomToggle = (symptom: string) => {
    setCurrentEntry((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const handleMedicationToggle = (medication: string) => {
    setCurrentEntry((prev) => ({
      ...prev,
      medications: prev.medications.includes(medication)
        ? prev.medications.filter((m) => m !== medication)
        : [...prev.medications, medication],
    }));
  };

  // Handle date change with validation
  const handleDateChange = (selectedDate: string) => {
    const today = getTodayDate();

    if (selectedDate > today) {
      setDateError(t("alerts.futureDate"));
      return;
    }

    setDateError("");
    setCurrentEntry((prev) => ({ ...prev, date: selectedDate }));
  };

  const handleSave = () => {
    // Validate date before saving
    if (currentEntry.date > getTodayDate()) {
      setDateError(t("alerts.futureDate"));
      return;
    }

    const newEntry: SymptomEntry = {
      ...currentEntry,
      id: Date.now().toString(),
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem("symptomEntries", JSON.stringify(updatedEntries));

    // Reset form
    setCurrentEntry({
      date: new Date().toISOString().split("T")[0],
      painLevel: 0,
      symptoms: [],
      mood: "",
      flow: "",
      medications: [],
      notes: "",
    });

    setDateError("");
    alert(t("alerts.saved"));
  };

  const commonSymptoms: string[] = Object.values(
    t("commonSymptoms", { returnObjects: true }) as unknown as Record<
      string,
      string
    >,
  );
  const moodOptions: string[] = Object.values(
    t("moodOptionsData", { returnObjects: true }) as unknown as Record<
      string,
      string
    >,
  );
  const flowOptions: string[] = Object.values(
    t("flowOptionsData", { returnObjects: true }) as unknown as Record<
      string,
      string
    >,
  );
  const commonMedications: string[] = Object.values(
    t("medicationOptionsData", { returnObjects: true }) as unknown as Record<
      string,
      string
    >,
  );

  const getPainLevelColor = (level: number) => {
    if (level <= 2) return "text-green-600";
    if (level <= 5) return "text-yellow-600";
    if (level <= 7) return "text-orange-600";
    return "text-red-600";
  };

  const getPainLevelText = (level: number) => {
    if (level === 0) return t("painLevels.none");
    if (level <= 2) return t("painLevels.mild");
    if (level <= 5) return t("painLevels.moderate");
    if (level <= 7) return t("painLevels.severe");
    return t("painLevels.extreme");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          {t("title")}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">{t("description")}</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setShowHistory(false)}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            !showHistory
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {t("tabs.record")}
        </button>
        <button
          onClick={() => setShowHistory(true)}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            showHistory
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {t("tabs.history")} ({entries.length})
        </button>
      </div>

      {!showHistory ? (
        /* Recording Form */
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Basic Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
              {t("form.basicInfo")}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("form.date")}
                </label>
                <input
                  type="date"
                  value={currentEntry.date}
                  max={getTodayDate()}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    dateError ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                />
                {dateError && (
                  <div className="mt-2 flex items-start space-x-2">
                    <svg
                      className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm text-red-600">{dateError}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("form.painLevel")}
                </label>
                <div className="relative mb-2">
                  {/* Gradient background track */}
                  <div className="absolute inset-0 h-3 bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-red-500 rounded-lg"></div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={currentEntry.painLevel}
                    onChange={(e) =>
                      setCurrentEntry((prev) => ({
                        ...prev,
                        painLevel: parseInt(e.target.value),
                      }))
                    }
                    className="relative w-full h-3 bg-transparent appearance-none cursor-pointer z-10 pain-slider"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{t("form.noPain")}</span>
                  <span
                    className={`font-semibold ${getPainLevelColor(
                      currentEntry.painLevel,
                    )}`}
                  >
                    {currentEntry.painLevel} -{" "}
                    {getPainLevelText(currentEntry.painLevel)}
                  </span>
                  <span>{t("form.extreme")}</span>
                </div>

                {/* Custom CSS for slider thumb */}
                <style jsx>{`
                  .pain-slider::-webkit-slider-thumb {
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

                  .pain-slider::-webkit-slider-thumb:hover {
                    border-color: #9333ea;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    transform: scale(1.1);
                  }

                  .pain-slider::-moz-range-thumb {
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

                  .pain-slider::-moz-range-thumb:hover {
                    border-color: #9333ea;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    transform: scale(1.1);
                  }

                  .pain-slider::-moz-range-track {
                    background: transparent;
                    height: 12px;
                  }
                `}</style>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("form.mood")}
                </label>
                <select
                  value={currentEntry.mood}
                  onChange={(e) =>
                    setCurrentEntry((prev) => ({
                      ...prev,
                      mood: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">{t("form.pleaseSelect")}</option>
                  {moodOptions.map((mood, index) => (
                    <option key={index} value={mood}>
                      {mood}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("form.flow")}
                </label>
                <select
                  value={currentEntry.flow}
                  onChange={(e) =>
                    setCurrentEntry((prev) => ({
                      ...prev,
                      flow: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">{t("form.pleaseSelect")}</option>
                  {flowOptions.map((flow, index) => (
                    <option key={index} value={flow}>
                      {flow}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Right Column - Symptoms and Medications */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
              {t("form.symptomsAndMeds")}
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("form.symptoms")}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {commonSymptoms.map((symptom, index) => (
                    <label key={index} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={currentEntry.symptoms.includes(symptom)}
                        onChange={() => handleSymptomToggle(symptom)}
                        className="mr-2 text-purple-600 focus:ring-purple-500"
                      />
                      {symptom}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("form.medications")}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {commonMedications.map((medication, index) => (
                    <label key={index} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={currentEntry.medications.includes(medication)}
                        onChange={() => handleMedicationToggle(medication)}
                        className="mr-2 text-purple-600 focus:ring-purple-500"
                      />
                      {medication}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("form.notes")}
                </label>
                <textarea
                  value={currentEntry.notes}
                  onChange={(e) =>
                    setCurrentEntry((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={t("form.notesPlaceholder")}
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                {t("form.save")}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* History View */
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">
            {t("history.title")}
          </h3>

          {entries.length === 0 ? (
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
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500">{t("history.noRecords")}</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">
                      {entry.date}
                    </h4>
                    <span
                      className={`font-semibold ${getPainLevelColor(
                        entry.painLevel,
                      )}`}
                    >
                      {t("history.pain")}: {entry.painLevel}/10
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>
                        <strong>{t("history.mood")}:</strong>{" "}
                        {entry.mood || t("form.notRecorded")}
                      </p>
                      <p>
                        <strong>{t("history.flow")}:</strong>{" "}
                        {entry.flow || t("form.notRecorded")}
                      </p>
                    </div>
                    <div>
                      {entry.symptoms.length > 0 && (
                        <p>
                          <strong>{t("history.symptoms")}:</strong>{" "}
                          {entry.symptoms.join(", ")}
                        </p>
                      )}
                      {entry.medications.length > 0 && (
                        <p>
                          <strong>{t("history.medications")}:</strong>{" "}
                          {entry.medications.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>

                  {entry.notes && (
                    <p className="mt-2 text-sm text-gray-600">
                      <strong>{t("history.notes")}:</strong> {entry.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
        <h4 className="font-semibold text-green-800 mb-2">{t("tips.title")}</h4>
        <ul className="text-green-700 space-y-1 text-sm">
          <li>• {t("tips.tip1")}</li>
          <li>• {t("tips.tip2")}</li>
          <li>• {t("tips.tip3")}</li>
        </ul>
      </div>
    </div>
  );
}
