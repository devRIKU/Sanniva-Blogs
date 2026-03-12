import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Save, Check } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [aboutText, setAboutText] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [collaborationsUrl, setCollaborationsUrl] = useState('');
  const [projectsUrl, setProjectsUrl] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetch('/api/settings')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch settings');
        return res.json();
      })
      .then((data) => {
        setAboutText(data.about_text || '');
        setPortfolioUrl(data.portfolio_url || '');
        setCollaborationsUrl(data.collaborations_url || '');
        setProjectsUrl(data.projects_url || '');
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [user, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          about_text: aboutText,
          portfolio_url: portfolioUrl,
          collaborations_url: collaborationsUrl,
          projects_url: projectsUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[var(--text)] font-display font-bold text-2xl">Loading settings...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center">
          <Link to="/admin" className="mr-4 p-2 text-[var(--secondary)] hover:text-[var(--text)] hover:bg-[var(--surface)] rounded-full transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-display font-bold text-[var(--text)]">
            Site Settings
          </h1>
        </div>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-[var(--accent)]/10 border border-[var(--accent)] text-[var(--accent)] rounded-lg text-sm font-mono text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-[var(--surface)] p-8 rounded-xl border border-[var(--border)] shadow-sm">
          <h2 className="text-xl font-display font-bold text-[var(--text)] mb-6 uppercase tracking-widest border-b border-[var(--border)] pb-2">
            Beyond The Blog
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-mono text-[var(--secondary)] uppercase tracking-wider mb-2">
                About Text
              </label>
              <textarea
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] text-[var(--text)] font-body transition-colors resize-none"
                placeholder="Looking for more? Explore my portfolio..."
                required
              />
              <p className="mt-2 text-xs font-mono text-[var(--secondary)]">
                This text appears in the "Beyond The Blog" section on the homepage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-mono text-[var(--secondary)] uppercase tracking-wider mb-2">
                  Portfolio URL
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] text-[var(--text)] font-mono text-sm transition-colors"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-[var(--secondary)] uppercase tracking-wider mb-2">
                  Collaborations URL
                </label>
                <input
                  type="url"
                  value={collaborationsUrl}
                  onChange={(e) => setCollaborationsUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] text-[var(--text)] font-mono text-sm transition-colors"
                  placeholder="https://..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-mono text-[var(--secondary)] uppercase tracking-wider mb-2">
                  Side Projects URL
                </label>
                <input
                  type="url"
                  value={projectsUrl}
                  onChange={(e) => setProjectsUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] text-[var(--text)] font-mono text-sm transition-colors"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--surface)] p-8 rounded-2xl border border-[var(--border)] shadow-sm">
            <h3 className="text-xl font-display font-bold text-[var(--text)] mb-6 uppercase tracking-widest border-b border-[var(--border)] pb-4">
              Obsidian / Notion Integration
            </h3>
            <div className="space-y-4">
              <p className="text-[var(--secondary)] font-body">
                You can use an Obsidian plugin (like "Obsidian Webhooks") or a custom Notion integration to publish directly to this blog.
              </p>
              <div className="bg-[var(--bg)] p-4 rounded-lg border border-[var(--border)]">
                <p className="text-sm font-mono text-[var(--secondary)] mb-2 uppercase tracking-wider">Webhook URL</p>
                <code className="text-[var(--accent)] text-sm break-all">
                  {window.location.origin}/api/posts/webhook/obsidian
                </code>
              </div>
              <div className="bg-[var(--bg)] p-4 rounded-lg border border-[var(--border)]">
                <p className="text-sm font-mono text-[var(--secondary)] mb-2 uppercase tracking-wider">Authentication</p>
                <p className="text-sm text-[var(--text)] font-body mb-2">
                  Send a <code className="bg-[var(--surface)] px-1 rounded">Bearer</code> token in the <code className="bg-[var(--surface)] px-1 rounded">Authorization</code> header using your <code className="bg-[var(--surface)] px-1 rounded">OBSIDIAN_SECRET</code>.
                </p>
                <p className="text-xs text-[var(--secondary)] font-mono">
                  Default: obsidian-secret-key
                </p>
              </div>
              <div className="bg-[var(--bg)] p-4 rounded-lg border border-[var(--border)]">
                <p className="text-sm font-mono text-[var(--secondary)] mb-2 uppercase tracking-wider">Payload Format (JSON)</p>
                <pre className="text-xs text-[var(--text)] font-mono overflow-x-auto">
{`{
  "title": "My New Post",
  "slug": "my-new-post",
  "content": "<p>HTML or Markdown content</p>",
  "tags": "obsidian, notes",
  "status": "Published",
  "cover_image": "https://...",
  "featured": true
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          {saved && (
            <span className="flex items-center text-green-500 font-mono text-sm uppercase tracking-wider">
              <Check size={16} className="mr-1" /> Saved Successfully
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-8 py-4 bg-[var(--accent)] text-white rounded-lg font-display font-bold text-lg hover:bg-opacity-90 transition-all shadow-md disabled:opacity-50"
          >
            <Save size={20} className="mr-2" /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
