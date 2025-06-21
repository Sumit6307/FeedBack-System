Lightweight Feedback System
Overview
A lightweight feedback system for internal use, allowing managers to provide structured feedback to employees and employees to view/acknowledge feedback.
Features

Authentication with JWT (Manager/Employee roles)
Feedback submission (strengths, areas to improve, sentiment)
Feedback visibility and editing
Manager dashboard with team overview
Employee dashboard with feedback timeline
Markdown support for comments
In-app notifications

Tech Stack

Backend: FastAPI (Python), MongoDB
Frontend: React.js, Tailwind CSS
Database: MongoDB
Containerization: Docker

Setup Instructions
Prerequisites

Docker and Docker Compose
Node.js (for frontend development)

Backend

Navigate to backend/:cd backend


Create .env:MONGODB_URL=mongodb://mongo:27017
JWT_SECRET=your-secret-key


Run:docker-compose up



Frontend

Navigate to frontend/:cd frontend


Install dependencies:npm install


Start frontend:npm start



Usage

Register users via API (e.g., using Postman):
POST /api/users with { "email": "", "password": "", "name": "", "role": "manager/employee", "manager_id": "" }


Login at http://localhost:3000/.
Managers can submit feedback; employees can view/acknowledge feedback.

Notes

Backend runs on http://localhost:8000.
Frontend runs on http://localhost:3000.
Ensure MongoDB is accessible in Docker Compose.

