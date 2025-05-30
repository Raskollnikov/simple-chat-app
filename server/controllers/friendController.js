import { FriendRequest } from '../models/FriendRequest.js';
import { User } from '../models/users.js';

export const sendRequest = async (req, res) => {
  const fromId = req.userId;
  const toId = req.params.toId;

  if (fromId === toId) return res.status(400).json({ message: "you cannot add yourself." });

  try {
    const fromUser = await User.findById(fromId);
    const toUser = await User.findById(toId);

    if (!fromUser || !toUser) return res.status(404).json({ message: "user not found." });

    if (fromUser.friends.includes(toId)) {
      return res.status(400).json({ message: "you are already friends." });
    }

    const existingRequest = await FriendRequest.findOne({ from: fromId, to: toId }).select('-password');
    if (existingRequest) {
      return res.status(400).json({ message: "friend request already sent." });
    }

    const newRequest = new FriendRequest({ from: fromId, to: toId });
    await newRequest.save();

    res.status(200).json({ message: "friend request sent." });
  } catch (err) {
    console.error("error sending friend request:", err);
    res.status(500).json({ message: "server error." });
  }
};

export const acceptRequest = async (req, res) => {
  const toId = req.userId;
  const fromId = req.params.fromId;

  try {
    const request = await FriendRequest.findOne({ from: fromId, to: toId });

    if (!request) {
      return res.status(404).json({ message: "friend request not found." });
    }

    await User.findByIdAndUpdate(toId, { $addToSet: { friends: fromId } });
    await User.findByIdAndUpdate(fromId, { $addToSet: { friends: toId } });

    await FriendRequest.deleteOne({ _id: request._id });

    res.status(200).json({ message: "friend request accepted." });
  } catch (err) {
    console.error("error accepting friend request:", err);
    res.status(500).json({ message: "server error." });
  }
};

export const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('friends', 'name email');
    if (!user) return res.status(404).json({ message: "user not found." });

    res.status(200).json(user.friends);
  } catch (err) {
    console.error("error getting friends:", err);
    res.status(500).json({ message: "server error." });
  }
};


export const getRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({ to: req.userId }).populate('from', 'name email');
    res.status(200).json(requests);
  } catch (err) {
    console.error("error getting friend requests:", err);
    res.status(500).json({ message: "server error." });
  }
};


export const searchUsers = async (req, res) => {
  const query = req.query.q;
  try {
    const users = await User.find({
      name: { $regex: query, $options: 'i' },
      _id: { $ne: req.userId }
    }).select('name email');
    res.json(users);
  } catch (err) {
    console.error("Search failed", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteFriend = async (req, res) => {
  const userId = req.userId;
  const friendId = req.params.friendId;

  if (userId === friendId) {
    return res.status(400).json({ message: "you cannot remove yourself." });
  }

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found." });
    }

    await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });

    res.status(200).json({ message: "friend removed successfully." });
  } catch (err) {
    console.error("error removing friend:", err);
    res.status(500).json({ message: "server error." });
  }
};
