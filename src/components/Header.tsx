import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--bg)]/80 border-b border-[var(--border)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center group flex-shrink min-w-0" onClick={() => setIsOpen(false)}>
          <span className="font-display font-extrabold text-xl sm:text-3xl tracking-tight text-[var(--text)] group-hover:opacity-90 transition-opacity truncate">
            Sanniva
          </span>
          <span className="font-display font-extrabold text-xl sm:text-3xl tracking-tight text-[var(--accent)] group-hover:opacity-90 transition-opacity truncate">
            /Blogs
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center space-x-6">
          <Link 
            to="/connections" 
            className="font-display font-bold text-sm sm:text-base text-[var(--text)] hover:text-[var(--accent)] transition-colors"
          >
            Connections
          </Link>
          <Link 
            to="/all-posts" 
            className="font-display font-bold text-sm sm:text-base text-[var(--text)] hover:text-[var(--accent)] transition-colors"
          >
            All Posts
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--surface)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Controls */}
        <div className="flex sm:hidden items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--surface)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full hover:bg-[var(--surface)] text-[var(--text)] transition-colors flex items-center justify-center"
            aria-label="Toggle mobile menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="sm:hidden overflow-hidden border-t border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-md"
          >
            <div className="px-6 py-4 flex flex-col space-y-4">
              <Link 
                to="/connections" 
                onClick={() => setIsOpen(false)}
                className="font-display font-bold text-lg text-[var(--text)] hover:text-[var(--accent)] transition-colors py-2 border-b border-[var(--border)]/30"
              >
                Connections
              </Link>
              <Link 
                to="/all-posts" 
                onClick={() => setIsOpen(false)}
                className="font-display font-bold text-lg text-[var(--text)] hover:text-[var(--accent)] transition-colors py-2"
              >
                All Posts
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
