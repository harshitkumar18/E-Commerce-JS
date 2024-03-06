import { Router } from 'express';
const router = Router();

import { get_product,get_products,create_product,update_product,delete_user } from '../controllers/ProductController.js';
import { isAdminVerifier } from '../middlewares/verifyToken.js';

router.get('/', get_products);
router.get('/:id', get_product);
router.post('/', isAdminVerifier, create_product);
router.put('/:id', isAdminVerifier, update_product);
router.delete('/:id', isAdminVerifier, delete_user);

export default router;