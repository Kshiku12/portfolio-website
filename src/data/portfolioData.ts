export interface ArchNode {
  id: string;
  label: string;
  sublabel: string;
  layer: 'client' | 'edge' | 'compute' | 'data';
}

export interface FlagshipSystem {
  id: string;
  code: string;
  metric: string;
  metricSub: string;
  title: string;
  context: string;
  category: 'AI & Full-Stack' | '3D & FinTech' | 'Real-Time Commerce' | 'TDD & Enterprise' | 'EdTech & Sandbox' | 'Deep Learning';
  summary: string;
  engineeringChallenge: string;
  points: string[];
  stack: string[];
  githubUrl: string;
  liveUrl?: string;
  interactiveDemoType: 'pokefinance' | 'nexussubs' | 'binkeyit' | 'auramotors' | 'fdsa' | 'autoregressive';
  archNodes: ArchNode[];
  archFlowNote: string;
}

export interface ExperienceItem {
  id: string;
  period: string;
  start: string;
  end: string;
  organization: string;
  role: string;
  location: string;
  type: 'Internship' | 'Leadership' | 'Research';
  highlightBadge?: string;
  credentials?: { label: string; url: string }[];
  points: string[];
  skills: string[];
  architectureSpotlight?: {
    title: string;
    tiers: { tier: string; tech: string; detail: string }[];
  };
}

export interface ArchiveProject {
  id: string;
  title: string;
  category: 'Full-Stack & Web' | 'AI, ML & Agents' | '3D & Game Engines' | 'Systems & Low-Level';
  description: string;
  stack: string[];
  githubUrl: string;
  liveUrl?: string;
  featuredMetric?: string;
  year: string;
}

export const PROFILE = {
  name: 'Kumar Kshitij',
  monogram: 'KK',
  roleHeadline: 'Full-Stack, AI Agents & Systems Engineer',
  heroStatement: 'I build full-stack systems and AI agents that hold up in production.',
  heroSub:
    'Computer Science & Communication at MIT Manipal. Software Development Intern at Schenck RoTec India (Global IT) & AI Agent Developer at Deepthought.',
  location: 'Manipal, Karnataka, India',
  email: 'kshitij.verma302312@gmail.com',
  phone: '+91 89716 36441',
  phoneRaw: '+918971636441',
  github: 'https://github.com/Kshiku12',
  githubHandle: 'Kshiku12',
  linkedin: 'https://www.linkedin.com/in/kumar-kshitij-600076288/',
  linkedinLabel: 'Kumar Kshitij',
  cvUrl: '/Kumar_Kshitij_CV.pdf',
  photoUrl: '/kshitij.jpg',
  statusText: 'Available for SWE, Full-Stack & AI Engineering Roles',
};

