import { useState, useEffect, useCallback } from 'react';
import { ArchiveProject, ARCHIVE_PROJECTS } from '../data/portfolioData';

// Repositories featured as Flagship Systems in the Work section
const EXCLUDED_FLAGSHIP_REPOS = new Set([
  'nexussubs',
  'pokefinance',
  'binkeyit',
  'incubyte_cardealership_inverntory',
  'fdsa',
  'autoregressive-text-generation-rnn-lstm-gru',
]);

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

const CACHE_KEY = 'kk_github_archive_projects_v2';
const CACHE_TIME_KEY = 'kk_github_archive_synced_at_v2';
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes cache to avoid GitHub rate limits

function formatRepoTitle(rawName: string): string {
  // If it's all uppercase acronym like FDSA or MADL
  if (/^[A-Z0-9_-]+$/.test(rawName) && rawName.length <= 6) {
    return rawName.replace(/[-_]/g, '');
  }

  // Split by hyphens, underscores, or camelCase
  return rawName
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .trim()
    .split(' ')
    .map((word) => {
      const lower = word.toLowerCase();
      if (['ai', 'ml', 'nlp', 'llm', 'dsa', 'api', 'ui', 'sdk', 'rnn', 'lstm', 'gru', 'tdd', 'sql', 'r3f', 'svdp'].includes(lower)) {
        return lower.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function classifyRepoCategory(
  lang: string | null,
  topics: string[] = [],
  name: string = '',
  desc: string = ''
): ArchiveProject['category'] {
  const combined = `${lang || ''} ${topics.join(' ')} ${name} ${desc}`.toLowerCase();

  if (
    combined.includes('agent') ||
    combined.includes('torch') ||
    combined.includes('tensorflow') ||
    combined.includes('neural') ||
    combined.includes('nlp') ||
    combined.includes('llm') ||
    combined.includes('gemini') ||
    combined.includes('jupyter') ||
    combined.includes('prediction') ||
    combined.includes('forecast') ||
    combined.includes('learning') ||
    combined.includes('stock') ||
    combined.includes('equities')
  ) {
    return 'AI, ML & Agents';
  }

  if (
    combined.includes('socket') ||
    combined.includes('kernel') ||
    combined.includes('crypto') ||
    combined.includes('security') ||
    combined.includes('android') ||
    combined.includes('posix') ||
    combined.includes('tcp') ||
    combined.includes('protocol') ||
    lang === 'C' ||
    lang === 'C++' ||
    lang === 'Rust' ||
    lang === 'Assembly'
  ) {
    return 'Systems & Low-Level';
  }

  if (
    combined.includes('three') ||
    combined.includes('r3f') ||
    combined.includes('game') ||
    combined.includes('battle') ||
    combined.includes('engine') ||
    combined.includes('pokemon') ||
    combined.includes('turn-based') ||
    combined.includes('graphics') ||
    combined.includes('webgl')
  ) {
    return '3D & Game Engines';
  }

  return 'Full-Stack & Web';
}

function parseGitHubReposToProjects(repos: GitHubRepo[]): ArchiveProject[] {
  // Start with the curated list
  const existingMap = new Map<string, ArchiveProject>();
  ARCHIVE_PROJECTS.forEach((p) => {
    const slug = p.githubUrl.split('/').pop()?.toLowerCase();
    if (slug) existingMap.set(slug, { ...p });
  });

  const liveProjects: ArchiveProject[] = [];

  for (const repo of repos) {
    const repoSlug = repo.name.toLowerCase();

    // Skip repos that belong to the Work (Flagship) section
    if (EXCLUDED_FLAGSHIP_REPOS.has(repoSlug)) {
      continue;
    }

    const year = new Date(repo.pushed_at || repo.created_at || Date.now())
      .getFullYear()
      .toString();

    // If it's an existing curated project, enrich with live data (stars, latest year, live link)
    if (existingMap.has(repoSlug)) {
      const existing = existingMap.get(repoSlug)!;
      existingMap.delete(repoSlug);

      const metric =
        repo.stargazers_count > 0
          ? `★ ${repo.stargazers_count}${repo.stargazers_count === 1 ? ' star' : ' stars'}`
          : existing.featuredMetric;

      liveProjects.push({
        ...existing,
        year: year || existing.year,
        liveUrl: repo.homepage || existing.liveUrl,
        featuredMetric: metric,
      });
      continue;
    }

    // It's a BRAND NEW REPOSITORY added by Kumar Kshitij on GitHub!
    const stack: string[] = [];
    if (repo.language) stack.push(repo.language);
    if (repo.topics && Array.isArray(repo.topics)) {
      repo.topics.slice(0, 4).forEach((t) => {
        const formatted = t.replace(/-/g, ' ');
        if (!stack.map((s) => s.toLowerCase()).includes(formatted.toLowerCase())) {
          stack.push(formatted);
        }
      });
    }
    if (stack.length === 0) stack.push('Software Architecture');

    const category = classifyRepoCategory(
      repo.language,
      repo.topics,
      repo.name,
      repo.description || ''
    );

    let featuredMetric: string | undefined;
    if (repo.stargazers_count > 0) {
      featuredMetric = `★ ${repo.stargazers_count}`;
    } else if (repo.homepage) {
      featuredMetric = 'Live App';
    } else {
      featuredMetric = 'GitHub Live';
    }

    const description =
      repo.description && repo.description.trim().length > 0
        ? repo.description.trim()
        : `Open-source ${repo.language || 'software'} repository by Kumar Kshitij, maintained on GitHub with automated version tracking.`;

    liveProjects.push({
      id: `gh-${repo.id || repo.name}`,
      title: formatRepoTitle(repo.name),
      category,
      description,
      stack,
      githubUrl: repo.html_url,
      liveUrl: repo.homepage || undefined,
      featuredMetric,
      year,
    });
  }

  // Add any remaining curated projects that might not be in the public repos query
  existingMap.forEach((p) => {
    liveProjects.push(p);
  });

  return liveProjects;
}

export function useGitHubProjects(username = 'Kshiku12') {
  const [projects, setProjects] = useState<ArchiveProject[]>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return ARCHIVE_PROJECTS;
  });

  const [loading, setLoading] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(() => {
    try {
      const t = localStorage.getItem(CACHE_TIME_KEY);
      if (t) return new Date(parseInt(t, 10));
    } catch {
      // ignore
    }
    return null;
  });

  const fetchLiveRepos = useCallback(
    async (force = false) => {
      // Check cache unless forced
      if (!force) {
        const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
        if (cachedTime) {
          const age = Date.now() - parseInt(cachedTime, 10);
          if (age < CACHE_DURATION_MS) {
            return;
          }
        }
      }

      setLoading(true);
      try {
        const res = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
          {
            headers: {
              Accept: 'application/vnd.github.v3+json',
            },
          }
        );

        if (!res.ok) {
          throw new Error(`GitHub API HTTP ${res.status}`);
        }

        const data: GitHubRepo[] = await res.json();
        if (Array.isArray(data)) {
          const merged = parseGitHubReposToProjects(data);
          setProjects(merged);
          setLastSynced(new Date());
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
            localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
          } catch {
            // storage quota or private browsing
          }
        }
      } catch (err) {
        console.warn('Live GitHub sync notice (using cached/curated projects):', err);
      } finally {
        setLoading(false);
      }
    },
    [username]
  );

  useEffect(() => {
    fetchLiveRepos();
  }, [fetchLiveRepos]);

  return {
    projects,
    loading,
    lastSynced,
    syncNow: () => fetchLiveRepos(true),
  };
}

