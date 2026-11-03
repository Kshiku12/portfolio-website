import React, { useEffect, useState } from 'react';
import {
  Search,
  ExternalLink,
  Download,
  Copy,
  Check,
  Terminal,
  Briefcase,
  Layers,
  User,
  Mail,
  Sun,
  Moon,
  X,
} from 'lucide-react';
import { PROFILE } from '../data/portfolioData';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  theme: 'dark' | 'paper';
  onToggleTheme: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  theme,
  onToggleTheme,
}) => {
  const [query, setQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const actions = [
    {
      group: 'Sections',
      items: [
        {
          id: 'nav-systems',
          label: 'Work & Interactive Systems',
          icon: <Layers size={15} />,
          shortcut: '01',
          run: () => {
            onNavigate('systems');
            onClose();
          },
        },
        {
          id: 'nav-experience',
          label: 'Experience & Leadership',
          icon: <Briefcase size={15} />,
          shortcut: '02',
          run: () => {
            onNavigate('experience');
            onClose();
          },
        },
        {
          id: 'nav-archive',
          label: 'More Projects & Archive',
          icon: <Terminal size={15} />,
          shortcut: '03',
          run: () => {
            onNavigate('archive');
            onClose();
          },
        },
        {
          id: 'nav-about',
          label: 'About & Stack',
          icon: <User size={15} />,
          shortcut: '04',
          run: () => {
            onNavigate('about');
            onClose();
          },
        },
        {
          id: 'nav-contact',
          label: 'Contact',
          icon: <Mail size={15} />,
          shortcut: '05',
          run: () => {
            onNavigate('contact');
            onClose();
          },
        },
      ],
    },
    {
      group: 'Quick Actions',
      items: [
        {
          id: 'act-download-cv',
          label: 'Download CV (PDF)',
          icon: <Download size={15} />,
          shortcut: 'PDF',
          run: () => {
            const a = document.createElement('a');
            a.href = PROFILE.cvUrl;
            a.download = 'Kumar_Kshitij_CV.pdf';
            a.click();
            onClose();
          },
        },
        {
          id: 'act-copy-email',
          label: copiedKey === 'email' ? 'Copied to clipboard!' : `Copy email (${PROFILE.email})`,
          icon: copiedKey === 'email' ? <Check size={15} /> : <Copy size={15} />,
          shortcut: 'COPY',
          run: () => copyText(PROFILE.email, 'email'),
        },
        {
          id: 'act-theme',
          label: `Switch theme (Current: ${theme === 'dark' ? 'Obsidian Dark' : 'Warm Paper'})`,
          icon: theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />,
          shortcut: 'THEME',
          run: () => {
            onToggleTheme();
            onClose();
          },
        },
      ],
    },
    {
      group: 'Live Projects & Profiles',
      items: [
        {
          id: 'ext-nexussubs',
          label: 'NexusSubs Live App (nexussubs.vercel.app)',
          icon: <ExternalLink size={15} />,
          shortcut: 'LIVE',
          run: () => window.open('https://nexussubs.vercel.app/', '_blank', 'noopener,noreferrer'),
        },
        {
          id: 'ext-binkeyit',
          label: 'Binkeyit Live App (binkeyit-online.vercel.app)',
          icon: <ExternalLink size={15} />,
          shortcut: 'LIVE',
          run: () => window.open('https://binkeyit-online.vercel.app/', '_blank', 'noopener,noreferrer'),
        },
        {
          id: 'ext-fdsa',
          label: 'Placement Ready Simulator (fdsa-two.vercel.app)',
          icon: <ExternalLink size={15} />,
          shortcut: 'LIVE',
          run: () => window.open('https://fdsa-two.vercel.app/', '_blank', 'noopener,noreferrer'),
        },
        {
          id: 'ext-github',
          label: 'GitHub (@Kshiku12)',
          icon: <ExternalLink size={15} />,
          shortcut: 'GH',
          run: () => window.open(PROFILE.github, '_blank', 'noopener,noreferrer'),
        },
        {
          id: 'ext-linkedin',
          label: 'LinkedIn (Kumar Kshitij)',
          icon: <ExternalLink size={15} />,
          shortcut: 'IN',
          run: () => window.open(PROFILE.linkedin, '_blank', 'noopener,noreferrer'),
        },
      ],
    },
  ];

  const filteredGroups = actions
    .map((g) => ({
      ...g,
      items: g.items.filter((item) =>
        item.label.toLowerCase().includes(query.trim().toLowerCase())
      ),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Command Palette">
      <div className="cmd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cmd-search-bar">
          <Search size={17} className="cmd-search-icon" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a section, project, or action..."
            className="cmd-input"
          />
          <button type="button" className="cmd-esc-btn" onClick={onClose}>
            ESC <X size={13} />
          </button>
        </div>

        <div className="cmd-results">
          {filteredGroups.length === 0 ? (
            <div className="cmd-empty">No matching commands found for "{query}".</div>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.group} className="cmd-group">
                <div className="cmd-group-title">{group.group}</div>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="cmd-item"
                    onClick={item.run}
                  >
                    <span className="cmd-item-left">
                      <span className="cmd-item-icon">{item.icon}</span>
                      <span className="cmd-item-label">{item.label}</span>
                    </span>
                    <kbd className="cmd-kbd">{item.shortcut}</kbd>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>

        <div className="cmd-footer">
          <span>Kumar Kshitij</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
