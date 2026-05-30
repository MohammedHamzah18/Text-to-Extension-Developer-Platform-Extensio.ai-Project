import { Router } from 'express';
import { body } from 'express-validator';
import {
  listExtensions,
  getExtension,
  createExtension,
  updateExtension,
  deleteExtension,
  previewExtension,
  generateExtension,
  saveVersion,
  restoreVersion,
  cloneExtension,
  compareVersions,
} from '../controllers/extensionController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { generateLimiter } from '../middleware/rateLimiter.js';

const router = Router();
router.use(protect);

router.get('/', listExtensions);
router.get('/:id', getExtension);
router.post(
  '/',
  [
    body('name').trim().notEmpty().isLength({ max: 120 }),
    body('templateId').notEmpty(),
    body('category').optional().isIn(['content-modifier', 'productivity', 'utility']),
  ],
  validate,
  createExtension
);
router.put('/:id', updateExtension);
router.delete('/:id', deleteExtension);
router.get('/:id/preview', previewExtension);
router.post('/:id/generate', generateLimiter, generateExtension);
router.post('/:id/versions', saveVersion);
router.post('/:id/clone', cloneExtension);
router.post('/:id/versions/:versionId/restore', restoreVersion);
router.get('/:id/versions/compare', compareVersions);

export default router;
