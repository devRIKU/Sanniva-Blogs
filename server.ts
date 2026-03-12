import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cookieParser from 'cookie-parser';
import { db, initDb } from './src/server/db.js';
import authRoutes from './src/server/routes/auth.js';
import postsRoutes from './src/server/routes/posts.js';
import settingsRoutes from './src/server/routes/settings.js';
import uploadRoutes from './src/server/routes/upload.js';
import fs from 'fs';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Initialize Database
  initDb();

  app.use(express.json());
  app.use(cookieParser());

  // Serve uploaded files
  app.use('/uploads', express.static(uploadsDir));

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/posts', postsRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/upload', uploadRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
