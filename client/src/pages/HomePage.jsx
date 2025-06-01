import { useEffect, useState } from 'react';
import Chat from '../Chat';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useFriendStore } from '../store/friendStore';
import Friends from '../components/Friends';
import useChatStore from '../store/chatStore';
import ChatBox from '../components/ChatBox';
import { FaCircleExclamation } from "react-icons/fa6";
import { socket } from '../socket'; 

const HomePage = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [showAnonymousChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  const { logout,user} = useAuthStore();
  
  const joinRoom = () => {
    if (name && room) {
      socket.emit('join_room', room);
      setShowChat(true);
    }
  };

  const handleLogout = async () => {
  try {
    await logout();
    useFriendStore.getState().reset(); 
    localStorage.removeItem('sentRequests');
    navigate('/login', { replace: true });
  } catch (err) {
    console.error("Logout failed", err);
  }
};
  useEffect(() => {
    return () => {
      if (!showAnonymousChat) useFriendStore.getState().searchUsers(''); 
    };
  }, [showAnonymousChat]);
  const handleBack = () => {
    setShowChat(false);
  };
  const {
    showChat
  } = useChatStore();
  if (showAnonymousChat) {
    return (
      <Chat 
        goBack={handleBack} 
        socket={socket} 
        username={name} 
        room={room} 
      />
    );
  }

  return (
  <div className="h-screen w-full flex flex-row">
   <div className="w-1/5 border-r">
      <Friends />
    </div>
    <div className='w-4/5'> 
{showChat?
      <ChatBox />
      :
     (   <div className="flex-1 flex flex-col justify-center items-center px-4 py-6 overflow-y-auto">   
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md mt-20">
      <h3 className="text-2xl font-bold mb-6 text-center text-blue-600 flex justify-between items-center">
        Join anonymous chat 
        <span className="relative flex items-center group">
          <FaCircleExclamation className="text-blue-500 cursor-pointer ml-2" />
          <span className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 bg-gray-700 text-white text-xs rounded px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
            you can name yourself anything and communicate with others only within the same room. No data is saved — it's completely anonymous!
          </span>
        </span>
      </h3>
        <input
          type="text"
          placeholder={user.name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Room ID..."
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={joinRoom}
          disabled={name === '' || room === ''}
          className={`w-full py-2 rounded text-white font-semibold transition ${
            room === ''
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Join a Room
        </button>
        <button
          onClick={handleLogout}
          className="w-full mt-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 font-semibold"
        >
          Logout
        </button>
      </div>
    </div>)}  
    </div>
  </div>
);
};

export default HomePage;
