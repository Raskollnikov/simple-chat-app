import express from 'express';
import { sendRequest, acceptRequest, getFriends,getRequests } from '../controllers/friendController.js';
import { protectedRoute } from '../middleware/protectedRoute.js';

const router = express.Router();

router.post('/request/:toId',protectedRoute, sendRequest);
router.post('/accept/:fromId', protectedRoute,acceptRequest);
router.get('/', protectedRoute, getFriends);
router.get('/friend-requests',protectedRoute,getRequests)
export default router;