import { useEffect, useState } from 'react';
import Chat from '../Chat';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useFriendStore } from '../store/friendStore';
import Friends from '../components/Friends';

const socket = io.connect("http://localhost:3000");

const HomePage = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);
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
      if (!showChat) useFriendStore.getState().searchUsers(''); 
    };
  }, [showChat]);
  const handleBack = () => {
    setShowChat(false);
  };

  if (showChat) {
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
    <Friends />
    

    <div className="flex-1 flex flex-col justify-center items-center px-4 py-6 overflow-y-auto">
    
      
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md mt-20">
        <h3 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Join a Chat
        </h3>
        <input
          type="text"
          placeholder="Name"
          value={user.name}
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
    </div>
  </div>
);
};

export default HomePage;
