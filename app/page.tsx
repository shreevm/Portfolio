'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, GraduationCap, Code, Heart, Eye, Sparkles, 
  Github, ArrowRight, User, Terminal, FolderGit2, BookOpen, AlertCircle,
  Mail, Phone, ExternalLink, Send, CheckCircle, School, BookMarked, Linkedin
} from 'lucide-react';
import { VideoIntro } from '@/components/VideoIntro';
import { ThreeLayer } from '@/components/ThreeLayer';
import { AdminDashboard } from '@/components/AdminDashboard';

// Structures
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

// Initial Resume Database Seeding for Projects and Experiences
const DEFAULT_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'CareMind: Agentic Clinical RAG Assistant',
    subtitle: 'May - Jun 2026',
    description: [
      'Built an agentic RAG system using LangGraph for multi-step query routing across document retrieval, report comparison, and medical education workflows over synthetic medical PDFs.',
      'Engineered an MCP tool server for document search, report comparison, and timeline extraction; integrated tool-call results into cited answers using NVIDIA NIM embeddings and Supabase vector search.',
      'Deployed a React frontend with a FastAPI backend, Redis response cache, and a repeatable evaluation pipeline measuring route accuracy and citation pass rate; accessible via both web and VS Code extension.'
    ],
    techStack: ['Python', 'FastAPI', 'LangGraph', 'Supabase', 'Redis', 'NVIDIA NIM', 'MCP', 'React', 'TypeScript'],
    githubLink: 'https://github.com/shreevm/CareMind/tree/new_CareMind',
    likes: 245,
    views: 1104,
    featured: true
  },
  {
    id: '2',
    title: 'Multi-Image Super Resolution for Prostate MRI using CNN & GAN',
    subtitle: 'High-Fidelity Clinical Super-Resolution Pipeline',
    description: [
      'Developed a multi-image super-resolution pipeline to reconstruct missing or low-resolution prostate MRI slices.',
      'Evaluated CNN, SRGAN, and diffusion-based models with a focus on anatomical consistency, minimizing hallucinated structures that could mislead biological or clinical interpretation.',
      'Analyzed tradeoffs between perceptual sharpness and structural fidelity using PSNR, SSIM, and qualitative anatomical assessment to ensure reconstructed images remained biologically plausible.'
    ],
    techStack: ['PyTorch', 'CNN', 'SRGAN', 'Diffusion Models', 'OpenCV', 'NumPy'],
    githubLink: 'https://github.com/shreevm/Prostate-MRI-Super-Res',
    likes: 184,
    views: 832,
    featured: true
  },
  {
    id: '3',
    title: 'Multimodal Spoken Command Recognition',
    subtitle: 'Audio-Text-Fusion with Cross-Attention Networks',
    description: [
      'Developed a multimodal command classification model by fusing audio embeddings from Wav2Vec2 and semantic embeddings from BERT using cross-attention and Transformer decoders.',
      'Integrated Pinecone vector retrieval to semantically enhance inference, retrieving the most relevant text command based on input audio embeddings.',
      'Explored fusion strategies and highlighted generalization challenges under noisy conditions to improve robustness.'
    ],
    techStack: ['PyTorch', 'Hugging Face', 'Wav2Vec2', 'BERT', 'Pinecone', 'Scikit-learn'],
    githubLink: 'https://github.com/shreevm/Multimodal-Command-Recognition',
    likes: 145,
    views: 651
  },
  {
    id: '4',
    title: 'COGNITO-MAP: Automated Question Classifier via Bloom\'s Taxonomy',
    subtitle: 'Document Extraction & Insights Dashboard',
    description: [
      'Built a scalable ETL pipeline to extract & transform questions from PDFs into MongoDB for downstream analytics.',
      'Achieved a 94% accuracy rate for question extraction from PDF documents by using the Gemini model.',
      'Utilized Flask and React.js for the frontend, MongoDB for data management, and designed dashboards with Chart.js, providing users with insights into cognitive levels based on Bloom\'s Taxonomy.'
    ],
    techStack: ['Flask', 'React.js', 'MongoDB', 'Pinecone', 'Chart.js', 'TypeScript', 'Gemini API'],
    githubLink: 'https://github.com/shreevm/COGNITO-MAP',
    likes: 199,
    views: 902
  }
];

