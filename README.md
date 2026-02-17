# 🎓 शिक्षाSetu

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![React](https://img.shields.io/badge/frontend-React_19-61DAFB?logo=react)
![Node](https://img.shields.io/badge/backend-Node.js-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/database-MongoDB-47A248?logo=mongodb)
![Vite](https://img.shields.io/badge/build-Vite-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/styling-Tailwind_CSS_4-38B2AC?logo=tailwindcss)

> **A modern, secure, and responsive online examination platform.**

Welcome to **शिक्षाSetu**, a comprehensive solution for managing and conducting online exams. This repository houses the source code for the application, featuring a robust Node.js/Express backend and a dynamic React frontend.

---

## Screenshot - Admin Dashboard
<img width="1920" height="1080" alt="image" src="https://github.com/Anshuman892494/GoanPathshala/blob/main/Screenshot%202026-02-17%20110824.png?raw=true" />


## 🌟 Overview

The application is split into two main parts:
- **Client**: A React-based Single Page Application (SPA) for the user interface.
- **Server**: A Node.js/Express API that handles business logic, authentication, and database interactions.

---

## ✨ Key Features

### 👩‍🎓 For Students
- **Dashboard**: View upcoming exams, past results, and performance analytics.
- **Secure Exam Interface**: Timed exams with full-screen mode and security checks.
- **Instant Results**: Immediate feedback and detailed score analysis.
- **Leaderboard**: Compete with peers and track global rankings.
- **Guest Access**: Quick exam sessions for temporary users without registration.

### 👨‍🏫 For Administrators
- **Exam Management**: Create, edit, and schedule exams with ease.
- **Student Database**: Manage student profiles and bulk import data.
- **Results & Analytics**: Comprehensive reports on student performance.
- **Security Control**: Manage exam access keys and session validation.

---

## 💻 Tech Stack

### Frontend (Client)
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **State/HTTP**: Axios

### Backend (Server)
- **Runtime**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) & Bcryptjs
- **Email Service**: Resend / Nodemailer

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)
- [Git](https://git-scm.com/)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Anshuman892494/शिक्षाSetu.git
    cd शिक्षाSetu
    ```

2.  **Install Dependencies**
    You need to install dependencies for both the `client` and `server` folders.

    **Client:**
    ```bash
    cd client
    npm install
    ```

    **Server:**
    ```bash
    cd ../server
    npm install
    ```

### Environment Variables

You need to configure environment variables for both applications.

**1. Client (.env)**
Create a file named `.env` in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

**2. Server (.env)**
Create a file named `.env` in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/शिक्षाSetu
JWT_SECRET=your_super_secret_key_change_this
RESEND_API_KEY=your_resend_api_key_optional
```

### Running the Application

To run the full stack application locally, you will need two terminal instances.

**Terminal 1: Start Backend**
```bash
cd server
npm run dev
```
> Server runs on [http://localhost:5000](http://localhost:5000)

**Terminal 2: Start Frontend**
```bash
cd client
npm run dev
```
> Client runs on [http://localhost:5173](http://localhost:5173) (typically)

---

## 📂 Project Structure

```bash
शिक्षाSetu/
├── client/                 # Frontend React Application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images and styles
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application views/pages
│   │   ├── services/       # API integration
│   │   ├── utils/          # Helper functions
│   │   ├── App.jsx         # Main component
│   │   └── main.jsx        # Entry point
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js      # Vite configuration
│   └── ...
├── server/                 # Backend Node.js Application
│   ├── src/
│   │   ├── config/         # DB config
│   │   ├── controllers/    # Route logic
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   └── ...
│   ├── server.js           # Server entry point
│   └── package.json        # Backend dependencies
└── README.md               # You are here!
```

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the ISC License. See `package.json` for more information.

---
