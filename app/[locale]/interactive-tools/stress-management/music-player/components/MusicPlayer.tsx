"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useTranslations } from "next-intl";

// Simple track definition
interface Track {
  title: string;
  src: string; // relative to public/audio
}

const tracks: Track[] = [
  { title: "雨声冥想", src: "/audio/rain-meditation.mp3" },
  { title: "森林之声", src: "/audio/forest-sounds.mp3" },
  { title: "轻柔钢琴", src: "/audio/soft-piano.mp3" },
];

export default function MusicPlayer() {
  const t = useTranslations("interactiveTools.stressManagement.musicPlayer");
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play/pause effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, current, volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrent((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrent((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (volume > 0) setVolume(0);
    else setVolume(0.7);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
        {t("title")}
      </h2>
      <div className="flex items-center justify-center space-x-4 mb-4">
        <button
          onClick={prevTrack}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          <SkipBack className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        </button>
        <button
          onClick={togglePlay}
          className="p-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>
        <button
          onClick={nextTrack}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          <SkipForward className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        </button>
        <button
          onClick={toggleMute}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {volume > 0 ? (
            <Volume2 className="w-5 h-5" />
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
        </button>
      </div>
      <p className="text-center text-gray-700 dark:text-gray-300 mb-2">
        {tracks[current].title}
      </p>
      <audio ref={audioRef} src={tracks[current].src} preload="metadata" />
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          {t("playlistTitle")}
        </h3>
        <ul className="space-y-2 max-h-48 overflow-y-auto">
          {tracks.map((track, idx) => (
            <li
              key={idx}
              className={`cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                idx === current ? "bg-purple-100 dark:bg-purple-900" : ""
              }`}
              onClick={() => {
                setCurrent(idx);
                setIsPlaying(true);
              }}
            >
              {track.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
