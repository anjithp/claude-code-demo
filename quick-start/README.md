# Task Management System

A full-stack TypeScript application demonstrating Claude Code's capabilities through a CRUD task management system.

## Project Overview

This project showcases various Claude Code features including:
- Code generation and scaffolding
- File operations and navigation
- Testing and debugging
- Git operations
- Refactoring and optimization
- Documentation generation


## Getting Started

### Prerequisites
- Node.js v20 or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
cd quick-start
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### Running the Application

#### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:4000

#### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:3000

### Running Tests

#### Backend Tests
```bash
cd backend
npm test
```

## Troubleshooting

### Backend won't start
- Ensure Node.js v20 is installed
- Check if port 4000 is available
- Verify all dependencies are installed

### Frontend can't connect to backend
- Ensure backend is running on port 4000
- Check Vite proxy configuration
- Verify CORS settings

### Database errors
- Delete `database.sqlite` and restart
- Check Sequelize model definitions
- Verify database configuration

## Environment Variables

### Backend (.env)
```
PORT=4000
NODE_ENV=development
DB_STORAGE=./database.sqlite
```
