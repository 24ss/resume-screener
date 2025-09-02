# AI Powered Resume Analysis
# Link : https://1screener.netlify.app

![ars](https://github.com/user-attachments/assets/451fd3a0-995e-4d4f-af03-a9f9cbf75703)

This is a web app that helps job seekers understand and improve their resumes.  
It pulls out key skills, suggests career roles, gives a strength score, and highlights recruiter-friendly keywords — all in a simple, responsive interface.

---

## Tech Stack

### Backend
- Python, FastAPI, SQLAlchemy, SQLite  
- Resume parsing with python-docx and PyPDF2  

### AI
- OpenAI API for skill extraction, role suggestions, and scoring  

### Frontend
- React, TypeScript, Vite, TailwindCSS  
- React Router for navigation  
- Axios for API calls  

### Infra
- REST API with JSON responses  
- CORS enabled for smooth frontend ↔ backend integration  

---

## Features
- PDF and DOCX parsing with cleaning and normalization  
- AI-driven insights: skills, career roles, strength score, recruiter keywords  
- Stores past analyses in SQLite  
- Clean and responsive UI with drag & drop upload and results dashboard  

---

## Why
The idea is simple: most resumes get rejected without feedback.  
This project helps applicants see what’s missing and what can be improved, using data-driven insights instead of guesswork.
