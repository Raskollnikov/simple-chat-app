import express from 'express';
import { signup,login,verify,checkAuth,logout} from '../controllers/authController.js';
import { protectedRoute } from '../middleware/protectedRoute.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify',verify);
router.post('/login', login);
router.post('/logout',logout)
router.get('/check-auth',protectedRoute,checkAuth)


export default router;