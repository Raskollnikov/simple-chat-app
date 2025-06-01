import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import socketHandler from './socket.js'; 
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import { connectDB } from './db/connectDb.js';
import authRoutes from './routes/authRoutes.js';
import friendRoutes from './routes/friendRoutes.js'
import chatRoutes from './routes/chatRoutes.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser())
dotenv.config();

app.use('/api/auth', authRoutes);
app.use('/api/friend',friendRoutes)
app.use('/api/chat', chatRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true
  },
});

socketHandler(io);

server.listen(3000, () => {
  connectDB();
  console.log('Server is running on http://localhost:3000');
});
