import { Router } from 'express';
const router = Router();

import { get_cart,get_carts,update_cart,delete_cart,create_cart } from '../controllers/CartController.js';
import { authenticationVerifier, accessLevelVerifier, isAdminVerifier } from '../middlewares/verifyToken.js';

router.get('/', isAdminVerifier, get_carts);
router.get('/:userId', accessLevelVerifier, get_cart)
router.post('/', authenticationVerifier, create_cart);
router.put('/:id', accessLevelVerifier, update_cart);
router.delete('/:id', accessLevelVerifier, delete_cart);

export default router;