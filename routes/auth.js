import { Router } from 'express';
const router = Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { create_user,login_user,change_password} from '../controllers/AuthController.js';
import { authenticationVerifier, accessLevelVerifier, isAdminVerifier } from '../middlewares/verifyToken.js';

router.post('/register/', create_user);
router.post('/login', login_user);
router.post('/change-password', verifyJWT, change_password);

export default router;