# my-fullstack-lab

A personal fullstack laboratory for practicing and building creative web ideas. This repository provides a complete development environment with a React frontend and Node.js/Express backend.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose (optional, for containerized development)

### Running Locally

1. **Clone the repository**
```bash
git clone https://github.com/kwonbongjun/my-fullstack-lab.git
cd my-fullstack-lab
```

2. **Start the Backend**
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The backend will run on http://localhost:3001

3. **Start the Frontend** (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:5173

### Using Docker

To run both frontend and backend with Docker:

```bash
docker-compose up
```

This will start both services in containers:
- Backend: http://localhost:3001
- Frontend: http://localhost:5173

## 📁 Project Structure

```
my-fullstack-lab/
├── backend/          # Express.js API server
│   ├── server.js     # Main server file
│   ├── package.json  # Backend dependencies
│   └── README.md     # Backend documentation
├── frontend/         # React + Vite application
│   ├── src/          # Source files
│   ├── package.json  # Frontend dependencies
│   └── README.md     # Frontend documentation
├── .gitignore
├── LICENSE
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **ESLint** - Code linting

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 🎯 Features

- Hot module replacement (HMR) for rapid development
- Backend API with example endpoints
- Frontend-backend integration examples
- CORS configured for local development
- Development and production modes

## 📚 Available Endpoints

### Backend API

- `GET /health` - Health check endpoint
- `GET /api/hello` - Example GET endpoint
- `POST /api/data` - Example POST endpoint

## 🧪 Development

### Backend
```bash
cd backend
npm run dev    # Start with hot reload
npm start      # Start production server
```

### Frontend
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run linting
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

This is a personal learning lab, but feel free to fork and create your own version!