export const FLAGSHIP_SYSTEMS: FlagshipSystem[] = [
  {
    id: 'nexussubs',
    code: 'SYS-01',
    metric: 'Multi-OAuth',
    metricSub: 'Gmail API + Gemini 2.5 Vision',
    title: 'NexusSubs',
    context: 'Autonomous Subscription & Media Intelligence Hub',
    category: 'AI & Full-Stack',
    summary:
      'High-performance Next.js 16 & TypeScript platform that automatically scans multi-account Gmail billing receipts and SMS webhooks while pairing a multi-modal Gemini Vision + Text assistant for media recognition and mood-based discovery.',
    engineeringChallenge:
      'Aggregating fragmented recurring billing across multiple Google accounts without storing raw inbox payloads, while enabling zero-latency visual media identification directly from user-uploaded screenshots.',
    points: [
      'Engineered automated subscription ingestion by integrating the Gmail API with multi-account Google OAuth (NextAuth.js) and an SMS webhook pipeline to parse billing cycles, renewal dates, and payment history across Netflix, Spotify, Prime, and Xbox Game Pass.',
      'Pioneered the Nexus AI Discovery Assistant leveraging Google Gemini 2.5 Flash (Vision + Text) to identify movies or games directly from uploaded screenshots and cross-reference live catalog metadata via OMDb and RAWG APIs.',
      'Built an interactive dark-mode SSR dashboard in Next.js 16 (App Router) with simulated cancellation workflows, burn-rate analytics, and mood-calibrated media recommendations.',
    ],
    stack: [
      'Next.js 16 (App Router)',
      'TypeScript',
      'Google Gemini 2.5 Vision & Text',
      'Gmail API',
      'NextAuth.js (Multi-OAuth)',
      'OMDb & RAWG APIs',
      'Tailwind CSS',
    ],
    githubUrl: 'https://github.com/Kshiku12/nexussubs',
    liveUrl: 'https://nexussubs.vercel.app/',
    interactiveDemoType: 'nexussubs',
    archNodes: [
      { id: 'n1', label: 'Multi-Account OAuth', sublabel: 'NextAuth.js + Google Scopes', layer: 'client' },
      { id: 'n2', label: 'Billing Parser & Webhook', sublabel: 'Gmail API + SMS Ingestion', layer: 'edge' },
      { id: 'n3', label: 'Nexus AI Vision Engine', sublabel: 'Gemini 2.5 Flash Multimodal', layer: 'compute' },
      { id: 'n4', label: 'SSR Telemetry Hub', sublabel: 'Next.js 16 + OMDb / RAWG', layer: 'data' },
    ],
    archFlowNote:
      'OAuth tokens fan out across linked Gmail accounts → regex/MIME billing parser extracts recurring charges → Gemini 2.5 Flash processes visual screenshots & natural language queries → SSR dashboard renders live spend & discovery.',
  },
  {
    id: 'pokefinance',
    code: 'SYS-02',
    metric: 'EXP = n³',
    metricSub: '3D Route 1 · 12+ Categories',
    title: 'PokéFinance',
    context: 'Gamified 3D Personal Finance & RPG Progression Engine',
    category: '3D & FinTech',
    summary:
      'Full-stack gamified personal finance tracker rendering an interactive 3D Pokémon world (Route 1) in Three.js and React Three Fiber, powered by an automated expense-to-EXP progression engine and real-time Supabase synchronization.',
    engineeringChallenge:
      'Maintaining smooth 60fps WebGL rendering with dynamic day/night shaders and orbital camera physics alongside real-time transactional state updates and deterministic RPG evolution math.',
    points: [
      'Engineered an interactive 3D Route 1 ecosystem using Three.js and React Three Fiber (R3F) in Next.js 16 & React 19, supporting 360° orbital navigation, real-time day/night lighting cycles, and custom particle VFX.',
      'Architected a deterministic Expense-to-EXP progression engine across 12+ financial categories, computing cubic level milestones (EXP = n³), 3-stage companion evolutions, and 8 unlockable Gym Badges.',
      'Integrated Supabase (PostgreSQL + Auth + Realtime Subscriptions) for instant cross-device state persistence of ledger entries, budget streaks, and companion evolution states.',
    ],
    stack: [
      'Next.js 16',
      'React 19',
      'Three.js',
      'React Three Fiber (R3F)',
      'Supabase Realtime',
      'PostgreSQL',
      'TypeScript',
      'Tailwind CSS',
    ],
    githubUrl: 'https://github.com/Kshiku12/pokefinance',
    interactiveDemoType: 'pokefinance',
    archNodes: [
      { id: 'p1', label: 'Ledger & Budget Input', sublabel: '12+ Expense Categories', layer: 'client' },
      { id: 'p2', label: 'Cubic Progression Core', sublabel: 'EXP = n³ · 8 Gym Badges', layer: 'compute' },
      { id: 'p3', label: 'Supabase Realtime Sync', sublabel: 'PostgreSQL + Row Level Security', layer: 'data' },
      { id: 'p4', label: 'R3F 3D Route 1 World', sublabel: 'Three.js · Day/Night Shaders', layer: 'edge' },
    ],
    archFlowNote:
      'Transactions trigger the deterministic EXP = n³ progression engine → Supabase persists ledger & broadcasts WebSocket state diffs → React Three Fiber updates companion evolution meshes & environment shaders in real time.',
  },
  {
    id: 'binkeyit',
    code: 'SYS-03',
    metric: '<100ms',
    metricSub: 'Live Socket.io + Leaflet Tracking',
    title: 'Binkeyit',
    context: 'AI-Powered Quick-Commerce & Live Logistics Platform',
    category: 'Real-Time Commerce',
    summary:
      'High-performance MERN quick-commerce platform featuring sub-second Vite/React Router transitions, a stateful Google Gemini AI Shopping Assistant with automated cart orchestration, and real-time Socket.io + Leaflet.js delivery telemetry.',
    engineeringChallenge:
      'Bridging conversational LLM intent directly to deterministic cart mutations while streaming low-latency geospatial courier coordinates to customers without polling overhead.',
    points: [
      'Constructed a full-stack MERN quick-commerce architecture achieving sub-second page transitions, optimistic cart updates, and responsive catalog filtering via Vite and React Router.',
      'Embedded a stateful AI Shopping Assistant powered by the Google Gemini API capable of curating recipe/need-based product bundles and executing automated cart mutations.',
      'Implemented live order tracking utilizing bidirectional Socket.io event channels and Leaflet.js vector maps for real-time courier telemetry and ETA visualization.',
    ],
    stack: [
      'React',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Socket.io',
      'Leaflet.js',
      'Google Gemini API',
      'Vite',
    ],
    githubUrl: 'https://github.com/Kshiku12/binkeyit',
    liveUrl: 'https://binkeyit-online.vercel.app/',
    interactiveDemoType: 'binkeyit',
    archNodes: [
      { id: 'b1', label: 'Vite SPA & Cart Store', sublabel: 'Optimistic UI Transitions', layer: 'client' },
      { id: 'b2', label: 'Gemini Shopping Agent', sublabel: 'Intent → Cart Action Calling', layer: 'compute' },
      { id: 'b3', label: 'Express & MongoDB Core', sublabel: 'Inventory, Auth & Orders', layer: 'data' },
      { id: 'b4', label: 'Socket.io + Leaflet Map', sublabel: 'Live Geospatial Telemetry', layer: 'edge' },
    ],
    archFlowNote:
      'User queries or checkout events hit Express REST/WebSocket gateway → Gemini Agent resolves natural language into SKU cart operations → Socket.io streams live GPS waypoints to Leaflet.js client map.',
  },
  {
    id: 'auramotors',
    code: 'SYS-04',
    metric: '81.8% TDD',
    metricSub: '32/32 Tests · Full-Stack TypeScript',
    title: 'Aura Motors',
    context: 'TDD-Engineered Luxury Automotive Inventory & AI Concierge',
    category: 'TDD & Enterprise',
    summary:
      'Full-stack automotive dealership inventory and client acquisition platform built under strict Test-Driven Development (TDD) with 32 automated test suites, token-based RBAC, an AI Automotive Concierge, and a side-by-side telemetry comparison engine.',
    engineeringChallenge:
      'Guaranteeing transactional stock integrity and role-isolated mutations across complex vehicle configurations through red-green-refactor TDD discipline before writing UI layers.',
    points: [
      'Engineered backend services and Mongoose schemas following strict Test-Driven Development (TDD), achieving 81.8% statement coverage across 32 passing unit and integration tests.',
      'Built JWT role-based access control (RBAC), atomic stock transaction tracking, and a Bespoke Custom Commission Studio for configuring trims, powertrains, and telemetry specs.',
      'Designed an Autonomous AI Automotive Concierge and an Interactive Side-by-Side Vehicle Comparison Engine comparing horsepower, 0–100 km/h acceleration, and chassis dynamics.',
    ],
    stack: [
      'TypeScript 5.6',
      'React 18',
      'Express 4.21',
      'MongoDB & Mongoose',
      'Jest / Supertest TDD',
      'JWT RBAC',
      'Tailwind CSS',
    ],
    githubUrl: 'https://github.com/Kshiku12/incubyte_cardealership_inverntory',
    interactiveDemoType: 'auramotors',
    archNodes: [
      { id: 'a1', label: '32 TDD Test Suites', sublabel: '81.8% Verified Coverage', layer: 'compute' },
      { id: 'a2', label: 'JWT RBAC & API Gateway', sublabel: 'Express 4.21 + TypeScript', layer: 'edge' },
      { id: 'a3', label: 'Transactional Inventory', sublabel: 'MongoDB / Mongoose Models', layer: 'data' },
      { id: 'a4', label: 'Showroom & AI Concierge', sublabel: 'Comparison & Commission Studio', layer: 'client' },
    ],
    archFlowNote:
      'Every API contract is verified first by 32 automated test cases → Express RBAC middleware validates dealer/client tokens → Mongoose enforces schema & stock invariants → React showroom renders live telemetry.',
  },
  {
    id: 'fdsa',
    code: 'SYS-05',
    metric: '15 Tests/Q',
    metricSub: 'Tier-1 OT Simulator & Code Sandbox',
    title: 'Placement Ready (FDSA)',
    context: 'Interactive DSA, SQL & Tier-1 Online Assessment Simulator',
    category: 'EdTech & Sandbox',
    summary:
      'Browser-based coding sandbox and company Online Test (OT) simulator replicating Google, Amazon, Microsoft, and Swiggy assessment rounds with anti-cheat lockouts, 15 automated unit test cases per problem, and interactive algorithm visualizers.',
    engineeringChallenge:
      'Executing untrusted user code submissions against 15 edge-case test vectors directly in the browser with deterministic output verification and strict timed assessment lockouts.',
    points: [
      'Built a Live Online Test (OT) Simulator modeling exact round structures of Google, Amazon, Microsoft, and Swiggy with strict countdown timers, anti-cheat solution lockouts, and automated OFFER FIT scorecards.',
      'Engineered a multi-language Code Editor Sandbox (JavaScript, Python, C++, Java) featuring an in-browser execution harness that validates submissions against 15 unit test cases per problem.',
      'Created interactive step-by-step visualizers for Data Structures, Algorithms, and SQL query execution plans to accelerate conceptual mastery.',
    ],
    stack: [
      'React',
      'TypeScript',
      'Vite',
      'Browser Sandbox Execution',
      'Algorithm Visualizers',
      'SQL Prep Engine',
    ],
    githubUrl: 'https://github.com/Kshiku12/FDSA',
    liveUrl: 'https://fdsa-two.vercel.app/',
    interactiveDemoType: 'fdsa',
    archNodes: [
      { id: 'f1', label: 'Company OT Mode', sublabel: 'Timer + Anti-Cheat Lockout', layer: 'client' },
      { id: 'f2', label: 'Multi-Lang Code Editor', sublabel: 'JS / Python / C++ / Java', layer: 'edge' },
      { id: 'f3', label: '15-Case Test Harness', sublabel: 'Isolated Sandbox Evaluator', layer: 'compute' },
      { id: 'f4', label: 'Scorecard & Visualizers', sublabel: 'OFFER FIT Telemetry & DSA', layer: 'data' },
    ],
    archFlowNote:
      'Candidate enters timed Company OT round → helper tabs lock automatically → code submissions run against 15 unit test vectors in sandbox → scorecard computes speed, accuracy & OFFER FIT readiness.',
  },
  {
    id: 'autoregressive-nlp',
    code: 'SYS-06',
    metric: '4 Architectures',
    metricSub: 'RNN · Bi-RNN · LSTM · GRU on CUDA',
    title: 'Autoregressive Text Generation Engine',
    context: 'Comparative Deep Learning Sequence Modeling in PyTorch',
    category: 'Deep Learning',
    summary:
      'End-to-end PyTorch & CUDA autoregressive language modeling study benchmarking Simple RNN, Bidirectional RNN, LSTM, and GRU architectures on Sir Arthur Conan Doyle’s Sherlock Holmes corpus with temperature-scaled sampling analysis.',
    engineeringChallenge:
      'Quantifying vanishing gradient degradation across long literary sequences and balancing grammatical coherence against lexical diversity via temperature-scaled softmax decoding.',
    points: [
      'Implemented four recurrent neural architectures from scratch in PyTorch with NVIDIA CUDA acceleration: Simple Elman RNN, Bidirectional RNN, Long Short-Term Memory (LSTM), and Gated Recurrent Unit (GRU).',
      'Trained and evaluated models on Project Gutenberg’s Sherlock Holmes corpus, tracking cross-entropy loss curves, validation perplexity, training throughput, and parameter efficiency.',
      'Conducted systematic temperature-scaling experiments (T = 0.5, 0.8, 1.0, 1.3) to analyze next-token probability entropy and syntactic fidelity in generated prose.',
    ],
    stack: [
      'Python',
      'PyTorch',
      'NVIDIA CUDA',
      'LSTM / GRU / Bi-RNN',
      'Autoregressive NLP',
      'Jupyter Notebook',
    ],
    githubUrl: 'https://github.com/Kshiku12/Autoregressive-Text-Generation-RNN-LSTM-GRU',
    interactiveDemoType: 'autoregressive',
    archNodes: [
      { id: 'r1', label: 'Corpus Tokenization', sublabel: 'Sherlock Holmes Vocabulary', layer: 'data' },
      { id: 'r2', label: 'CUDA Recurrent Cores', sublabel: 'RNN vs Bi-RNN vs LSTM vs GRU', layer: 'compute' },
      { id: 'r3', label: 'Perplexity Benchmark', sublabel: 'Cross-Entropy & Gradient Flow', layer: 'edge' },
      { id: 'r4', label: 'Temperature Decoder', sublabel: 'Softmax T ∈ [0.5, 1.3] Sampling', layer: 'client' },
    ],
    archFlowNote:
      'Literary corpus is tokenized into sliding context windows → 4 CUDA-accelerated recurrent networks learn conditional P(w_t | w_<t) → temperature-scaled multinomial decoder generates stylistic prose.',
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'schenck-rotec',
    period: 'Jul 2026 — Aug 2026',
    start: 'Jul 2026',
    end: 'Aug 2026',
    organization: 'Schenck RoTec India Ltd.',
    role: 'Software Development Intern — Global IT Department',
    location: 'Noida, Uttar Pradesh · On-site',
    type: 'Internship',
    highlightBadge: 'Enterprise 3-Tier Architecture Shipped',
    credentials: [
      {
        label: 'Internship Record / Offer',
        url: 'https://drive.google.com/file/d/1FfZnCxAS3dknkrKELnAR8ijQp7iru0F2/view?usp=sharing',
      },
      {
        label: 'Completion Certificate',
        url: 'https://drive.google.com/file/d/19WIGV9iCKRNyFqtBBE5-Nb6eobZ5ikgK/view?usp=sharing',
      },
    ],
    points: [
      'Designed and built the Power Pages Student Event & Host Club Directory Hub, a full-stack enterprise web application on Microsoft Power Pages that unified event discovery, club directories, and student registration — replacing a scattered mix of spreadsheets, forms, and social posts.',
      'Architected a secure three-tier system (Microsoft Dataverse relational schema, Liquid & FetchXML server-side templating, and modular client-side JavaScript) powering an interactive event calendar, auto-generated club directory, and a multistep registration flow with live ticket-ID generation.',
      'Automated confirmation emails, scheduled event reminders, and on-demand/monthly admin reporting using Microsoft Power Automate, eliminating manual administrative overhead through event-driven and scheduled cloud workflows.',
    ],
    skills: [
      'Microsoft Power Pages',
      'Microsoft Dataverse',
      'Liquid & FetchXML',
      'Power Automate',
      'JavaScript (ES6+)',
      'Three-Tier Architecture',
      'Enterprise RBAC',
    ],
    architectureSpotlight: {
      title: 'Schenck RoTec 3-Tier Enterprise Event Hub Architecture',
      tiers: [
        {
          tier: 'Tier 1 · Data & Security Layer',
          tech: 'Microsoft Dataverse + Table Permissions',
          detail: 'Relational entities for Events, Host Clubs, Registrations & Generated Ticket IDs with role-based row security.',
        },
        {
          tier: 'Tier 2 · Server Templating & Query Layer',
          tech: 'Liquid Templates + FetchXML Aggregations',
          detail: 'Server-rendered dynamic views, live capacity counts, and filtered club directories queried via FetchXML.',
        },
        {
          tier: 'Tier 3 · Client UX & Cloud Automation',
          tech: 'Client-Side JS + Power Automate Flows',
          detail: 'Interactive calendar, multistep registration wizard with live ticket-ID generation, and automated email/reporting pipelines.',
        },
      ],
    },
  },
  {
    id: 'data-alchemist',
    period: 'Aug 2025 — Present',
    start: 'Aug 2025',
    end: 'Present',
    organization: 'The Data Alchemist — MIT Manipal',
    role: 'Board Member · Head of HR & Management',
    location: 'Manipal, Karnataka',
    type: 'Leadership',
    highlightBadge: 'Promoted to Board — Head of HR',
    credentials: [
      {
        label: 'Board Appointment Credential',
        url: 'https://drive.google.com/file/d/1vrDBI2s4Uo_OCLa7pZ3OGk8s5ba3cX8d/view?usp=sharing',
      },
    ],
    points: [
      'Promoted from Management Committee to Board Member (Head of HR & Management) in recognition of leadership in organizational strategy, recruitment architecture, and cross-functional team coordination.',
      'Spearhead talent onboarding, technical workshop logistics, and inter-domain collaboration for MIT Manipal’s premier data science and analytics collective.',
    ],
    skills: ['Organizational Strategy', 'Technical Recruitment', 'Cross-Functional Leadership', 'Event Operations'],
  },
  {
    id: 'deepthought',
    period: 'May 2025 — Jul 2025',
    start: 'May 2025',
    end: 'Jul 2025',
    organization: 'Deepthought Edutech Ventures Pvt. Ltd.',
    role: 'AI Agent Developer Intern',
    location: 'Pune, Maharashtra',
    type: 'Internship',
    highlightBadge: 'Production Client AI Agents (Wishkarma)',
    points: [
      'Developed and deployed AI-driven conversational chatbots for enterprise clients including Wishkarma to automate customer workflows and elevate user engagement.',
      'Integrated multi-turn AI agent pipelines directly into client production platforms in collaboration with cross-functional product and backend engineering teams.',
      'Trained, prompt-engineered, and fine-tuned language models to significantly improve domain intent recognition, contextual response accuracy, and end-user experience.',
    ],
    skills: ['AI Agents', 'LLM Fine-Tuning', 'Intent Recognition', 'Python', 'API Integration', 'Prompt Engineering'],
  },
  {
    id: 'epoch-techtatva',
    period: 'Aug 2024 — Oct 2024',
    start: 'Aug 2024',
    end: 'Oct 2024',
    organization: 'Epoch’24 — Tech Tatva (MIT Manipal)',
    role: 'Technical Committee Member',
    location: 'Manipal, Karnataka',
    type: 'Leadership',
    points: [
      'Organized a large-scale campus datathon during MIT Manipal’s national technical fest, designing problem statements centered on Exploratory Data Analysis (EDA) and ethical dataset evaluation.',
      'Evaluated participant submissions on statistical rigor, feature engineering quality, and algorithmic fairness.',
    ],
    skills: ['Exploratory Data Analysis (EDA)', 'Ethical AI & Datasets', 'Datathon Curation', 'Python'],
  },
  {
    id: 'mit-blockchain',
    period: '2024 — 2025',
    start: '2024',
    end: '2025',
    organization: 'Manipal Institute of Technology — Blockchain & Web3 Lab',
    role: 'Undergraduate Researcher (Guided by Ms. Pooja S.)',
    location: 'Manipal, Karnataka',
    type: 'Research',
    points: [
      'Conducted applied research in decentralized systems and Web3 protocols under the faculty guidance of Ms. Pooja S. at MIT Manipal.',
      'Authored and executed smart contracts in Solidity, analyzing consensus mechanisms to optimize transaction finality, gas efficiency, and smart-contract security.',
    ],
    skills: ['Solidity', 'Smart Contracts', 'Consensus Mechanisms', 'Blockchain Security', 'Web3'],
  },
];

