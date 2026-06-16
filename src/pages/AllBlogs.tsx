import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Search } from 'lucide-react';
import { format } from 'date-fns';
import { getAllPosts } from '../utils/content';

export default function AllBlogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Synchronously fetch posts on compile/render to eliminate flicker or loading gaps
  const posts = getAllPosts();

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.tags && post.tags.toLowerCase().includes(searchTerm.toLowerCase())) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)]">
      {/* Sticky Header matching the content width layout */}
      <header className="sticky top-0 bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)] z-30 py-3 sm:py-6">
        <div className="w-full px-4 sm:px-10 md:px-14 flex items-center justify-between gap-3 sm:gap-4">
          <h1 className="text-xs min-[375px]:text-sm min-[420px]:text-base sm:text-xl md:text-2xl lg:text-3xl font-display font-bold uppercase tracking-widest text-[var(--text)] truncate shrink-0">
            All Blogs
          </h1>
          
          <div className="flex items-center gap-2 sm:gap-4 flex-grow sm:flex-grow-0 justify-end max-w-[70%] sm:max-w-none">
            <div className="relative flex-grow sm:flex-grow-0 max-w-[150px] min-[375px]:max-w-[180px] min-[420px]:max-w-[220px] sm:max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--secondary)]" size={16} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 sm:pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg font-body text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors text-xs sm:text-sm"
              />
            </div>
            
            <button
              onClick={() => navigate('/')}
              className="p-1.5 sm:p-2 rounded-full hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--secondary)] hover:text-[var(--text)] transition-colors flex items-center justify-center shadow-sm shrink-0"
              aria-label="Close drawer"
            >
              <X size={16} className="sm:hidden" />
              <X size={18} className="hidden sm:block" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full px-6 sm:px-10 md:px-14 py-8 sm:py-10">
        <div className="flex flex-col">
          {filteredPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <motion.div
                whileHover={{ scale: 1.01, x: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Link
                  to={`/post/${post.slug}`}
                  className="group block py-6 border-b border-solid border-[var(--border)] hover:border-[var(--accent)] transition-colors duration-300 relative overflow-hidden pl-4"
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
            </motion.div>
          ))}
          
          {filteredPosts.length === 0 && (
            <div className="py-12 text-center text-[var(--secondary)] font-body">
              No posts found matching "{searchTerm}".
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
