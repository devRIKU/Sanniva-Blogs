/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Post from './pages/Post';
import AllBlogs from './pages/AllBlogs';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAllPosts = location.pathname === '/all-posts';
  const isPostPage = location.pathname.startsWith('/post/');
  
  useEffect(() => {
    // Only scroll to top if we're not toggle-opening/closing the drawer to preserve scroll
    if (!isAllPosts) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, isAllPosts]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[var(--bg)]">
      <Header />
      
      {/* Premium Backdrop Overlay for the Side-Drawer */}
      <AnimatePresence>
        {isAllPosts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.25 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] cursor-pointer"
            onClick={() => navigate('/')}
          />
        )}
      </AnimatePresence>

      <main className="flex-grow grid grid-cols-1 grid-rows-1 relative">
        {/* Base Layer: Either Home page or full article page */}
        <AnimatePresence mode="popLayout">
          <motion.div 
            key={isPostPage ? location.pathname : 'main-view'}
            className="row-start-1 col-start-1 h-full w-full bg-[var(--bg)] origin-center"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              scale: isAllPosts ? 0.95 : 1,
              filter: isAllPosts ? 'brightness(0.65)' : 'brightness(1)',
              borderRadius: isAllPosts ? '24px' : '0px',
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              mass: 1
            }}
          >
            {/* If we are on the drawer page, keep Home page visible as the underneath stack layer */}
            {isAllPosts ? <Home /> : <Outlet />}
          </motion.div>
        </AnimatePresence>

        {/* Side-Drawer Overlay Panel */}
        <AnimatePresence>
          {isAllPosts && (
            <motion.div
              initial={{ x: '100%', opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.9 }}
              // Custom spring-based physics (mass: 1, tension 300, friction 30)
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30, 
                mass: 1 
              }}
              className="fixed inset-y-0 right-0 w-full sm:w-[90%] md:w-[75%] lg:w-[60%] xl:w-[50%] bg-[var(--bg)] shadow-2xl z-[100] border-l border-[var(--border)] overflow-y-auto"
            >
              <div className="relative min-h-screen">
                {/* Minimalist Close button on the top right */}
                <button
                  onClick={() => navigate('/')}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--secondary)] hover:text-[var(--text)] transition-colors z-50 flex items-center justify-center shadow-sm"
                  aria-label="Close drawer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
                <AllBlogs />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="post/:slug" element={<Post />} />
            <Route path="all-posts" element={<AllBlogs />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
