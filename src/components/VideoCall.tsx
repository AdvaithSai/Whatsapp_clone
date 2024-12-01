import React, { useEffect, useRef } from 'react';
import { X, Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { MediaStreamManager } from '../utils/mediaStream';

interface VideoCallProps {
  isOpen: boolean;
  onClose: () => void;
  participantName: string;
  participantAvatar: string;
}

export default function VideoCall({ isOpen, onClose, participantName, participantAvatar }: VideoCallProps) {
  const [isMuted, setIsMuted] = React.useState(false);
  const [isVideoOff, setIsVideoOff] = React.useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaManagerRef = useRef<MediaStreamManager>(new MediaStreamManager());

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const stream = await mediaManagerRef.current.startCamera();
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Failed to start camera:', error);
      setIsVideoOff(true);
    }
  };

  const stopCamera = () => {
    mediaManagerRef.current.stopCamera();
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleVideoToggle = () => {
    setIsVideoOff(!isVideoOff);
    mediaManagerRef.current.toggleVideo(!isVideoOff);
  };

  const handleMicToggle = () => {
    setIsMuted(!isMuted);
    mediaManagerRef.current.toggleAudio(!isMuted);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg">Call with {participantName}</h2>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative aspect-video bg-gray-800 rounded-lg mb-4">
          {isVideoOff ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={participantAvatar}
                alt={participantName}
                className="w-24 h-24 rounded-full"
              />
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          )}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleMicToggle}
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
            onClick={handleVideoToggle}
            className={`p-4 rounded-full ${
              isVideoOff ? 'bg-red-500' : 'bg-gray-700'
            } hover:opacity-90`}
          >
            {isVideoOff ? (
              <VideoOff className="w-6 h-6 text-white" />
            ) : (
              <Video className="w-6 h-6 text-white" />
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