const DEFAULT_EXPERIENCES: Experience[] = [
  {
    id: 'exp-1',
    role: 'Machine Learning Engineering Co-op',
    organization: 'University of Florida-IPPD | AGIS Inc',
    period: 'AUG 2025 – APR 2026',
    bullets: [
      'Built an end-to-end pipeline that captures video/image streams, reconstructs them into 3D assets using 2D Gaussian Splatting (2DGS), and integrates them into Unity for real-time interactive visualization.',
      'Designed and trained neural reconstruction models (3DGS/2DGS, COLMAP/GLOMAP) on multi-view data to generate high-fidelity meshes and point clouds; selected 2DGS for its superior exportable mesh quality over 3DGS.',
      'Accelerated large-scale reconstruction and rendering using NVIDIA B200 GPU clusters with CUDA nightly builds, significantly improving training throughput and pipeline scalability.',
      'Investigated real-time vs. offline processing tradeoffs to optimize computational efficiency, reducing reconstruction latency and enabling practical deployment workflows.'
    ]
  },
  {
    id: 'exp-2',
    role: 'Machine Learning Researcher',
    organization: 'University of Florida-Trustworthy Engineered-Autonomy Lab',
    period: 'SEPT 2025 – APR 2026',
    bullets: [
      'Designed and executed experiments generating videos with Wan 2.1 T2V 1.3B and HunyuanVideo from T2VCompBench and ViBe benchmark prompts, systematically quantifying semantic discrepancies between prompts and generated content.',
      'Developed a fine-grained hallucination taxonomy identifying object omissions, attribute mismatches, spatial relationship errors, and semantic drift across video generation stages.',
      'Benchmarked automated hallucination detection using Qwen3-VL and other VLMs on severity-level classification; evaluated using Balanced Accuracy, Macro F1, AUROC, and AUPRC.'
    ]
  },
  {
    id: 'exp-3',
    role: 'Global People Analytics Intern',
    organization: 'Ford Motor Company',
    period: 'AUG 2023 – OCT 2023',
    bullets: [
      'Conducted statistical analysis and forecasting on time series forecasting models such as Autoregressive Integrated Moving Average (ARIMA), Vector Autoregression (VAR), and Vector Error Correction Model (VECM) and non-time series models, such as Lasso and Ridge regression, to determine optimal female incumbency.',
      'Developed ETL pipelines in Python to predict salary costs using workforce datasets containing 1,000+ employee records, improving model accuracy by 20% through exploratory data analysis, feature engineering, and data quality improvements.',
      'Applied statistical techniques to support HR strategy and workforce planning initiatives.'
    ]
  },
  {
    id: 'exp-4',
    role: 'Software Engineer Intern',
    organization: 'Spacescan Ltd',
    period: 'SEPT 2022 – JAN 2023',
    bullets: [
      'Built and maintained responsive web interfaces in React.js, integrating REST APIs documented with Swagger to enable seamless frontend-backend communication over PostgreSQL databases.',
      'Developed reusable, scalable UI components with robust state management patterns, reducing code duplication and improving long-term maintainability of the application.',
      'Contributed to the React Native mobile app, implementing new features and participating in frontend architecture discussions to ensure consistency across web and mobile platforms.'
    ]
  }
];

