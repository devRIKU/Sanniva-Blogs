import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { getAllConnections, getAllPosts, Post } from '../utils/content';

export default function Connection() {
  const { slug } = useParams<{ slug: string }>();
  
  const connections = useMemo(() => getAllConnections(), []);
  const allPosts = useMemo(() => getAllPosts(), []);
  
  const connection = connections.find(c => c.slug === slug);
  
  const getRelatedPosts = (): Post[] => {
    if (!connection || !connection.related_posts) return [];
    return allPosts.filter(post => connection.related_posts?.includes(post.slug));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!connection) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-display font-bold text-[var(--accent)] mb-4">404</h1>
        <p className="text-[var(--text)] font-body mb-8">Connection not found.</p>
        <Link to="/" className="text-[var(--accent)] hover:underline flex items-center">
          <ArrowLeft className="mr-2" size={20} /> Back to Home
        </Link>
      </div>
    );
  }

  const relatedPosts = getRelatedPosts();

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 sm:pt-8 md:pt-12">
      <Link to="/connections" className="inline-flex items-center text-[var(--secondary)] hover:text-[var(--accent)] transition-colors mb-4 sm:mb-6 md:mb-8 font-mono text-sm uppercase tracking-wider">
        <ArrowLeft className="mr-2" size={16} /> Back to Connections
      </Link>

      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-10 pb-8 border-b border-[var(--border)]"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {connection.avatar_image ? (
            <motion.img
              layoutId={`avatar-${connection.id}`}
              src={connection.avatar_image}
              alt={connection.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-[var(--accent)] shadow-sm shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)] flex items-center justify-center font-display font-bold text-2xl sm:text-3xl shrink-0">
              {getInitials(connection.name)}
            </div>
          )}
          <div>
            <span className="px-3 py-1 bg-[var(--surface)] text-[var(--accent)] border border-[var(--border)] font-mono text-xs uppercase tracking-widest rounded-full font-bold inline-block mb-3">
              {connection.relation}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-[var(--text)] leading-tight">
              {connection.name}
            </h1>
          </div>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="prose prose-lg max-w-none text-[var(--text)] font-body prose-headings:font-display prose-headings:font-bold prose-headings:text-[var(--text)] prose-a:text-[var(--accent)] prose-strong:text-[var(--text)] prose-blockquote:border-[var(--accent)] prose-blockquote:text-[var(--secondary)] mb-16"
      >
        <Markdown remarkPlugins={[remarkBreaks, remarkGfm]}>
          {connection.content}
        </Markdown>
      </motion.div>

      {/* Related Stories */}
      {relatedPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-display font-bold uppercase tracking-widest text-[var(--text)] mb-6">
            Related Stories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map((post) => (
              <Link
                key={post.id}
                to={`/post/${post.slug}`}
                className="group flex flex-col justify-between p-6 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div>
                  <p className="font-mono text-[10px] text-[var(--secondary)] uppercase tracking-wider mb-2">
                    {post.tags ? post.tags.split(',').join(' • ') : 'ARTICLE'}
                  </p>
                  <h4 className="text-xl font-display font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors mb-3 leading-snug">
                    {post.title}
                  </h4>
                </div>
                <div className="mt-4 font-mono text-xs text-[var(--secondary)] pt-4 border-t border-[var(--border)]/50">
                  {(() => {
                    try {
                      return format(new Date(post.created_at), 'MMMM dd, yyyy');
                    } catch (e) {
                      return post.created_at;
                    }
                  })()}
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </article>
  );
}
