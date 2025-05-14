import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
});

io.on('connection', (socket) => {
  console.log(`Socket with ID: ${socket.id} connected!`);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User with ID: ${socket.id} joined the room: ${room}`);
  });

  socket.on("send_message",(data)=>{
    socket.to(data.room).emit('receive_message',data)
  })
  socket.on('disconnect', () => {
    console.log(`Socket with ID: ${socket.id} disconnected`);
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
