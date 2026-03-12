import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

interface Post {
  id: number;
  title: string;
  slug: string;
  created_at: string;
  tags?: string;
}

export default function AllBlogs() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[var(--text)] font-display font-bold text-2xl">Loading...</div>
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
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-display font-bold uppercase tracking-widest text-[var(--text)]">
            All Blogs
          </h1>
          <div className="ml-4 flex-grow h-px bg-[var(--border)]"></div>
        </div>

        <div className="flex flex-col">
          {posts.map((post, idx) => (
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
                    {format(new Date(post.created_at), 'dd/MM/yy')}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          
          {posts.length === 0 && (
            <div className="py-12 text-center text-[var(--secondary)] font-body">
              No blogs published yet.
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
