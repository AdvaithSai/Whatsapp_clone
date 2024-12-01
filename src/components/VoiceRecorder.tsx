import React, { useState, useRef } from 'react';
import { Mic, Square, Loader } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export default function VoiceRecorder({
  onRecordingComplete,
  isRecording,
  onStartRecording,
  onStopRecording,
}: VoiceRecorderProps) {
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setDuration(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-2">
      {isRecording && (
        <div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-full">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm text-red-500">{formatDuration(duration)}</span>
        </div>
      )}
      <button
        onClick={isRecording ? onStopRecording : onStartRecording}
        className={`p-2 rounded-full transition-colors ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600'
            : 'hover:bg-gray-200'
        }`}
      >
        {isRecording ? (
          <Square className="w-6 h-6 text-white" />
        ) : (
          <Mic className={`w-6 h-6 ${isRecording ? 'text-white' : 'text-gray-600'}`} />
        )}
      </button>
    </div>
  );
}