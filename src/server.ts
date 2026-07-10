import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { seedDatabase } from './seed/seeder';

// Import Routes
import authRoutes from './routes/authRoutes';
import doctorRoutes from './routes/doctorRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import statsRoutes from './routes/statsRoutes';

import path from 'path';

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
const envResult = dotenv.config({ path: envPath });
console.log('[DEBUG] Loading .env from:', envPath);
if (envResult.error) {
  console.error('[DEBUG] Dotenv error:', envResult.error);
} else {
  console.log('[DEBUG] Dotenv loaded. MONGODB_URI length:', process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*', // allows simple local dev connections
  credentials: true
}));

// Body parsing middleware
app.use(express.json());

// Routes Mounts
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/stats', statsRoutes);

// Simple Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Boot Server
const startServer = async () => {
  // Connect to Database
  await connectDB();
  
  // Seed Database with initial dataset
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
  });
};

startServer();

export default app;
