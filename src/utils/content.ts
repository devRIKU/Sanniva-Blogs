/// <reference types="vite/client" />
import frontMatter from 'front-matter';
import settingsData from '../content/settings.json';

export interface Post {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  content: string;
  cover_image?: string;
  tags?: string;
  status: string;
  featured: boolean;
}

export interface Settings {
  about_text: string;
  portfolio_url: string;
  collaborations_url: string;
  projects_url: string;
}

// Load all markdown files from the content/posts directory
const postFiles = import.meta.glob('../content/posts/*.md', { query: '?raw', import: 'default', eager: true });

export function getAllPosts(): Post[] {
  const posts: Post[] = [];

  for (const path in postFiles) {
    const rawContent = postFiles[path] as string;
    const { attributes, body } = frontMatter<any>(rawContent);

    if (attributes.status === 'Published') {
      posts.push({
        id: attributes.slug || path,
        title: attributes.title || 'Untitled',
        slug: attributes.slug || path.replace('../content/posts/', '').replace('.md', ''),
        created_at: attributes.date || new Date().toISOString(),
        content: body,
        cover_image: attributes.cover_image,
        tags: attributes.tags,
        status: attributes.status,
        featured: attributes.featured || false,
      });
    }
  }

  // Sort by date descending
  return posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getPostBySlug(slug: string): Post | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug);
}

// Load settings from a local JSON or markdown file if needed.
// For now, we'll just return a hardcoded default or an empty object,
// but you could easily move this to a `src/content/settings.json` file.
export function getSettings(): Settings {
  return settingsData as Settings;
}
