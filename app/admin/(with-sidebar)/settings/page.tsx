'use client';

import { useState, useEffect } from 'react';

interface BlogSettings {
  blog_title: string;
  blog_description: string;
  profile_name: string;
  profile_subtitle: string;
}

interface Category {
  id: string;
  name: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<BlogSettings>({
    blog_title: '',
    blog_description: '',
    profile_name: '',
    profile_subtitle: '',
  });
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    fetchSettings();
    fetchCategories();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    setSettingsMessage('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSettingsMessage('Settings saved successfully.');
        setTimeout(() => setSettingsMessage(''), 3000);
      } else {
        setSettingsMessage('Failed to save settings.');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSettingsMessage('Failed to save settings.');
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleAddCategory = async () => {
    const id = newCategoryId.trim().toLowerCase();
    const name = newCategoryName.trim();
    if (!id || !name) return;

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name }),
      });
      if (res.ok) {
        const added = await res.json();
        setCategories((prev) => [...prev, added]);
        setNewCategoryId('');
        setNewCategoryName('');
      }
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  const handleUpdateCategory = async (id: string) => {
    const name = editingName.trim();
    if (!name) return;

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name }),
      });
      if (res.ok) {
        setCategories((prev) =>
          prev.map((c) => (c.id === id ? { ...c, name } : c))
        );
        setEditingId(null);
        setEditingName('');
      }
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm(`"${id}" 카테고리를 삭제하시겠습니까?`)) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-6 py-10">
      <h1 className="text-heading-lg font-bold text-foreground mb-8">Settings</h1>

      {/* Blog Info Section */}
      <section className="bg-card border border-card-border rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          Blog Info
        </h2>

        {settingsLoading ? (
          <p className="text-muted text-sm">로딩 중...</p>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Blog Title
              </label>
              <input
                type="text"
                value={settings.blog_title}
                onChange={(e) =>
                  setSettings({ ...settings, blog_title: e.target.value })
                }
                className="w-full rounded-lg border border-card-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary"
                placeholder="My Blog"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Blog Description
              </label>
              <input
                type="text"
                value={settings.blog_description}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    blog_description: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-card-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary"
                placeholder="A personal blog about..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Profile Name
              </label>
              <input
                type="text"
                value={settings.profile_name}
                onChange={(e) =>
                  setSettings({ ...settings, profile_name: e.target.value })
                }
                className="w-full rounded-lg border border-card-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Profile Subtitle
              </label>
              <input
                type="text"
                value={settings.profile_subtitle}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    profile_subtitle: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-card-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary"
                placeholder="Developer, Writer, ..."
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSaveSettings}
                disabled={settingsSaving}
                className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors disabled:opacity-50"
              >
                {settingsSaving ? 'Saving...' : 'Save'}
              </button>
              {settingsMessage && (
                <span
                  className={`text-sm ${
                    settingsMessage.includes('success')
                      ? 'text-primary'
                      : 'text-primary'
                  }`}
                >
                  {settingsMessage}
                </span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Category Management Section */}
      <section className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          Categories
        </h2>

        {categoriesLoading ? (
          <p className="text-muted text-sm">로딩 중...</p>
        ) : (
          <>
            <div className="space-y-2 mb-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-3 px-4 py-3 bg-surface rounded-lg"
                >
                  <span className="text-xs font-mono text-muted w-[80px] shrink-0">
                    {category.id}
                  </span>

                  {editingId === category.id ? (
                    <>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter')
                            handleUpdateCategory(category.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="flex-1 rounded-lg border border-card-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary"
                        autoFocus
                      />
                      <button
                        onClick={() => handleUpdateCategory(category.id)}
                        className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs font-medium text-muted hover:text-foreground transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm text-foreground">
                        {category.name}
                      </span>
                      <button
                        onClick={() => {
                          setEditingId(category.id);
                          setEditingName(category.name);
                        }}
                        className="text-subtle hover:text-foreground transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Add new category */}
            <div className="flex items-center gap-3 pt-4 border-t border-card-border">
              <input
                type="text"
                value={newCategoryId}
                onChange={(e) => setNewCategoryId(e.target.value)}
                placeholder="ID (e.g. travel)"
                className="w-[120px] rounded-lg border border-card-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCategory();
                }}
                placeholder="Name (e.g. 여행)"
                className="flex-1 rounded-lg border border-card-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary"
              />
              <button
                onClick={handleAddCategory}
                disabled={!newCategoryId.trim() || !newCategoryName.trim()}
                className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
