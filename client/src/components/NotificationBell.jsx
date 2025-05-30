import { useEffect, useState } from 'react';
import { FaBell } from "react-icons/fa";
import { useFriendStore } from '../store/friendStore';
import toast from 'react-hot-toast';

const NotificationBell = () => {
  const {
    friendRequests,
    fetchFriendRequests,
    acceptFriendRequest,
  } = useFriendStore();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchFriendRequests();
  }, [fetchFriendRequests]);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        <FaBell className="text-2xl text-gray-800" />
        {friendRequests.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {friendRequests.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border rounded shadow z-50 p-4">
          <h4 className="font-bold mb-2">Friend Requests</h4>
          {friendRequests.length === 0 ? (
            <p className="text-sm text-gray-600">No requests</p>
          ) : (
            <ul className="space-y-2">
          {friendRequests.map((req) => (
            <li key={req._id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <div>
                <p className="font-semibold">{req.from ? req.from.name : "Unknown User"}</p>
                <p className="text-xs text-gray-500">{req.from ? req.from.email : "No info"}</p>
                </div>
                {req.from && (
                <div className="flex gap-1">
                    <button
                    onClick={async () => {
                        await acceptFriendRequest(req.from._id);
                        toast.success("Friend request accepted");
                    }}
                    className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                    >
                    Accept
                    </button>
                </div>
                )}
            </li>
            ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
