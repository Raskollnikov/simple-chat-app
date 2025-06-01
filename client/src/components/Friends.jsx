import React, { useEffect, useState } from 'react';
import { useFriendStore } from '../store/friendStore';
import toast from 'react-hot-toast';
import NotificationBell from '../components/NotificationBell';
import { io } from 'socket.io-client';
import useChatStore  from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import { RiDeleteBinLine } from "react-icons/ri";

const Friends = () => {
    const [sentRequests, setSentRequests] = useState(() => {
      const stored = localStorage.getItem('sentRequests');
      return stored ? JSON.parse(stored) : [];
    });
    const socket = io.connect("http://localhost:3000");
    const {user} = useAuthStore();
    const [activeFriendId, setActiveFriendId] = useState(null);
  const {
    setRoom,
    setName,
    setSenderId,
    setMessageList,
    setShowChat
  } = useChatStore();

  const {
    fetchFriends,
    friends,
    searchResults,
    searchUsers,
    sendFriendRequest,
    removeFriend
  } = useFriendStore();

  const [searchQuery, setSearchQuery] = useState('');
    const handleRemoveFriend = async (friendId) => {
    await removeFriend(friendId);
    toast.success("Friend removed");
    };
  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);
  

  const handleSearch = async () => {
    await searchUsers(searchQuery);
  };

  const startChatWithFriend = async (friendId) => {
      if (activeFriendId === friendId) {
      setActiveFriendId(null);
      setShowChat(false);
    return;
  }
  try {
    const res = await fetch(`http://localhost:3000/api/chat/${friendId}`, {
      method: 'GET',
      credentials: 'include' 
    });

    if (!res.ok) throw new Error("Failed to fetch chat");
    const chat = await res.json();

    socket.emit('join_room', chat._id);

    const messagesRes = await fetch(`http://localhost:3000/api/chat/messages/${chat._id}`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!messagesRes.ok) throw new Error("Failed to fetch messages");
    const messages = await messagesRes.json();

    setRoom(chat._id);
    setName(user.name);
    setSenderId(user._id); 

    setMessageList(messages.map((msg) => ({
      author: msg.sender.name,
      senderId: msg.sender._id,
      message: msg.content,
      time: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    })));

      setActiveFriendId(friendId);
    setShowChat(true);
  } catch (err) {
    console.error("Failed to start chat", err);
  }
};


  const handleSendFriendRequest = async (toId) => {
  await sendFriendRequest(toId);
  toast.success("Friend request sent");
  setSentRequests(prev => {
    const newSent = [...prev, toId];
    localStorage.setItem('sentRequests', JSON.stringify(newSent));
    return newSent;
  });
}; 
  return (
    <div className="w-full h-full bg-gray-100 p-4 overflow-y-auto">
    <div className="absolute top-4 right-4 z-50">
        <NotificationBell />
    </div>
      <h2 className="text-xl font-bold mb-4">Friends</h2>

      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-2 py-1 border rounded"
      />
      <button
        onClick={handleSearch}
        className="mt-2 w-full py-1 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Search
      </button>

   <ul className="mt-4 space-y-2">
    {searchResults.map((user) => {
    const alreadyFriend = friends.some(friend => friend._id === user._id);
    const alreadySent = sentRequests.includes(user._id);

    return (
        <li
        key={user._id}
        className="flex justify-between items-center bg-white p-2 rounded shadow"
        >
        <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
        </div>
        {alreadyFriend ? (
            <span className="text-green-600 font-semibold text-sm ml-2 py-1">Already a friend</span>
        ) : alreadySent ? (
            <span className="text-gray-500 font-semibold text-sm ml-2 py-1">Sent</span>
        ) : (
           <button
            onClick={(e) => {
              e.stopPropagation();
              handleSendFriendRequest(user._id);
            }}
            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 cursor-pointer"
          >
            Send
          </button>
        )}
        </li>
    );
    })}
</ul>

      <ul className="mt-6 space-y-2">
        {friends.map((friend) => (
          <li title='message' key={friend._id} className="hover:bg-gray-100 transition-colors duration-200 px-3 py-4 bg-white rounded shadow flex justify-between cursor-pointer" onClick={() => startChatWithFriend(friend._id)}>
            {friend.name}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFriend(friend._id);
              }}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm cursor-pointer"
            >
              <RiDeleteBinLine />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Friends;
