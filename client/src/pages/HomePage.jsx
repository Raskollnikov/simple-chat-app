import React, { useState } from 'react';
import Chat from '../Chat';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';


const socket = io.connect("http://localhost:3000");

const HomePage = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

   const {logout,user} = useAuthStore();
  
   console.log(searchResults)
  const joinRoom = () => {
    if (name !== '' && room !== '') {
      socket.emit('join_room', room);
      setShowChat(true);
    }
  };
  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/friend/search?q=${searchQuery}`, {
        withCredentials: true
      });
      setSearchResults(res.data);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const sendFriendRequest = async (toId) => {
    try {
      await axios.post(`http://localhost:3000/api/friend/request/${toId}`, {}, {
        withCredentials: true
      });
      toast.success("Friend request sent");
    } catch (err) {
      console.error("Send request failed", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };
    const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

    const handleBack = () => {
        setShowChat(false);
    };
  if (showChat) {
    return <Chat goBack={handleBack} socket={socket} username={name} room={room} />;
  }

  return (
    <div className="join-chat bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
      <h3 className="text-2xl font-bold mb-6 text-center text-blue-600">Join a Chat</h3>
      <input
        type="text"
        placeholder="Name"
        value={name}
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
          name === '' || room === ''
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
          <div className="absolute top-6 left-6">
    <input
      type="text"
      placeholder="Search users..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full px-4 py-2 border rounded"
    />
    <button
      onClick={handleSearch}
      className="mt-2 w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Search
    </button>

    <ul className="mt-4">
      {searchResults.map((user) => (
        <li key={user._id} className="flex justify-between items-center bg-white p-2 mb-2 rounded shadow">
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
          <button
            onClick={() => sendFriendRequest(user._id)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Send Request
          </button>
        </li>
      ))}
    </ul>
  </div>
    </div>
  );
};

export default HomePage;
