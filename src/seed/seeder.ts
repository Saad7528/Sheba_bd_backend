import bcrypt from 'bcryptjs';
import User from '../models/User';
import Doctor from '../models/Doctor';
import Appointment from '../models/Appointment';

export const seedDatabase = async () => {
  try {
    // 1. Check if we already have users. If yes, skip seeding users to prevent duplication
    const userCount = await User.countDocuments({});
    if (userCount > 0) {
      console.log('Database already has users. Skipping seeding.');
      return;
    }

    console.log('Seeding initial database data...');

    // 2. Clear existing collections just to be clean
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});

    // 3. Create demo users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const demoPatient = new User({
      name: 'Rahim Uddin',
      email: 'patient@healthbd.com',
      password: hashedPassword,
      role: 'patient'
    });

    const demoDoctor = new User({
      name: 'Prof. Dr. M. A. Baqui',
      email: 'doctor@healthbd.com',
      password: hashedPassword,
      role: 'doctor'
    });

    const demoAdmin = new User({
      name: 'System Admin',
      email: 'admin@healthbd.com',
      password: hashedPassword,
      role: 'admin'
    });

    await demoPatient.save();
    await demoDoctor.save();
    await demoAdmin.save();

    console.log('Seeded Users: Patient, Doctor, Admin.');

    // 4. Create doctor profiles
    const doctors = [
      {
        userId: demoDoctor._id,
        name: 'Prof. Dr. M. A. Baqui',
        specialty: 'Cardiology',
        degrees: 'MBBS, MD (Cardiology), FCPS (Medicine), FACC',
        visitingFee: 1000,
        location: 'Dhaka',
        chamber: 'Labaid Specialized Hospital, Dhanmondi',
        schedule: [
          'Saturday: 05:00 PM - 08:00 PM',
          'Monday: 05:00 PM - 08:00 PM',
          'Wednesday: 05:00 PM - 08:00 PM'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
        description: 'Professor Baqui is a leading cardiologist in Bangladesh with over 20 years of experience. He specializes in interventional cardiology, coronary angiogram, angioplasty, and pacemaker implantations.',
        rating: 4.9,
        reviewsCount: 3,
        reviews: [
          {
            patientId: demoPatient._id,
            patientName: 'Kamil Hossain',
            rating: 5,
            comment: 'Very professional and polite. Explained my ECG reports clearly.',
            createdAt: new Date('2026-07-01')
          },
          {
            patientId: demoPatient._id,
            patientName: 'Selina Begum',
            rating: 5,
            comment: 'The best cardiologist in Dhaka. Under his treatment, my father has recovered remarkably.',
            createdAt: new Date('2026-07-03')
          },
          {
            patientId: demoPatient._id,
            patientName: 'Tariqul Anam',
            rating: 4,
            comment: 'Highly experienced doctor, but the chamber queue was a bit long.',
            createdAt: new Date('2026-07-05')
          }
        ]
      },
      {
        name: 'Dr. Tasnim Ara',
        specialty: 'Gynecology',
        degrees: 'MBBS, MS (OBGYN), FCPS',
        visitingFee: 1200,
        location: 'Chattogram',
        chamber: 'Evercare Hospital, Anannya R/A',
        schedule: [
          'Sunday: 04:00 PM - 07:00 PM',
          'Tuesday: 04:00 PM - 07:00 PM',
          'Thursday: 04:00 PM - 07:00 PM'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400',
        description: 'Dr. Tasnim Ara is a dedicated Gynecologist and Obstetrician in Chattogram. She provides compassionate prenatal care, handles high-risk pregnancies, and specializes in laparoscopic gynecological surgeries.',
        rating: 4.8,
        reviewsCount: 2,
        reviews: [
          {
            patientId: demoPatient._id,
            patientName: 'Nusrat Jahan',
            rating: 5,
            comment: 'Dr. Tasnim is very friendly and supportive. Highly recommended for maternal health advice.',
            createdAt: new Date('2026-07-02')
          },
          {
            patientId: demoPatient._id,
            patientName: 'Jannatul Fardous',
            rating: 5,
            comment: 'Exceptional service and caring attitude. Evercare facilities were top-notch too.',
            createdAt: new Date('2026-07-04')
          }
        ]
      },
      {
        name: 'Dr. Md. Rafiqul Islam',
        specialty: 'Pediatrics',
        degrees: 'MBBS, DCH, MD (Pediatrics)',
        visitingFee: 800,
        location: 'Dhaka',
        chamber: 'Ibn Sina Diagnostic Center, Badda',
        schedule: [
          'Saturday: 10:00 AM - 01:00 PM',
          'Sunday: 10:00 AM - 01:00 PM',
          'Tuesday: 10:00 AM - 01:00 PM'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
        description: 'Dr. Rafiqul is a child specialist offering pediatric care, newborn health supervision, immunizations, and growth monitoring. He has a child-friendly chamber environment to ease young patients.',
        rating: 4.7,
        reviewsCount: 2,
        reviews: [
          {
            patientId: demoPatient._id,
            patientName: 'Imran Ahmed',
            rating: 5,
            comment: 'He is great with kids. My son was not scared at all during the checkup.',
            createdAt: new Date('2026-07-02')
          },
          {
            patientId: demoPatient._id,
            patientName: 'Mitu Rahman',
            rating: 4,
            comment: 'Very helpful medicine prescriptions. Got cured in three days.',
            createdAt: new Date('2026-07-06')
          }
        ]
      },
      {
        name: 'Dr. Syeda Nawsheen',
        specialty: 'Dermatology',
        degrees: 'MBBS, DDV (Dermatology & Venereology)',
        visitingFee: 700,
        location: 'Sylhet',
        chamber: 'Popular Medical Center, Subhanighat',
        schedule: [
          'Monday: 03:00 PM - 06:00 PM',
          'Wednesday: 03:00 PM - 06:00 PM'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
        description: 'Dr. Nawsheen is a consultant dermatologist specializing in skin, hair, and nail conditions. She offers treatments for acne, eczema, psoriasis, hair loss, and cosmetic laser therapy.',
        rating: 4.6,
        reviewsCount: 1,
        reviews: [
          {
            patientId: demoPatient._id,
            patientName: 'Fahad Chowdhury',
            rating: 5,
            comment: 'Affordable fee and very effective skin treatment. My eczema cleared up within a week.',
            createdAt: new Date('2026-07-05')
          }
        ]
      },
      {
        name: 'Prof. Dr. Ashis Kumar',
        specialty: 'Neurology',
        degrees: 'MBBS, MD (Neurology), Fellowship in Stroke (Singapore)',
        visitingFee: 1500,
        location: 'Dhaka',
        chamber: 'Square Hospitals, Panthapath',
        schedule: [
          'Tuesday: 06:00 PM - 09:00 PM',
          'Thursday: 06:00 PM - 09:00 PM'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
        description: 'Professor Ashis is a senior Neurologist specializing in brain disorders, stroke management, Parkinson Disease, chronic migraines, epilepsy, and spinal cord disorders.',
        rating: 4.9,
        reviewsCount: 2,
        reviews: [
          {
            patientId: demoPatient._id,
            patientName: 'Mahmudul Hasan',
            rating: 5,
            comment: 'Highly scholarly doctor. His diagnosis saved me from unnecessary medications.',
            createdAt: new Date('2026-07-04')
          },
          {
            patientId: demoPatient._id,
            patientName: 'Rasheda Khatun',
            rating: 5,
            comment: 'We travel from Rangpur to seek his treatment. Highly recommended stroke consultant.',
            createdAt: new Date('2026-07-08')
          }
        ]
      },
      {
        name: 'Dr. Farhana Chowdhury',
        specialty: 'General Medicine',
        degrees: 'MBBS, FCPS (Internal Medicine)',
        visitingFee: 600,
        location: 'Khulna',
        chamber: 'Gazi Medical College Hospital, Khulna',
        schedule: [
          'Saturday: 02:00 PM - 05:00 PM',
          'Monday: 02:00 PM - 05:00 PM',
          'Wednesday: 02:00 PM - 05:00 PM'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400',
        description: 'Dr. Farhana is a consultant in Internal Medicine. She treats general ailments, diabetes, hypertension, asthma, thyroid disorders, and infectious diseases.',
        rating: 4.5,
        reviewsCount: 1,
        reviews: [
          {
            patientId: demoPatient._id,
            patientName: 'Abul Kalam',
            rating: 4,
            comment: 'Very patient-friendly doctor, listens to symptoms attentively.',
            createdAt: new Date('2026-07-07')
          }
        ]
      }
    ];

    await Doctor.insertMany(doctors);
    console.log('Seeded Doctor Profiles successfully!');

    // 5. Seed some initial appointments to populate stats & charts
    const dbDoctors = await Doctor.find({});
    
    // Create 7 past dates and seed 15 appointments to show charts
    const appointmentBatch = [];
    const patientPhones = ['01712345678', '01812345678', '01912345678', '01512345678', '01612345678'];
    const patientNames = ['Zafar Iqbal', 'Nafis Ahmed', 'Lutfur Rahman', 'Rezaul Karim', 'Nasreen Akhter'];

    for (let i = 0; i < 15; i++) {
      // Pick random doctor
      const doc = dbDoctors[i % dbDoctors.length];
      
      // Pick date offset (from 6 days ago to today)
      const offset = i % 7;
      const d = new Date();
      d.setDate(d.getDate() - offset);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const date = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${date}`;

      appointmentBatch.push({
        patientId: demoPatient._id,
        patientName: patientNames[i % patientNames.length],
        patientEmail: `patient${i}@example.com`,
        patientPhone: patientPhones[i % patientPhones.length],
        doctorId: doc._id,
        doctorName: doc.name,
        doctorSpecialty: doc.specialty,
        appointmentDate: dateStr,
        timeSlot: doc.schedule[0],
        visitingFee: doc.visitingFee,
        status: i % 4 === 0 ? 'approved' : i % 7 === 0 ? 'cancelled' : 'pending',
        notes: 'General health checkup and consultation.',
        createdAt: d
      });
    }

    await Appointment.insertMany(appointmentBatch);
    console.log('Seeded mock appointments for dashboard graphs!');
    console.log('Database seeding successfully finished.');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
};
