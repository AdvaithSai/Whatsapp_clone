import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import type { Chat, Message } from './types';

const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    name: 'Abhi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    lastMessage: {
      id: 'm1',
      content: 'Pretty good! Working on some new features.',
      sender: 'them',
      timestamp: new Date(),
      status: 'read'
    },
    unreadCount: 0,
    online: true
  },
  {
    id: '2',
    name: 'Neha',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    lastMessage: {
      id: 'm2',
      content: 'The meeting is at 3 PM',
      sender: 'me',
      timestamp: new Date(),
      status: 'delivered'
    },
    unreadCount: 2,
    online: false,
    typing: true
  },
  {
    id: '3',
    name: 'Team Group',
    avatar: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    lastMessage: {
      id: 'm3',
      content: 'Project deadline updated',
      sender: 'them',
      timestamp: new Date(),
      status: 'sent'
    },
    unreadCount: 5,
    online: true
  }
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      content: 'Hey, how are you?',
      sender: 'them',
      timestamp: new Date(Date.now() - 3600000),
      status: 'read'
    },
    {
      id: '2',
      content: 'I\'m good, thanks! How about you?',
      sender: 'me',
      timestamp: new Date(Date.now() - 3500000),
      status: 'read'
    },
    {
      id: '3',
      content: 'Pretty good! Working on some new features.',
      sender: 'them',
      timestamp: new Date(Date.now() - 3400000),
      status: 'read'
    }
  ]
  ,'2': [
    {
      id: '1',
      content: 'The meeting is at 3 PM',
      sender: 'them',
      timestamp: new Date(Date.now() - 3700000),
      status: 'read'
    },
    {
      id: '2',
      content: 'Thanks for remainding! I\'ll join the meeting.',
      sender: 'me',
      timestamp: new Date(Date.now() - 3400000),
      status: 'read'
    }
  ]
  ,'3': [
    {
      id: '1',
      content: 'Project deadline updated',
      sender: 'them',
      timestamp: new Date(Date.now() - 3700000),
      status: 'read'
    }
  ]
};

function App() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);

  const handleSendMessage = (content: string) => {
    if (!selectedChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'me',
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage]
    }));

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChat
          ? { ...chat, lastMessage: newMessage }
          : chat
      )
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex w-full max-w-screen-xl mx-auto bg-white shadow-lg">
        <div className="w-[400px] border-r">
          <Sidebar
            chats={chats}
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
          />
        </div>
        <div className="flex-1">
          {selectedChat ? (
            <ChatWindow
              chat={chats.find((c) => c.id === selectedChat)!}
              messages={messages[selectedChat] || []}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                  Welcome to WhatsApp Clone
                </h2>
                <p className="text-gray-500">
                  Select a chat to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;