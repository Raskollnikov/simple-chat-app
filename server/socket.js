import { Message } from './models/messages.js'

export default function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log(`Socket with ID: ${socket.id} connected!`);

    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`User with ID: ${socket.id} joined the room: ${room}`);
    });

    socket.on("send_anonymous", (data) => {
      socket.to(data.room).emit('receive_anonymous', data);
    });

    socket.on('send_message', async (data) => {
      try {
        const message = new Message({
          chat: data.room,
          sender: data.senderId,
          content: data.message
        });
        await message.save();

        await Chat.findByIdAndUpdate(data.room, { lastMessage: message._id });

        const messageData = {
          _id: message._id,
          room: data.room,
          sender: data.sender,
          senderId: data.senderId,
          message: data.message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          createdAt: message.createdAt
        };

        io.to(data.room).emit('receive_message', messageData);
      } catch (err) {
        console.error('Error saving message:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket with ID: ${socket.id} disconnected`);
    });
  });
}
