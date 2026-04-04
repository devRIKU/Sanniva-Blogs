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

// Load all markdown files from the content/posts directory, excluding Extras
const postFiles = import.meta.glob('../content/posts/**/*.md', { 
  query: '?raw', 
  import: 'default', 
  eager: true,
  ignore: ['../content/posts/Extras/**']
});
const imageFiles = import.meta.glob('../content/posts/**/*.{png,jpg,jpeg,gif,svg,webp}', { query: '?url', import: 'default', eager: true });

export function getImageUrl(filename: string): string {
  // If it's an external URL, return as is
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  
  // Find the image in the imported files
  const normalizedFilename = filename.replace(/^\//, ''); // Remove leading slash if any
  for (const path in imageFiles) {
    if (path.endsWith(normalizedFilename)) {
      return imageFiles[path] as string;
    }
  }
  
  // Fallback to the original filename if not found
  return filename;
}

export function getAllPosts(): Post[] {
  const posts: Post[] = [];

  for (const path in postFiles) {
    try {
      const rawContent = postFiles[path] as string;
      const { attributes, body } = frontMatter<any>(rawContent);

      if (attributes.status === 'Published') {
        posts.push({
          id: String(attributes.slug || path),
          title: String(attributes.title || 'Untitled'),
          slug: String(attributes.slug || path.replace('../content/posts/', '').replace('.md', '')),
          created_at: String(attributes.date || new Date().toISOString()),
          content: String(body || ''),
          cover_image: String(attributes.cover_image || ''),
          tags: Array.isArray(attributes.tags) ? attributes.tags.join(', ') : String(attributes.tags || ''),
          status: String(attributes.status || ''),
          featured: attributes.featured || false,
        });
      }
    } catch (error) {
      console.error(`Error parsing markdown file ${path}:`, error);
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
