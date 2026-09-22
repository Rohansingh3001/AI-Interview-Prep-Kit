import mongoose, { Schema, Document } from 'mongoose';

export interface IKit extends Document {
  userId: mongoose.Types.ObjectId;
  status: string;
  source: any;
  companyBrief: any;
  role: any;
  questions: any[];
  flashcards: any[];
  schedule: any;
  coverage: any;
  generationState: string;
  contentHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const KitSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'queued' },
    source: { type: Schema.Types.Mixed },
    companyBrief: { type: Schema.Types.Mixed },
    role: { type: Schema.Types.Mixed },
    questions: [{ type: Schema.Types.Mixed }],
    flashcards: [{ type: Schema.Types.Mixed }],
    schedule: { type: Schema.Types.Mixed },
    coverage: { type: Schema.Types.Mixed },
    generationState: { type: String, default: 'queued' },
    contentHash: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IKit>('Kit', KitSchema);
