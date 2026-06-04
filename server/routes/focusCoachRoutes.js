import express from 'express';
import { focusCoach } from '../controllers/focusCoachController.js';

const router = express.Router();

router.post('/generate', focusCoach);

export default router;