# Full-Stack Application

A modern full-stack application with Node.js backend and React frontend using Vite.

## Tech Stack

- **Backend**: Node.js 24.x (LTS) with Express
- **Frontend**: React 19.2.1 with Vite
- **Package Manager**: npm

## Project Structure

```
try_cursor/
├── backend/          # Node.js Express backend
│   ├── server.js     # Main server file
│   └── package.json  # Backend dependencies
├── frontend/         # React + Vite frontend
│   ├── src/          # React source files
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
└── package.json      # Root package.json with scripts

```

## Prerequisites

- Node.js 24.x (LTS) installed
- npm installed
- WSL 2 (if using Windows)

## Setup Instructions

### 1. Install Dependencies

From the project root, run:

```bash
npm run install-all
```

Or install manually:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Backend (Optional)

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
```

### 3. Run the Application

#### Option 1: Run both servers together
```bash
npm run dev
```

#### Option 2: Run servers separately

Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
npm run client
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Available Scripts

- `npm run dev` - Run both backend and frontend concurrently
- `npm run server` - Run backend server only
- `npm run client` - Run frontend development server only
- `npm run install-all` - Install all dependencies
- `npm run build` - Build frontend for production

## Backend API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/hello` - Hello message with Node.js version

## Development Notes

- The frontend is configured to proxy `/api` requests to the backend (http://localhost:5000)
- Backend uses ES modules (`type: "module"` in package.json)
- Frontend uses Vite for fast development and building

## Troubleshooting

### WSL Issues

If you encounter WSL-related issues:

1. Ensure Node.js is installed in your WSL distribution:
   ```bash
   wsl
   node --version
   npm --version
   ```

2. If Node.js is not installed in WSL, install it:
   ```bash
   wsl
   curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. The workspace is configured to use WSL as the default terminal (see `.vscode/settings.json`)


