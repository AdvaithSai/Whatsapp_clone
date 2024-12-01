export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  file?: {
    name: string;
    url: string;
    type: string;
  };
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: Message;
  unreadCount: number;
  online: boolean;
  typing?: boolean;
}