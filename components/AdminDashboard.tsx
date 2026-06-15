'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, Unlock, Plus, Trash2, Edit2, Check, X, 
  MessageSquare, Layers, TrendingUp, Heart, Eye, LogOut, CheckCircle, Mail, Clock
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string[];
  techStack: string[];
  githubLink?: string;
  likes: number;
  views: number;
  featured?: boolean;
}

interface Experience {
  id: string;
  role: string;
  organization: string;
  period: string;
  bullets: string[];
}

export function AdminDashboard({ 
  onRefreshData 
}: { 
  onRefreshData: () => void 
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Tab State: 'projects' | 'experience' | 'inbox'
  const [activeTab, setActiveTab] = useState<'projects' | 'experience' | 'inbox'>('projects');

  // Dashboard Data states derived from localStorage
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  // Editing form states
  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [projForm, setProjForm] = useState({
    title: '',
    subtitle: '',
    descriptionText: '', // split by newline
    techStackText: '', // split by comma
    githubLink: '',
    likes: 0,
    views: 0
  });

  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [expForm, setExpForm] = useState({
    role: '',
    organization: '',
    period: '',
    bulletsText: '' // split by newline
  });

  // Load all stats and datasets
  const loadData = () => {
    if (typeof window !== 'undefined') {
      const storedProjs = JSON.parse(localStorage.getItem('sv_projects') || '[]');
      const storedExps = JSON.parse(localStorage.getItem('sv_experience') || '[]');
      const storedInbox = JSON.parse(localStorage.getItem('sv_inbox') || '[]');
      setProjects(storedProjs);
      setExperiences(storedExps);
      setMessages(storedInbox);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      loadData();
    }, 0);
  }, [isLoggedIn]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.toLowerCase() === 'admin' && password === 'shreevaraamangai') {
      setIsLoggedIn(true);
      setErrorMsg('');
      setUsername('');
      setPassword('');
    } else {
      setErrorMsg('Incorrect authentication credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // --- Project CRUD ---
  const handleStartAddProject = () => {
    setEditingProjId('new');
    setProjForm({
      title: '',
      subtitle: '',
      descriptionText: '',
      techStackText: '',
      githubLink: '',
      likes: 0,
      views: 0
    });
  };

  const handleStartEditProject = (p: Project) => {
    setEditingProjId(p.id);
    setProjForm({
      title: p.title,
      subtitle: p.subtitle,
      descriptionText: p.description.join('\n'),
      techStackText: p.techStack.join(', '),
      githubLink: p.githubLink || '',
      likes: p.likes,
      views: p.views
    });
  };

  const handleSaveProject = () => {
    if (!projForm.title || !projForm.subtitle) {
      alert('Title and Subtitle are required.');
      return;
    }

    const updatedProjects = [...projects];
    const descArr = projForm.descriptionText.split('\n').filter(line => line.trim().length > 0);
    const techArr = projForm.techStackText.split(',').map(s => s.trim()).filter(s => s.length > 0);

    if (editingProjId === 'new') {
      const newProj: Project = {
        id: Date.now().toString(),
        title: projForm.title,
        subtitle: projForm.subtitle,
        description: descArr,
        techStack: techArr,
        githubLink: projForm.githubLink || undefined,
        likes: projForm.likes || 0,
        views: projForm.views || 0
      };
      updatedProjects.push(newProj);
    } else {
      const idx = updatedProjects.findIndex(p => p.id === editingProjId);
      if (idx !== -1) {
        updatedProjects[idx] = {
          ...updatedProjects[idx],
          title: projForm.title,
          subtitle: projForm.subtitle,
          description: descArr,
          techStack: techArr,
          githubLink: projForm.githubLink || undefined,
          likes: projForm.likes,
          views: projForm.views
        };
      }
    }

    localStorage.setItem('sv_projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
    setEditingProjId(null);
    onRefreshData();
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const filtered = projects.filter(p => p.id !== id);
      localStorage.setItem('sv_projects', JSON.stringify(filtered));
      setProjects(filtered);
      onRefreshData();
    }
  };

  // --- Experience CRUD ---
  const handleStartAddExperience = () => {
    setEditingExpId('new');
    setExpForm({
      role: '',
      organization: '',
      period: '',
      bulletsText: ''
    });
  };

  const handleStartEditExperience = (e: Experience) => {
    setEditingExpId(e.id);
    setExpForm({
      role: e.role,
      organization: e.organization,
      period: e.period,
      bulletsText: e.bullets.join('\n')
    });
  };

  const handleSaveExperience = () => {
    if (!expForm.role || !expForm.organization) {
      alert('Role and Organization are required.');
      return;
    }

    const updatedExps = [...experiences];
    const bulletsArr = expForm.bulletsText.split('\n').filter(line => line.trim().length > 0);

    if (editingExpId === 'new') {
      const newExp: Experience = {
        id: Date.now().toString(),
        role: expForm.role,
        organization: expForm.organization,
        period: expForm.period,
        bullets: bulletsArr
      };
      updatedExps.push(newExp);
    } else {
      const idx = updatedExps.findIndex(e => e.id === editingExpId);
      if (idx !== -1) {
        updatedExps[idx] = {
          ...updatedExps[idx],
          role: expForm.role,
          organization: expForm.organization,
          period: expForm.period,
          bullets: bulletsArr
        };
      }
    }

    localStorage.setItem('sv_experience', JSON.stringify(updatedExps));
    setExperiences(updatedExps);
    setEditingExpId(null);
    onRefreshData();
  };

  const handleDeleteExperience = (id: string) => {
    if (confirm('Are you sure you want to delete this experience record?')) {
      const filtered = experiences.filter(e => e.id !== id);
      localStorage.setItem('sv_experience', JSON.stringify(filtered));
      setExperiences(filtered);
      onRefreshData();
    }
  };

  // --- Inbox Message Handlers ---
  const handleDeleteMessage = (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      const filtered = messages.filter(m => m.id !== id);
      localStorage.setItem('sv_inbox', JSON.stringify(filtered));
      setMessages(filtered);
    }
  };

  const handleToggleReadMessage = (id: string) => {
    const updated = messages.map(m => m.id === id ? { ...m, read: !m.read } : m);
    localStorage.setItem('sv_inbox', JSON.stringify(updated));
    setMessages(updated);
  };

  // Quick stats calculations
  const totalViews = projects.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalLikes = projects.reduce((acc, curr) => acc + (curr.likes || 0), 0);

  return (
    <div id="admin-dashboard-root" className="w-full max-w-5xl mx-auto glass-card p-6 md:p-10 min-h-[500px] transition-all duration-300 hover:border-orange-500/30">
      
      {!isLoggedIn ? (
        /* Secure login interface with demo-ready details */
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto py-8"
        >
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-4 shadow-sm">
              <Lock size={20} />
            </div>
            <h3 className="text-xl font-sans font-extrabold text-white tracking-tight">
              Secure Administration Access
            </h3>
            <p className="text-xs text-gray-400 font-sans tracking-wide mt-2">
              Log in to dynamically modify research, projects, or view contact submissions.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">
                Username Identifier
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-orange-500/50 outline-none transition-all font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">
                Secret Access Phrase
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-orange-500/50 outline-none transition-all font-mono"
              />
            </div>

            {errorMsg && (
              <p className="text-xs font-mono text-red-400 text-center bg-red-950/25 border border-red-500/15 p-2.5 rounded">
                ⚠️ {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-sans font-medium py-3 rounded-lg text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <Unlock size={14} />
              <span>Verify and Unlock</span>
            </button>
          </form>


        </motion.div>
      ) : (
        /* Full admin controls */
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Header Dashboard section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <h3 className="text-xl font-sans font-bold text-white tracking-tight">
                  Console Control Panel
                </h3>
              </div>
              <p className="text-xs text-gray-400 font-sans tracking-wide mt-1">
                Authentic dashboard managing real-time portfolio elements directly.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-red-950/20 hover:border-red-500/30 text-gray-300 hover:text-red-400 text-xs transition-all font-mono cursor-pointer"
            >
              <LogOut size={13} />
              <span>Terminate Session</span>
            </button>
          </div>

          {/* Quick Metrics grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-400">
                <Layers size={18} />
              </div>
              <div>
                <p className="text-[10px] font-mono text-gray-400 uppercase">Projects</p>
                <p className="text-lg font-sans font-bold text-white">{projects.length}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400">
                <TrendingUp size={18} />
              </div>
              <div>
                <p className="text-[10px] font-mono text-gray-400 uppercase">Experience</p>
                <p className="text-lg font-sans font-bold text-white">{experiences.length}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-red-500/10 text-red-400">
                <Heart size={18} className="animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-gray-400 uppercase">Likes Logged</p>
                <p className="text-lg font-sans font-bold text-white">{totalLikes}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                <MessageSquare size={18} />
              </div>
              <div>
                <p className="text-[10px] font-mono text-gray-400 uppercase">Messages Received</p>
                <p className="text-lg font-sans font-bold text-white">{messages.length}</p>
              </div>
            </div>
          </div>

          {/* Tab Selection */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => { setActiveTab('projects'); setEditingProjId(null); }}
              className={`px-4 py-2.5 text-xs font-mono font-medium tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                activeTab === 'projects' 
                  ? 'border-orange-500 text-orange-400 bg-white/5' 
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              📁 Projects Database ({projects.length})
            </button>
            <button
              onClick={() => { setActiveTab('experience'); setEditingExpId(null); }}
              className={`px-4 py-2.5 text-xs font-mono font-medium tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                activeTab === 'experience' 
                  ? 'border-orange-500 text-orange-400 bg-white/5' 
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              🎓 Experience / Research ({experiences.length})
            </button>
            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-4 py-2.5 text-xs font-mono font-medium tracking-wider uppercase border-b-2 transition-all cursor-pointer relative ${
                activeTab === 'inbox' 
                  ? 'border-orange-500 text-orange-400 bg-white/5' 
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              📥 Contact Inbox ({messages.filter(m => !m.read).length} unread)
              {messages.filter(m => !m.read).length > 0 && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="mt-4">
            
            {/* PROJECTS tab */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                {editingProjId === null ? (
                  <>
                    <div className="flex justify-end">
                      <button
                        onClick={handleStartAddProject}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-mono transition-colors cursor-pointer"
                      >
                        <Plus size={14} />
                        Add New Project
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projects.map(p => (
                        <div 
                          key={p.id} 
                          className="p-5 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col justify-between"
                        >
                          <div>
                            <h4 className="text-base font-sans font-bold text-white">{p.title}</h4>
                            <p className="text-xs text-orange-400/80 font-mono mt-1">{p.subtitle}</p>
                            <p className="text-xs text-gray-400 font-sans mt-3 line-clamp-2">
                              {p.description[0]}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-3">
                              {p.techStack.map(t => (
                                <span key={t} className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-gray-300">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                            <div className="flex items-center gap-3 text-[11px] font-mono text-gray-400">
                              <span className="flex items-center gap-1"><Heart size={11} className="text-red-400" /> {p.likes || 0}</span>
                              <span className="flex items-center gap-1"><Eye size={11} className="text-blue-400" /> {p.views || 0}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleStartEditProject(p)}
                                className="p-1.5 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                                title="Edit project"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteProject(p.id)}
                                className="p-1.5 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 transition-all cursor-pointer"
                                title="Delete project"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  /* Create / Edit Project form */
                  <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02] space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <h4 className="text-sm font-mono font-medium text-white">
                        {editingProjId === 'new' ? '✨ Add New Project Entry' : '📝 Edit Project Entry'}
                      </h4>
                      <button onClick={() => setEditingProjId(null)} className="text-gray-400 hover:text-white cursor-pointer">
                        <X size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase">Project Title</label>
                        <input
                          type="text"
                          value={projForm.title}
                          onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase">Subheading / Tech Role</label>
                        <input
                          type="text"
                          value={projForm.subtitle}
                          onChange={(e) => setProjForm({ ...projForm, subtitle: e.target.value })}
                          placeholder="e.g., Clinical QA System Using LLaMA"
                          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase">Tech Stack (comma-separated)</label>
                      <input
                        type="text"
                        value={projForm.techStackText}
                        onChange={(e) => setProjForm({ ...projForm, techStackText: e.target.value })}
                        placeholder="Python, PyTorch, LangChain, Pinecone, LLaMA"
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase">GitHub Repository Link (optional)</label>
                      <input
                        type="text"
                        value={projForm.githubLink}
                        onChange={(e) => setProjForm({ ...projForm, githubLink: e.target.value })}
                        placeholder="https://github.com/shreevm/..."
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase">Bullet Descriptions (one per line)</label>
                      <textarea
                        rows={4}
                        value={projForm.descriptionText}
                        onChange={(e) => setProjForm({ ...projForm, descriptionText: e.target.value })}
                        placeholder="Built a Retrieval-Augmented Generation (RAG) system...&#10;Developed a semantic retrieval pipeline..."
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase">Mock Likes Count</label>
                        <input
                          type="number"
                          value={projForm.likes}
                          onChange={(e) => setProjForm({ ...projForm, likes: parseInt(e.target.value) || 0 })}
                          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase">Mock Views Count</label>
                        <input
                          type="number"
                          value={projForm.views}
                          onChange={(e) => setProjForm({ ...projForm, views: parseInt(e.target.value) || 0 })}
                          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        onClick={() => setEditingProjId(null)}
                        className="px-4 py-2 border border-white/10 bg-transparent text-gray-400 hover:text-white rounded-lg text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProject}
                        className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                      >
                        <Check size={14} />
                        Save Project
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* EXPERIENCE tab */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                {editingExpId === null ? (
                  <>
                    <div className="flex justify-end">
                      <button
                        onClick={handleStartAddExperience}
                        className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-mono rounded-lg transition-colors cursor-pointer"
                      >
                        <Plus size={14} />
                        Add New Experience
                      </button>
                    </div>

                    <div className="space-y-3">
                      {experiences.map(e => (
                        <div 
                          key={e.id}
                          className="p-5 rounded-xl border border-white/5 bg-white/[0.01]/30 flex flex-col md:flex-row justify-between items-start gap-4"
                        >
                          <div>
                            <h4 className="text-base font-sans font-bold text-white">{e.role}</h4>
                            <p className="text-xs text-orange-400 font-mono mt-0.5">{e.organization}</p>
                            <p className="text-xs text-gray-500 font-mono mt-1">{e.period}</p>
                            <ul className="list-disc list-inside text-xs text-gray-400 mt-3 space-y-1">
                              {e.bullets.slice(0, 2).map((b, i) => <li key={i} className="line-clamp-1">{b}</li>)}
                            </ul>
                          </div>

                          <div className="flex items-center gap-2 self-end md:self-start">
                            <button
                              onClick={() => handleStartEditExperience(e)}
                              className="p-1.5 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteExperience(e.id)}
                              className="p-1.5 rounded bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 transition-all cursor-pointer"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  /* Create / Edit Experience Form */
                  <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02] space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <h4 className="text-sm font-mono font-medium text-white">
                        {editingExpId === 'new' ? '✨ Add New Work Record' : '📝 Edit Work Record'}
                      </h4>
                      <button onClick={() => setEditingExpId(null)} className="text-gray-400 hover:text-white cursor-pointer">
                        <X size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase">Role / Title</label>
                        <input
                          type="text"
                          value={expForm.role}
                          onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase">Organization</label>
                        <input
                          type="text"
                          value={expForm.organization}
                          onChange={(e) => setExpForm({ ...expForm, organization: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase">Period (e.g., AUG 2025 – APR 2026)</label>
                        <input
                          type="text"
                          value={expForm.period}
                          onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase">Description Bullets (one per line)</label>
                      <textarea
                        rows={5}
                        value={expForm.bulletsText}
                        onChange={(e) => setExpForm({ ...expForm, bulletsText: e.target.value })}
                        placeholder="Developed standard pipeline solutions...&#10;Collaborated with frontend and backend developers..."
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white resize-none"
                      />
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        onClick={() => setEditingExpId(null)}
                        className="px-4 py-2 border border-white/10 bg-transparent text-gray-400 hover:text-white rounded-lg text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveExperience}
                        className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                      >
                        <Check size={14} />
                        Save Record
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* REAL-TIME CONTACT INBOX tab */}
            {activeTab === 'inbox' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-400 font-mono">
                  Messages received via the contact form on your portfolio landing page:
                </p>

                {messages.length === 0 ? (
                  <div className="text-center py-10 rounded-xl border border-dashed border-white/10 text-gray-500 text-xs font-mono">
                    🕳️ Inbox is empty. Submit a contact request to see it appear here!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((m: any) => (
                      <div 
                        key={m.id}
                        className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                          m.read 
                            ? 'bg-white/[0.01] border-white/5 text-gray-400' 
                            : 'bg-orange-950/10 border-orange-500/20 text-white'
                        }`}
                      >
                        <div>
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-sans font-bold text-sm text-white flex items-center gap-1">
                                {m.name}
                              </span>
                              <span className="text-[10px] text-gray-500 font-mono flex items-center gap-0.5">
                                <Mail size={10} /> {m.email}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-500 font-mono flex items-center gap-0.5">
                              <Clock size={10} /> {new Date(m.dateMs).toLocaleDateString()} {new Date(m.dateMs).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>

                          {m.subject && (
                            <p className="text-xs font-bold text-orange-400 font-sans mt-2">
                              RE: {m.subject}
                            </p>
                          )}

                          <p className="text-xs font-sans text-gray-300 mt-2.5 whitespace-pre-wrap select-text selection:bg-orange-500/30">
                            {m.message}
                          </p>
                        </div>

                        <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-3.5 mt-3.5">
                          <button
                            onClick={() => handleToggleReadMessage(m.id)}
                            className="flex items-center gap-1 text-[10px] font-mono hover:text-white bg-white/5 border border-white/10 px-2 py-1 rounded cursor-pointer transition-colors"
                          >
                            <CheckCircle size={10} />
                            <span>{m.read ? 'Mark Unread' : 'Mark Read'}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(m.id)}
                            className="flex items-center gap-1 text-[10px] font-mono text-red-500 hover:text-red-400 bg-white/5 border border-white/10 px-2 py-1 rounded cursor-pointer transition-colors"
                          >
                            <Trash2 size={10} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </motion.div>
      )}
    </div>
  );
}
