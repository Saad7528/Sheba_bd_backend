import mongoose, { Schema, Document } from 'mongoose';

export interface IReview {
  patientId: mongoose.Types.ObjectId;
  patientName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IDoctor extends Document {
  userId?: mongoose.Types.ObjectId;
  name: string;
  specialty: string;
  degrees: string;
  visitingFee: number;
  location: string; // District (e.g., 'Dhaka', 'Chattogram')
  chamber: string;   // Clinic/Hospital name
  schedule: string[]; // e.g., ["Saturday: 05:00 PM - 08:00 PM", "Monday: 05:00 PM - 08:00 PM"]
  imageUrl: string;
  description: string;
  rating: number;
  reviewsCount: number;
  reviews: IReview[];
}

const ReviewSchema = new Schema<IReview>({
  patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  patientName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const DoctorSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    degrees: { type: String, required: true },
    visitingFee: { type: Number, required: true },
    location: { type: String, required: true },
    chamber: { type: String, required: true },
    schedule: [{ type: String, required: true }],
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, default: 5 },
    reviewsCount: { type: Number, default: 0 },
    reviews: [ReviewSchema]
  },
  { timestamps: true }
);

export default mongoose.model<IDoctor>('Doctor', DoctorSchema);
