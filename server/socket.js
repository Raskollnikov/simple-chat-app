export default function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log(`Socket with ID: ${socket.id} connected!`);

    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`User with ID: ${socket.id} joined the room: ${room}`);
    });

    socket.on("send_message", (data) => {
      socket.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
      console.log(`Socket with ID: ${socket.id} disconnected`);
    });
  });
}
