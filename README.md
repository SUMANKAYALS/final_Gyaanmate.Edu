# Gyaanmate — Global Learning Platform

AI-powered online learning platform (Udemy/Coursera-style) with semantic search, instructor dashboards, payments, and PDF receipts.

## Tech Stack

- **Frontend:** React (Vite), TailwindCSS, Framer Motion, Lucide Icons, Zustand, Axios
- **Backend:** Node.js, Express, MongoDB, JWT, Google Gemini AI, PDFKit

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`)

### Install

```bash
npm run install:all
```

### Seed database

```bash
npm run seed
```

### Run (client + server)

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@learnhub.ai | admin123 |
| Instructor | instructor1@learnhub.ai | instructor123 |

## AI Search

Click the AI search bar on the homepage and try:

- "Show me React courses"
- "Best AI courses for beginners"

Set `GEMINI_API_KEY` in `server/.env` for AI-powered search and chat ([get a free key](https://aistudio.google.com/apikey)).

## Features

- 17+ global course categories
- AI chat-style course discovery
- Student / Instructor / Admin dashboards
- Course upload, video curriculum, progress tracking
- Checkout + downloadable PDF receipts
- Dark glassmorphism UI with Framer Motion
