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
import Connections from './pages/Connections';

import Connection from './pages/Connection';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAllPosts = location.pathname === '/all-posts';
  const isConnections = location.pathname === '/connections';
  const isPostPage = location.pathname.startsWith('/post/');
  const isConnectionPage = location.pathname.startsWith('/connection/');
  const isDrawerOpen = isAllPosts || isConnections;
  const isBaseHidden = isPostPage || isConnectionPage;
  
  useEffect(() => {
    // Only scroll to top if we're not toggle-opening/closing drawers to preserve scroll
    if (!isDrawerOpen) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, isDrawerOpen]);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[var(--bg)]">
      <Header />
      
      {/* Premium Backdrop Overlay for the Side-Drawers */}
      <AnimatePresence>
        {isDrawerOpen && (
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
        {/* Base Layer: Either Home page or full article/connection page */}
        <motion.div 
          key={isBaseHidden ? location.pathname : 'main-view'}
          className="row-start-1 col-start-1 h-full w-full bg-[var(--bg)] origin-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ 
            opacity: 1,
            y: 0,
            scale: isDrawerOpen ? 0.95 : 1,
            filter: isDrawerOpen ? 'brightness(0.65)' : 'brightness(1)',
            borderRadius: isDrawerOpen ? '24px' : '0px',
          }}
          transition={{ 
            opacity: { duration: 0.25, ease: "easeInOut" },
            y: { duration: 0.25, ease: "easeInOut" },
            scale: { type: "spring", stiffness: 300, damping: 30 },
            filter: { duration: 0.3 },
            borderRadius: { duration: 0.3 }
          }}
        >
          {/* Render Home directly to prevent unmounting and re-triggering entry animations */}
          {isBaseHidden ? <Outlet /> : <Home />}
        </motion.div>

        {/* Side-Drawer Overlay Panel for All Blogs */}
        <AnimatePresence>
          {isAllPosts && (
            <motion.div
              initial={{ x: '100%', opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.9 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30, 
                mass: 1 
              }}
              className="fixed inset-y-0 right-0 w-full sm:w-[92%] md:w-[85%] lg:w-[78%] xl:w-[70%] bg-[var(--bg)] shadow-2xl z-[100] border-l border-[var(--border)] overflow-y-auto"
            >
              <div className="relative min-h-screen">
                <AllBlogs />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Side-Drawer Overlay Panel for Connections */}
        <AnimatePresence>
          {isConnections && (
            <motion.div
              initial={{ x: '100%', opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.9 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30, 
                mass: 1 
              }}
              className="fixed inset-y-0 right-0 w-full sm:w-[92%] md:w-[85%] lg:w-[78%] xl:w-[70%] bg-[var(--bg)] shadow-2xl z-[100] border-l border-[var(--border)] overflow-y-auto"
            >
              <div className="relative min-h-screen">
                <Connections />
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
            <Route path="connections" element={<Connections />} />
            <Route path="connection/:slug" element={<Connection />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
