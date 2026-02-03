# Frontend

A React + Vite frontend for the fullstack lab.

## Getting Started

1. Install dependencies (if not already installed):
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will run on http://localhost:5173

## Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build the production bundle
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## Backend Integration

The frontend connects to the backend API at http://localhost:3001. Make sure the backend server is running to see full functionality.

---

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
