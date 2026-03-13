import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { getAllPosts, getSettings, Post, Settings } from '../utils/content';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async loading for smoother transitions if desired, 
    // but we can just set it immediately since it's synchronous now.
    setPosts(getAllPosts());
    setSettings(getSettings());
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        {/* Welcome Section Skeleton */}
        <section className="mb-20">
          <div className="flex items-center mb-8">
            <div className="h-8 w-40 bg-[var(--border)] rounded"></div>
            <div className="ml-4 flex-grow h-px bg-[var(--border)]"></div>
          </div>
          <div className="py-4">
            <div className="h-4 w-full bg-[var(--border)] rounded mb-3"></div>
            <div className="h-4 w-5/6 bg-[var(--border)] rounded mb-3"></div>
            <div className="h-4 w-4/6 bg-[var(--border)] rounded mb-6"></div>
            <div>
              <div className="h-6 w-16 bg-[var(--border)] rounded mb-3"></div>
              <div className="h-4 w-20 bg-[var(--border)] rounded"></div>
            </div>
          </div>
        </section>

        {/* Featured Blogs Section Skeleton */}
        <section className="mb-20">
          <div className="flex items-center mb-8">
            <div className="h-8 w-48 bg-[var(--border)] rounded"></div>
            <div className="ml-4 flex-grow h-px bg-[var(--border)]"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Hero Card Skeleton */}
            <div className="md:col-span-7 rounded-xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
              <div className="aspect-[4/3] w-full bg-[var(--border)]"></div>
              <div className="p-6">
                <div className="h-8 w-3/4 bg-[var(--border)] rounded mb-2"></div>
                <div className="h-4 w-full bg-[var(--border)] rounded mb-1"></div>
                <div className="h-4 w-5/6 bg-[var(--border)] rounded"></div>
              </div>
            </div>
            {/* Side Cards Skeleton */}
            <div className="md:col-span-5 flex flex-col gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex flex-col sm:flex-row bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
                  <div className="w-full sm:w-2/5 aspect-video sm:aspect-square bg-[var(--border)]"></div>
                  <div className="w-full sm:w-3/5 p-4 flex flex-col justify-center">
                    <div className="h-6 w-full bg-[var(--border)] rounded mb-2"></div>
                    <div className="h-6 w-2/3 bg-[var(--border)] rounded"></div>
                  </div>
                </div>
              ))}
              <div className="mt-auto py-4 px-6 bg-[var(--surface)] border border-[var(--border)] rounded-xl h-14"></div>
            </div>
          </div>
        </section>

        {/* Recent Blogs Section Skeleton */}
        <section className="mb-20">
          <div className="flex items-center mb-8">
            <div className="h-8 w-40 bg-[var(--border)] rounded"></div>
            <div className="ml-4 flex-grow h-px bg-[var(--border)]"></div>
          </div>
          <div className="flex flex-col">
            {[1, 2, 3].map((i) => (
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

  const featuredPosts = posts.filter((p) => p.featured).slice(0, 3);
  const recentPosts = posts.slice(0, 5);

  const heroPost = featuredPosts[0] || posts[0]; // Fallback to first post if no featured
  const sidePosts = featuredPosts.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {/* Welcome Section */}
      <section className="mb-20">
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-display font-bold uppercase tracking-widest text-[var(--text)]">
            Welcome 🎉
          </h1>
          <div className="ml-4 flex-grow h-px bg-[var(--border)]"></div>
        </div>
        <div className="py-4">
          <p className="font-body text-lg sm:text-xl text-[var(--text)] leading-relaxed mb-6">
            Hey there! I’m a 7th grader at Techno India Group Public School who’s way too into coding and all things techy. I’m not gonna lie—I don’t feel like a genius, but somehow I manage to pull off good grades (magic, maybe?).
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
      </section>

      {/* Featured Blogs Section */}
      <section className="mb-20">
        <div className="flex items-center mb-8">
          <h2 className="text-2xl font-display font-bold uppercase tracking-widest text-[var(--text)]">
            Featured Blogs
          </h2>
          <div className="ml-4 flex-grow h-px bg-[var(--border)]"></div>
        </div>

        {heroPost && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Hero Card */}
            <Link
              to={`/post/${heroPost.slug}`}
              className="md:col-span-7 group relative block overflow-hidden rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-[4/3] w-full relative overflow-hidden">
                <img
                  src={heroPost.cover_image || 'https://picsum.photos/seed/blog1/800/600'}
                  alt={heroPost.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-black/30 backdrop-blur-md border-t border-white/10">
                <h3 className="text-3xl font-display font-bold text-white mb-2 group-hover:text-[var(--accent)] transition-colors">
                  {heroPost.title}
                </h3>
                <p className="text-gray-300 font-body text-sm line-clamp-2">
                  {heroPost.content.replace(/<[^>]+>/g, '')}
                </p>
              </div>
            </Link>

            {/* Side Cards */}
            <div className="md:col-span-5 flex flex-col gap-6">
              {sidePosts.map((post, idx) => (
                <Link
                  key={post.id}
                  to={`/post/${post.slug}`}
                  className="group flex flex-col sm:flex-row bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className={`w-full sm:w-2/5 aspect-video sm:aspect-square relative overflow-hidden ${idx % 2 === 0 ? 'clipped-edge' : 'clipped-edge-reverse'}`}>
                    <img
                      src={post.cover_image || `https://picsum.photos/seed/blog${idx + 2}/400/400`}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="w-full sm:w-3/5 p-4 flex flex-col justify-center">
                    <h3 className="text-xl font-display font-bold text-[var(--text)] mb-2 relative inline-block">
                      {post.title}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--accent)] transition-all duration-300 group-hover:w-full"></span>
                    </h3>
                    {idx === 1 && (
                      <p className="text-[var(--secondary)] font-body text-xs line-clamp-2 mt-2">
                        {post.content.replace(/<[^>]+>/g, '')}
                      </p>
                    )}
                  </div>
                </Link>
              ))}

              {/* See More Button */}
              <Link
                to="/all-posts"
                className="group mt-auto flex items-center justify-center w-full py-4 px-6 bg-[var(--btn-bg)] border border-[var(--border)] rounded-xl font-display font-bold text-xl text-[var(--btn-text)] hover:bg-[var(--surface)] transition-all duration-300 shadow-sm"
              >
                see more
                <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-2" size={24} />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Recent Blogs Section */}
      <section className="mb-20">
        <div className="flex items-center mb-8">
          <h2 className="text-2xl font-display font-bold uppercase tracking-widest text-[var(--text)]">
            Recent Posts
          </h2>
          <div className="ml-4 flex-grow h-px bg-[var(--border)]"></div>
        </div>

        <div className="flex flex-col">
          {recentPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
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
        </div>
        
        {/* See More Button */}
        <Link
          to="/all-posts"
          className="group mt-8 flex items-center justify-center w-full py-4 px-6 bg-[var(--btn-bg)] border border-[var(--border)] rounded-xl font-display font-bold text-xl text-[var(--btn-text)] hover:bg-[var(--surface)] transition-all duration-300 shadow-sm"
        >
          see more
          <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-2" size={24} />
        </Link>
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
    </motion.div>
  );
}
