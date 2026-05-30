import Extension from '../models/Extension.js';
import { generateExtensionFiles } from '../generators/fileGenerator.js';
import { validateExtension } from '../validators/codeValidator.js';
import { scanFilesForThreats, sanitizeSettings } from '../validators/securityValidator.js';
import { packageExtensionZip, ensureStorageDirs } from '../zip/zipPackager.js';
import { getTemplate } from '../generators/templateRegistry.js';

export const listExtensions = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    const filter = { userId: req.user._id };
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Extension.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(Number(limit)),
      Extension.countDocuments(filter),
    ]);
    res.json({ success: true, data: items, total, page: Number(page) });
  } catch (err) {
    next(err);
  }
};

export const getExtension = async (req, res, next) => {
  try {
    const ext = await Extension.findOne({ _id: req.params.id, userId: req.user._id });
    if (!ext) return res.status(404).json({ success: false, message: 'Extension not found' });
    res.json({ success: true, data: ext });
  } catch (err) {
    next(err);
  }
};

export const createExtension = async (req, res, next) => {
  try {
    const { name, description, category, templateId, settings } = req.body;
    const template = getTemplate(templateId);
    if (!template) return res.status(400).json({ success: false, message: 'Invalid template' });

    const cleanSettings = sanitizeSettings(settings);
    const ext = await Extension.create({
      userId: req.user._id,
      name,
      description,
      category: category || template.category,
      templateId,
      settings: cleanSettings,
    });
    res.status(201).json({ success: true, data: ext });
  } catch (err) {
    next(err);
  }
};

export const updateExtension = async (req, res, next) => {
  try {
    const ext = await Extension.findOne({ _id: req.params.id, userId: req.user._id });
    if (!ext) return res.status(404).json({ success: false, message: 'Extension not found' });

    const { name, description, settings } = req.body;
    if (name) ext.name = name;
    if (description !== undefined) ext.description = description;
    if (settings) ext.settings = sanitizeSettings(settings);
    await ext.save();
    res.json({ success: true, data: ext });
  } catch (err) {
    next(err);
  }
};

export const deleteExtension = async (req, res, next) => {
  try {
    const ext = await Extension.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!ext) return res.status(404).json({ success: false, message: 'Extension not found' });
    res.json({ success: true, message: 'Extension deleted' });
  } catch (err) {
    next(err);
  }
};

/** Preview / validate without saving ZIP */
export const previewExtension = async (req, res, next) => {
  try {
    const ext = await Extension.findOne({ _id: req.params.id, userId: req.user._id });
    if (!ext) return res.status(404).json({ success: false, message: 'Extension not found' });

    const files = await generateExtensionFiles({
      name: ext.name,
      description: ext.description,
      templateId: ext.templateId,
      settings: ext.settings,
      version: `${ext.version}.0.0`,
    });

    const security = scanFilesForThreats(files);
    if (!security.safe) {
      return res.status(400).json({
        success: false,
        message: 'Security validation failed',
        security,
      });
    }

    const textFiles = Object.fromEntries(
      Object.entries(files).filter(([, v]) => !Buffer.isBuffer(v))
    );
    const validationReport = validateExtension(
      Object.fromEntries(
        Object.entries(files).map(([k, v]) => [k, Buffer.isBuffer(v) ? '[binary]' : v])
      )
    );

    res.json({
      success: true,
      files: textFiles,
      folderStructure: buildFolderTree(Object.keys(files)),
      validationReport,
      security,
    });
  } catch (err) {
    next(err);
  }
};

