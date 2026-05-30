import Download from '../models/Download.js';
import Extension from '../models/Extension.js';

export const recordDownload = async (req, res, next) => {
  try {
    const { extensionId } = req.params;
    const ext = await Extension.findOne({ _id: extensionId, userId: req.user._id });
    if (!ext) return res.status(404).json({ success: false, message: 'Extension not found' });
    if (!ext.zipUrl) {
      return res.status(400).json({ success: false, message: 'Generate ZIP first' });
    }

    const record = await Download.findOneAndUpdate(
      { userId: req.user._id, extensionId },
      { $inc: { downloadCount: 1 }, lastDownloadedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      zipUrl: ext.zipUrl,
      downloadCount: record.downloadCount,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserDownloads = async (req, res, next) => {
  try {
    const downloads = await Download.find({ userId: req.user._id })
      .populate('extensionId', 'name zipUrl category')
      .sort({ lastDownloadedAt: -1 });
    res.json({ success: true, data: downloads });
  } catch (err) {
    next(err);
  }
};
