import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { getAllPosts, getSettings, Post, Settings } from '../utils/content';

let hasPlayedEntryAnimation = false;

export default function Home() {
  const [posts] = useState<Post[]>(() => getAllPosts());
  const [settings] = useState<Settings | null>(() => getSettings());

  useEffect(() => {
    hasPlayedEntryAnimation = true;
  }, []);

  const featuredPosts = posts.filter((p) => p.featured).slice(0, 3);
  const heroPost = featuredPosts.length > 0 ? featuredPosts[0] : posts[0]; // Fallback to first post if no featured
  const sidePosts = featuredPosts.length > 0 ? featuredPosts.slice(1) : [];

  const displayedFeaturedIds = new Set([heroPost?.id, ...sidePosts.map(p => p.id)].filter(Boolean));
  let recentPosts = posts.filter((p) => !displayedFeaturedIds.has(p.id));
  if (recentPosts.length < 4) {
    // Fallback to preserve a rich list of blogs when count is small
    recentPosts = posts;
  }
  recentPosts = recentPosts.slice(0, 5);

  const initialPropsFadeUp = hasPlayedEntryAnimation ? false : { opacity: 0, y: 20 };
  const initialPropsFade = hasPlayedEntryAnimation ? false : { opacity: 0 };
  const initialPropsFadeRight = hasPlayedEntryAnimation ? false : { opacity: 0, x: -20 };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-12">
      {/* Welcome Section */}
      <motion.section 
        initial={initialPropsFadeUp}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-20"
      >
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-display font-bold uppercase tracking-widest text-[var(--text)]">
            Welcome 🎉
          </h1>
          <div className="ml-4 flex-grow h-px bg-[var(--border)]"></div>
        </div>
        <div className="py-4">
          <p className="font-body text-lg sm:text-xl text-[var(--text)] leading-relaxed mb-6">
            Hey there! I’m an 8th grader at Techno India Group Public School who’s way too into coding and all things techy. I’m not gonna lie—I don’t feel like a genius, but somehow I manage to pull off good grades (magic, maybe?).
          </p>
          <div>
            <h3 className="text-xl font-display font-bold text-[var(--text)] mb-3">Links</h3>
            <a
              href="https://github.com/devRIKU"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[var(--accent)] hover:opacity-80 transition-opacity font-bold underline decoration-[var(--accent)] underline-offset-4"
            >
              GitHub
            </a>
          </div>
        </div>
      </motion.section>

      {/* Featured Blogs Section */}
      <motion.section 
        initial={initialPropsFade}
        animate={{ opacity: 1 }}
        className="mb-14"
        style={{ paddingTop: '0px' }}
      >
        <div className="flex items-center mb-8">
          <h2 className="text-2xl font-display font-bold uppercase tracking-widest text-[var(--text)]">
            Featured Blogs
          </h2>
          <div className="ml-4 flex-grow h-px bg-[var(--border)]"></div>
        </div>

        {heroPost && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Hero Card */}
            <motion.div 
              className="lg:col-span-8 flex flex-col"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.975 }}
              transition={{ type: "spring", stiffness: 300, damping: 30, mass: 1 }}
            >
              <Link
                to={`/post/${heroPost.slug}`}
                className="group relative flex-1 flex flex-col overflow-hidden rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-md hover:shadow-lg transition-all duration-300 min-h-[280px] sm:min-h-[320px] lg:min-h-full w-full"
              >
                <div className="absolute inset-0 z-0">
                  <motion.img
                    layoutId={`cover-${heroPost.id}`}
                    src={heroPost.cover_image || 'https://picsum.photos/seed/blog1/800/600'}
                    alt={heroPost.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                </div>
                
                <div className="mt-auto relative z-10 p-6 sm:p-8 bg-black/40 backdrop-blur-md border-t border-white/10">
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-[var(--accent)] text-white font-mono text-xs uppercase tracking-widest rounded-full font-bold">
                      Featured
                    </span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3 group-hover:text-[var(--accent)] transition-colors leading-tight">
                    {heroPost.title}
                  </h3>
                  <p className="text-gray-200 font-body text-base line-clamp-2">
                    {heroPost.content.replace(/<[^>]+>/g, '')}
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Side Cards */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {sidePosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  className="flex-1 flex flex-col"
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.975 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30, mass: 1 }}
                >
                  <Link
                    to={`/post/${post.slug}`}
                    className="group flex-1 flex w-full flex-col sm:flex-row lg:flex-col bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-full sm:w-2/5 lg:w-full aspect-[16/10] sm:aspect-auto lg:aspect-[16/10] sm:h-full lg:h-32 relative overflow-hidden shrink-0">
                      <motion.img
                        layoutId={`cover-${post.id}`}
                        src={post.cover_image || `https://picsum.photos/seed/blog${idx + 2}/400/400`}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="w-full sm:w-3/5 lg:w-full p-4 flex flex-col justify-center flex-1">
                      <h3 className="text-lg sm:text-xl font-display font-bold text-[var(--text)] mb-2 relative inline-block group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-[var(--secondary)] font-body text-xs sm:text-sm line-clamp-2 mt-1">
                        {post.content.replace(/<[^>]+>/g, '')}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.section>

      {/* Recent Blogs Section */}
      <section className="mb-20">
        <div className="flex items-center mb-8">
          <h2 className="text-2xl font-display font-bold uppercase tracking-widest text-[var(--text)]">
            Recent Posts
          </h2>
          <div className="ml-4 flex-grow h-px bg-[var(--border)]"></div>
        </div>
        <p className="font-body text-[var(--secondary)] mb-8 -mt-4">
          A collection of my most recent thoughts and stories, fresh from the keyboard.
        </p>

        <div className="flex flex-col">
          {recentPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={initialPropsFadeRight}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: hasPlayedEntryAnimation ? 0 : idx * 0.1 }}
            >
              <motion.div
                whileHover={{ scale: 1.01, x: 5 }}
                whileTap={{ scale: 0.99 }}
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
        </div>
        
        {/* See More Button */}
        <motion.div
           whileHover={{ scale: 1.02 }}
           whileTap={{ scale: 0.95 }}
           transition={{ type: "spring", stiffness: 300, damping: 30, mass: 1 }}
        >
          <Link
            to="/all-posts"
            className="group mt-8 flex items-center justify-center w-full py-4 px-6 bg-[var(--btn-bg)] border border-[var(--border)] rounded-2xl font-display font-bold text-xl text-[var(--btn-text)] hover:bg-[var(--surface)] transition-all duration-300 shadow-sm"
          >
            see more
            <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-2" size={24} />
          </Link>
        </motion.div>
      </section>

      {/* Beyond The Blog Section */}
      <section>
        <div className="flex items-center mb-8">
          <h2 className="text-2xl font-display font-bold uppercase tracking-widest text-[var(--text)]">
            Beyond The Blog
          </h2>
          <div className="ml-4 flex-grow h-px bg-[var(--border)]"></div>
        </div>

        <div className="bg-[var(--surface)] p-8 rounded-xl border border-[var(--border)] shadow-sm">
          <p className="font-body text-lg text-[var(--text)] leading-relaxed">
            {settings?.about_text || 'Looking for more? Explore my portfolio, past collaborations, and side projects.'}
            {' '}Explore my{' '}
            <a href={settings?.portfolio_url || '#'} className="underline decoration-[var(--accent)] underline-offset-4 hover:text-[var(--accent)] transition-colors font-bold">portfolio</a>,{' '}
            <a href={settings?.collaborations_url || '#'} className="underline decoration-[var(--accent)] underline-offset-4 hover:text-[var(--accent)] transition-colors font-bold">past collaborations</a>, and{' '}
            <a href={settings?.projects_url || '#'} className="underline decoration-[var(--accent)] underline-offset-4 hover:text-[var(--accent)] transition-colors font-bold">side projects</a>.
            {' '}Whether it's design, tech, or creative experiments, there's always something exciting to share.
          </p>
        </div>
      </section>
    </div>
  );
}
