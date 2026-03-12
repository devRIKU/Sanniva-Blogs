import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Save, Check, Image as ImageIcon, Link as LinkIcon, X } from 'lucide-react';

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('Draft');
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      LinkExtension.configure({
        openOnClick: false,
      }),
    ],
    content: '',
    onUpdate: () => {
      setSaved(false);
    },
  });

  const addImage = async () => {
    const choice = window.prompt('Type "url" to add an image from a link, or "upload" to upload a file:', 'upload');
    
    if (choice?.toLowerCase() === 'url') {
      const url = window.prompt('Enter image URL:');
      if (url) {
        editor?.chain().focus().setImage({ src: url }).run();
      }
      return;
    }

    if (choice?.toLowerCase() === 'upload') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        if (input.files?.length) {
          const file = input.files[0];
          const formData = new FormData();
          formData.append('image', file);
          
          try {
            const res = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });
            const data = await res.json();
            if (res.ok && data.url) {
              editor?.chain().focus().setImage({ src: data.url }).run();
            } else {
              alert(data.error || 'Failed to upload image');
            }
          } catch (error) {
            console.error('Failed to upload image', error);
            alert('Failed to upload image');
          }
        }
      };
      input.click();
    }
  };

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (id) {
      fetch(`/api/posts/admin/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Post not found');
          return res.json();
        })
        .then((data) => {
          setTitle(data.title);
          setSlug(data.slug);
          setCoverImage(data.cover_image || '');
          setTags(data.tags || '');
          setStatus(data.status);
          setFeatured(data.featured === 1);
          if (editor) {
            editor.commands.setContent(data.content);
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id, user, navigate, editor]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!id && title && !slug) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  }, [title, id, slug]);

  const handleSave = useCallback(async () => {
    if (!title || !slug) {
      setError('Title and Slug are required');
      return;
    }

    setSaving(true);
    setError('');

    const postData = {
      title,
      slug,
      content: editor?.getHTML() || '',
      cover_image: coverImage,
      tags,
      status,
      featured,
    };

    try {
      const url = id ? `/api/posts/${id}` : '/api/posts';
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save post');
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

      if (!id && data.id) {
        navigate(`/admin/editor/${data.id}`, { replace: true });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [id, title, slug, editor, coverImage, tags, status, featured, navigate]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!id || !title || !slug || saved || saving) return;

    const interval = setInterval(() => {
      handleSave();
    }, 30000);

    return () => clearInterval(interval);
  }, [id, title, slug, saved, saving, handleSave]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[var(--text)] font-display font-bold text-2xl">Loading editor...</div>
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
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center">
          <Link to="/admin" className="mr-4 p-2 text-[var(--secondary)] hover:text-[var(--text)] hover:bg-[var(--surface)] rounded-full transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-display font-bold text-[var(--text)]">
            {id ? 'Edit Post' : 'New Post'}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {saved && (
            <span className="flex items-center text-green-500 font-mono text-sm uppercase tracking-wider">
              <Check size={16} className="mr-1" /> Saved
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-display font-bold hover:bg-opacity-90 transition-all shadow-md disabled:opacity-50"
          >
            <Save size={20} className="mr-2" /> {saving ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-[var(--accent)]/10 border border-[var(--accent)] text-[var(--accent)] rounded-lg text-sm font-mono text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-mono text-[var(--secondary)] uppercase tracking-wider mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] text-[var(--text)] font-display font-bold text-2xl transition-colors"
              placeholder="Post Title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-mono text-[var(--secondary)] uppercase tracking-wider mb-2">
              Content
            </label>
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 p-2 border-b border-[var(--border)] bg-[var(--bg)]/50">
                <button
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`p-2 rounded hover:bg-[var(--surface)] transition-colors font-bold ${editor?.isActive('bold') ? 'bg-[var(--surface)] text-[var(--accent)]' : 'text-[var(--text)]'}`}
                >
                  B
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded hover:bg-[var(--surface)] transition-colors italic ${editor?.isActive('italic') ? 'bg-[var(--surface)] text-[var(--accent)]' : 'text-[var(--text)]'}`}
                >
                  I
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`p-2 rounded hover:bg-[var(--surface)] transition-colors font-bold ${editor?.isActive('heading', { level: 2 }) ? 'bg-[var(--surface)] text-[var(--accent)]' : 'text-[var(--text)]'}`}
                >
                  H2
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={`p-2 rounded hover:bg-[var(--surface)] transition-colors font-bold ${editor?.isActive('heading', { level: 3 }) ? 'bg-[var(--surface)] text-[var(--accent)]' : 'text-[var(--text)]'}`}
                >
                  H3
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`p-2 rounded hover:bg-[var(--surface)] transition-colors ${editor?.isActive('bulletList') ? 'bg-[var(--surface)] text-[var(--accent)]' : 'text-[var(--text)]'}`}
                >
                  • List
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                  className={`p-2 rounded hover:bg-[var(--surface)] transition-colors ${editor?.isActive('blockquote') ? 'bg-[var(--surface)] text-[var(--accent)]' : 'text-[var(--text)]'}`}
                >
                  " Quote
                </button>
                <div className="w-px h-6 bg-[var(--border)] mx-1"></div>
                <button
                  onClick={setLink}
                  className={`p-2 rounded hover:bg-[var(--surface)] transition-colors ${editor?.isActive('link') ? 'bg-[var(--surface)] text-[var(--accent)]' : 'text-[var(--text)]'}`}
                  title="Add Link"
                >
                  <LinkIcon size={18} />
                </button>
                <button
                  onClick={addImage}
                  className="p-2 rounded hover:bg-[var(--surface)] transition-colors text-[var(--text)]"
                  title="Add Image"
                >
                  <ImageIcon size={18} />
                </button>
              </div>
              <EditorContent editor={editor} className="min-h-[400px]" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
            <h3 className="text-lg font-display font-bold text-[var(--text)] mb-4 uppercase tracking-widest border-b border-[var(--border)] pb-2">
              Publishing
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-mono text-[var(--secondary)] uppercase tracking-wider mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] text-[var(--text)] font-body transition-colors"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-mono text-[var(--secondary)] uppercase tracking-wider mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] text-[var(--text)] font-mono text-sm transition-colors"
                />
              </div>

              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)] bg-[var(--bg)]"
                />
                <label htmlFor="featured" className="ml-2 text-sm font-body text-[var(--text)]">
                  Feature on Homepage
                </label>
              </div>
            </div>
          </div>

          <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
            <h3 className="text-lg font-display font-bold text-[var(--text)] mb-4 uppercase tracking-widest border-b border-[var(--border)] pb-2">
              Media & Meta
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-mono text-[var(--secondary)] uppercase tracking-wider mb-2">
                  Cover Image
                </label>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="Enter image URL..."
                    className="w-full px-4 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] text-[var(--text)] font-mono text-sm transition-colors"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--secondary)] font-body">OR</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        const formData = new FormData();
                        formData.append('image', file);
                        
                        try {
                          const res = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData,
                          });
                          const data = await res.json();
                          if (res.ok && data.url) {
                            setCoverImage(data.url);
                          } else {
                            alert(data.error || 'Failed to upload image');
                          }
                        } catch (error) {
                          alert('Failed to upload image');
                        }
                      }}
                      className="text-sm text-[var(--text)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent)] file:text-white hover:file:bg-opacity-90 transition-all cursor-pointer"
                    />
                  </div>
                </div>
                {coverImage && (
                  <div className="mt-4 rounded-lg overflow-hidden border border-[var(--border)] relative group">
                    <img src={coverImage} alt="Cover preview" className="w-full h-48 object-cover" />
                    <button
                      onClick={() => setCoverImage('')}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-mono text-[var(--secondary)] uppercase tracking-wider mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="design, tech, life"
                  className="w-full px-4 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] text-[var(--text)] font-body transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
