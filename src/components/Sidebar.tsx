import React, { useState } from 'react';
import { MessageCircle, Users2, History, Settings, Search, MoreVertical } from 'lucide-react';
import ChatList from './ChatList';
import type { Chat } from '../types';

interface SidebarProps {
  chats: Chat[];
  selectedChat: string | null;
  onSelectChat: (chatId: string) => void;
}

export default function Sidebar({ chats, selectedChat, onSelectChat }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full border-r">
      {/* Header */}
      <div className="p-4 bg-gray-50 flex items-center justify-between">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex space-x-3">
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <Users2 className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <History className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <MessageCircle className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-green-500"
          />
          <Search className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Chat List */}
      <ChatList
        chats={filteredChats}
        selectedChat={selectedChat}
        onSelectChat={onSelectChat}
      />
    </div>
  );
}