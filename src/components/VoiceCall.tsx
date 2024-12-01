import React, { useEffect, useState } from 'react';
import { X, Mic, MicOff, PhoneOff } from 'lucide-react';
import { Timer } from '../utils/timer';

interface VoiceCallProps {
  isOpen: boolean;
  onClose: () => void;
  participantName: string;
  participantAvatar: string;
}

export default function VoiceCall({ isOpen, onClose, participantName, participantAvatar }: VoiceCallProps) {
  const [isMuted, setIsMuted] = React.useState(false);
  const [callTime, setCallTime] = useState('00:00');
  const timerRef = React.useRef<Timer | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Initialize and start timer when call opens
      timerRef.current = new Timer((time) => setCallTime(time));
      timerRef.current.start();
    }

    return () => {
      // Cleanup timer when component unmounts or call closes
      if (timerRef.current) {
        timerRef.current.stop();
        timerRef.current = null;
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    if (timerRef.current) {
      timerRef.current.stop();
      timerRef.current = null;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg">Voice Call with {participantName}</h2>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-8">
          <img
            src={participantAvatar}
            alt={participantName}
            className="w-24 h-24 rounded-full mb-4"
          />
          <p className="text-white text-lg mb-2">{participantName}</p>
          <p className="text-gray-400">{callTime}</p>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full ${
              isMuted ? 'bg-red-500' : 'bg-gray-700'
            } hover:opacity-90`}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>
          <button
            onClick={handleClose}
            className="p-4 rounded-full bg-red-500 hover:bg-red-600"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}