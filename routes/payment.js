import { Router } from 'express';
const router = Router();

import { accessLevelVerifier } from '../middlewares/verifyToken.js';
import { create_payment } from '../controllers/PaymentController.js';

router.post('/payment', accessLevelVerifier, create_payment);

export default router;