export const generateExtension = async (req, res, next) => {
  try {
    await ensureStorageDirs();
    const ext = await Extension.findOne({ _id: req.params.id, userId: req.user._id });
    if (!ext) return res.status(404).json({ success: false, message: 'Extension not found' });

    const files = await generateExtensionFiles({
      name: ext.name,
      description: ext.description,
      templateId: ext.templateId,
      settings: ext.settings,
      version: `${ext.version}.0.0`,
    });

    const security = scanFilesForThreats(files);
    if (!security.safe) {
      return res.status(400).json({
        success: false,
        message: 'Generation blocked by security policy',
        security,
      });
    }

    const validationReport = validateExtension(
      Object.fromEntries(
        Object.entries(files).map(([k, v]) => [k, Buffer.isBuffer(v) ? 'icons' : v])
      )
    );

    if (!validationReport.valid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        validationReport,
      });
    }

    const { zipUrl } = await packageExtensionZip(req.user._id, ext._id, files);

    const snapshot = {
      version: ext.version,
      settings: ext.settings,
      generatedFiles: Object.fromEntries(
        Object.entries(files)
          .filter(([, v]) => !Buffer.isBuffer(v))
          .map(([k, v]) => [k, v])
      ),
      zipUrl,
      label: `v${ext.version}`,
    };
    ext.versions.push(snapshot);
    ext.version += 1;
    ext.generatedFiles = snapshot.generatedFiles;
    ext.zipUrl = zipUrl;
    ext.validationReport = validationReport;
    await ext.save();

    res.json({
      success: true,
      zipUrl,
      validationReport,
      data: ext,
    });
  } catch (err) {
    next(err);
  }
};

export const saveVersion = async (req, res, next) => {
  try {
    const ext = await Extension.findOne({ _id: req.params.id, userId: req.user._id });
    if (!ext) return res.status(404).json({ success: false, message: 'Extension not found' });

    const { label } = req.body;
    ext.versions.push({
      version: ext.version,
      settings: { ...ext.settings },
      generatedFiles: ext.generatedFiles,
      zipUrl: ext.zipUrl,
      label: label || `v${ext.version}`,
    });
    ext.version += 1;
    await ext.save();
    res.json({ success: true, data: ext });
  } catch (err) {
    next(err);
  }
};

export const restoreVersion = async (req, res, next) => {
  try {
    const ext = await Extension.findOne({ _id: req.params.id, userId: req.user._id });
    if (!ext) return res.status(404).json({ success: false, message: 'Extension not found' });

    const versionId = req.params.versionId;
    const snapshot = ext.versions.id(versionId);
    if (!snapshot) return res.status(404).json({ success: false, message: 'Version not found' });

    ext.settings = snapshot.settings;
    ext.generatedFiles = snapshot.generatedFiles;
    ext.zipUrl = snapshot.zipUrl;
    await ext.save();
    res.json({ success: true, data: ext });
  } catch (err) {
    next(err);
  }
};

export const cloneExtension = async (req, res, next) => {
  try {
    const source = await Extension.findOne({ _id: req.params.id, userId: req.user._id });
    if (!source) return res.status(404).json({ success: false, message: 'Extension not found' });

    const clone = await Extension.create({
      userId: req.user._id,
      name: `${source.name} (Copy)`,
      description: source.description,
      category: source.category,
      templateId: source.templateId,
      settings: source.settings,
    });
    res.status(201).json({ success: true, data: clone });
  } catch (err) {
    next(err);
  }
};

export const compareVersions = async (req, res, next) => {
  try {
    const ext = await Extension.findOne({ _id: req.params.id, userId: req.user._id });
    if (!ext) return res.status(404).json({ success: false, message: 'Extension not found' });

    const { v1, v2 } = req.query;
    const snap1 = ext.versions.id(v1);
    const snap2 = ext.versions.id(v2);
    if (!snap1 || !snap2) {
      return res.status(404).json({ success: false, message: 'Versions not found' });
    }

    res.json({
      success: true,
      diff: {
        settings: diffObjects(snap1.settings, snap2.settings),
        v1: snap1.label,
        v2: snap2.label,
      },
    });
  } catch (err) {
    next(err);
  }
};

function buildFolderTree(paths) {
  const root = { name: 'extension', type: 'folder', children: [] };
  for (const p of paths.sort()) {
    const parts = p.split('/');
    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;
      let child = current.children.find((c) => c.name === part);
      if (!child) {
        child = { name: part, type: isFile ? 'file' : 'folder', children: [] };
        current.children.push(child);
      }
      current = child;
    }
  }
  return root;
}

function diffObjects(a, b) {
  const changes = [];
  const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
  for (const k of keys) {
    if (JSON.stringify(a?.[k]) !== JSON.stringify(b?.[k])) {
      changes.push({ key: k, from: a?.[k], to: b?.[k] });
    }
  }
  return changes;
}
