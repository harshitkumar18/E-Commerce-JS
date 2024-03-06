import { Router } from 'express';
const router = Router();

import { get_income,get_order,get_orders,create_order,update_order,delete_order } from '../controllers/OrderController.js';
import { authenticationVerifier, accessLevelVerifier, isAdminVerifier } from '../middlewares/verifyToken.js';

router.get('/', isAdminVerifier, get_orders);
router.get('/income', isAdminVerifier, get_income);
router.get('/:userId', accessLevelVerifier, get_order);
router.post('/', authenticationVerifier, create_order);
router.put('/:id', isAdminVerifier, update_order);
router.delete('/:id', isAdminVerifier, delete_order);

export default router;