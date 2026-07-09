import { Request, Response } from 'express';
import Doctor from '../models/Doctor';
import { AuthRequest } from '../middleware/authMiddleware';

export const getDoctors = async (req: Request, res: Response) => {
  try {
    const { search, specialty, location, maxFee, sortBy, page = '1', limit = '10' } = req.query;

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialty: { $regex: search, $options: 'i' } },
        { degrees: { $regex: search, $options: 'i' } }
      ];
    }

    if (specialty) {
      query.specialty = specialty;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (maxFee) {
      query.visitingFee = { $lte: Number(maxFee) };
    }

    // Sorting
    let sortOptions: any = {};
    if (sortBy === 'fee_low') {
      sortOptions.visitingFee = 1;
    } else if (sortBy === 'fee_high') {
      sortOptions.visitingFee = -1;
    } else if (sortBy === 'rating') {
      sortOptions.rating = -1;
    } else {
      sortOptions.createdAt = -1; // default sort
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.max(1, parseInt(limit as string));
    const skipNum = (pageNum - 1) * limitNum;

    const total = await Doctor.countDocuments(query);
    const doctors = await Doctor.find(query)
      .sort(sortOptions)
      .skip(skipNum)
      .limit(limitNum);

    return res.json({
      doctors,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum)
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error retrieving doctors', error: error.message });
  }
};

export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    return res.json(doctor);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error retrieving doctor profile', error: error.message });
  }
};

export const addDoctor = async (req: AuthRequest, res: Response) => {
  try {
    const { name, specialty, degrees, visitingFee, location, chamber, schedule, imageUrl, description } = req.body;

    if (!name || !specialty || !degrees || !visitingFee || !location || !chamber || !schedule || !imageUrl || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newDoctor = new Doctor({
      userId: req.user?.role === 'doctor' ? req.user.id : undefined, // link to user if logged in doctor is adding it
      name,
      specialty,
      degrees,
      visitingFee: Number(visitingFee),
      location,
      chamber,
      schedule: Array.isArray(schedule) ? schedule : [schedule],
      imageUrl,
      description,
      rating: 5,
      reviewsCount: 0,
      reviews: []
    });

    await newDoctor.save();

    return res.status(201).json({
      message: 'Doctor profile added successfully',
      doctor: newDoctor
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error adding doctor profile', error: error.message });
  }
};

export const addDoctorReview = async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment } = req.body;
    const doctorId = req.params.id;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Please provide rating and comment' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const newReview = {
      patientId: req.user?.id as any,
      patientName: req.user?.email.split('@')[0] || 'Anonymous', // fall back if no name
      rating: Number(rating),
      comment,
      createdAt: new Date()
    };

    // If user's name is saved in database, fetch user
    const user = await mongoose.model('User').findById(req.user?.id);
    if (user) {
      newReview.patientName = user.name;
    }

    doctor.reviews.push(newReview);
    doctor.reviewsCount = doctor.reviews.length;
    
    // Recalculate average rating
    const totalRating = doctor.reviews.reduce((acc, curr) => acc + curr.rating, 0);
    doctor.rating = Number((totalRating / doctor.reviews.length).toFixed(1));

    await doctor.save();

    return res.status(201).json({
      message: 'Review added successfully',
      reviews: doctor.reviews,
      rating: doctor.rating,
      reviewsCount: doctor.reviewsCount
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error adding review', error: error.message });
  }
};
import mongoose from 'mongoose';
