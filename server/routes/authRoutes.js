import express from 'express';
import { signup,login,verify} from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify',verify);
router.post('/login', login);

export default router;