export const ARCHIVE_PROJECTS: ArchiveProject[] = [
  {
    id: 'arch-street-vendor',
    title: 'Street Vendor Demand Predictor (SVDP)',
    category: 'AI, ML & Agents',
    description:
      '4-layer conversational AI agent helping Indian street food vendors forecast daily inventory demand ("Kitna maal laaun aaj ke liye?") in Hinglish using weather, footfall, and rupee margin heuristics.',
    stack: ['Python', 'AI Agent Architecture', 'Stateful Memory', 'Forecasting'],
    githubUrl: 'https://github.com/Kshiku12/street-vendor-ai-agent',
    featuredMetric: '4-Layer Agent',
    year: '2025',
  },
  {
    id: 'arch-gen-ai-suite',
    title: 'Generative AI & Deep Sequence Modeling Suite',
    category: 'AI, ML & Agents',
    description:
      'End-to-end generative AI notebooks and sequence architectures exploring neural text synthesis, token distribution analysis, and deep learning training pipelines.',
    stack: ['Python', 'PyTorch', 'Generative AI', 'Jupyter Notebook'],
    githubUrl: 'https://github.com/Kshiku12/Gen-AI-Assignment',
    featuredMetric: 'GenAI Lab',
    year: '2026',
  },
  {
    id: 'arch-stock-tracker',
    title: 'Market & Stock Portfolio Tracker',
    category: 'AI, ML & Agents',
    description:
      'Python-based equities analytics utility for monitoring real-time stock price movements, historical volatility indicators, and portfolio allocation performance.',
    stack: ['Python', 'Financial Analytics', 'Data Visualization', 'Market Telemetry'],
    githubUrl: 'https://github.com/Kshiku12/Stock_Tracker',
    featuredMetric: 'Live Equities',
    year: '2026',
  },
  {
    id: 'arch-kashuflix',
    title: 'Kashuflix Media Platform',
    category: 'Full-Stack & Web',
    description:
      'Full-featured streaming catalog and media discovery application with curated genres, watchlist persistence, and responsive playback UI.',
    stack: ['Python', 'JavaScript', 'Web UI', 'REST APIs'],
    githubUrl: 'https://github.com/Kshiku12/Kashuflix_final',
    featuredMetric: 'Media Catalog',
    year: '2025',
  },
  {
    id: 'arch-pokemon-java',
    title: 'Turn-Based Pokémon Battle Engine',
    category: '3D & Game Engines',
    description:
      'Object-oriented turn-based combat engine in Java implementing type-effectiveness matrices, priority queues, status effects, and deterministic damage formulas.',
    stack: ['Java', 'OOP Architecture', 'State Machines', 'Game Loop'],
    githubUrl: 'https://github.com/Kshiku12/Turn-Based-Pok-mon-Game',
    featuredMetric: 'Java Engine',
    year: '2025',
  },
  {
    id: 'arch-npacn',
    title: 'NPACN Network Programming Suite',
    category: 'Systems & Low-Level',
    description:
      'Low-level TCP/UDP socket programming implementations, concurrent client-server architectures, and packet routing protocols written in C.',
    stack: ['C', 'POSIX Sockets', 'TCP/UDP', 'Network Protocols'],
    githubUrl: 'https://github.com/Kshiku12/NPACN-Lab',
    featuredMetric: 'POSIX / C',
    year: '2026',
  },
  {
    id: 'arch-madl',
    title: 'Native Android Application Suite (MADL)',
    category: 'Systems & Low-Level',
    description:
      'Collection of native Android mobile applications engineered in Java featuring lifecycle-aware components, SQLite persistence, and Material UI flows.',
    stack: ['Java', 'Android SDK', 'Mobile Architecture', 'SQLite'],
    githubUrl: 'https://github.com/Kshiku12/MADL',
    featuredMetric: 'Android SDK',
    year: '2026',
  },
  {
    id: 'arch-cryptonite',
    title: 'Cryptonite Security & Systems Taskphase',
    category: 'Systems & Low-Level',
    description:
      'Applied cryptography, systems security challenges, and protocol analysis engineered for MIT Manipal’s Cryptonite cybersecurity collective taskphase.',
    stack: ['Cryptography', 'Systems Security', 'Linux', 'Protocol Analysis'],
    githubUrl: 'https://github.com/Kshiku12/cryptonite_taskphase_Kshitij',
    featuredMetric: 'Cybersecurity',
    year: '2024',
  },
  {
    id: 'arch-kshikuit',
    title: 'Kshikuit Web & Scripting Suite',
    category: 'Full-Stack & Web',
    description:
      'Modular web experiments, full-stack utility scripts, and frontend workflow prototypes built for rapid iteration.',
    stack: ['JavaScript', 'Web Modules', 'Full-Stack Utilities'],
    githubUrl: 'https://github.com/Kshiku12/kshikuit',
    year: '2026',
  },
];

