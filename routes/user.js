import { Router } from 'express';
const router = Router();

import { accessLevelVerifier, isAdminVerifier } from '../middlewares/verifyToken.js';
import { get_stats,get_user,get_users,update_user,delete_user } from '../controllers/UserController.js';

router.get('/', isAdminVerifier, get_users);
router.get('/:id', isAdminVerifier, get_user);
router.get('/stats', isAdminVerifier, get_stats);
router.put('/:id', accessLevelVerifier,update_user);
router.delete('/:id', isAdminVerifier, delete_user);

export default router;