import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PROFILE,
  FLAGSHIP_SYSTEMS,
  EXPERIENCES,
  ARCHIVE_PROJECTS,
} from './data/portfolioData';
import { useGitHubProjects } from './hooks/useGitHubProjects';
import {
  NeuralCanvasHero,
  HeroDisplayName,
  PointerState,
} from './components/NeuralCanvasHero';
import { InteractiveSystemLab } from './components/InteractiveSystemLab';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import {
  ArrowUpRight,
  Command,
  Download,
  Github,
  Linkedin,
  MapPin,
  Copy,
  Check,
  Layers,
  Cpu,
  Search,
  ChevronDown,
  Terminal,
  Send,
  Menu,
  X,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export type ActivePage = 'home' | 'work' | 'experience' | 'projects' | 'about' | 'contact';
type ArchiveCategory =
  | 'All'
  | 'Full-Stack & Web'
  | 'AI, ML & Agents'
  | '3D & Game Engines'
  | 'Systems & Low-Level';

function getPageFromLocation(): ActivePage {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (path === 'work' || path === 'systems') return 'work';
  if (path === 'experience') return 'experience';
  if (path === 'projects' || path === 'archive') return 'projects';
  if (path === 'about') return 'about';
  if (path === 'contact') return 'contact';
  return 'home';
}

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<ActivePage>(() => getPageFromLocation());
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [scrollSection, setScrollSection] = useState<ActivePage | null>(null);

  // Hero pointer & live 3D tensor counter refs
  const heroBoxRef = useRef<HTMLElement | null>(null);
  const pointerRef = useRef<PointerState>({ x: -9999, y: -9999, last: 0 });
  const counterRef = useRef<HTMLSpanElement | null>(null);

  // Flagship accordion state & per-project active tab ('overview' | 'sandbox' | 'architecture')
  const [openSystemId, setOpenSystemId] = useState<string>('pokefinance');
  const [systemTab, setSystemTab] = useState<
    Record<string, 'overview' | 'sandbox' | 'architecture'>
  >({});

  // Experience architecture spotlight toggle
  const [showSchenckArch, setShowSchenckArch] = useState<boolean>(false);

  // Archive filter state
  const [archiveFilter, setArchiveFilter] = useState<ArchiveCategory>('All');
  const [archiveSearch, setArchiveSearch] = useState<string>('');

  // Modals & UI state
  const [cmdOpen, setCmdOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSending, setContactSending] = useState(false);
  const [contactPopup, setContactPopup] = useState<{
    title: string;
    subtitle: string;
    isError?: boolean;
  } | null>(null);

  // Sync browser back/forward navigation
  useEffect(() => {
    const onPopState = () => {
      setActivePage(getPageFromLocation());
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Track scroll position so the top index stays floating & adapts translucency
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 44);

      const sectionMap: { id: string; page: ActivePage }[] = [
        { id: 'contact', page: 'contact' },
        { id: 'about', page: 'about' },
        { id: 'archive', page: 'projects' },
        { id: 'experience', page: 'experience' },
        { id: 'systems', page: 'work' },
      ];

      // Check which section is right under the floating index dock (top ~48px)
      const dockLine = 56;
      for (const item of sectionMap) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= dockLine && rect.bottom >= dockLine) {
            setScrollSection(item.page);
            return;
          }
        }
      }

      if (activePage === 'home' && y < window.innerHeight * 0.55) {
        setScrollSection(null);
        return;
      }

      const triggerLine = window.innerHeight * 0.36;
      for (const item of sectionMap) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerLine) {
            setScrollSection(item.page);
            return;
          }
        }
      }
      setScrollSection(null);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [activePage]);

  const navigateToPage = useCallback((page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    const nextUrl = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== nextUrl) {
      window.history.pushState({ page }, '', nextUrl);
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const handleCommandNavigate = useCallback(
    (sectionId: string) => {
      if (sectionId === 'top') navigateToPage('home');
      else if (sectionId === 'systems') navigateToPage('work');
      else if (sectionId === 'experience') navigateToPage('experience');
      else if (sectionId === 'archive') navigateToPage('projects');
      else if (sectionId === 'about') navigateToPage('about');
      else if (sectionId === 'contact') navigateToPage('contact');
      else navigateToPage('home');
    },
    [navigateToPage]
  );

  // Global keyboard shortcuts (Ctrl+K / Cmd+K & Escape)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setCmdOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleHeroPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const rect = heroBoxRef.current?.getBoundingClientRect();
    if (rect && e.pointerType !== 'touch') {
      pointerRef.current.x = e.clientX - rect.left;
      pointerRef.current.y = e.clientY - rect.top;
      pointerRef.current.last = performance.now();
    }
  }, []);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contactSending) return;

    const cleanName = contactName.trim();
    const cleanEmail = contactEmail.trim();
    const cleanMsg = contactMessage.trim();

    setContactSending(true);

    try {
      // 1. Try direct personal SMTP / Resend backend first (100% native email, zero third-party wrapper)
      const directRes = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          message: cleanMsg,
        }),
      }).catch(() => null);

      if (directRes && directRes.ok) {
        setContactName('');
        setContactEmail('');
        setContactMessage('');
        setContactPopup({
          title: 'Message sent!',
          subtitle: 'Thanks for reaching out — I’ll get back to you soon.',
        });
        setTimeout(() => setContactPopup(null), 4000);
        return;
      }

      // 2. Fallback: Clean conversational letter format (no dark-blue Name/Value table)
      const formattedLetter = `Hi Kshitij,\n\n${cleanMsg}\n\nBest regards,\n${cleanName}\n${cleanEmail}`;

      const response = await fetch(`https://formsubmit.co/ajax/${PROFILE.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `Message from ${cleanName} (${cleanEmail})`,
          _replyto: cleanEmail,
          email: cleanEmail,
          _template: 'basic',
          _captcha: 'false',
          Message: formattedLetter,
        }),
      });

      await response.json().catch(() => ({}));

      if (response.ok) {
        setContactName('');
        setContactEmail('');
        setContactMessage('');
        setContactPopup({
          title: 'Message sent!',
          subtitle: 'Thanks for reaching out — I’ll get back to you soon.',
        });
        setTimeout(() => setContactPopup(null), 4000);
      } else {
        setContactPopup({
          title: 'Could not send message',
          subtitle: 'Please try again in a moment.',
          isError: true,
        });
        setTimeout(() => setContactPopup(null), 4000);
      }
    } catch {
      setContactPopup({
        title: 'Could not send message',
        subtitle: 'Please check your connection and try again.',
        isError: true,
      });
      setTimeout(() => setContactPopup(null), 4000);
    } finally {
      setContactSending(false);
    }
  };

  // Live GitHub Repository Sync (auto-fetches and auto-adds new repos from github.com/Kshiku12)
  const {
    projects: liveArchiveProjects,
    loading: githubLoading,
    syncNow: syncGitHub,
  } = useGitHubProjects(PROFILE.githubHandle);

  const filteredArchive = liveArchiveProjects.filter((proj) => {
    const matchesCat = archiveFilter === 'All' || proj.category === archiveFilter;
    const q = archiveSearch.trim().toLowerCase();
    const matchesQuery =
      !q ||
      proj.title.toLowerCase().includes(q) ||
      proj.description.toLowerCase().includes(q) ||
      proj.stack.some((s) => s.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  const renderTopHeader = (isSubpage: boolean) => {
    const highlightedId = isSubpage ? activePage : scrollSection;
    const currentView = isSubpage ? (scrollSection || activePage) : scrollSection;
    const isOverLight =
      isScrolled &&
      (currentView === 'work' || currentView === 'projects' || currentView === 'about');

    return (
      <header
        className={`top-nav ${isSubpage ? 'is-subpage' : 'is-hero-nav'} ${
          isScrolled ? 'is-scrolled' : ''
        } ${isOverLight ? 'is-over-light' : ''}`}
      >
        <div className="nav-inner">
          <a
            href="/"
            className="nav-mark"
            aria-label="Kumar Kshitij, Home"
            onClick={(e) => {
              e.preventDefault();
              navigateToPage('home');
            }}
          >
            <span className="nav-mark-letters">{PROFILE.monogram}</span>
            <span className="nav-mark-dot" aria-hidden="true" />
          </a>

          <nav className="nav-pill-dock" aria-label="Primary Navigation">
            {(
              [
                { id: 'work', label: 'Work' },
                { id: 'experience', label: 'Experience' },
                { id: 'projects', label: 'Projects' },
                { id: 'about', label: 'About' },
                { id: 'contact', label: 'Contact' },
              ] as { id: ActivePage; label: string }[]
            ).map((item) => (
              <a
                key={item.id}
                href={`/${item.id}`}
                className={`nav-link ${highlightedId === item.id ? 'is-active' : ''}`}
                aria-current={activePage === item.id ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  navigateToPage(item.id);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="nav-utilities">
            <button
              type="button"
              className="cmd-trigger-btn"
              onClick={() => setCmdOpen(true)}
              title="Command Palette (Ctrl+K)"
            >
              <Command size={13} />
              <kbd>⌘K</kbd>
            </button>

            <a
              href={PROFILE.cvUrl}
              download="Kumar_Kshitij_CV.pdf"
              className="nav-cv-download"
            >
              <Download size={14} />
              <span>Download CV</span>
            </a>

            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-drawer">
            <button type="button" onClick={() => navigateToPage('work')}>
              Work
            </button>
            <button type="button" onClick={() => navigateToPage('experience')}>
              Experience
            </button>
            <button type="button" onClick={() => navigateToPage('projects')}>
              Projects
            </button>
            <button type="button" onClick={() => navigateToPage('about')}>
              About
            </button>
            <button type="button" onClick={() => navigateToPage('contact')}>
              Contact
            </button>
            <div className="mobile-drawer-actions">
              <a
                href={PROFILE.cvUrl}
                download="Kumar_Kshitij_CV.pdf"
                className="btn btn-solid"
              >
                <Download size={15} /> Download CV
              </a>
            </div>
          </div>
        )}
      </header>
    );
  };

  const showWork = activePage === 'home' || activePage === 'work';
  const showExperience = activePage === 'home' || activePage === 'experience';
  const showArchive = activePage === 'home' || activePage === 'projects';
  const showAbout = activePage === 'home' || activePage === 'about';

  return (
    <div className="site-shell">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      {/* PERSISTENT FLOATING NAVIGATION BAR */}
      {renderTopHeader(activePage !== 'home')}

      {/* HOME HERO STAGE */}
      {activePage === 'home' && (
        <section
          ref={heroBoxRef}
          className="hero-stage"
          id="top"
          onPointerMove={handleHeroPointerMove}
        >
          <NeuralCanvasHero pointerRef={pointerRef} counterRef={counterRef} />

          <div className="hero-nav-spacer" aria-hidden="true" />

          <div className="hero-center-wrap">
            <HeroDisplayName pointerRef={pointerRef} boxRef={heroBoxRef} />
          </div>

          <div className="hero-bottom-bar">
            <div className="hero-intro-block">
              <p className="hero-lede">{PROFILE.heroStatement}</p>
              <p className="hero-sub">{PROFILE.heroSub}</p>

              <div className="hero-actions">
                <a
                  href="/work"
                  className="btn btn-solid"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToPage('work');
                  }}
                >
                  <span>See the work</span>
                  <ArrowUpRight size={16} />
                </a>
                <a
                  href="/contact"
                  className="btn btn-line"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToPage('contact');
                  }}
                >
                  <span>Get in touch</span>
                </a>
              </div>
            </div>

            <div className="hero-tensor-hud">
              <div className="tensor-stat-row">
                <span className="tensor-live-pill">
                  <Sparkles size={12} /> LIVE COMPUTE MESH
                </span>
                <span className="meter-num" ref={counterRef}>
                  12,480
                </span>
              </div>
              <p className="meter-label">
                nodes &amp; signals routed live.{' '}
                <strong>Move your cursor</strong> to bend the field or <strong>click</strong> to pulse.
              </p>
            </div>
          </div>
        </section>
      )}

      <main id="main" className={activePage !== 'home' ? 'main-subpage' : ''}>
        {/* SECTION 01: FLAGSHIP PRODUCTION & ENGINEERED SYSTEMS */}
        {showWork && (
          <section className="sec sec-paper" id="systems" aria-labelledby="systems-heading">
            <div className="container">
              <div className="sec-head">
                <div>
                  <span className="sec-index">01 // SELECTED WORK</span>
                  <h2 id="systems-heading" className="sec-title">
                    Systems I’ve designed &amp; shipped
                  </h2>
                </div>
                <p className="sec-note">
                  Full-stack applications, 3D WebGL worlds, TDD backend architectures, and CUDA language models. Switch between Overview, Architecture, and the Live Sandbox inside any project.
                </p>
              </div>

              <ol className="systems-board">
                {FLAGSHIP_SYSTEMS.map((sys) => {
                  const isOpen = openSystemId === sys.id;
                  const activeTab = systemTab[sys.id] || 'overview';
                  const setTab = (tab: 'overview' | 'sandbox' | 'architecture') =>
                    setSystemTab((prev) => ({ ...prev, [sys.id]: tab }));

                  return (
                    <li key={sys.id} className={`board-row ${isOpen ? 'is-open' : ''}`}>
                      <button
                        type="button"
                        className="board-hit"
                        aria-expanded={isOpen}
                        onClick={() => setOpenSystemId(isOpen ? '' : sys.id)}
                      >
                        <div className="board-metric-col">
                          <span className="board-code">{sys.code}</span>
                          <span className="board-metric">{sys.metric}</span>
                          <span className="board-metric-sub">{sys.metricSub}</span>
                        </div>

                        <div className="board-main-col">
                          <div className="board-title-line">
                            <span className="board-title">{sys.title}</span>
                            <span className="board-category-pill">{sys.category}</span>
                            {sys.liveUrl && <span className="board-live-dot">● LIVE</span>}
                          </div>
                          <span className="board-context">{sys.context}</span>
                        </div>

                        <div className="board-summary-col">
                          <span className="board-short">{sys.summary}</span>
                        </div>

                        <span className="board-toggle-icon" aria-hidden="true">
                          <ChevronDown size={20} />
                        </span>
                      </button>

                      {isOpen && (
                        <div className="board-detail">
                          {/* PROJECT WORKSPACE TABS BAR */}
                          <div className="project-tabs-bar">
                            <div
                              className="project-tabs-nav"
                              role="tablist"
                              aria-label={`${sys.title} details`}
                            >
                              <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'overview'}
                                className={`project-tab-btn ${
                                  activeTab === 'overview' ? 'is-active' : ''
                                }`}
                                onClick={() => setTab('overview')}
                              >
                                <Layers size={14} />
                                <span>Overview &amp; Specs</span>
                              </button>

                              <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'architecture'}
                                className={`project-tab-btn ${
                                  activeTab === 'architecture' ? 'is-active' : ''
                                }`}
                                onClick={() => setTab('architecture')}
                              >
                                <Cpu size={14} />
                                <span>System Architecture</span>
                              </button>

                              <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'sandbox'}
                                className={`project-tab-btn sandbox-tab ${
                                  activeTab === 'sandbox' ? 'is-active' : ''
                                }`}
                                onClick={() => setTab('sandbox')}
                              >
                                <Terminal size={14} />
                                <span>Interactive Sandbox</span>
                                <span className="tab-live-pill">TRY LIVE</span>
                              </button>
                            </div>

                            <div className="project-tabs-links">
                              {sys.liveUrl && (
                                <a
                                  href={sys.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="board-ext-link primary"
                                >
                                  <span>Open Live Site</span>
                                  <ArrowUpRight size={14} />
                                </a>
                              )}
                              <a
                                href={sys.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="board-ext-link"
                              >
                                <Github size={14} />
                                <span>Code on GitHub</span>
                                <ArrowUpRight size={14} />
                              </a>
                            </div>
                          </div>

                          {/* TAB 1: OVERVIEW & SPECS (DEFAULT — RIGHT AT THE TOP) */}
                          {activeTab === 'overview' && (
                            <div className="board-overview-grid" role="tabpanel">
                              <div className="board-overview-main">
                                <p className="board-summary-lead">{sys.summary}</p>

                                <div className="engineering-challenge-box">
                                  <span className="challenge-kicker">
                                    CORE ENGINEERING CHALLENGE
                                  </span>
                                  <p className="challenge-text">{sys.engineeringChallenge}</p>
                                </div>

                                <h4 className="overview-subhead">
                                  Key Implementation Highlights
                                </h4>
                                <ul className="board-points">
                                  {sys.points.map((pt, i) => (
                                    <li key={i}>{pt}</li>
                                  ))}
                                </ul>
                              </div>

                              <div className="board-overview-side">
                                <div className="sandbox-cta-card">
                                  <div className="sandbox-cta-top">
                                    <span className="sandbox-cta-badge">
                                      INTERACTIVE REPLICA
                                    </span>
                                    <span className="sandbox-cta-metric">{sys.metric}</span>
                                  </div>
                                  <p className="sandbox-cta-desc">
                                    Test {sys.title}’s interactive interface, real-time state, and core workflows right inside this tab.
                                  </p>
                                  <button
                                    type="button"
                                    className="sandbox-launch-btn"
                                    onClick={() => setTab('sandbox')}
                                  >
                                    <Terminal size={15} />
                                    <span>Launch Interactive Sandbox</span>
                                    <ArrowUpRight size={15} />
                                  </button>
                                </div>

                                <div className="board-stack-block">
                                  <span className="stack-label">Built with</span>
                                  <div className="stack-pills">
                                    {sys.stack.map((tech) => (
                                      <span key={tech} className="stack-pill">
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  className="arch-switch-btn"
                                  onClick={() => setTab('architecture')}
                                >
                                  <Cpu size={14} />
                                  <span>Inspect 4-Stage System Architecture →</span>
                                </button>
                              </div>
                            </div>
                          )}

                          {/* TAB 2: SYSTEM ARCHITECTURE */}
                          {activeTab === 'architecture' && (
                            <div className="board-topo-panel" role="tabpanel">
                              <div className="topo-panel-head">
                                <div>
                                  <span className="challenge-kicker">
                                    END-TO-END SYSTEM TOPOLOGY
                                  </span>
                                  <h4 className="topo-panel-title">
                                    {sys.title} — 4-Stage Execution Pipeline
                                  </h4>
                                </div>
                                <button
                                  type="button"
                                  className="board-ext-link"
                                  onClick={() => setTab('sandbox')}
                                >
                                  <Terminal size={14} />
                                  <span>Switch to Interactive Sandbox</span>
                                </button>
                              </div>

                              <div className="topology-grid">
                                {sys.archNodes.map((node, index) => (
                                  <div key={node.id} className="topology-node">
                                    <div className="topology-step">
                                      <span>STAGE 0{index + 1}</span>
                                      <span className={`layer-tag layer-${node.layer}`}>
                                        {node.layer.toUpperCase()}
                                      </span>
                                    </div>
                                    <h4 className="topology-title">{node.label}</h4>
                                    <p className="topology-sub">{node.sublabel}</p>
                                  </div>
                                ))}
                              </div>

                              <div className="topology-flow-note">
                                <strong>Data Flow &amp; Runtime:</strong> {sys.archFlowNote}
                              </div>
                            </div>
                          )}

                          {/* TAB 3: INTERACTIVE SANDBOX */}
                          {activeTab === 'sandbox' && (
                            <div className="board-interactive-stage" role="tabpanel">
                              <InteractiveSystemLab system={sys} />
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>
        )}

        {/* SECTION 02: PROFESSIONAL EXPERIENCE, RESEARCH & LEADERSHIP */}
        {showExperience && (
          <section className="sec sec-ink" id="experience" aria-labelledby="exp-heading">
            <div className="container">
              <div className="sec-head">
                <div>
                  <span className="sec-index">02 // EXPERIENCE</span>
                  <h2 id="exp-heading" className="sec-title">
                    Internships, research &amp; campus leadership
                  </h2>
                </div>
                <p className="sec-note">
                  Shipping internal enterprise platforms at Schenck RoTec India, building client AI agents at Deepthought, and leading teams at MIT Manipal.
                </p>
              </div>

              <ol className="timeline">
                {EXPERIENCES.map((exp) => (
                  <li key={exp.id} className="tl-row">
                    <div className="tl-date-col">
                      <span className="tl-type-tag">{exp.type}</span>
                      <p className="tl-date">
                        <span>{exp.start}</span>
                        <span className="tl-dash" aria-hidden="true" />
                        <span>{exp.end}</span>
                      </p>
                    </div>

                    <div className="tl-body">
                      <div className="tl-head-row">
                        <div>
                          <h3 className="tl-org">{exp.organization}</h3>
                          <p className="tl-role">
                            {exp.role}
                            <span className="tl-place">{exp.location}</span>
                          </p>
                        </div>
                      </div>

                      {exp.highlightBadge && (
                        <p className="tl-award">
                          <span className="led-dot" aria-hidden="true" />
                          {exp.highlightBadge}
                        </p>
                      )}

                      <ul className="tl-points">
                        {exp.points.map((pt, idx) => (
                          <li key={idx}>{pt}</li>
                        ))}
                      </ul>

                      {exp.architectureSpotlight && (
                        <div className="schenck-arch-card">
                          <div className="schenck-arch-head">
                            <span className="schenck-arch-title">
                              <Layers size={14} /> {exp.architectureSpotlight.title}
                            </span>
                            <button
                              type="button"
                              className="schenck-toggle-btn"
                              onClick={() => setShowSchenckArch((s) => !s)}
                            >
                              {showSchenckArch
                                ? 'Hide three-tier breakdown'
                                : 'View three-tier breakdown'}
                            </button>
                          </div>

                          {showSchenckArch && (
                            <div className="schenck-tiers-grid">
                              {exp.architectureSpotlight.tiers.map((t) => (
                                <div key={t.tier} className="schenck-tier-box">
                                  <span className="tier-k">{t.tier}</span>
                                  <strong className="tier-tech">{t.tech}</strong>
                                  <p className="tier-detail">{t.detail}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="tl-foot-meta">
                        <div className="tl-skills">
                          {exp.skills.map((sk) => (
                            <span key={sk} className="tl-skill-chip">
                              {sk}
                            </span>
                          ))}
                        </div>

                        {exp.credentials && exp.credentials.length > 0 && (
                          <div className="tl-quiet-links">
                            {exp.credentials.map((cred) => (
                              <a
                                key={cred.label}
                                href={cred.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="tl-quiet-link"
                              >
                                <span>{cred.label}</span>
                                <ArrowUpRight size={12} />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* SECTION 03: ADDITIONAL ENGINEERING PROJECTS */}
        {showArchive && (
          <section
            className="sec sec-paper"
            id="archive"
            aria-labelledby="archive-heading"
          >
            <div className="container">
              <div className="sec-head">
                <div>
                  <div className="sec-index-row">
                    <span className="sec-index">03 // PROJECTS</span>
                    <button
                      type="button"
                      className="github-live-sync-pill"
                      onClick={() => syncGitHub()}
                      title="Live-synced with github.com/Kshiku12. Click to check for newly pushed repos."
                    >
                      <span className="live-dot-pulse" aria-hidden="true" />
                      <span>LIVE GITHUB SYNC</span>
                      <RefreshCw
                        size={11}
                        className={githubLoading ? 'spin-icon' : ''}
                      />
                    </button>
                  </div>
                  <h2 id="archive-heading" className="sec-title">
                    More things I’ve built
                  </h2>
                </div>

                <div className="archive-controls">
                  <div className="archive-search-wrap">
                    <Search size={15} className="archive-search-icon" />
                    <input
                      type="text"
                      value={archiveSearch}
                      onChange={(e) => setArchiveSearch(e.target.value)}
                      placeholder="Filter by stack (e.g. Python, PyTorch, C, Java, Android)..."
                      className="archive-search-input"
                      aria-label="Search projects by keyword or technology"
                    />
                  </div>

                  <div className="seg-group" role="group" aria-label="Filter projects by domain">
                    {(
                      [
                        'All',
                        'Full-Stack & Web',
                        'AI, ML & Agents',
                        '3D & Game Engines',
                        'Systems & Low-Level',
                      ] as ArchiveCategory[]
                    ).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className={`seg-btn ${archiveFilter === cat ? 'is-active' : ''}`}
                        onClick={() => setArchiveFilter(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <ul className="archive-grid">
                {filteredArchive.map((item) => (
                  <li key={item.id} className="archive-card">
                    <div className="archive-card-top">
                      <div className="archive-meta-row">
                        <span className="archive-year">{item.year}</span>
                        <span className="archive-domain">{item.category}</span>
                        {item.featuredMetric && (
                          <span className="archive-metric-badge">{item.featuredMetric}</span>
                        )}
                      </div>

                      <h3 className="archive-title">{item.title}</h3>
                      <p className="archive-desc">{item.description}</p>
                    </div>

                    <div className="archive-card-Bottom">
                      <div className="archive-stack-list">
                        {item.stack.map((s) => (
                          <span key={s} className="archive-tech">
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="archive-links-row">
                        {item.liveUrl && (
                          <a
                            href={item.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="archive-link live"
                          >
                            <span>Live App</span>
                            <ArrowUpRight size={14} />
                          </a>
                        )}
                        <a
                          href={item.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="archive-link"
                        >
                          <Github size={14} />
                          <span>Code</span>
                          <ArrowUpRight size={14} />
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="archive-foot-banner">
                <div className="archive-foot-text">
                  <Terminal size={18} />
                  <span>All 18 public repositories and commit histories on GitHub:</span>
                </div>
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ink"
                >
                  <Github size={16} />
                  <span>github.com/Kshiku12</span>
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 04: ABOUT & STACK */}
        {showAbout && (
          <section className="sec sec-ink sec-about" id="about" aria-labelledby="about-heading">
            <div className="container">
              <div className="about-grid">
                <div className="about-photo-col">
                  <figure className="about-photo-frame">
                    <img
                      src={PROFILE.photoUrl}
                      alt="Kumar Kshitij"
                      className="about-photo-img"
                      loading="lazy"
                    />
                    <figcaption className="about-photo-caption">
                      <span className="caption-mono">Kumar Kshitij</span>
                      <span className="caption-loc">
                        <MapPin size={12} /> Manipal, India
                      </span>
                    </figcaption>
                  </figure>
                </div>

                <div className="about-content-col">
                  <span className="sec-index">04 // ABOUT</span>
                  <h2 id="about-heading" className="sec-title">
                    About
                  </h2>

                  <p className="about-lede">
                    I care equally about what happens inside a database transaction and what happens on the screen at 60 frames per second.
                  </p>

                  <p className="about-p">
                    Most of my work sits at the intersection of full-stack engineering, AI agents, and interactive graphics — from building a three-tier event and club directory system on{' '}
                    <strong>Microsoft Power Pages, Dataverse, and Power Automate</strong> at{' '}
                    <strong>Schenck RoTec India</strong>, to rendering a 3D Route 1 world in{' '}
                    <strong>Three.js &amp; React Three Fiber</strong> backed by real-time Supabase sync, to benchmarking{' '}
                    <strong>LSTM and GRU language models on CUDA</strong>.
                  </p>

                  <p className="about-p">
                    At <strong>MIT Manipal</strong>, alongside my B.Tech in Computer Science and Communication Engineering, I serve on the board of{' '}
                    <strong>The Data Alchemist</strong> as Head of HR &amp; Management, help run campus datathons for{' '}
                    <strong>Tech Tatva</strong>, and write smart contracts in <strong>Solidity</strong>.
                  </p>

                  <dl className="facts-dl">
                    <div className="fact-row">
                      <dt>Studying</dt>
                      <dd>
                        B.Tech, Computer Science &amp; Communication Engineering
                        <br />
                        <span className="fact-sub">
                          Manipal Institute of Technology · 2023 – 2027
                        </span>
                      </dd>
                    </div>

                    <div className="fact-row">
                      <dt>Schooling</dt>
                      <dd>
                        Delhi Public School, Greater Noida ·{' '}
                        <span className="fact-inline-accent">95.75%</span> (Class XII)
                      </dd>
                    </div>

                    <div className="fact-row">
                      <dt>Languages</dt>
                      <dd>Python, TypeScript, JavaScript, C, C++, Java, SQL, Dart, Solidity, C#</dd>
                    </div>

                    <div className="fact-row">
                      <dt>Frontend &amp; 3D</dt>
                      <dd>
                        Next.js 16, React 19, Three.js, React Three Fiber (R3F), Tailwind CSS, Vite, Flutter, React Native
                      </dd>
                    </div>

                    <div className="fact-row">
                      <dt>Backend &amp; Systems</dt>
                      <dd>
                        Node.js, Express, Django, Flask, Supabase, PostgreSQL, MongoDB, Socket.io, Power Pages, Dataverse
                      </dd>
                    </div>

                    <div className="fact-row">
                      <dt>AI &amp; Deep Learning</dt>
                      <dd>
                        PyTorch (CUDA), Google Gemini API (Vision &amp; Text), TensorFlow, LLM Fine-Tuning, Multi-Agent Pipelines
                      </dd>
                    </div>

                    <div className="fact-row">
                      <dt>Coursework</dt>
                      <dd>
                        Data Structures &amp; Algorithms, Operating Systems, Database Systems, Computer Networks, OOP, Information Security
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 05: CONNECT & DIRECT CHANNELS (SHOWN WITH EVERY VIEW) */}
        <section className="contact-section" id="contact" aria-labelledby="contact-heading">
          <div className="container">
            <div className="contact-grid">
              <div className="contact-left">
                <span className="sec-index contact-index">05 // CONNECT</span>
                <h2 id="contact-heading" className="contact-title">
                  Let’s build something together.
                </h2>
                <p className="contact-note">
                  Always up for talking about full-stack systems, AI agents, 3D web graphics, or interesting engineering problems.
                </p>

                <div className="direct-contact-cards">
                  <div className="direct-card">
                    <div>
                      <span className="direct-k">Email</span>
                      <a href={`mailto:${PROFILE.email}`} className="direct-v">
                        {PROFILE.email}
                      </a>
                    </div>
                    <button
                      type="button"
                      className="copy-icon-btn"
                      onClick={() => handleCopy(PROFILE.email, 'email')}
                      title="Copy email address"
                    >
                      {copiedField === 'email' ? <Check size={15} /> : <Copy size={15} />}
                      <span>{copiedField === 'email' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="direct-card">
                    <div>
                      <span className="direct-k">Phone</span>
                      <a href={`tel:${PROFILE.phoneRaw}`} className="direct-v">
                        {PROFILE.phone}
                      </a>
                    </div>
                    <button
                      type="button"
                      className="copy-icon-btn"
                      onClick={() => handleCopy(PROFILE.phone, 'phone')}
                      title="Copy phone number"
                    >
                      {copiedField === 'phone' ? <Check size={15} /> : <Copy size={15} />}
                      <span>{copiedField === 'phone' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <ul className="contact-social-row">
                  <li>
                    <a
                      href={PROFILE.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-pill"
                    >
                      <Github size={15} />
                      <span>GitHub</span>
                      <ArrowUpRight size={14} />
                    </a>
                  </li>
                  <li>
                    <a
                      href={PROFILE.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-pill"
                    >
                      <Linkedin size={15} />
                      <span>LinkedIn</span>
                      <ArrowUpRight size={14} />
                    </a>
                  </li>
                  <li>
                    <a
                      href={PROFILE.cvUrl}
                      download="Kumar_Kshitij_CV.pdf"
                      className="social-pill accent"
                    >
                      <Download size={15} />
                      <span>Download CV</span>
                    </a>
                  </li>
                </ul>
              </div>

              <form className="contact-form-card" onSubmit={handleContactSubmit}>
                <h3 className="form-card-heading">Send a direct message</h3>
                <label className="form-field">
                  <span>Name</span>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    autoComplete="name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </label>

                <label className="form-field">
                  <span>Email</span>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </label>

                <label className="form-field">
                  <span>Message</span>
                  <textarea
                    rows={4}
                    required
                    placeholder="What are you working on?"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                  />
                </label>

                <button type="submit" className="btn btn-signal" disabled={contactSending}>
                  <Send size={15} />
                  <span>{contactSending ? 'Sending message...' : 'Send message'}</span>
                </button>
              </form>
            </div>

            <footer className="site-footer">
              <div className="footer-left">
                <span className="footer-brand">© {new Date().getFullYear()} Kumar Kshitij</span>
              </div>
              <div className="footer-right">
                <span>Manipal, India</span>
              </div>
            </footer>
          </div>
        </section>
      </main>

      {/* FLOATING POP-UP NOTIFICATION WHEN MESSAGE IS SENT */}
      {contactPopup && (
        <div
          className={`contact-popup-toast ${contactPopup.isError ? 'is-error' : ''}`}
          role="alert"
        >
          <div className="popup-icon-badge">
            {contactPopup.isError ? <X size={16} /> : <Check size={16} />}
          </div>
          <div className="popup-text-col">
            <strong className="popup-title">{contactPopup.title}</strong>
            <span className="popup-subtitle">{contactPopup.subtitle}</span>
          </div>
          <button
            type="button"
            className="popup-close-btn"
            onClick={() => setContactPopup(null)}
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* COMMAND PALETTE MODAL */}
      <CommandPaletteModal
        isOpen={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onNavigate={handleCommandNavigate}
        theme="paper"
        onToggleTheme={() => {}}
      />
    </div>
  );
};
export default App;
