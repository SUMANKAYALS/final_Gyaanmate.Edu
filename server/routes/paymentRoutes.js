import { Router } from 'express';
import {
  processPayment,
  getMyPayments,
  downloadReceipt,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.post('/checkout', processPayment);
router.get('/my', getMyPayments);
router.get('/:id/receipt', downloadReceipt);
export default router;
