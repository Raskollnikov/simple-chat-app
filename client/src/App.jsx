import { useState } from "react";
import { io } from "socket.io-client";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3000");

function App() {
  const [name, setName] = useState('');
  const [showChat,setShowChat] = useState(false)
  const [room, setRoom] = useState('');

  const joinRoom = () => {
    if (name !== '' && room !== '') {
      socket.emit('join_room', room);
      setShowChat(true)
    }
  };

  return (
  <div className="App h-screen flex items-center justify-center bg-gray-100">
  {!showChat ? (
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
    </div>
  ) : (
    <Chat socket={socket} username={name} room={room} />
  )}
</div>

  );
}

export default App;
