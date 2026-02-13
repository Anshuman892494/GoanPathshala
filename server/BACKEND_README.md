# 🚀 ExamPoint Backend Documentation

Welcome to the backend of **ExamPoint**, a powerful and secure online examination platform. This server-side application is built using **Node.js**, **Express**, and **MongoDB**.

## 📑 Table of Contents
1. [Overview](#-overview)
2. [Project Architecture](#-project-architecture)
3. [Getting Started](#-getting-started)
4. [Folder Structure](#-folder-structure)
5. [API Reference](#-api-reference)
6. [Database Models](#-database-models)
7. [Authentication Flow](#-authentication-flow)

---

## 🏗 Overview
The backbone of ExamPoint handles user authentication (Students, Guests, and Admins), exam management, secure exam submission, real-time results, and performance tracking via leaderboards.

### Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Email**: Resend / Nodemailer
- **Authentication**: JWT (JSON Web Tokens) & Bcryptjs

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or local MongoDB instance

### Installation
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration
Create a `.env` file in the `server` directory and add the following:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_api_key (optional for emails)
```

### Running the Server
- **Development Mode**:
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

---

## 📂 Folder Structure

```
server/
├── server.js           # Entry point (connects DB & starts server)
├── src/
│   ├── app.js          # Express app configuration & middleware
│   ├── config/         # Database & environment configurations
│   ├── controllers/    # Route handler logic
│   ├── middleware/     # Auth & validation middleware
│   ├── models/         # Mongoose schemas (Admin, Student, Exam, etc.)
│   ├── routes/         # API endpoint definitions
│   └── utils/          # Utility functions (sending emails, constants)
```

---

## 📡 API Reference

### 🔐 Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/students/login` | Student login (RegNo & Password) |
| `POST` | `/api/session/start` | Guest session start (Name only) |
| `POST` | `/api/admin/login` | Admin login |

### 📝 Exam Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/exams` | Fetch all active exams |
| `GET` | `/api/exams/:id` | Get specific exam details |
| `POST` | `/api/exams/:id/verify-key` | Verify exam access key |
| `POST` | `/api/exams` | Create new exam (Admin) |

### 🏆 Results & Leaderboards
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/results/submit` | Submit exam answers |
| `GET` | `/api/results/:id` | Fetch specific result details |
| `GET` | `/api/results/leaderboard` | Get monthly global leaderboard |

### 👥 Student Management (Admin)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/students` | Add a new student |
| `GET` | `/api/students` | List all students |
| `POST` | `/api/students/bulk` | Bulk import students via JSON |

---

## 🗄 Database Models

### Core Entities:
- **Admin**: System administrators with full access.
- **Student**: Registered students with permanent records.
- **Guest (Session)**: Temporary users for quick sessions.
- **Exam**: Contains questions, timing, and security keys.
- **Result**: Links students/guests to their performance in an exam.

---

## 🛡 Authentication Flow

### Student/Admin Flow:
1. User provides credentials.
2. Server validates via **Bcrypt**.
3. Server issues a **JWT** token.
4. Client stores token and includes it in `Authorization: Bearer <token>` headers for protected routes.

### Guest Flow:
1. Guest provides a name.
2. Server generates a unique **Registration Number** and **Session ID**.
3. Session is tracked in the database but expires after a set period.

---

Developed by **Advance Computer Career Institute**.
