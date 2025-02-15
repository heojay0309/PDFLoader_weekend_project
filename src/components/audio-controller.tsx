'use client';
import { Play, Pause } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { Progress } from './ui/progress';
import { useUploadedFiles } from '@/context/UploadedFilesContext';
const speedOptions = [1, 1.5, 2, 2.5, 3, 3.5, 4];
const AudioController = ({ file }: { file: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [speed, setSpeed] = useState(0);
  const { pdfUrl } = useUploadedFiles();

  useEffect(() => {
    if (file) {
      if (audioRef.current) {
        const fileUrl = pdfUrl.find((url) => url.name === file)?.url;

        // audioRef.current.src = data.url;
        audioRef.current.src = fileUrl?.ttsUrl || '';
        // audioRef.current.src =
        //   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

        // audioRef.current.play();
        // setIsPlaying(true);
      }
    }
  }, [file]);

  const handlePlayPause = async () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    try {
      // const response = await fetch('/api/tts', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ text: currentText }),
      // });

      // if (!response.ok) throw new Error('TTS request failed');

      // const data = await response.json();

      if (audioRef.current) {
        // audioRef.current.src = data.url;
        // audioRef.current.src =
        //   'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error generating speech:', error);
      // toast.error('Failed to generate speech');
    }
  };

  const handleSpeedChange = () => {
    setSpeed((prevSpeed) => {
      const newSpeed = prevSpeed + 1 >= speedOptions.length ? 0 : prevSpeed + 1;

      // Update the audio playback speed
      if (audioRef.current) {
        audioRef.current.playbackRate = speedOptions[newSpeed] ?? 1; // Ensure a valid speed
      }

      return newSpeed;
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      className={`fixed w-full left-0 bottom-0 duration-300 transition-all p-8 ${
        file ? 'opacity-100' : 'opacity-0  pointer-events-none'
      }`}
    >
      {file && (
        <div className="border  justify-between flex-col-reverse md:flex-row flex rounded-2xl border-white/10 p-4 bg-[#111111]">
          <div className="md:p-4 rounded-lg w-full md:w-[20%]">
            <div className="max-h-60">
              {' '}
              <p className="truncate w-[60%] md:w-full">{file}</p>
              <p className="text-sm">
                {formatTime(audioRef.current?.currentTime || 0)} /{' '}
                {formatTime(audioRef.current?.duration || 0)}
              </p>
            </div>
          </div>
          <div className="max-w-[100%] md:max-w-[60%] h-[40px] md:h-auto w-full relative flex items-center justify-center">
            <Progress
              value={progress}
              className="max-w-[100%] md:max-w-[60%] w-full"
            />
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
              className="w-full max-w-[100%] md:max-w-[61%] absolute"
            />
          </div>
          <div className="flex items-center md:justify-between gap-8 justify-center md:max-w-[20%]  w-full">
            <Button
              onClick={handlePlayPause}
              variant="outline"
              className="flex items-center h-12 w-12 rounded-full bg-white hover:bg-[#b4fd83]"
            >
              {isPlaying ? (
                <Pause className="h-[40px] w-[40px] text-black" fill="black" />
              ) : (
                <Play className="h-[40px] w-[40px] text-black" fill="black" />
              )}
            </Button>
            <Button
              onClick={handleSpeedChange}
              variant="ghost"
              className="h-12 w-12 rounded-full"
            >
              {speedOptions[speed]}x
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
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default AudioController;
