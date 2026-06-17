/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
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
  const navType = useNavigationType();
  const scrollPositions = React.useRef<Record<string, number>>({});
  
  const allBlogsRef = React.useRef<HTMLDivElement>(null);
  const connectionsRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Only track window scroll if no drawers are open
      if (!isDrawerOpen) {
        scrollPositions.current[location.pathname] = window.scrollY;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname, isDrawerOpen]);

  useEffect(() => {
    // Scroll management when not toggling drawers
    if (!isDrawerOpen) {
      if (navType === 'POP' || location.state?.restoreScroll) {
        const savedScroll = scrollPositions.current[location.pathname] || 0;
        // Wait for route's exit transition (0.15s) to complete, then scroll instantly
        const timer = setTimeout(() => {
          window.scrollTo(0, savedScroll);
        }, 150);
        return () => clearTimeout(timer);
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [location.pathname, isDrawerOpen, navType, location.state]);

  // Restore scroll for AllBlogs drawer
  useEffect(() => {
    if (isAllPosts && allBlogsRef.current) {
      const savedScroll = scrollPositions.current['/all-posts'] || 0;
      if (location.state?.restoreScroll) {
        const timer = setTimeout(() => {
          if (allBlogsRef.current) {
            allBlogsRef.current.scrollTop = savedScroll;
          }
        }, 150);
        return () => clearTimeout(timer);
      } else {
        allBlogsRef.current.scrollTop = 0;
      }
    }
  }, [isAllPosts, location.state]);

  // Restore scroll for Connections drawer
  useEffect(() => {
    if (isConnections && connectionsRef.current) {
      const savedScroll = scrollPositions.current['/connections'] || 0;
      if (location.state?.restoreScroll) {
        const timer = setTimeout(() => {
          if (connectionsRef.current) {
            connectionsRef.current.scrollTop = savedScroll;
          }
        }, 150);
        return () => clearTimeout(timer);
      } else {
        connectionsRef.current.scrollTop = 0;
      }
    }
  }, [isConnections, location.state]);

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

  const handleAllBlogsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    scrollPositions.current['/all-posts'] = e.currentTarget.scrollTop;
  };

  const handleConnectionsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    scrollPositions.current['/connections'] = e.currentTarget.scrollTop;
  };

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
        <AnimatePresence mode="popLayout">
          {(() => {
            const viewKey = isBaseHidden ? location.pathname : 'main-view';
            return (
              <motion.div 
                key={viewKey}
                className="row-start-1 col-start-1 h-full w-full bg-[var(--bg)] origin-center"
                initial={{ opacity: 0, y: 15 }}
                animate={{ 
                  opacity: 1,
                  y: 0,
                  scale: isDrawerOpen ? 0.95 : 1,
                  filter: isDrawerOpen ? 'brightness(0.65)' : 'brightness(1)',
                  borderRadius: isDrawerOpen ? '24px' : '0px',
                }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ 
                  opacity: { duration: 0.25, ease: "easeInOut" },
                  y: { duration: 0.25, ease: "easeInOut" },
                  scale: { type: "spring", stiffness: 300, damping: 30 },
                  filter: { duration: 0.3 },
                  borderRadius: { duration: 0.3 }
                }}
              >
                {/* Render Home directly to prevent unmounting and re-triggering entry animations */}
                {viewKey === 'main-view' ? <Home /> : <Outlet />}
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* Side-Drawer Overlay Panel for All Blogs */}
        <AnimatePresence>
          {isAllPosts && (
            <motion.div
              ref={allBlogsRef}
              onScroll={handleAllBlogsScroll}
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
              ref={connectionsRef}
              onScroll={handleConnectionsScroll}
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