const SKILL_DOMAINS = [
  {
    index: "01",
    title: "AI / ML & Deep Learning",
    skills: ["PyTorch", "TensorFlow", "Keras", "Hugging Face Transformers", "Scikit-learn", "CUDA"]
  },
  {
    index: "02",
    title: "Generative AI & LLM Engineering",
    skills: ["LangGraph", "LlamaIndex", "RAG", "OpenAI API", "Gemini API", "Prompt Engineering"]
  },
  {
    index: "03",
    title: "Computer Vision & Multimodal AI",
    skills: ["OpenCV", "Gaussian Splatting (2DGS/3DGS)", "COLMAP", "Diffusion Models", "Neural Rendering"]
  },
  {
    index: "04",
    title: "PROGRAMMING LANGUAGES",
    skills: ["Python", "TypeScript", "JavaScript", "Java", "C/C++"]
  },
  {
    index: "05",
    title: "Backend & Frontend",
    skills: ["FastAPI", "Flask", "Node.js", "React.js", "React Native", "REST APIs"]
  },
  {
    index: "06",
    title: "Databases & Vector Stores",
    skills: ["PostgreSQL", "MongoDB", "Pinecone", "Firebase"]
  },
  {
    index: "07",
    title: "MLOps & DevOps",
    skills: ["Docker", "Git", "CI/CD", "Weights & Biases", "Grafana", "Azure", "Linux"]
  },
  {
    index: "08",
    title: "Data & Visualization",
    skills: ["Pandas", "NumPy", "Matplotlib", "PowerBI"]
  }
];

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [showAdminConsole, setShowAdminConsole] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  
  // Selection and highlight state
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [likedProjects, setLikedProjects] = useState<Record<string, boolean>>({});

  // Timeline interaction states
  const [hoveredExpId, setHoveredExpId] = useState<string | null>(null);
  const [expandedExps, setExpandedExps] = useState<Record<string, boolean>>({
    'exp-1': true,
    'exp-2': true,
    'exp-3': false,
    'exp-4': false
  });

  // Navigation State
  const [activeSection, setActiveSection] = useState('hero');

  // Trigger loading and database seeding
  const refreshPortfolioData = () => {
    if (typeof window !== 'undefined') {
      // 1. Resolve Projects
      let localProjsLst = localStorage.getItem('sv_projects');
      if (!localProjsLst) {
        localStorage.setItem('sv_projects', JSON.stringify(DEFAULT_PROJECTS));
        localProjsLst = JSON.stringify(DEFAULT_PROJECTS);
      }
      
      // 2. Resolve Experiences
      let localExpsLst = localStorage.getItem('sv_experience');
      let shouldForceUpdate = false;
      if (localExpsLst) {
        // Enforce update if stale structures or old system texts are encountered
        if (localExpsLst.includes('IPPD | AGIS INC') || !localExpsLst.includes('University of Florida - IPPD & AGIS Inc')) {
          shouldForceUpdate = true;
        }
      }
      if (!localExpsLst || shouldForceUpdate) {
        localStorage.setItem('sv_experience', JSON.stringify(DEFAULT_EXPERIENCES));
        localExpsLst = JSON.stringify(DEFAULT_EXPERIENCES);
      }

      const parsedProjs: Project[] = JSON.parse(localProjsLst);
      const migratedProjs = parsedProjs.map(project => {
        if (project.id !== '1') {
          return project;
        }

        const defaultCareMind = DEFAULT_PROJECTS[0];
        return {
          ...project,
          title: defaultCareMind.title,
          subtitle: defaultCareMind.subtitle,
          description: defaultCareMind.description,
          techStack: defaultCareMind.techStack,
          githubLink: defaultCareMind.githubLink,
          featured: defaultCareMind.featured
        };
      });

      if (JSON.stringify(migratedProjs) !== JSON.stringify(parsedProjs)) {
        localStorage.setItem('sv_projects', JSON.stringify(migratedProjs));
      }

      const parsedExps: Experience[] = JSON.parse(localExpsLst);

      setProjects(migratedProjs);
      setExperiences(parsedExps);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
      refreshPortfolioData();
    }, 0);
    
    // Add 1 view increment to all projects upon landing
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const localProjsLst = localStorage.getItem('sv_projects');
        if (localProjsLst) {
          const parsed: Project[] = JSON.parse(localProjsLst);
          const incremental = parsed.map(p => ({ ...p, views: (p.views || 0) + 1 }));
          localStorage.setItem('sv_projects', JSON.stringify(incremental));
          setProjects(incremental);
        }
      }
    }, 1500);

    // Track active scrolling sections
    const handleScroll = () => {
      const sections = ['hero', 'about', 'projects', 'skills', 'experience', 'education', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Soft smooth scrolling implementation
  const scrollToIdGrid = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Like increment tracker
  const handleLikeProject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Avoid triggering full card expand

    if (likedProjects[id]) return; // Single like per session

    const updatedProjects = projects.map(p => {
      if (p.id === id) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    });

    localStorage.setItem('sv_projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
    setLikedProjects(prev => ({ ...prev, [id]: true }));
  };

  // Get unique tech tags
  const allTags = Array.from(
    new Set(projects.flatMap(p => p.techStack))
  ).sort();

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#080808] text-gray-100 font-sans" />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#080808] text-gray-100 font-sans overflow-x-hidden selection:bg-orange-500/30 selection:text-white">
      
      {/* Ambient glass-glow background lights */}
      <div className="glow-bg absolute top-0 left-0 w-full h-[600px] pointer-events-none opacity-80" />
      <div className="glow-bg-alt absolute bottom-20 right-0 w-[800px] h-[800px] pointer-events-none opacity-40" />

      {/* Cinematic Particle Canvas underneath primary items */}
      <ThreeLayer />

      {/* Floating Header Navbar Bar */}
      <nav id="floating-navbar" className="fixed top-0 inset-x-0 h-16 bg-[#080808]/70 backdrop-blur-xl border-b border-white/5 z-50 transition-all">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <button 
            onClick={() => scrollToIdGrid('hero')}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <span className="text-sm font-mono font-bold tracking-[0.25em] text-white">
              SVM
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 group-hover:scale-150 transition-transform" />
          </button>

          {/* Desktop Navigation Paths */}
          <div className="hidden md:flex items-center gap-6 text-xs font-mono tracking-wider">
            {[
              { id: 'about', label: 'About' },
              { id: 'projects', label: 'Projects' },
              { id: 'skills', label: 'Skills' },
              { id: 'experience', label: 'Experience' },
              { id: 'education', label: 'Education' },
              { id: 'contact', label: 'Contact' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => scrollToIdGrid(tab.id)}
                className={`relative py-1 cursor-pointer transition-all ${
                  activeSection === tab.id ? 'text-orange-400 font-semibold font-mono' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
                {activeSection === tab.id && (
                  <motion.div 
                    layoutId="navbar-indicator" 
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-500" 
                  />
                )}
              </button>
            ))}
          </div>

          <button 
            onClick={() => scrollToIdGrid('contact')}
            className="px-4 py-1.5 rounded-full bg-orange-600/10 border border-orange-500/25 text-orange-400 hover:bg-orange-600 hover:text-white transition-all text-xs font-mono cursor-pointer"
          >
            Connect
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen">
        <VideoIntro onScrollNext={() => scrollToIdGrid('about')} />
      </section>

      {/* MAIN CONTAINER BACKGROUND GRADIENT */}
      <div className="relative bg-gradient-to-b from-[#080808] via-zinc-950 to-[#080808] z-30 pt-16">

        {/* ABOUT ME SECTION */}
        <section id="about" className="py-24 px-6 max-w-4xl mx-auto scroll-mt-20">
          <div className="text-center md:text-left mb-12">
            <h2 className="text-3xl md:text-5xl font-sans font-black text-white tracking-tight mt-2 uppercase">
              ABOUT SHREE
            </h2>
            <div className="space-y-6 text-base text-gray-300 leading-relaxed font-sans mt-8 text-justify md:text-left">
              <p>
                It started with a curiosity that refused to stay shallow. During my undergraduate studies in Information Technology, I wasn&apos;t just interested in how software worked. I wanted to build systems that made a real impact. That drive took me from developing web applications at Spacescan to building forecasting models at Ford Motor Company, where I saw how data driven solutions influence real world decisions.
              </p>
              <p>
                As I built more systems, I became increasingly interested in understanding why AI models behave the way they do, especially when they fail. That question led me to pursue a Master&apos;s in Artificial Intelligence Systems at the University of Florida, where I have worked on evaluating hallucinations in text to video models, developing clinical RAG systems designed for reliability, and building 3D reconstruction pipelines using neural rendering and Gaussian Splatting.
              </p>
              <p>
                Today, my interests lie at the intersection of Generative AI, Computer Vision, Multimodal Learning, and Machine Learning Systems. I enjoy transforming research ideas into scalable applications and building AI systems that are both innovative and trustworthy.
              </p>
              <p className="text-orange-400 font-mono text-sm border-l-2 border-orange-500 pl-4 py-1 mt-8">
                Currently seeking opportunities in AI/ML Engineering, Applied AI, Computer Vision, NLP, and Machine Learning Research.
              </p>
            </div>
          </div>
        </section>
        
        {/* EXPERIENCE SECTION */}
        <section id="experience" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 scroll-mt-20">
          <div className="text-center md:text-left mb-16">
            <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-widest mb-3">
              <Building2 size={14} />
              <span>Professional Journey</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-sans font-black text-white tracking-tight mt-2 uppercase">
              Work & Research
            </h2>
          </div>

          <div className="space-y-6 max-w-4xl">
            {experiences.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative rounded-xl border border-white/10 bg-white/[0.01] hover:border-orange-500/30 hover:bg-white/[0.02] transition-all p-6 md:p-8 group"
              >
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
                
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                      {exp.role}
                    </h3>
                    <p className="text-sm text-orange-400/80 font-mono mt-1">
                      {exp.organization}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-gray-500 whitespace-nowrap pl-4">
                    {exp.period}
                  </span>
                </div>

                <ul className="space-y-2.5">
                  {exp.bullets.map((bullet, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-300 leading-relaxed">
                      <span className="text-orange-400/60 flex-shrink-0 mt-1.5">▸</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
          <div className="text-center md:text-left mb-12">
            <h2 
              id="projects-header-title"
              className="text-3xl md:text-5xl font-sans font-black text-white tracking-tight mt-2 uppercase"
            >
              PROJECTS
            </h2>
          </div>

          {/* Interactive Skill highlight filter */}
          <div className="flex flex-wrap items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-mono text-gray-500 uppercase mr-2">Highlight:</span>
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-full text-xs font-mono tracking-wide transition-all cursor-pointer ${
                selectedTag === null 
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-950/20' 
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              All Systems ({projects.length})
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-3 py-1 rounded-full text-xs font-mono tracking-wide transition-all cursor-pointer ${
                  tag === selectedTag 
                    ? 'bg-orange-500 text-white shadow-sm' 
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Responsive Grid layout for projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {projects
              .filter(p => selectedTag === null || p.techStack.includes(selectedTag))
              .map((project, idx) => (
                <motion.div
                  key={project.id}
                  layout
                  onClick={() => setSelectedProjectId(project.id === selectedProjectId ? null : project.id)}
                  className={`group relative glass-card p-6 md:p-8 cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-[300px] overflow-hidden ${
                    project.id === selectedProjectId 
                      ? 'border-orange-500/60 bg-orange-500/5 shadow-[0_10px_35px_rgba(242,125,38,0.08)]' 
                      : 'hover:border-orange-500/30 hover:bg-white/[0.01]'
                  }`}
                >
                  {/* Glowing decorative indicator */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-500/10 via-transparent to-transparent pointer-events-none" />

                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/10 text-orange-400 group-hover:scale-105 transition-transform">
                        <FolderGit2 size={20} />
                      </div>
                    </div>

                    <div className="text-xs font-serif italic text-orange-400/90 mt-6 mb-1">
                      System Architecture 0{idx + 1}
                    </div>

                    <h3 className="text-xl font-sans font-bold text-white tracking-tight mt-1 leading-snug group-hover:text-orange-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-orange-400/80 font-mono mt-1 uppercase tracking-wider">
                      {project.subtitle}
                    </p>

                    <p className="text-sm text-gray-400 font-sans mt-4 line-clamp-3 leading-relaxed">
                      {project.description[0]}
                    </p>
                  </div>

                  <div>
                    {/* Tech categories list */}
                    <div className="flex flex-wrap gap-1.5 mt-6">
                      {project.techStack.map(tech => (
                        <span 
                          key={tech} 
                          className={`text-[10px] font-mono px-2.5 py-0.5 rounded-md transition-colors ${
                            tech === selectedTag 
                              ? 'bg-orange-500 text-white' 
                              : 'bg-white/5 text-gray-400'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Bento Expanded details toggle button */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6">
                      <span className="text-xs font-mono text-orange-400/80 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        {project.id === selectedProjectId ? 'Collapse specs' : 'Expand full specs'}
                        <ArrowRight size={12} />
                      </span>

                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
                          title="Open GitHub repository"
                        >
                          <Github size={15} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Expandable Bento specifications */}
                  <AnimatePresence>
                    {project.id === selectedProjectId && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-orange-500/20 pt-4 mt-4 space-y-3">
                          <p className="text-xs font-mono text-orange-300 uppercase tracking-widest flex items-center gap-1">
                            <Terminal size={12} /> Architect Highlights:
                          </p>
                          <ul className="list-disc list-inside text-xs text-gray-300 space-y-2 leading-relaxed">
                            {project.description.map((bullet, idx) => (
                              <li key={idx} className="marker:text-orange-500 pl-1">
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
          </div>
        </section>

        {/* SKILLS CARDS SECTION */}
        <section id="skills" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 scroll-mt-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-sans font-black text-white tracking-tight mt-2 uppercase">
              Core Stack Expertise
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {SKILL_DOMAINS.map((domain) => (
              <div 
                key={domain.index} 
                className="p-6 glass-card hover:border-orange-500/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xs font-mono text-orange-400 uppercase tracking-widest mb-4">
                    {domain.index} / {domain.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {domain.skills.map(s => (
                      <span 
                        key={s} 
                        className="text-[11px] bg-white/5 border border-white/10 hover:border-orange-500/30 text-gray-300 px-2.5 py-1.5 rounded-lg transition-colors select-none"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EDUCATION SECTION */}
        <section id="education" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 scroll-mt-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-sans font-black text-white tracking-tight mt-2 uppercase">
              Education
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* University of Florida */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-6 md:p-8 shadow-[0_20px_50px_rgba(249,115,22,0.03)] overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
              
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex-shrink-0">
                      <School size={32} className="stroke-1" />
                    </div>
                    <div>
                      <h3 className="text-xl font-sans font-bold text-white tracking-tight">
                        University of Florida
                      </h3>
                      <p className="text-xs font-mono text-gray-500 uppercase mt-0.5">
                        Gainesville, Florida
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-mono font-medium text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full px-2.5 py-1">
                      GPA: 3.90/4.0
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-white">
                    Masters in Artificial Intelligence Systems
                  </p>
                  <p className="text-xs font-mono text-gray-400 mt-1">
                    Aug 2024 - May 2026
                  </p>
                </div>

                <div className="mt-6 border-t border-white/5 pt-4">
                  <h4 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-semibold">
                    <BookMarked size={12} /> Relevant Coursework
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Deep Learning in Medical Image Analysis",
                      "ML for AI systems",
                      "Applied Deep Learning",
                      "AI ethics",
                      "Computational Photography & AI Systems Project"
                    ].map((course) => (
                      <span key={course} className="text-[11px] bg-white/5 border border-white/15 text-gray-300 px-2.5 py-1 rounded-lg">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Loyola-ICAM */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-6 md:p-8 shadow-[0_20px_50px_rgba(249,115,22,0.03)] overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
              
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex-shrink-0">
                      <School size={32} className="stroke-1" />
                    </div>
                    <div>
                      <h3 className="text-xl font-sans font-bold text-white tracking-tight leading-snug">
                        Loyola-ICAM College of Engineering and Technology
                      </h3>
                      <p className="text-xs font-mono text-gray-500 uppercase mt-0.5">
                        India
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-[11px] font-mono font-medium text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full px-2.5 py-1">
                      CGPA: 8.43/10
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold text-white">
                    Bachelor of Technology in Information Technology
                  </p>
                  <p className="text-xs font-mono text-gray-400 mt-1">
                    Sept 2020 - May 2024
                  </p>
                </div>

                <div className="mt-6 border-t border-white/5 pt-4">
                  <h4 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-semibold">
                    <BookMarked size={12} /> Relevant Coursework
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "OOP principles",
                      "Computational Intelligence",
                      "Cryptography & Network Security",
                      "Design and Analysis of Algorithms",
                      "Big data Analytics",
                      "Linear algebra",
                      "Statistics",
                      "Computer Graphics",
                      "Database Management Systems",
                      "Ecommerce",
                      "Object Oriented Analysis and Design & Data Structures"
                    ].map((course) => (
                      <span key={course} className="text-[11px] bg-white/5 border border-white/15 text-gray-300 px-2.5 py-1 rounded-lg">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* GET IN TOUCH SECTION */}
        <section id="contact" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5 scroll-mt-20">
          <div className="max-w-3xl mx-auto">
            
            {/* Get In Touch specified messaging & visual placeholders */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-widest mb-3">
                  <Mail size={14} />
                  <span>Reach Out</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-sans font-black text-white tracking-tight uppercase leading-none">
                  Get In Touch
                </h2>
                <div className="space-y-4 text-sm md:text-base text-gray-300 font-sans mt-6 leading-relaxed">
                  <p className="font-medium text-white text-base md:text-lg">
                    Always open to the right opportunity, an interesting problem, or just a chat over coffee ☕
                  </p>
                  <p className="text-gray-400 text-sm">
                    Open to new opportunities, collaborations and interesting projects. Reach out any time.
                  </p>
                </div>
              </div>

              {/* Dynamic Visual Placeholders / Fields */}
              <div className="space-y-4">
                {/* Email Field Card */}
                <div className="group p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-orange-500/30 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-400">
                      <Mail size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-gray-500 uppercase">Email Address</p>
                      <p className="text-sm font-mono text-white mt-0.5 select-text">shreevaraamangai@gmail.com</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:shreevaraamangai@gmail.com"
                    className="p-1 px-3 text-[10px] font-mono rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all hover:bg-orange-600/10"
                  >
                    Send Email
                  </a>
                </div>

                {/* Phone Field Card */}
                <div className="group p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-orange-500/30 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-400">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-gray-500 uppercase">Phone Number</p>
                      <p className="text-sm font-mono text-white mt-0.5 select-text">+1(904)-420-9650</p>
                    </div>
                  </div>
                  <a 
                    href="tel:+19044209650"
                    className="p-1 px-3 text-[10px] font-mono rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all hover:bg-orange-600/10"
                  >
                    Call
                  </a>
                </div>

                {/* Socials Card */}
                <div className="group p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-orange-500/30 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-400">
                      <Linkedin size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-gray-500 uppercase">Professional Networks</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <a 
                          href="https://linkedin.com/in/shreevaraamangaiv" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-orange-400 hover:underline"
                        >
                          LinkedIn
                        </a>
                        <span className="text-gray-600">•</span>
                        <a 
                          href="https://github.com/shreevm" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-orange-400 hover:underline"
                        >
                          GitHub
                        </a>
                        <span className="text-gray-600">•</span>
                        <a 
                          href="https://medium.com/@shreevaraamangai" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-orange-400 hover:underline"
                        >
                          Medium
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-gray-500">Connected</div>
                </div>

                {/* Resume Card */}
                <div className="group p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-orange-500/30 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-400">
                      <BookOpen size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-gray-500 uppercase">Resume / CV</p>
                      <p className="text-sm font-mono text-white mt-0.5">Download Latest</p>
                    </div>
                  </div>
                  <a 
                    href="/images/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 px-3 text-[10px] font-mono rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all hover:bg-orange-600/10"
                  >
                    View
                  </a>
                </div>
              </div>
            </div>

          </div>


        </section>

        {/* Footer info box */}
        <footer className="border-t border-white/5 py-12 px-6 text-center text-xs font-mono text-gray-500">
          <p className="tracking-wide text-gray-400 italic">
            (Always curious. Always building. Open to what&apos;s next)
          </p>
          <p className="mt-2 text-[10px] text-orange-500/40">
            © 2026 Shree Varaa Mangai V • Gainesville, Florida
          </p>
        </footer>

      </div>

    </div>
  );
}
