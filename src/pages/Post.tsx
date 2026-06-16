import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { getPostBySlug, getAllPosts, Post as PostType, getImageUrl } from '../utils/content';

export default function Post() {
  const { slug } = useParams<{ slug: string }>();
  
  // Find the post and preprocess it synchronously on render to prevent any delay or loading flickers
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex(p => p.slug === slug);
  const post = currentIndex !== -1 ? allPosts[currentIndex] : null;
  const prevPost = currentIndex !== -1 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex !== -1 && currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  const processedContent = React.useMemo(() => {
    if (!post) return '';
    return post.content
      // Replace Obsidian image wikilinks: ![[filename.png]] or ![[filename.png|100]]
      .replace(/!\[\[([^\]]+)\]\]/g, (match, p1) => {
        const parts = p1.split('|');
        const filename = parts[0].trim();
        const alt = parts.length > 1 ? parts[1].trim() : filename;
        return `![${alt}](${getImageUrl(filename)})`;
      })
      // Replace standard markdown images: ![alt](filename.png)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, filename) => {
        return `![${alt}](${getImageUrl(filename)})`;
      })
      // Replace Obsidian page wikilinks: [[Page Name]] or [[Page Name|Display Text]]
      .replace(/(?<!!)\[\[([^\]]+)\]\]/g, (match, p1) => {
        const parts = p1.split('|');
        const target = parts[0].trim();
        const display = parts.length > 1 ? parts[1].trim() : target;
        
        // If it looks like a URL, link directly to it
        if (target.startsWith('http://') || target.startsWith('https://')) {
          return `[${display}](${target})`;
        }
        
        // Otherwise, assume it's an internal post link and convert to slug
        const slug = target.toLowerCase().replace(/\s+/g, '-');
        return `[${display}](/post/${slug})`;
      });
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-display font-bold text-[var(--accent)] mb-4">404</h1>
        <p className="text-[var(--text)] font-body mb-8">Post not found.</p>
        <Link to="/" className="text-[var(--accent)] hover:underline flex items-center">
          <ArrowLeft className="mr-2" size={20} /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 sm:pt-8 md:pt-12">
      <Link to="/" className="inline-flex items-center text-[var(--secondary)] hover:text-[var(--accent)] transition-colors mb-4 sm:mb-6 md:mb-8 font-mono text-sm uppercase tracking-wider">
        <ArrowLeft className="mr-2" size={16} /> Back
      </Link>

      {post.cover_image && (
        <div className="mb-8 rounded-2xl overflow-hidden shadow-sm h-48 sm:h-64 md:h-[400px] w-full mt-2 sm:mt-4">
          <motion.img
            layoutId={`cover-${post.id}`}
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-10"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-[var(--text)] leading-tight mb-6">
          {post.title}
        </h1>
        <div className="flex items-center justify-between border-y border-[var(--border)] py-4 font-mono text-sm text-[var(--secondary)] uppercase tracking-wider">
          <div>
            {(() => {
              try {
                return format(new Date(post.created_at), 'MMMM dd, yyyy');
              } catch (e) {
                return post.created_at;
              }
            })()}
          </div>
          {post.tags && <div>{post.tags.split(',').map(t => `#${t.trim()}`).join(' ')}</div>}
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="prose prose-lg max-w-none text-[var(--text)] font-body prose-headings:font-display prose-headings:font-bold prose-headings:text-[var(--text)] prose-a:text-[var(--accent)] prose-strong:text-[var(--text)] prose-blockquote:border-[var(--accent)] prose-blockquote:text-[var(--secondary)] prose-code:text-[var(--accent)] prose-pre:bg-[var(--surface)] prose-pre:border prose-pre:border-[var(--border)]"
      >
        <Markdown 
          remarkPlugins={[remarkBreaks, remarkGfm]}
          components={{
            img: ({node, ...props}) => {
              // Check if alt text is a number (width) from Obsidian like ![[image.png|300]]
              const width = props.alt && !isNaN(Number(props.alt)) ? props.alt : undefined;
              return (
                <img 
                  {...props} 
                  width={width} 
                  style={width ? { width: `${width}px`, maxWidth: '100%', height: 'auto' } : {}} 
                  className="rounded-md my-4"
                />
              );
            },
            a: ({node, ...props}) => {
              const isInternal = props.href?.startsWith('/');
              if (isInternal) {
                return <Link to={props.href || ''} {...props} />;
              }
              return <a target="_blank" rel="noopener noreferrer" {...props} />;
            }
          }}
        >
          {processedContent}
        </Markdown>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-stretch gap-4"
      >
        {prevPost ? (
          <Link
            to={`/post/${prevPost.slug}`}
            className="flex-1 group flex flex-col items-start p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] bg-[var(--surface)] hover:bg-[var(--bg)] transition-all duration-300"
          >
            <span className="text-[var(--secondary)] font-mono text-xs uppercase tracking-wider mb-2 flex items-center">
              <ArrowLeft className="mr-1" size={14} /> Previous Post
            </span>
            <span className="text-[var(--text)] font-display font-bold text-lg group-hover:text-[var(--accent)] transition-colors line-clamp-2">
              {prevPost.title}
            </span>
          </Link>
        ) : (
          <div className="flex-1"></div>
        )}

        {nextPost ? (
          <Link
            to={`/post/${nextPost.slug}`}
            className="flex-1 group flex flex-col items-end text-right p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] bg-[var(--surface)] hover:bg-[var(--bg)] transition-all duration-300"
          >
            <span className="text-[var(--secondary)] font-mono text-xs uppercase tracking-wider mb-2 flex items-center">
              Next Post <ArrowRight className="ml-1" size={14} />
            </span>
            <span className="text-[var(--text)] font-display font-bold text-lg group-hover:text-[var(--accent)] transition-colors line-clamp-2">
              {nextPost.title}
            </span>
          </Link>
        ) : (
          <div className="flex-1"></div>
        )}
      </motion.div>
    </article>
  );
}
