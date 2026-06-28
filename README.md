# UniTrack – Smart Campus Management Platform

A full-stack campus utility app with Student and Admin portals.

## Tech Stack
- **Backend**: Node.js + Express (in-memory data, no DB needed)
- **Frontend**: React + React Router

## Demo Accounts
| Role    | Email                    | Password    |
|---------|--------------------------|-------------|
| Admin   | admin@unitrack.edu       | admin123    |
| Student | rahul@unitrack.edu       | student123  |
| Student | anjali@unitrack.edu      | student123  |

## Features

### Student Portal
- 🏠 Dashboard with attendance overview, upcoming deadlines, notices
- 📅 Weekly timetable with color-coded subjects
- 📝 Assignments – view, submit, see grades
- ✅ Attendance per subject with warnings below 75%
- 📚 Study notes filtered by subject
- 📢 Notices with category and priority filters

### Admin Portal
- 🏠 Dashboard with stats and pending grading alerts
- 📢 Create/delete notices (category, priority)
- 📅 Manage timetable – add/remove classes
- 📝 Create assignments, view submissions, grade students
- 📚 Upload/manage study notes
- 👥 View all students + their attendance

## Running Locally

### Backend
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

### Frontend (dev)
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
# Proxies API calls to :5000 automatically
```

### Frontend (production build)
```bash
cd frontend
npm run build
# Serve the build/ folder with any static server
```
