import express from 'express';
import { db } from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';

const authenticate = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/', (req, res) => {
  try {
    const settings = db.prepare('SELECT * FROM settings LIMIT 1').get();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.put('/', authenticate, (req, res) => {
  const { about_text, portfolio_url, collaborations_url, projects_url } = req.body;

  try {
    db.prepare(`
      UPDATE settings
      SET about_text = ?, portfolio_url = ?, collaborations_url = ?, projects_url = ?
      WHERE id = (SELECT id FROM settings LIMIT 1)
    `).run(about_text, portfolio_url, collaborations_url, projects_url);

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

router.post('/demo', authenticate, (req, res) => {
  try {
    db.prepare(`
      UPDATE settings
      SET about_text = ?, portfolio_url = ?, collaborations_url = ?, projects_url = ?
      WHERE id = (SELECT id FROM settings LIMIT 1)
    `).run(
      'Looking for more? Explore my portfolio, past collaborations, and side projects. Whether it is design, tech, or creative experiments, there is always something exciting to share.',
      'https://example.com/portfolio',
      'https://example.com/collaborations',
      'https://example.com/projects'
    );

    res.json({ message: 'Demo settings generated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to generate demo settings', details: error.message });
  }
});

export default router;
