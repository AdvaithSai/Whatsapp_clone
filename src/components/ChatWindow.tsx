import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { Phone, Video, MoreVertical, Smile, Paperclip, Send } from 'lucide-react';
import type { Chat, Message } from '../types';
import EmojiPicker from './EmojiPicker';
import FilePreview from './FilePreview';
import FileAttachment from './FileAttachment';
import VideoCall from './VideoCall';
import VoiceCall from './VoiceCall';
import VoiceRecorder from './VoiceRecorder';
import VoiceMessagePlayer from './VoiceMessagePlayer';
import { AudioRecorder } from '../utils/audioRecorder';

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
  onSendMessage: (content: string, file?: File) => void;
}

export default function ChatWindow({ chat, messages, onSendMessage }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isVoiceCallOpen, setIsVoiceCallOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRecorderRef = useRef<AudioRecorder>(new AudioRecorder());

  const handleSend = () => {
    if (newMessage.trim() || selectedFile) {
      onSendMessage(newMessage, selectedFile || undefined);
      setNewMessage('');
      setSelectedFile(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setIsEmojiPickerOpen(false);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const startVideoCall = () => {
    if (!chat.online) {
      alert('User is offline');
      return;
    }
    setIsVideoCallOpen(true);
  };

  const startVoiceCall = () => {
    if (!chat.online) {
      alert('User is offline');
      return;
    }
    setIsVoiceCallOpen(true);
  };

  const handleStartRecording = async () => {
    try {
      await audioRecorderRef.current.startRecording();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Could not access microphone. Please check your permissions.');
    }
  };

  const handleStopRecording = async () => {
    try {
      const audioBlob = await audioRecorderRef.current.stopRecording();
      setIsRecording(false);
      
      // Convert blob to file
      const audioFile = new File([audioBlob], 'voice-message.webm', {
        type: 'audio/webm',
      });
      
      // Send the audio file
      onSendMessage('Voice message', audioFile);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-4">
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold">{chat.name}</h2>
            <p className="text-sm text-gray-500">
              {chat.online ? 'online' : 'offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 hover:bg-gray-200 rounded-full"
            onClick={startVideoCall}
          >
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            className="p-2 hover:bg-gray-200 rounded-full"
            onClick={startVoiceCall}
          >
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#e5ded8]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'me' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === 'me'
                  ? 'bg-[#dcf8c6] rounded-tr-none'
                  : 'bg-white rounded-tl-none'
              }`}
            >
              {message.file?.type.startsWith('audio/') ? (
                <VoiceMessagePlayer
                  audioUrl={message.file.url}
                  audioType={message.file.type}
                />
              ) : message.file ? (
                <FileAttachment file={message.file} />
              ) : (
                <p className="text-gray-800">{message.content}</p>
              )}
              <div className="flex items-center justify-end space-x-1 mt-1">
                <span className="text-xs text-gray-500">
                  {format(message.timestamp, 'HH:mm')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-50">
        {selectedFile && (
          <div className="mb-2">
            <FilePreview
              file={selectedFile}
              onRemove={() => setSelectedFile(null)}
            />
          </div>
        )}
        <div className="flex items-center space-x-2 relative">
          <button
            className="p-2 hover:bg-gray-200 rounded-full"
            onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
          >
            <Smile className="w-6 h-6 text-gray-600" />
          </button>
          <EmojiPicker
            isOpen={isEmojiPickerOpen}
            onEmojiSelect={handleEmojiSelect}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <button
            className="p-2 hover:bg-gray-200 rounded-full"
            onClick={handleFileClick}
          >
            <Paperclip className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message"
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-green-500"
            />
          </div>
          {newMessage || selectedFile ? (
            <button
              onClick={handleSend}
              className="p-2 hover:bg-gray-200 rounded-full"
            >
              <Send className="w-6 h-6 text-gray-600" />
            </button>
          ) : (
            <VoiceRecorder
              isRecording={isRecording}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              onRecordingComplete={() => {}}
            />
          )}
        </div>
      </div>

      {/* Call Components */}
      <VideoCall
        isOpen={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
        participantName={chat.name}
        participantAvatar={chat.avatar}
      />
      <VoiceCall
        isOpen={isVoiceCallOpen}
        onClose={() => setIsVoiceCallOpen(false)}
        participantName={chat.name}
        participantAvatar={chat.avatar}
      />
    </div>
  );
}