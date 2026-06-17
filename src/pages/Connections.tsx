import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { X, Search } from 'lucide-react';
import { getAllConnections, Connection } from '../utils/content';

export default function Connections() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Load all connections on compile/render
  const connections = useMemo(() => getAllConnections(), []);

  const filteredConnections = connections.filter(conn => 
    conn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conn.relation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conn.content.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] relative overflow-hidden">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)] z-30 py-3 sm:py-6">
        <div className="w-full px-4 sm:px-10 md:px-14 flex items-center justify-between gap-3 sm:gap-4">
          <h1 className="text-xs min-[375px]:text-sm min-[420px]:text-base sm:text-xl md:text-2xl lg:text-3xl font-display font-bold uppercase tracking-widest text-[var(--text)] truncate shrink-0">
            Connections
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

      {/* Connections List Grid */}
      <main className="flex-grow w-full px-6 sm:px-10 md:px-14 py-8 sm:py-10">
        {(() => {
          if (filteredConnections.length === 0) {
            return (
              <div className="py-12 text-center text-[var(--secondary)] font-body">
                No connections found matching "{searchTerm}".
              </div>
            );
          }

          // Group by category
          const grouped = filteredConnections.reduce((acc, conn) => {
            const cat = conn.category || 'Others';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(conn);
            return acc;
          }, {} as Record<string, Connection[]>);

          // Sort categories: Cousins first, Friends second, Others last, rest alphabetically
          const orderedCategories = Object.keys(grouped).sort((a, b) => {
            const aLow = a.toLowerCase();
            const bLow = b.toLowerCase();
            if (aLow === 'cousins') return -1;
            if (bLow === 'cousins') return 1;
            if (aLow === 'friends') return -1;
            if (bLow === 'friends') return 1;
            if (aLow === 'others') return 1;
            if (bLow === 'others') return -1;
            return a.localeCompare(b);
          });

          return orderedCategories.map((cat) => (
            <div key={cat} className="mb-12">
              <h2 className="text-lg sm:text-xl font-display font-bold text-[var(--text)] mb-6 uppercase tracking-wider border-b border-[var(--border)] pb-2 flex items-center">
                {cat}
                <span className="ml-3 px-2 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--secondary)]">
                  {grouped[cat].length}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {grouped[cat].map((conn, idx) => (
                  <motion.div
                    key={conn.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.01, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/connection/${conn.slug}`)}
                      className="group cursor-pointer flex items-center gap-4 p-6 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] rounded-2xl transition-colors duration-300 shadow-sm hover:shadow-md h-full"
                    >
                      {conn.avatar_image ? (
                        <motion.img
                          layoutId={`avatar-${conn.id}`}
                          src={conn.avatar_image}
                          alt={conn.name}
                          className="w-14 h-14 rounded-full object-cover border border-[var(--border)] group-hover:border-[var(--accent)] transition-colors shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[var(--secondary)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)] transition-colors flex items-center justify-center font-display font-bold text-lg shrink-0">
                          {getInitials(conn.name)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="font-mono text-[10px] text-[var(--secondary)] uppercase tracking-wider block mb-1">
                          {conn.relation}
                        </span>
                        <h3 className="text-xl font-display font-bold text-[var(--text)] truncate">
                          {conn.name}
                        </h3>
                        <p className="font-body text-xs text-[var(--secondary)] line-clamp-1 mt-1">
                          {conn.content.replace(/<[^>]+>|#[^\s]+/g, '').slice(0, 80)}...
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          ));
        })()}
      </main>
    </div>
  );
}
