import { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import useChatStore from '../store/chatStore';
import { FaWindowClose } from "react-icons/fa";
import { socket } from '../socket';

const ChatBox = () => {
  const {
    messageList,
    setMessageList,
    name,
    senderId,
    room,
    setShowChat
  } = useChatStore();

  const [currentMessage, setCurrentMessage] = useState('');

   useEffect(() => {
    if (room) {
      socket.emit('join_room', room);
    }

    return () => {
      if (room) {
        socket.emit('leave_room', room);
      }
    };
  }, [room]);

 useEffect(() => {
  const handleMessage = (data) => {
    const currentList = useChatStore.getState().messageList;
    setMessageList([...currentList, data]);
  };

  socket.on('receive_message', handleMessage);

  return () => {
    socket.off('receive_message', handleMessage);
  };
}, [socket]);



  const sendMessage = async () => {
    if (currentMessage.trim() !== '') {
      const messageData = {
        room,
        author: name,
        senderId,
        message: currentMessage,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      socket.emit('send_message', messageData);
      setMessageList(prev => [...prev, messageData]);
      setCurrentMessage('');
    }
  };

 useEffect(() => {
  const handleMessage = (data) => {
    const currentList = useChatStore.getState().messageList;
    setMessageList([...currentList, data]);
  };

  socket.on('receive_message', handleMessage);

  return () => {
    socket.off('receive_message', handleMessage);
  };
}, [socket]);

  return (
<div className="mt-12 flex flex-col bg-white fixed bottom-0 top-[20px] right-0 left-[351px]">
    <button
    onClick={() => setShowChat(false)}
    className="absolute top-4 right-4 text-red-600 hover:text-red-800 text-2xl cursor-pointer"
    aria-label="Close chat"
    >
    <FaWindowClose />
    </button>
      <div className="chat-header bg-blue-600 text-white py-3 px-4 text-xl font-semibold rounded-t">
        <p>Chat Room: {room}</p>
      </div>

      <div className="chat-body flex-1 overflow-y-auto px-4 py-2 bg-gray-50">
        <ScrollToBottom className="h-full">
          {messageList.map((each, index) => (
            <div
              key={index}
              className={`flex ${senderId === each.senderId ? 'justify-end' : 'justify-start'} my-2`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${
                  senderId === each.senderId
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{each.message}</p>
                <div className="text-xs mt-1 flex justify-between gap-2 opacity-70">
                  <p>{each.time}</p>
                  <p>{each.author}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>

      <div className="chat-footer flex items-center border-t border-gray-300 p-4 gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          onChange={(e) => setCurrentMessage(e.target.value)}
          value={currentMessage}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
        >
          &#9658;
        </button>
      </div>

      
    </div>
  );
};

export default ChatBox;
