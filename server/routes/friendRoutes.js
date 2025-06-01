import express from 'express';
import { sendRequest, acceptRequest, getFriends,getRequests,searchUsers,deleteFriend,declineFriendRequest} from '../controllers/friendController.js';
import { protectedRoute } from '../middleware/protectedRoute.js';

const router = express.Router();

router.post('/request/:toId',protectedRoute, sendRequest);
router.post('/accept/:fromId', protectedRoute,acceptRequest);
router.post('/decline/:fromId', protectedRoute, declineFriendRequest); 
router.get('/', protectedRoute, getFriends);
router.get('/friend-requests',protectedRoute,getRequests)

router.get('/search', protectedRoute, searchUsers);

router.delete('/:friendId', protectedRoute, deleteFriend);


export default router;