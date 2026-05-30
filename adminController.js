import User from '../models/User.js';
import Extension from '../models/Extension.js';
import Download from '../models/Download.js';
import { listTemplates } from '../generators/templateRegistry.js';

export const getStats = async (req, res, next) => {
  try {
    const [users, extensions, downloads, totalDownloads] = await Promise.all([
      User.countDocuments(),
      Extension.countDocuments(),
      Download.countDocuments(),
      Download.aggregate([{ $group: { _id: null, total: { $sum: '$downloadCount' } } }]),
    ]);
    res.json({
      success: true,
      stats: {
        users,
        extensions,
        downloadRecords: downloads,
        totalDownloads: totalDownloads[0]?.total || 0,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

export const listAllExtensions = async (req, res, next) => {
  try {
    const extensions = await Extension.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ success: true, data: extensions });
  } catch (err) {
    next(err);
  }
};

export const listAllDownloads = async (req, res, next) => {
  try {
    const downloads = await Download.find()
      .populate('userId', 'name email')
      .populate('extensionId', 'name')
      .sort({ updatedAt: -1 })
      .limit(100);
    res.json({ success: true, data: downloads });
  } catch (err) {
    next(err);
  }
};

export const deleteExtensionAdmin = async (req, res, next) => {
  try {
    const ext = await Extension.findByIdAndDelete(req.params.id);
    if (!ext) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Extension removed' });
  } catch (err) {
    next(err);
  }
};

export const flagExtension = async (req, res, next) => {
  try {
    const ext = await Extension.findByIdAndUpdate(
      req.params.id,
      { isFlagged: true },
      { new: true }
    );
    if (!ext) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: ext });
  } catch (err) {
    next(err);
  }
};

export const getTemplates = (req, res) => {
  res.json({ success: true, data: listTemplates() });
};
