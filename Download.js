import mongoose from 'mongoose';

const downloadSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    extensionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Extension',
      required: true,
      index: true,
    },
    downloadCount: { type: Number, default: 0 },
    lastDownloadedAt: { type: Date },
  },
  { timestamps: true }
);

downloadSchema.index({ userId: 1, extensionId: 1 }, { unique: true });

export default mongoose.model('Download', downloadSchema);
