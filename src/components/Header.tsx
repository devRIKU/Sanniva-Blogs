import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--bg)]/80 border-b border-[var(--border)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <span className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-[var(--text)] group-hover:opacity-90 transition-opacity">
            Sanniva
          </span>
          <span className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-[var(--accent)] group-hover:opacity-90 transition-opacity">
            /Blogs
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--surface)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
