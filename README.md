<div align="center">

# 🎓 Gyaanmate

### The All-in-One Learning Ecosystem

**AI tools, top courses, study materials, and more — everything a student needs to grow, in one place.**

[![Live Demo](https://img.shields.io/badge/demo-live-8b5cf6?style=for-the-badge)](https://final-gyaanmate-edu.vercel.app)
[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-AI-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev)

[Live Demo](https://final-gyaanmate-edu.vercel.app) · [Features](#-core-features) · [Quick Start](#-quick-start) · [Tech Stack](#-tech-stack)

</div>

---

## 📖 Overview

Most "learning platforms" solve one problem at a time — a course catalog here, a note-sharing tool there, a chatbot bolted onto a UI somewhere else. **Gyaanmate is built on a different premise: learning is scattered, so the platform shouldn't be.**

It's a single ecosystem that unifies course discovery, AI tutoring, career guidance, interview prep, focus tools, and gamified habit-building — wrapped in a dark aurora glassmorphism interface designed to keep students in flow, not switching tabs.

<div align="center">
<table>
<tr>
<td align="center" width="20%">📚<br><b>Learn</b><br><sub>Courses, notes & study material in one library</sub></td>
<td align="center" width="20%">🤖<br><b>Get AI Help</b><br><sub>Semantic search, recommendations & live chat</sub></td>
<td align="center" width="20%">💼<br><b>Get Job-Ready</b><br><sub>Coding practice & AI mock interviews</sub></td>
<td align="center" width="20%">🎯<br><b>Stay Consistent</b><br><sub>Streaks, rewards & focus tools</sub></td>
<td align="center" width="20%">📊<br><b>Track Progress</b><br><sub>One dashboard for everything</sub></td>
</tr>
</table>
</div>

---

## 🖥️ Dashboard Preview

The home dashboard is mission control for a student's entire learning journey — continue-learning shortcuts, AI suggestions, streak tracking, upcoming mock tests, and one-click access to every tool below.

> *Add a screenshot or GIF of the dashboard here for maximum impact — e.g. `docs/dashboard-preview.png`*

---

## 🚀 Core Features

### 📚 Learning & Content

| Feature | Description |
|:---|:---|
| **Study Material** | Browse curated PDFs and notes shared by top students |
| **Notes Upload** | Upload and share your own study material with the community |
| **Image PDF → Text PDF** | OCR-powered conversion of scanned/handwritten notes into searchable PDFs |
| **AI Course Recommender** | Personalized course and material suggestions based on your goals |
| **AI Search** | Natural-language search that instantly matches you to the right content |

### 🤖 AI-Powered Learning

| Feature | Description |
|:---|:---|
| **Interactive Chat** | GyaanMate AI — an always-on tutor, ready for any question |
| **Live Teacher Session** | Real-time video classrooms with instructors |
| **Focus Assistance** | Personalized tools to help you stay on track while studying |

### 💼 Career & Practice

| Feature | Description |
|:---|:---|
| **Career Roadmap** | A personalized learning path toward your target career |
| **Coding Practice** | Interview-style problems with hidden test cases and instant feedback |
| **AI Mock Interview** | Practice interview questions and receive AI-driven feedback |
| **Mock Test Generator** | AI-generated mock assessments on demand |

### 🔥 Motivation & Engagement

| Feature | Description |
|:---|:---|
| **Gamified Streaks** | Build daily study habits and earn streak rewards |
| **Learning Progress** | Track milestones and completion across everything you're learning |

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="50%">

**Frontend**
- ⚛️ React (Vite)
- 🎨 TailwindCSS
- 🎬 Framer Motion
- 🧠 Zustand (state management)
- 🎯 Lucide Icons
- 🔌 Axios

</td>
<td valign="top" width="50%">

**Backend**
- 🟢 Node.js + Express
- 🍃 MongoDB
- 🔐 JWT Authentication
- ✨ Google Gemini AI
- 👁️ Tesseract.js (OCR)
- 📄 PDFKit

</td>
</tr>
</table>

**Project structure**

```
final_Gyaanmate.Edu/
├── client/    # React (Vite) frontend
├── server/    # Node.js + Express backend, MongoDB models, AI integrations
└── shared/    # Shared types/utilities between client and server
```

---

## ⚡ Quick Start

### Prerequisites

- Node.js `18+`
- MongoDB running locally (`mongodb://127.0.0.1:27017`)

### Installation

```bash
# 1. Install all dependencies (root, client, and server)
npm run install:all

# 2. Seed the database
npm run seed

# 3. Run client + server together
npm run dev
```

| Service | URL |
|:---|:---|
| Frontend | [http://localhost:5173](http://localhost:5173) |
| API | [http://localhost:5000](http://localhost:5000) |

Run each side independently if needed:

```bash
npm run dev:client   # frontend only
npm run dev:server   # backend only
```

### Enable AI Features

Add your Gemini API key to `server/.env`:

```env
GEMINI_API_KEY=your_key_here
```

Get a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

---

## 👤 Demo Accounts

| Role | Email | Password |
|:---|:---|:---|
| 🛡️ Admin | `gyaanmate.edu@gmail.com` | `admin123` |
| 🧑‍🏫 Instructor | `instructor1@learnhub.ai` | `instructor123` |

> ⚠️ These are demo credentials for local/testing use only — rotate or remove before any production deployment.

---

## 🧠 Try the AI Search

On the homepage, click the AI search bar and try:

- *"Show me React courses"*
- *"Best AI courses for beginners"*

---

## 🗺️ Roadmap

- [ ] Expand the AI mock interview engine with role-specific question banks
- [ ] Gemini Vision upgrade for the OCR pipeline
- [ ] Deeper analytics on the learning-progress dashboard
- [ ] Mobile-responsive polish across all feature panels

---

## 🤝 Contributing

This project is currently maintained as a solo/private build. If you'd like to collaborate, report a bug, or suggest a feature, please open an issue or reach out directly.

---

## 📄 License

This project is currently private/unlicensed. Contact the maintainer for usage or contribution inquiries.

---

<div align="center">

<sub>⭐ If Gyaanmate is useful to you, consider starring the repo!</sub>

</div>
