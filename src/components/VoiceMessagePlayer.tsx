import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface VoiceMessagePlayerProps {
  audioUrl: string;
  audioType: string;
}

export default function VoiceMessagePlayer({ audioUrl, audioType }: VoiceMessagePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col space-y-2 w-full max-w-[240px]">
      <audio ref={audioRef}>
        <source src={audioUrl} type={audioType} />
      </audio>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={togglePlay}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-gray-600" />
          ) : (
            <Play className="w-5 h-5 text-gray-600" />
          )}
        </button>
        
        <button
          onClick={handleRestart}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-gray-600" />
        </button>
        
        <div className="text-xs text-gray-500 min-w-[70px]">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      <div
        ref={progressRef}
        className="h-1 bg-gray-200 rounded-full cursor-pointer"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>
    </div>
  );
}