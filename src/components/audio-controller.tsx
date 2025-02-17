"use client";

import { useEffect, useState, useRef } from "react";
import { Play, Pause, Eye, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const speedOptions = [1, 1.5, 2, 2.5, 3, 3.5, 4];

const AudioController = ({
  fileAudio,
  fileName,
}: {
  fileAudio: string;
  fileName: string;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    const audioMount = async () => {
      if (audioRef.current) {
        audioRef.current.src = fileAudio;
      }
    };
    if (fileAudio) {
      audioMount();
    }
  }, [fileAudio]);

  const handlePlayPause = async () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    try {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error generating speech:", error);
    }
  };

  const handleSpeedChange = () => {
    setSpeed((prevSpeed) => {
      const newSpeed = prevSpeed + 1 >= speedOptions.length ? 0 : prevSpeed + 1;

      if (audioRef.current) {
        audioRef.current.playbackRate = speedOptions[newSpeed] ?? 1;
      }

      return newSpeed;
    });
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleHide = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`absolute bottom-0 left-0 w-full p-8 transition-all duration-300 ${
        fileAudio ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {fileAudio && isOpen ? (
        <div className="flex flex-col-reverse justify-between rounded-2xl border border-white/10 bg-[#111111] bg-opacity-80 p-4 md:flex-row">
          <div className="w-full rounded-lg md:w-[20%] md:p-4">
            <div className="max-h-60">
              <p className="w-[60%] truncate md:w-full">{fileName}</p>
              <p className="text-sm">
                {formatTime(audioRef.current?.currentTime || 0)} /{" "}
                {formatTime(audioRef.current?.duration || 0)}
              </p>
            </div>
          </div>
          <div className="relative flex h-[40px] w-full max-w-[100%] items-center justify-center md:h-auto md:max-w-[60%]">
            <Progress value={progress} />
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => {
                const newTime =
                  (parseFloat(e.target.value) / 100) *
                  (audioRef.current?.duration || 0);
                if (audioRef.current) {
                  audioRef.current.currentTime = newTime;
                }
              }}
              className="absolute w-full"
            />
          </div>
          <div className="flex items-center justify-center gap-4 lg:gap-8">
            <Button
              onClick={handleSpeedChange}
              variant="ghost"
              className="h-12 w-12 rounded-full"
            >
              {speedOptions[speed]}x
            </Button>
            <Button
              onClick={handlePlayPause}
              variant="outline"
              className="flex h-12 w-12 items-center rounded-full bg-white hover:bg-[#b4fd83]"
            >
              {isPlaying ? (
                <Pause className="h-[40px] w-[40px] text-black" fill="black" />
              ) : (
                <Play className="h-[40px] w-[40px] text-black" fill="black" />
              )}
            </Button>
            <Button
              onClick={handleHide}
              variant="ghost"
              className="h-12 w-12 rounded-full"
            >
              <X className="h-[40px] w-[40px] text-white" fill="white" />
            </Button>
          </div>

          <audio
            ref={audioRef}
            onTimeUpdate={(e) => {
              const audio = e.currentTarget;
              setProgress((audio.currentTime / audio.duration) * 100);
            }}
            onEnded={() => {
              setIsPlaying(false);
              setProgress(0);
            }}
            onLoadedMetadata={() => {
              setProgress(0);
            }}
            className="hidden"
          />
        </div>
      ) : (
        <div className="h-[64px] w-[64px]">
          <Button
            onClick={handleHide}
            variant="ghost"
            className="h-12 w-12 rounded-full bg-white/10"
          >
            <Eye className="h-[40px] w-[40px] text-white" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AudioController;
