import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  patientId: mongoose.Types.ObjectId;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: mongoose.Types.ObjectId;
  doctorName: string;
  doctorSpecialty: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string;       // Chosen slot from doctor availability list
  visitingFee: number;    // Snapshot of the fee at the time of booking in BDT
  status: 'pending' | 'approved' | 'cancelled';
  notes?: string;
  prescription?: {
    diagnosis: string;
    medicines: string;
    advice: string;
  };
  createdAt: Date;
}

const AppointmentSchema: Schema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    patientName: { type: String, required: true },
    patientEmail: { type: String, required: true },
    patientPhone: { type: String, required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    doctorName: { type: String, required: true },
    doctorSpecialty: { type: String, required: true },
    appointmentDate: { type: String, required: true },
    timeSlot: { type: String, required: true },
    visitingFee: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'cancelled'], default: 'pending' },
    notes: { type: String },
    prescription: {
      diagnosis: { type: String },
      medicines: { type: String },
      advice: { type: String }
    }
  },
  { timestamps: true }
);

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
