import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import Markdown from 'react-markdown';
import { getPostBySlug, Post as PostType } from '../utils/content';

export default function Post() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const foundPost = getPostBySlug(slug);
      setPost(foundPost || null);
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[var(--text)] font-display font-bold text-2xl">Loading...</div>
      </div>
    );
  }

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
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <Link to="/" className="inline-flex items-center text-[var(--secondary)] hover:text-[var(--accent)] transition-colors mb-8 font-mono text-sm uppercase tracking-wider">
        <ArrowLeft className="mr-2" size={16} /> Back
      </Link>

      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-10"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-[var(--text)] leading-tight mb-6">
          {post.title}
        </h1>
        <div className="flex items-center justify-between border-y border-[var(--border)] py-4 font-mono text-sm text-[var(--secondary)] uppercase tracking-wider">
          <div>{format(new Date(post.created_at), 'MMMM dd, yyyy')}</div>
          {post.tags && <div>{post.tags.split(',').map(t => `#${t.trim()}`).join(' ')}</div>}
        </div>
      </motion.header>

      {post.cover_image && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 rounded-xl overflow-hidden border border-[var(--border)] shadow-md"
        >
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-auto object-cover max-h-[600px]"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="prose prose-lg max-w-none text-[var(--text)] font-body prose-headings:font-display prose-headings:font-bold prose-headings:text-[var(--text)] prose-a:text-[var(--accent)] prose-strong:text-[var(--text)] prose-blockquote:border-[var(--accent)] prose-blockquote:text-[var(--secondary)] prose-code:text-[var(--accent)] prose-pre:bg-[var(--surface)] prose-pre:border prose-pre:border-[var(--border)]"
      >
        <Markdown>{post.content}</Markdown>
      </motion.div>
    </motion.article>
  );
}
