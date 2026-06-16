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

export interface Connection {
  id: string;
  name: string;
  slug: string;
  relation: string;
  avatar_image?: string;
  content: string;
  related_posts?: string[];
}

// Load all markdown files from the content/posts directory, excluding Extras
const postFiles = import.meta.glob(['../content/posts/**/*.md', '!../content/posts/Extras/**'], { 
  query: '?raw', 
  import: 'default', 
  eager: true
});
const connectionFiles = import.meta.glob('../content/connections/**/*.md', { 
  query: '?raw', 
  import: 'default', 
  eager: true
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
        let coverImage = String(attributes.cover_image || '');
        if (!coverImage) {
          const title = String(attributes.title || '');
          const tags = Array.isArray(attributes.tags) ? attributes.tags : (attributes.tags ? String(attributes.tags).split(',') : []);
          
          // Determine intent keyword
          let intentWord = 'blog';
          if (tags.length > 0 && tags[0].trim()) {
             intentWord = tags[0].trim().toLowerCase().replace(/[^a-z0-9]/g, '');
          } else if (title) {
             const words = title.split(' ').filter(w => w.length > 3);
             if (words.length > 0) {
               intentWord = words[0].toLowerCase().replace(/[^a-z0-9]/g, '');
             }
          }
          
          coverImage = `https://picsum.photos/seed/${intentWord || 'blog'}/1600/800`;
        }

        posts.push({
          id: String(attributes.slug || path),
          title: String(attributes.title || 'Untitled'),
          slug: String(attributes.slug || path.replace('../content/posts/', '').replace('.md', '')),
          created_at: String(attributes.date || new Date().toISOString()),
          content: String(body || ''),
          cover_image: coverImage,
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

export function getAllConnections(): Connection[] {
  const connections: Connection[] = [];

  for (const path in connectionFiles) {
    try {
      const rawContent = connectionFiles[path] as string;
      const { attributes, body } = frontMatter<any>(rawContent);

      connections.push({
        id: String(attributes.slug || path),
        name: String(attributes.name || 'Anonymous'),
        slug: String(attributes.slug || path.replace('../content/connections/', '').replace('.md', '')),
        relation: String(attributes.relation || ''),
        avatar_image: attributes.avatar_image ? String(attributes.avatar_image) : undefined,
        content: String(body || ''),
        related_posts: Array.isArray(attributes.related_posts) 
          ? attributes.related_posts.map((p: any) => String(p)) 
          : (attributes.related_posts ? String(attributes.related_posts).split(',').map(s => s.trim()) : [])
      });
    } catch (error) {
      console.error(`Error parsing markdown file ${path}:`, error);
    }
  }

  // Sort alphabetically by name
  return connections.sort((a, b) => a.name.localeCompare(b.name));
}
