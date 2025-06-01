import express from 'express';
import { 
  getOrCreateChat, 
  getMessages, 
  createMessage 
} from '../controllers/chatController.js';
import { protectedRoute } from '../middleware/protectedRoute.js';

const router = express.Router();

router.get('/:friendId', protectedRoute, getOrCreateChat);
router.get('/messages/:chatId', protectedRoute, getMessages);
router.post('/message', protectedRoute, createMessage);

export default router;