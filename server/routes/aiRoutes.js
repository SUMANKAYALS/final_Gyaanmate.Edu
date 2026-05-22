import { Router } from 'express';
import { aiSearch, aiChat, aiStatus, botChat } from '../controllers/aiController.js';

const router = Router();
router.get('/status', aiStatus);
router.post('/search', aiSearch);
router.post('/chat', aiChat);
router.post('/bot', botChat);
export default router;