export const SKILL_GROUPS = [
  {
    category: 'Languages & Core',
    tag: '01 // SYNTAX',
    items: ['TypeScript', 'Python', 'JavaScript (ES6+)', 'Java', 'C', 'C++', 'SQL', 'Dart', 'Solidity', 'C#', 'HTML5 / CSS3'],
  },
  {
    category: 'Frontend, 3D & Mobile',
    tag: '02 // INTERFACE',
    items: ['Next.js 16 (App Router)', 'React 19', 'Three.js', 'React Three Fiber (R3F)', 'Tailwind CSS', 'Vite', 'React Native', 'Flutter', 'Leaflet.js'],
  },
  {
    category: 'Backend, Enterprise & Data',
    tag: '03 // SYSTEMS',
    items: ['Node.js', 'Express.js', 'Flask', 'Django', 'Supabase (Realtime & Auth)', 'PostgreSQL', 'MongoDB', 'Socket.io', 'Microsoft Power Pages', 'Dataverse & FetchXML', 'Power Automate'],
  },
  {
    category: 'AI, ML & Developer Tooling',
    tag: '04 // INTELLIGENCE',
    items: ['Google Gemini API (Vision & Text)', 'PyTorch (CUDA)', 'TensorFlow', 'LLM Fine-Tuning & Agents', 'NextAuth.js (Multi-OAuth)', 'Gmail API', 'Jest TDD', 'Git & GitHub', 'Jupyter Notebook'],
  },
];

export const EDUCATION = [
  {
    institution: 'Manipal Institute of Technology (MIT)',
    location: 'Manipal, Karnataka, India',
    degree: 'Bachelor of Technology in Computer Science and Communication Engineering',
    period: 'Aug 2023 — Present (Expected 2027)',
    badge: 'B.Tech CCE · MIT Manipal',
    coursework: [
      'Data Structures & Algorithms',
      'Operating Systems',
      'Database Management Systems',
      'Computer Networks',
      'Object-Oriented Programming',
      'Information Security',
      'Foundations of Generative AI',
    ],
  },
  {
    institution: 'Delhi Public School (DPS)',
    location: 'Greater Noida, Uttar Pradesh, India',
    degree: 'High School Diploma (CBSE Class XII)',
    period: '2008 — 2022',
    badge: '95.75% Aggregate Score',
    coursework: ['Mathematics', 'Computer Science', 'Physics', 'Chemistry'],
  },
];

