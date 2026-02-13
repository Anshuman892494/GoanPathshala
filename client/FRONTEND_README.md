# 🎨 ExamPoint Frontend Documentation

Welcome to the frontend of **ExamPoint**, a modern and responsive web application designed for a seamless examination experience. This application is built using **React 19**, **Vite**, and **Tailwind CSS 4**.

## 📑 Table of Contents
1. [Overview](#-overview)
2. [Tech Stack](#-tech-stack)
3. [Getting Started](#-getting-started)
4. [Project Structure](#-project-structure)
5. [Routing & Access Control](#-routing--access-control)
6. [API Integration](#-api-integration)
7. [Design System](#-design-system)

---

## 🌟 Overview
The ExamPoint frontend provides an intuitive interface for students to take exams, view results, and track their rankings. It also features a robust Admin Panel for managing exams, students, and system settings.

### Key Features:
- **Guest & Student Login**: Secure entry for both registered students and temporary guests.
- **Dynamic Exam Interface**: Smooth exam-taking experience with real-time timers and security checks.
- **Interactive Leaderboard**: View global rankings and performance metrics.
- **Admin Dashboard**: Comprehensive tools for institution administrators.

---

## 💻 Tech Stack
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [Material Symbols](https://fonts.google.com/icons) & [React Icons](https://react-icons.github.io/react-icons/)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)

### Installation
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
- **Development Server**:
  ```bash
  npm run dev
  ```
- **Build for Production**:
  ```bash
  npm run build
  ```
- **Preview Production Build**:
  ```bash
  npm run preview
  ```

---

## 📂 Project Structure

```
client/
├── src/
│   ├── assets/         # Images, global fonts, and styles
│   ├── components/     # Reusable UI components (Navbar, Sidebar, etc.)
│   ├── pages/          # Main page components and views
│   │   ├── Admin/      # Admin-only pages
│   │   └── Exams/      # Exam-related pages (Attempt, List, Result)
│   ├── services/       # API interaction layer (Axios instance)
│   ├── utils/          # Helper functions and global constants
│   ├── App.jsx         # Main application component & routing
│   └── main.jsx        # Application entry point
├── public/             # Static assets
└── tailwind.config.js  # Tailwind CSS configuration
```

---

## 🛤 Routing & Access Control
The application uses **React Router** for navigation. Most routes are protected by a `PrivateRoute` component.

### Access Levels:
- **Student**: Full access to all student features including Notes and Class Tests.
- **Guest**: Limited access (Dashboard, All Exam, and Leaderboard only).
- **Admin**: Access to the specialized `/admin` routes for management.

---

## 🔌 API Integration
All backend communication is centralized in `src/services/examApi.js`. 
- An **Axios instance** is configured with the base API URL from environment variables.
- **Interceptors** are used to automatically attach Admin/Student JWT tokens to outgoing requests.

---

## 🎨 Design System
- **Responsive Layout**: Designed to work across desktops, tablets, and mobile devices.
- **Modern Aesthetics**: Utilizes deep grays, vibrant reds, and subtle glassmorphism for a premium feel.
- **Typography**: Focused on readability using system-default sans-serif fonts.

---

Developed by **Advance Computer Career Institute**.
