# ShebaBD Backend API

A Node.js + Express.js + Mongoose + TypeScript backend service for a premium Doctor Appointment System.

## Features
- JWT based Authentication (Register, Login, Session)
- Advanced doctor profile directories (Chambers, Ratings)
- Dynamic patient slot bookings (Chamber / Telemedicine)
- Recharts daily consultations statistics aggregator
- Auto In-Memory MongoDB Server fallback for zero-configuration testing

## Prerequisites
- Node.js (LTS version)
- NPM

## Installation & Setup
1. Install backend dependencies:
   ```bash
   npm install
   ```
2. Configure `.env` file details:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/sheba_doctor_db
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```


## Core Technologies
- Node.js
- Express.js
- Mongoose (MongoDB ODM)
- TypeScript
- Dotenv (Environment loader)