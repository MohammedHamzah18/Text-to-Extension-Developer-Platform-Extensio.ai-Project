import { Router } from 'express';
import { recordDownload, getUserDownloads } from '../controllers/downloadController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.get('/', getUserDownloads);
router.post('/:extensionId', recordDownload);

export default router;
