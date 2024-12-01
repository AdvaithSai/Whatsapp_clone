import React from 'react';

const emojis = [
  '😀', '😂', '😊', '😍', '🥰', '😎', 
  '😇', '🤔', '😅', '😉', '🙂', '🤗',
  '❤️', '👍', '👋', '🎉', '✨', '🔥'
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  isOpen: boolean;
}

export default function EmojiPicker({ onEmojiSelect, isOpen }: EmojiPickerProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-16 left-0 bg-white rounded-lg shadow-lg p-2 grid grid-cols-6 gap-1 border border-gray-200">
      {emojis.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onEmojiSelect(emoji)}
          className="w-8 h-8 hover:bg-gray-100 rounded flex items-center justify-center text-xl"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}