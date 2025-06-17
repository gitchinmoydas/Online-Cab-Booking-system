import React, { useState, useEffect, useContext, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';
import { MessageCircle, X } from 'lucide-react';
import { Send } from 'lucide-react';


const UserChatBox = ({ ride }) => {
    const { socket } = useContext(SocketContext);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const handleMessage = (msg) => {
            setMessages((prev) => [...prev, msg]);

            // Increment unread count only if chatbox closed and message from captain
            if (!isOpen && msg.senderType !== 'user') {
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
        if (!ride?.user?._id || !ride?.captain?._id) return;
        console.log(ride);

        socket.emit('chat-message', {
            senderId: ride.user._id,
            receiverId: ride.captain._id,
            message: text,
            senderType: 'user',
        });

        setMessages((prev) => [...prev, { message: text, senderType: 'user' }]);
        setText('');
    };

    const toggleChat = () => {
        setIsOpen((prev) => {
            if (!prev) setUnreadCount(0); // reset unread when opening chat
            return !prev;
        });
    };

    return (
        <>
            {/* Floating Message Icon */}
            <button
                onClick={toggleChat}
                className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg focus:outline-none"
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
                title={isOpen ? 'Close chat' : 'Open chat'}
            >
                <div className="relative">
                    {isOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <>
                            <MessageCircle className="h-6 w-6" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </>
                    )}
                </div>
            </button>

            {/* Chatbox */}
            {isOpen && (
         <div className="fixed bottom-20 right-6 z-50 w-80 max-w-full rounded-2xl shadow-2xl flex flex-col h-72 bg-white border border-gray-200">
  {/* Header */}
  <div className="bg-green-600 text-white p-3 rounded-t-2xl font-semibold text-base flex items-center justify-between">
    {ride.captain.fullname.firstname} {ride.captain.fullname.lastname} <p>(Captain)</p>
  </div>

  {/* Messages area */}
  <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
    {messages.length === 0 && (
      <p className="text-gray-400 text-sm text-center mt-8">No messages yet</p>
    )}
    {messages.map((msg, i) => (
      <div
        key={i}
        className={`flex ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-[75%] px-4 py-2 text-sm rounded-xl break-words shadow-sm 
            ${msg.senderType === 'user'
              ? 'bg-green-100 text-right rounded-br-none'
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
      className="flex-grow border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
      placeholder="Type a message..."
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') sendMessage();
      }}
    />
    <button
      onClick={sendMessage}
      className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition-all shadow-md"
    >
      <Send size={18} className="text-white" />
    </button>
  </div>
</div>


            )}
        </>
    );
};

export default UserChatBox;
