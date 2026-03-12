import express from 'express';
import { db } from '../db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';

// Middleware to check authentication
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

// Get all posts (public)
router.get('/', (req, res) => {
  try {
    const posts = db.prepare('SELECT * FROM posts WHERE status = ? ORDER BY created_at DESC').all('Published');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get all posts (admin)
router.get('/admin', authenticate, (req, res) => {
  try {
    const posts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get single post by slug (public)
router.get('/:slug', (req, res) => {
  try {
    const post = db.prepare('SELECT * FROM posts WHERE slug = ? AND status = ?').get(req.params.slug, 'Published');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Get single post by id (admin)
router.get('/admin/:id', authenticate, (req, res) => {
  try {
    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Create post (admin)
router.post('/', authenticate, (req, res) => {
  const { title, slug, content, cover_image, tags, status, featured } = req.body;

  try {
    const result = db.prepare(`
      INSERT INTO posts (title, slug, content, cover_image, tags, status, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(title, slug, content, cover_image, tags, status, featured ? 1 : 0);

    res.status(201).json({ id: result.lastInsertRowid, message: 'Post created successfully' });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Update post (admin)
router.put('/:id', authenticate, (req, res) => {
  const { title, slug, content, cover_image, tags, status, featured } = req.body;

  try {
    db.prepare(`
      UPDATE posts
      SET title = ?, slug = ?, content = ?, cover_image = ?, tags = ?, status = ?, featured = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, slug, content, cover_image, tags, status, featured ? 1 : 0, req.params.id);

    res.json({ message: 'Post updated successfully' });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete post (admin)
router.delete('/:id', authenticate, (req, res) => {
  try {
    db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Generate Demo Content (admin)
router.post('/demo', authenticate, (req, res) => {
  try {
    // Clear existing posts
    db.prepare('DELETE FROM posts').run();

    const demoPosts = [
      {
        title: 'The Future of Web Design',
        slug: 'future-of-web-design',
        content: '<h2>Embracing the Unknown</h2><p>Web design is constantly evolving. From brutalism to neomorphism, the trends come and go, but the core principles remain the same: usability, accessibility, and aesthetics.</p><p>In this post, we explore what the next decade might look like for digital creators.</p><img src="https://picsum.photos/seed/design/800/400" alt="Design" />',
        cover_image: 'https://picsum.photos/seed/design/800/600',
        tags: 'design,future,web',
        status: 'Published',
        featured: 1
      },
      {
        title: 'Mastering Typography',
        slug: 'mastering-typography',
        content: '<h2>The Power of Words</h2><p>Typography is more than just choosing a font. It is about hierarchy, readability, and conveying emotion.</p><blockquote>"Good typography is like a good voice: it makes the words more meaningful."</blockquote><p>Let us dive into the details of kerning, leading, and tracking.</p>',
        cover_image: 'https://picsum.photos/seed/typography/800/600',
        tags: 'typography,design,fonts',
        status: 'Published',
        featured: 1
      },
      {
        title: 'Color Theory in Practice',
        slug: 'color-theory-in-practice',
        content: '<h2>Beyond the Color Wheel</h2><p>Understanding color theory is essential for any designer. It is not just about what looks good, but how colors interact and influence perception.</p><p>Here are some practical tips for applying color theory to your next project.</p>',
        cover_image: 'https://picsum.photos/seed/color/800/600',
        tags: 'color,design,theory',
        status: 'Published',
        featured: 1
      },
      {
        title: 'Minimalism: Less is More',
        slug: 'minimalism-less-is-more',
        content: '<h2>The Art of Subtraction</h2><p>Minimalism is not about taking things away until there is nothing left. It is about removing the unnecessary so the essential can speak.</p><p>Discover how to apply minimalist principles to your life and work.</p>',
        cover_image: 'https://picsum.photos/seed/minimal/800/600',
        tags: 'minimalism,lifestyle,design',
        status: 'Published',
        featured: 0
      },
      {
        title: 'The Rise of AI in Creativity',
        slug: 'rise-of-ai-in-creativity',
        content: '<h2>Collaborating with Machines</h2><p>Artificial intelligence is no longer just a sci-fi concept. It is a tool that creatives are using every day to enhance their workflows and explore new possibilities.</p><p>Let us look at how AI is shaping the future of art and design.</p>',
        cover_image: 'https://picsum.photos/seed/ai/800/600',
        tags: 'ai,creativity,future',
        status: 'Published',
        featured: 0
      }
    ];

    const insert = db.prepare(`
      INSERT INTO posts (title, slug, content, cover_image, tags, status, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((posts) => {
      for (const post of posts) {
        insert.run(post.title, post.slug, post.content, post.cover_image, post.tags, post.status, post.featured);
      }
    });

    insertMany(demoPosts);

    res.json({ message: 'Demo content generated successfully' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate demo content', details: error.message });
  }
});

// Obsidian Webhook Endpoint
router.post('/webhook/obsidian', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const expectedSecret = process.env.OBSIDIAN_SECRET || 'obsidian-secret-key';
    
    if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
      return res.status(401).json({ error: 'Unauthorized webhook access' });
    }

    const { title, slug, content, tags, status, cover_image, featured } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ error: 'Title and slug are required' });
    }

    const existingPost = db.prepare('SELECT id FROM posts WHERE slug = ?').get(slug);

    if (existingPost) {
      // Update
      db.prepare(`
        UPDATE posts 
        SET title = ?, content = ?, tags = ?, status = ?, cover_image = ?, featured = ?, updated_at = CURRENT_TIMESTAMP
        WHERE slug = ?
      `).run(
        title, 
        content || '', 
        tags || '', 
        status || 'Published', 
        cover_image || '', 
        featured ? 1 : 0, 
        slug
      );
      return res.json({ message: 'Post updated successfully', slug });
    } else {
      // Create
      db.prepare(`
        INSERT INTO posts (title, slug, content, tags, status, cover_image, featured)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        title, 
        slug, 
        content || '', 
        tags || '', 
        status || 'Published', 
        cover_image || '', 
        featured ? 1 : 0
      );
      return res.status(201).json({ message: 'Post created successfully', slug });
    }
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Failed to process webhook', details: error.message });
  }
});

export default router;
