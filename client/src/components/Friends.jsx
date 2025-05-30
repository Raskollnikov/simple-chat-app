import React, { useEffect, useState } from 'react';
import { useFriendStore } from '../store/friendStore';
import toast from 'react-hot-toast';
import NotificationBell from '../components/NotificationBell';

const Friends = () => {
    const [sentRequests, setSentRequests] = useState([]);

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

  const handleSendFriendRequest = async (toId) => {
  await sendFriendRequest(toId);
  toast.success("Friend request sent");
  setSentRequests((prev) => [...prev, toId]);
};  
  return (
    <div className="w-64 h-full bg-gray-100 p-4 overflow-y-auto">
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
            onClick={() => handleSendFriendRequest(user._id)}
            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
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
          <li key={friend._id} className="p-2 bg-white rounded shadow flex justify-between">
            {friend.name}
             <button
                onClick={() => handleRemoveFriend(friend._id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm cursor-pointer"
            >
                Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Friends;
