import { Router } from 'express';
import { listTemplates, getTemplate } from '../generators/templateRegistry.js';

const router = Router();

router.get('/', (req, res) => {
  const { category } = req.query;
  res.json({ success: true, data: listTemplates(category) });
});

router.get('/:id', (req, res) => {
  const template = getTemplate(req.params.id);
  if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
  res.json({ success: true, data: template });
});

export default router;
