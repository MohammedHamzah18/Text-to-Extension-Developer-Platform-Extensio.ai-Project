import { Router } from 'express';
import {
  getStats,
  listUsers,
  listAllExtensions,
  listAllDownloads,
  deleteExtensionAdmin,
  flagExtension,
  getTemplates,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();
router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', listUsers);
router.get('/extensions', listAllExtensions);
router.get('/downloads', listAllDownloads);
router.get('/templates', getTemplates);
router.delete('/extensions/:id', deleteExtensionAdmin);
router.patch('/extensions/:id/flag', flagExtension);

export default router;
