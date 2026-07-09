import { Response } from 'express';
import Appointment from '../models/Appointment';
import Doctor from '../models/Doctor';
import { AuthRequest } from '../middleware/authMiddleware';

export const bookAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { doctorId, patientName, patientPhone, patientEmail, appointmentDate, timeSlot, notes } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!doctorId || !patientName || !patientPhone || !patientEmail || !appointmentDate || !timeSlot) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const newAppointment = new Appointment({
      patientId: req.user.id,
      patientName,
      patientEmail,
      patientPhone,
      doctorId,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      appointmentDate,
      timeSlot,
      visitingFee: doctor.visitingFee, // snapshot fee
      status: 'pending',
      notes
    });

    await newAppointment.save();

    return res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: newAppointment
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error booking appointment', error: error.message });
  }
};

export const getAppointments = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let appointments;

    if (req.user.role === 'patient') {
      appointments = await Appointment.find({ patientId: req.user.id }).sort({ createdAt: -1 });
    } else if (req.user.role === 'doctor') {
      // Find doctor profile linked to user, or return all as fallback
      const doctorProfile = await Doctor.findOne({ userId: req.user.id });
      if (doctorProfile) {
        appointments = await Appointment.find({ doctorId: doctorProfile._id }).sort({ createdAt: -1 });
      } else {
        // Fallback to all if not linked yet
        appointments = await Appointment.find({}).sort({ createdAt: -1 });
      }
    } else {
      // Admin gets everything
      appointments = await Appointment.find({}).sort({ createdAt: -1 });
    }

    return res.json(appointments);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error retrieving appointments', error: error.message });
  }
};

export const updateAppointmentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body; // 'approved' | 'cancelled' | 'pending'
    const { id } = req.params;

    if (!status || !['approved', 'cancelled', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Patients can only cancel their own appointments
    if (req.user.role === 'patient') {
      if (appointment.patientId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      if (status !== 'cancelled') {
        return res.status(403).json({ message: 'Patients can only cancel appointments' });
      }
    }

    appointment.status = status;
    await appointment.save();

    return res.json({
      message: `Appointment status updated to ${status}`,
      appointment
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error updating appointment status', error: error.message });
  }
};

export const cancelAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check ownership
    if (req.user.role === 'patient' && appointment.patientId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Doctors can cancel their own, Admins can do anything
    if (req.user.role === 'doctor') {
      const doc = await Doctor.findOne({ userId: req.user.id });
      if (doc && appointment.doctorId.toString() !== doc._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    await Appointment.findByIdAndDelete(id);
    return res.json({ message: 'Appointment deleted/cancelled successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error deleting appointment', error: error.message });
  }
};
