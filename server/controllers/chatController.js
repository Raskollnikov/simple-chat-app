import { Chat } from '../models/chat.js';
import { Message } from '../models/messages.js';

export const getOrCreateChat = async (req, res) => {
  const userId = req.userId;
  const friendId = req.params.friendId;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, friendId] }
    }).populate('lastMessage');

    if (!chat) {
      chat = new Chat({
        participants: [userId, friendId]
      });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name');

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;
    
    const message = new Message({
      chat: chatId,
      sender: req.userId,
      content
    });

    await message.save();

    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};