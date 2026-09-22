import mongoose, { Schema, Document } from 'mongoose';

export interface IPracticeSession extends Document {
  userId: mongoose.Types.ObjectId;
  kitId: mongoose.Types.ObjectId;
  flashcardId: string;
  confidence: number;
  practicedAt: Date;
  duration: number;
}

const PracticeSessionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    kitId: { type: Schema.Types.ObjectId, ref: 'Kit', required: true },
    flashcardId: { type: String, required: true },
    confidence: { type: Number, required: true, min: 1, max: 5 },
    duration: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPracticeSession>('PracticeSession', PracticeSessionSchema);
