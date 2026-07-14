# ShebaBD - Backend API Gateway & Server

A secure, scalable Node.js + Express.js + Mongoose + TypeScript API gateway for the **ShebaBD Doctor Appointment System**. 

---

## 🔗 Live Deployment & Repository Links
* **Live API Server**: [https://sheba-bd-backend.vercel.app](https://sheba-bd-backend.vercel.app)
* **GitHub Repository**: [https://github.com/Saad7528/Sheba_bd_backend](https://github.com/Saad7528/Sheba_bd_backend)

---

## 🚀 Features
1. **Google OAuth Token Verification**: Securely verifies Google ID tokens using the official `google-auth-library` and signs JWT sessions.
2. **Role Guards Middleware**: Protects sensitive endpoints with role-based access checkers (`requireRole(['doctor', 'admin'])`).
3. **Database Seeding**: Commands to automatically seed mock user records, doctor profiles, and appointment analytics history.
4. **Digital Prescriptions API**: Fully manages digital prescription updates with strict ownership validation check guards.
5. **Robust Schema Validations**: Built on **Mongoose** schemas validating email formats, credentials, and schedule constraints.

---

## 🛠️ API Reference Endpoints

### 1. Authentication (`/api/auth`)
* `POST /api/auth/register` - Create a standard account.
* `POST /api/auth/login` - Local email/password login.
* `POST /api/auth/google` - Verifies Google idToken and generates session token.
* `GET /api/auth/me` - Get current session profile.

### 2. Doctors (`/api/doctors`)
* `GET /api/doctors` - Query doctor listings with pagination and filters (search, division, specialty, maxFee).
* `GET /api/doctors/:id` - Fetch doctor profile detail.
* `POST /api/doctors` - Register new profile (Admin only).
* `PUT /api/doctors/:id` - Update profile data (Admin or Owner Doctor).
* `DELETE /api/doctors/:id` - Remove profile (Admin only).
* `POST /api/doctors/:id/reviews` - Add a rating & review (Treated Patient only).

### 3. Appointments (`/api/appointments`)
* `POST /api/appointments` - Book a slot.
* `GET /api/appointments` - Lists user appointments (filters based on role).
* `PUT /api/appointments/:id/status` - Approve or cancel slot status.
* `PUT /api/appointments/:id/prescription` - Add/update prescription notes (Admin or Assigned Doctor).
* `DELETE /api/appointments/:id` - Delete/cancel appointment booking.

### 4. Stats (`/api/stats`)
* `GET /api/stats/overview` - Basic summary counts.
* `GET /api/stats/weekly` - Weekly appointment count history.

---

## 🛠️ Installation & Local Setup

### 1. Configure Env Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sheba_doctor_db
JWT_SECRET=your_jwt_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 2. Start Application
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run database seeder to populate mock statistics and accounts:
   ```bash
   npm run seed
   ```
3. Start local hot-reload server:
   ```bash
   npm run dev
   ```
   *The REST API will be running locally at [http://localhost:5000](http://localhost:5000).*

---

## 💻 Tech Stack
* **Language**: TypeScript
* **Server**: Node.js & Express.js
* **Database**: MongoDB & Mongoose ODM
* **Auth**: JSON Web Tokens & Google Auth Library
* **Password Hashing**: Bcryptjs

---

## 📄 License
Licensed under the [MIT License](LICENSE).
