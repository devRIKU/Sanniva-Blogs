import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-20 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-sm font-mono text-[var(--secondary)]">
        <div className="mb-4 sm:mb-0">
          Made With Love <span className="text-[var(--accent)]">❤️</span>
        </div>
        <div>
          ©{new Date().getFullYear()} Sanniva Chatterjee
        </div>
      </div>
    </footer>
  );
}
