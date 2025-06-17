import React, { useState, useEffect, useContext, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';
import { MessageCircle, X } from 'lucide-react';
import { Send } from 'lucide-react';

const CaptainChatBox = ({ ride }) => {
  const { socket } = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  

  useEffect(() => {
    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);

      if (!isOpen && msg.senderType !== 'captain') {
        setUnreadCount((count) => count + 1);
      }
    };

    socket.on('chat-message', handleMessage);

    return () => {
      socket.off('chat-message', handleMessage);
    };
  }, [socket, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;
    if (!ride?.captain?._id || !ride?.user?._id) return;

    socket.emit('chat-message', {
      senderId: ride.captain._id,
      receiverId: ride.user._id,
      message: text,
      senderType: 'captain',
    });

    setMessages((prev) => [...prev, { message: text, senderType: 'captain' }]);
    setText('');
  };

  const toggleChat = () => {
    setIsOpen((prev) => {
      if (!prev) setUnreadCount(0);
      return !prev;
    });
  };

  return (
    <>
      {/* Floating Icon with unread count */}
      <button
        onClick={toggleChat}
        className="fixed  left-50 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg focus:outline-none relative"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        title={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Chatbox */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 max-w-full rounded-2xl shadow-2xl flex flex-col h-72 bg-white border border-gray-200">
  {/* Header */}
  <div className="bg-blue-600 text-white p-3 rounded-t-2xl font-semibold text-base flex items-center justify-between">
    {ride.user.fullname.firstname} {ride.user.fullname.lastname} <p>(User)</p>
  </div>

  {/* Messages area */}
  <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
    {messages.length === 0 && (
      <p className="text-gray-400 text-sm text-center mt-8">No messages yet</p>
    )}
    {messages.map((msg, i) => (
      <div
        key={i}
        className={`flex ${msg.senderType === 'captain' ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-[75%] px-4 py-2 text-sm rounded-xl break-words shadow-sm 
            ${msg.senderType === 'captain'
              ? 'bg-blue-100 text-right rounded-br-none'
              : 'bg-white text-left border border-gray-200 rounded-bl-none'
            }`}
        >
          {msg.message}
        </div>
      </div>
    ))}
    <div ref={messagesEndRef} />
  </div>

  {/* Input box */}
  <div className="flex items-center border-t border-gray-200 p-2 bg-white gap-2">
    <input
      type="text"
      className="flex-grow border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      placeholder="Type a message..."
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') sendMessage();
      }}
    />
    <button
      onClick={sendMessage}
      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-all shadow-md"
    >
      <Send size={18} className="text-white" />
    </button>
  </div>
</div>
      )}
    </>
  );
};

export default CaptainChatBox;
