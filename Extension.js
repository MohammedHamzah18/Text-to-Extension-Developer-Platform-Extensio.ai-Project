import mongoose from 'mongoose';

const versionSnapshotSchema = new mongoose.Schema(
  {
    version: { type: Number, required: true },
    settings: { type: mongoose.Schema.Types.Mixed, required: true },
    generatedFiles: { type: mongoose.Schema.Types.Mixed, default: {} },
    zipUrl: { type: String, default: '' },
    label: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const extensionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: '', maxlength: 500 },
    category: {
      type: String,
      enum: ['content-modifier', 'productivity', 'utility'],
      required: true,
    },
    templateId: { type: String, required: true },
    settings: { type: mongoose.Schema.Types.Mixed, default: {} },
    generatedFiles: { type: mongoose.Schema.Types.Mixed, default: {} },
    version: { type: Number, default: 1 },
    zipUrl: { type: String, default: '' },
    validationReport: { type: mongoose.Schema.Types.Mixed, default: null },
    versions: [versionSnapshotSchema],
    isFlagged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

extensionSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Extension', extensionSchema);
