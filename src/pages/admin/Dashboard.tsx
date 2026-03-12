import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { FileText, Plus, LogOut, Settings, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface Post {
  id: number;
  title: string;
  slug: string;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetch('/api/posts/admin')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch posts');
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [user, navigate]);

  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000); // Reset after 3 seconds
      return;
    }

    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== id));
      }
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete post');
    }
  };

  const [confirmDemo, setConfirmDemo] = useState(false);
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);

  const handleDemo = async () => {
    if (isGeneratingDemo) return;
    
    if (!confirmDemo) {
      setConfirmDemo(true);
      setTimeout(() => setConfirmDemo(false), 3000); // Reset after 3 seconds
      return;
    }
    
    setIsGeneratingDemo(true);
    try {
      const postsRes = await fetch('/api/posts/demo', { method: 'POST' });
      if (!postsRes.ok) {
        const err = await postsRes.text();
        console.error('Posts demo failed:', postsRes.status, err);
        throw new Error('Failed to generate posts demo');
      }

      const settingsRes = await fetch('/api/settings/demo', { method: 'POST' });
      if (!settingsRes.ok) {
        const err = await settingsRes.text();
        console.error('Settings demo failed:', settingsRes.status, err);
        throw new Error('Failed to generate settings demo');
      }

      const data = await fetch('/api/posts/admin', { cache: 'no-store' }).then(r => r.json());
      setPosts(data);
      setConfirmDemo(false);
    } catch (error) {
      console.error('Failed to generate demo content', error);
      alert('Failed to generate demo content. Check console for details.');
    } finally {
      setIsGeneratingDemo(false);
    }
  };

  const publishedCount = posts.filter((p) => p.status === 'Published').length;
  const draftCount = posts.filter((p) => p.status === 'Draft').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[var(--text)] font-display font-bold text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-[var(--text)] mb-2">Dashboard</h1>
          <p className="text-[var(--secondary)] font-mono text-sm uppercase tracking-wider">
            Welcome back, {user?.email}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleDemo}
            disabled={isGeneratingDemo}
            className={`flex items-center px-4 py-3 border rounded-lg font-display font-bold transition-all shadow-sm ${
              isGeneratingDemo ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              confirmDemo 
                ? 'bg-red-500 text-white border-red-600 hover:bg-red-600' 
                : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--bg)]'
            }`}
          >
            {isGeneratingDemo ? 'Generating...' : confirmDemo ? 'Click again to confirm' : 'Demo Mode'}
          </button>
          <Link
            to="/admin/editor"
            className="flex items-center px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-display font-bold hover:bg-opacity-90 transition-all shadow-md"
          >
            <Plus size={20} className="mr-2" /> New Post
          </Link>
          <button
            onClick={logout}
            className="flex items-center p-3 text-[var(--secondary)] hover:text-[var(--accent)] hover:bg-[var(--surface)] rounded-lg transition-all border border-transparent hover:border-[var(--border)]"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Total Posts', value: posts.length, icon: FileText },
          { label: 'Published', value: publishedCount, icon: FileText, color: 'text-green-500' },
          { label: 'Drafts', value: draftCount, icon: FileText, color: 'text-yellow-500' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[var(--secondary)] font-mono text-sm uppercase tracking-wider mb-2">{stat.label}</p>
              <p className="text-4xl font-display font-bold text-[var(--text)]">{stat.value}</p>
            </div>
            <stat.icon size={48} className={`opacity-20 ${stat.color || 'text-[var(--text)]'}`} />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-xl font-display font-bold text-[var(--text)] mb-6 uppercase tracking-widest border-b border-[var(--border)] pb-2">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/settings"
            className="flex items-center px-6 py-3 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded-lg font-display font-bold hover:bg-[var(--bg)] transition-all shadow-sm"
          >
            <Settings size={20} className="mr-2 text-[var(--accent)]" /> Edit About Section
          </Link>
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <h2 className="text-xl font-display font-bold text-[var(--text)] mb-6 uppercase tracking-widest border-b border-[var(--border)] pb-2">
          Recent Posts
        </h2>
        
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-[var(--surface)] rounded-xl border border-[var(--border)] border-dashed">
            <p className="text-[var(--secondary)] font-body mb-4">No posts found. Start writing!</p>
            <Link
              to="/admin/editor"
              className="inline-flex items-center px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-display font-bold hover:bg-opacity-90 transition-all shadow-md"
            >
              <Plus size={20} className="mr-2" /> Create First Post
            </Link>
          </div>
        ) : (
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--bg)]/50">
                    <th className="p-4 font-mono text-xs text-[var(--secondary)] uppercase tracking-wider">Title</th>
                    <th className="p-4 font-mono text-xs text-[var(--secondary)] uppercase tracking-wider">Status</th>
                    <th className="p-4 font-mono text-xs text-[var(--secondary)] uppercase tracking-wider">Date</th>
                    <th className="p-4 font-mono text-xs text-[var(--secondary)] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)]/30 transition-colors">
                      <td className="p-4">
                        <p className="font-display font-bold text-[var(--text)] text-lg">{post.title}</p>
                        <p className="font-mono text-xs text-[var(--secondary)] mt-1">/{post.slug}</p>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold ${
                          post.status === 'Published' 
                            ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                            : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-sm text-[var(--secondary)]">
                        {format(new Date(post.created_at), 'MMM dd, yyyy')}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/editor/${post.id}`}
                            className="p-2 text-[var(--secondary)] hover:text-[var(--text)] hover:bg-[var(--bg)] rounded-md transition-colors border border-transparent hover:border-[var(--border)]"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className={`p-2 rounded-md transition-colors border ${
                              deleteConfirm === post.id
                                ? 'bg-red-500 text-white border-red-600 hover:bg-red-600'
                                : 'text-[var(--secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 border-transparent hover:border-[var(--accent)]/20'
                            }`}
                            title={deleteConfirm === post.id ? "Click again to delete" : "Delete"}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
