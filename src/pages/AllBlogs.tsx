import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { getAllPosts, Post } from '../utils/content';

export default function AllBlogs() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setPosts(getAllPosts());
    setLoading(false);
  }, []);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.tags && post.tags.toLowerCase().includes(searchTerm.toLowerCase())) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="h-4 w-32 bg-[var(--border)] rounded mb-8"></div>

        <section className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="h-8 w-40 bg-[var(--border)] rounded"></div>
            <div className="h-10 w-full sm:w-64 bg-[var(--border)] rounded-lg"></div>
          </div>
          <div className="h-px bg-[var(--border)] mb-8"></div>

          <div className="flex flex-col">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="py-6 border-b border-dashed border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="w-full sm:w-2/3">
                  <div className="h-6 w-3/4 bg-[var(--border)] rounded mb-2"></div>
                  <div className="h-3 w-1/4 bg-[var(--border)] rounded"></div>
                </div>
                <div className="mt-2 sm:mt-0 h-4 w-16 bg-[var(--border)] rounded"></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <Link to="/" className="inline-flex items-center text-[var(--secondary)] hover:text-[var(--accent)] transition-colors mb-8 font-mono text-sm uppercase tracking-wider">
        <ArrowLeft className="mr-2" size={16} /> Back to Home
      </Link>

      <section className="mb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-display font-bold uppercase tracking-widest text-[var(--text)]">
            All Blogs
          </h1>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg font-body text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
        <div className="h-px bg-[var(--border)] mb-8"></div>

        <div className="flex flex-col">
          {filteredPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link
                to={`/post/${post.slug}`}
                className="group block py-6 border-b border-dashed border-[var(--border)] hover:border-solid hover:border-[var(--accent)] transition-all duration-300 relative overflow-hidden pl-4"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-[var(--text)] mb-1 group-hover:text-[var(--accent)] transition-colors">
                      {post.title}
                    </h3>
                    <p className="font-mono text-xs text-[var(--secondary)] uppercase tracking-wider">
                      {post.tags ? post.tags.split(',').join(' • ') : 'ARTICLE'}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0 font-mono text-sm text-[var(--secondary)] font-bold">
                    {(() => {
                      try {
                        return format(new Date(post.created_at), 'dd/MM/yy');
                      } catch (e) {
                        return post.created_at;
                      }
                    })()}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          
          {filteredPosts.length === 0 && (
            <div className="py-12 text-center text-[var(--secondary)] font-body">
              No posts found matching "{searchTerm}".
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
