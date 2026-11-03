import React, { useState, useEffect, useRef } from 'react';
import { FlagshipSystem } from '../data/portfolioData';
import {
  Sparkles,
  CheckCircle2,
  Play,
  Sun,
  Moon,
  Award,
  MapPin,
  ShieldCheck,
  Terminal,
  Cpu,
  Mail,
  Eye,
  Plus,
  RefreshCw,
  Trash2,
  ShoppingCart,
  ExternalLink,
  Camera,
  Sliders,
  Send,
  RotateCcw,
  Car,
  GitCompare,
} from 'lucide-react';

interface InteractiveSystemLabProps {
  system: FlagshipSystem;
}

/* ============================================================================
   1. POKÉFINANCE REPLICA (Exact Categories, PokéAPI Artwork, EXP=n³ & Route 1)
   ============================================================================ */
const POKE_CATEGORIES = [
  {
    id: 'food-delivery',
    name: 'Food Delivery',
    icon: '🍔',
    apps: 'Zomato · Swiggy',
    color: '#F08030',
    habitLore: 'Campfire Slumber: Resting warmly by the roadside hearth after a midnight delivery feast.',
    pos: { x: 0.24, y: 0.62 },
    evolutions: [
      { stage: 1, name: 'Charmander', id: 4, minLv: 1 },
      { stage: 2, name: 'Charmeleon', id: 5, minLv: 16 },
      { stage: 3, name: 'Charizard', id: 6, minLv: 36 },
    ],
  },
  {
    id: 'grocery',
    name: 'Grocery',
    icon: '🛒',
    apps: 'Blinkit · Instamart',
    color: '#78C850',
    habitLore: 'Tall Grass Forager: Grazing in the dense Route 1 meadows amidst fresh produce.',
    pos: { x: 0.68, y: 0.58 },
    evolutions: [
      { stage: 1, name: 'Bulbasaur', id: 1, minLv: 1 },
      { stage: 2, name: 'Ivysaur', id: 2, minLv: 16 },
      { stage: 3, name: 'Venusaur', id: 3, minLv: 32 },
    ],
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    icon: '📦',
    apps: 'Amazon · Flipkart',
    color: '#6890F0',
    habitLore: 'Azure Lake Swimmer: Paddling peacefully in Azure Lake inspecting water lilies.',
    pos: { x: 0.82, y: 0.38 },
    evolutions: [
      { stage: 1, name: 'Squirtle', id: 7, minLv: 1 },
      { stage: 2, name: 'Wartortle', id: 8, minLv: 16 },
      { stage: 3, name: 'Blastoise', id: 9, minLv: 36 },
    ],
  },
  {
    id: 'upi-payments',
    name: 'UPI / Payments',
    icon: '💳',
    apps: 'GPay · PhonePe · CRED',
    color: '#F8D030',
    habitLore: 'Signpost Watcher: Perched alertly by the Route 1 sign, cheeks crackling with UPI energy.',
    pos: { x: 0.42, y: 0.46 },
    evolutions: [
      { stage: 1, name: 'Pichu', id: 172, minLv: 1 },
      { stage: 2, name: 'Pikachu', id: 25, minLv: 10 },
      { stage: 3, name: 'Raichu', id: 26, minLv: 22 },
    ],
  },
  {
    id: 'gaming',
    name: 'Gaming & OTT',
    icon: '🎮',
    apps: 'Steam · Netflix',
    color: '#705898',
    habitLore: 'Shaded Canopy: Drifting beneath the pine trees after a late-night gaming session.',
    pos: { x: 0.18, y: 0.32 },
    evolutions: [
      { stage: 1, name: 'Gastly', id: 92, minLv: 1 },
      { stage: 2, name: 'Haunter', id: 93, minLv: 25 },
      { stage: 3, name: 'Gengar', id: 94, minLv: 40 },
    ],
  },
  {
    id: 'investments',
    name: 'Investments & MF',
    icon: '💰',
    apps: 'Zerodha · Groww',
    color: '#58A060',
    habitLore: 'Cliffside Guardian: Training steadily on the northern ridge as your portfolio compounds.',
    pos: { x: 0.55, y: 0.26 },
    evolutions: [
      { stage: 1, name: 'Larvitar', id: 246, minLv: 1 },
      { stage: 2, name: 'Pupitar', id: 247, minLv: 30 },
      { stage: 3, name: 'Tyranitar', id: 248, minLv: 55 },
    ],
  },
];

const spriteUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const amountToExp = (amount: number) => {
  const bonus = Math.floor(Math.log10(Math.max(amount, 1)) * 50);
  return Math.max(Math.floor(amount + bonus), 1);
};

const PokeFinanceReplica: React.FC = () => {
  const [subTab, setSubTab] = useState<'world' | 'ledger' | 'badges'>('world');
  const [isNight, setIsNight] = useState<boolean>(true);
  const [cameraView, setCameraView] = useState<'sleep' | 'drone' | 'lake'>('sleep');
  const [selectedCatId, setSelectedCatId] = useState<string>('food-delivery');
  const [customAmount, setCustomAmount] = useState<string>('850');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // EXP per category (using exact EXP = n³ math from pokemon.ts)
  const [catExp, setCatExp] = useState<Record<string, number>>({
    'food-delivery': 19683, // Lv 27 Charmeleon
    grocery: 35937, // Lv 33 Venusaur
    ecommerce: 5832, // Lv 18 Wartortle
    'upi-payments': 12167, // Lv 23 Raichu
    gaming: 17576, // Lv 26 Haunter
    investments: 42875, // Lv 35 Pupitar
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const selectedCat = POKE_CATEGORIES.find((c) => c.id === selectedCatId) || POKE_CATEGORIES[0];
  const currentExp = catExp[selectedCat.id] || 1000;
  const currentLv = Math.min(60, Math.floor(Math.cbrt(currentExp)));
  const currentLvExp = Math.pow(currentLv, 3);
  const nextLvExp = Math.pow(currentLv + 1, 3);
  const progressPct = Math.min(
    100,
    Math.max(5, Math.round(((currentExp - currentLvExp) / (nextLvExp - currentLvExp)) * 100))
  );

  const getActiveEvo = (cat: (typeof POKE_CATEGORIES)[0], lv: number) => {
    const sorted = [...cat.evolutions].sort((a, b) => b.minLv - a.minLv);
    return sorted.find((e) => lv >= e.minLv) || cat.evolutions[0];
  };

  const activeEvo = getActiveEvo(selectedCat, currentLv);

  const handleLogTransaction = (amt: number, label: string) => {
    const gained = amountToExp(amt) * 12; // scaled so user can trigger level-ups quickly
    const oldLv = Math.floor(Math.cbrt(catExp[selectedCat.id]));
    const nextTotal = catExp[selectedCat.id] + gained;
    const newLv = Math.floor(Math.cbrt(nextTotal));
    setCatExp((prev) => ({ ...prev, [selectedCat.id]: nextTotal }));

    const oldEvo = getActiveEvo(selectedCat, oldLv);
    const newEvo = getActiveEvo(selectedCat, newLv);
    if (newEvo.name !== oldEvo.name) {
      setToastMsg(`✨ EVOLUTION! ${oldEvo.name} evolved into ${newEvo.name} at Lv. ${newLv}!`);
    } else {
      setToastMsg(`Logged ₹${amt.toLocaleString('en-IN')} (${label}) → +${gained.toLocaleString()} EXP!`);
    }
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Interactive Route 1 3D-style Sanctuary Canvas
  useEffect(() => {
    if (subTab !== 'world') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.025;
      const w = (canvas.width = canvas.parentElement?.clientWidth || 680);
      const h = (canvas.height = 270);

      // Sky & meadow background
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      if (isNight) {
        grad.addColorStop(0, '#070b19');
        grad.addColorStop(0.45, '#0f1e36');
        grad.addColorStop(1, '#0b241c');
      } else {
        grad.addColorStop(0, '#38bdf8');
        grad.addColorStop(0.45, '#86efac');
        grad.addColorStop(1, '#15803d');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Camera perspective offset
      const camOffsetX = cameraView === 'sleep' ? 0 : cameraView === 'lake' ? -60 : 20;
      const camScale = cameraView === 'drone' ? 0.88 : 1;

      ctx.save();
      ctx.translate(camOffsetX, 0);
      ctx.scale(camScale, camScale);

      // Dirt Route 1 Winding Path
      ctx.fillStyle = isNight ? 'rgba(120, 88, 56, 0.38)' : 'rgba(217, 169, 108, 0.65)';
      ctx.beginPath();
      ctx.ellipse(w * 0.45, h * 0.62, w * 0.34, 42, -0.08, 0, Math.PI * 2);
      ctx.fill();

      // Azure Lake Sanctuary (Right side)
      ctx.fillStyle = isNight ? 'rgba(14, 116, 144, 0.58)' : 'rgba(56, 189, 248, 0.75)';
      ctx.beginPath();
      ctx.ellipse(w * 0.82, h * 0.42, 95, 48, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Animated Water Ripples on Azure Lake
      ctx.strokeStyle = isNight ? 'rgba(103, 232, 249, 0.35)' : 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 1.2;
      for (let r = 0; r < 3; r++) {
        const rad = 18 + ((t * 14 + r * 22) % 62);
        ctx.beginPath();
        ctx.ellipse(w * 0.82, h * 0.4, rad, rad * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Central Sleep Sanctuary Circle (Snorlax Nest)
      ctx.strokeStyle = isNight ? 'rgba(52, 211, 153, 0.35)' : 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(w * 0.48, h * 0.54, 66, 30, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Campfire Hearth (Left side)
      const fireX = w * 0.2;
      const fireY = h * 0.66;
      const flicker = Math.sin(t * 6) * 3;
      const fireGrad = ctx.createRadialGradient(fireX, fireY, 2, fireX, fireY, 38 + flicker);
      fireGrad.addColorStop(0, 'rgba(255, 180, 50, 0.95)');
      fireGrad.addColorStop(0.5, 'rgba(255, 82, 39, 0.45)');
      fireGrad.addColorStop(1, 'rgba(255, 82, 39, 0)');
      ctx.fillStyle = fireGrad;
      ctx.beginPath();
      ctx.arc(fireX, fireY, 38 + flicker, 0, Math.PI * 2);
      ctx.fill();

      // Fireflies / Starlight VFX
      for (let i = 0; i < 18; i++) {
        const fx = ((i * 97 + Math.sin(t + i) * 28) % w);
        const fy = 24 + ((i * 43 + Math.cos(t * 0.8 + i) * 18) % (h - 40));
        ctx.fillStyle = isNight ? 'rgba(250, 204, 21, 0.75)' : 'rgba(255, 255, 255, 0.65)';
        ctx.beginPath();
        ctx.arc(fx, fy, 1.8 + Math.sin(t * 3 + i) * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      // Floating "Zzz" over Sleep Sanctuary
      ctx.font = '700 11px "JetBrains Mono", monospace';
      ctx.fillStyle = isNight ? 'rgba(167, 243, 208, 0.85)' : 'rgba(255, 255, 255, 0.9)';
      const zOffset = (t * 18) % 32;
      ctx.fillText('Zzz...', w * 0.47, h * 0.48 - zOffset);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [subTab, isNight, cameraView]);

  return (
    <div className="app-replica poke-app">
      {/* Top App Navigation Dock (Exact match to PokéFinance AppNavigation) */}
      <div className="replica-topbar">
        <div className="replica-brand">
          <span className="replica-logo-icon">⚡</span>
          <div>
            <strong className="replica-app-name">PokéFinance</strong>
            <span className="replica-app-tag">Route 1 3D Sanctuary · EXP = n³</span>
          </div>
        </div>

        <div className="replica-nav-tabs">
          <button
            type="button"
            className={`replica-tab ${subTab === 'world' ? 'is-active' : ''}`}
            onClick={() => setSubTab('world')}
          >
            🌲 Route 1 World
          </button>
          <button
            type="button"
            className={`replica-tab ${subTab === 'ledger' ? 'is-active' : ''}`}
            onClick={() => setSubTab('ledger')}
          >
            💸 Add Transaction &amp; Pokédex
          </button>
          <button
            type="button"
            className={`replica-tab ${subTab === 'badges' ? 'is-active' : ''}`}
            onClick={() => setSubTab('badges')}
          >
            🏆 Gym Badges (8)
          </button>
        </div>

        <div className="replica-controls">
          <button
            type="button"
            className="replica-icon-pill"
            onClick={() => setIsNight((n) => !n)}
          >
            {isNight ? <Moon size={13} /> : <Sun size={13} />}
            <span>{isNight ? 'Starlight' : 'Daylight'}</span>
          </button>
        </div>
      </div>

      {toastMsg && <div className="replica-toast">{toastMsg}</div>}

      {subTab === 'world' && (
        <div className="poke-world-body">
          <div className="poke-canvas-stage">
            <canvas ref={canvasRef} className="poke-route-canvas" />

            {/* Camera Preset Overlay Buttons */}
            <div className="poke-camera-hud">
              <Camera size={12} />
              {(['sleep', 'drone', 'lake'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`cam-btn ${cameraView === v ? 'is-active' : ''}`}
                  onClick={() => setCameraView(v)}
                >
                  {v === 'sleep' ? 'Sleep Sanctuary' : v === 'drone' ? 'Drone Orbit' : 'Azure Lake'}
                </button>
              ))}
            </div>

            {/* Interactive Companion Sprites Positioned on Route 1 */}
            {POKE_CATEGORIES.map((cat) => {
              const lv = Math.min(60, Math.floor(Math.cbrt(catExp[cat.id])));
              const evo = getActiveEvo(cat, lv);
              const isSelected = cat.id === selectedCatId;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`route-sprite-pin ${isSelected ? 'is-selected' : ''}`}
                  style={{ left: `${cat.pos.x * 100}%`, top: `${cat.pos.y * 100}%` }}
                  onClick={() => setSelectedCatId(cat.id)}
                  title={`${evo.name} (Lv. ${lv}) — ${cat.name}`}
                >
                  <img
                    src={spriteUrl(evo.id)}
                    alt={evo.name}
                    className="route-sprite-img"
                  />
                  <span className="route-sprite-lbl">
                    {cat.icon} Lv.{lv}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Companion Inspector & Quick Expense Logger */}
          <div className="poke-inspector-card">
            <div className="poke-inspector-left">
              <img
                src={spriteUrl(activeEvo.id)}
                alt={activeEvo.name}
                className="poke-hero-sprite"
              />
              <div>
                <div className="poke-cat-badge" style={{ borderColor: selectedCat.color }}>
                  <span>{selectedCat.icon}</span>
                  <span>{selectedCat.name}</span>
                  <span className="poke-apps-sub">({selectedCat.apps})</span>
                </div>
                <h4 className="poke-companion-name">
                  {activeEvo.name} <span className="poke-lv-pill">Lv. {currentLv}</span>
                </h4>
                <p className="poke-lore-text">{selectedCat.habitLore}</p>

                <div className="poke-exp-bar-wrap">
                  <div className="poke-exp-labels">
                    <span>
                      EXP = {currentLv}³ = <strong>{currentExp.toLocaleString()} XP</strong>
                    </span>
                    <span>Next Lv: {nextLvExp.toLocaleString()} XP ({progressPct}%)</span>
                  </div>
                  <div className="poke-exp-track">
                    <div
                      className="poke-exp-fill"
                      style={{ width: `${progressPct}%`, background: selectedCat.color }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="poke-quick-log">
              <span className="quick-log-title">Log Category Expense → Train Companion</span>
              <div className="quick-log-buttons">
                <button
                  type="button"
                  className="lab-action-btn"
                  onClick={() => handleLogTransaction(340, selectedCat.apps.split(' · ')[0])}
                >
                  + ₹340 ({selectedCat.apps.split(' · ')[0]})
                </button>
                <button
                  type="button"
                  className="lab-action-btn"
                  onClick={() => handleLogTransaction(1450, 'Budget Streak Bonus')}
                >
                  + ₹1,450 (Streak Bonus)
                </button>
                <button
                  type="button"
                  className="lab-action-btn"
                  onClick={() => handleLogTransaction(4800, 'Monthly Milestone')}
                >
                  ⚡ Trigger Evolution Boost
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'ledger' && (
        <div className="poke-ledger-body">
          <div className="poke-cat-grid">
            {POKE_CATEGORIES.map((cat) => {
              const lv = Math.min(60, Math.floor(Math.cbrt(catExp[cat.id])));
              const evo = getActiveEvo(cat, lv);
              return (
                <div
                  key={cat.id}
                  className={`poke-dex-card ${selectedCatId === cat.id ? 'is-active' : ''}`}
                  onClick={() => setSelectedCatId(cat.id)}
                >
                  <img src={spriteUrl(evo.id)} alt={evo.name} className="poke-dex-img" />
                  <div>
                    <span className="poke-dex-cat">
                      {cat.icon} {cat.name}
                    </span>
                    <h5 className="poke-dex-title">
                      {evo.name} · <span>Lv.{lv}</span>
                    </h5>
                    <div className="poke-evo-chain">
                      {cat.evolutions.map((e) => (
                        <span
                          key={e.name}
                          className={`evo-step ${lv >= e.minLv ? 'unlocked' : ''}`}
                        >
                          {e.name} (L{e.minLv})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <form
            className="poke-custom-tx-bar"
            onSubmit={(e) => {
              e.preventDefault();
              const val = Math.max(10, Number(customAmount) || 500);
              handleLogTransaction(val, `Custom ${selectedCat.name}`);
            }}
          >
            <span>
              Log ₹ into <strong>{selectedCat.name}</strong>:
            </span>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              min={10}
              max={100000}
              className="replica-input-sm"
            />
            <button type="submit" className="lab-seg-btn is-active">
              <Plus size={13} /> Add Transaction &amp; Grant EXP
            </button>
          </form>
        </div>
      )}

      {subTab === 'badges' && (
        <div className="poke-badges-body">
          <div className="lab-badges-grid">
            {[
              { name: 'Boulder Badge', desc: 'First Expense Logged on Route 1', unlocked: true },
              { name: 'Cascade Badge', desc: 'Grocery Companion Reached Stage 2', unlocked: true },
              { name: 'Thunder Badge', desc: '10+ UPI Transactions Synced', unlocked: true },
              { name: 'Rainbow Badge', desc: '6 Active Categories Tracked', unlocked: true },
              { name: 'Soul Badge', desc: 'SIP & Investment Streak ≥ Lv.30', unlocked: true },
              { name: 'Marsh Badge', desc: 'Under-Budget Month Completed', unlocked: true },
              { name: 'Volcano Badge', desc: 'Stage 3 Charizard / Venusaur Evolved', unlocked: currentLv >= 32 },
              { name: 'Earth Badge', desc: 'Master of Route 1 Finances (All Lv.35+)', unlocked: currentLv >= 40 },
            ].map((b) => (
              <div key={b.name} className={`lab-badge-cell ${b.unlocked ? 'is-unlocked' : ''}`}>
                <Award size={15} />
                <div>
                  <strong style={{ display: 'block' }}>{b.name}</strong>
                  <span style={{ fontSize: '0.66rem', opacity: 0.8 }}>{b.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   2. NEXUSSUBS REPLICA (Dashboard + Multi-OAuth + Nexus AI Vision + Live Iframe)
   ============================================================================ */
const NexusSubsReplica: React.FC = () => {
  const [tab, setTab] = useState<'dashboard' | 'chatbot' | 'live'>('dashboard');
  const [linkedEmails, setLinkedEmails] = useState<string[]>([
    'kshitij.verma302312@gmail.com',
    'kshitij.gaming@gmail.com',
  ]);
  const [newEmailInput, setNewEmailInput] = useState('');
  const [syncing, setSyncing] = useState(false);

  const [subs, setSubs] = useState([
    {
      id: 's1',
      serviceName: 'Netflix 4K Ultra HD',
      category: 'OTT Streaming',
      amount: 649,
      nextDueDate: 'Expiring in 2 days',
      status: 'expiring',
      source: 'Gmail API · kshitij.verma302312@gmail.com',
    },
    {
      id: 's2',
      serviceName: 'Xbox Game Pass Ultimate',
      category: 'Gaming Catalog',
      amount: 549,
      nextDueDate: 'Renews in 14 days',
      status: 'active',
      source: 'Gmail API · kshitij.gaming@gmail.com',
    },
    {
      id: 's3',
      serviceName: 'Spotify Premium Duo',
      category: 'Music',
      amount: 149,
      nextDueDate: 'Renews in 19 days',
      status: 'active',
      source: 'SMS Webhook · +91 89716 36441',
    },
    {
      id: 's4',
      serviceName: 'Amazon Prime Video',
      category: 'OTT & Delivery',
      amount: 299,
      nextDueDate: 'Renews in 25 days',
      status: 'active',
      source: 'Gmail API · kshitij.verma302312@gmail.com',
    },
  ]);

  // Nexus AI Vision & Chat state
  const [selectedShot, setSelectedShot] = useState<number>(0);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<
    { role: 'user' | 'ai'; text: string; mediaCard?: { title: string; rating: string; platform: string; year: string } }[]
  >([
    {
      role: 'ai',
      text: 'Hi Kshitij! Attach any movie/game screenshot for Gemini 2.5 Flash Vision identification, or tell me your mood for catalog recommendations.',
    },
    {
      role: 'user',
      text: '[Attached Screenshot: Gargantua_BlackHole_Frame.png] — What movie is this from and where can I stream it?',
    },
    {
      role: 'ai',
      text: 'Identified via Gemini 2.5 Vision + OMDb API (99.4% confidence):',
      mediaCard: {
        title: 'Interstellar',
        year: '2014 · Directed by Christopher Nolan',
        rating: 'IMDb 8.7/10 · Sci-Fi / Adventure',
        platform: 'Streaming on your active Netflix & Amazon Prime subscriptions',
      },
    },
  ]);

  const totalBurn = subs.reduce((acc, s) => acc + s.amount, 0);

  const triggerGmailSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      if (!subs.some((s) => s.id === 's5')) {
        setSubs((prev) => [
          ...prev,
          {
            id: 's5',
            serviceName: 'PlayStation Plus Deluxe',
            category: 'Gaming Catalog',
            amount: 749,
            nextDueDate: 'Scanned just now · Renews in 28d',
            status: 'active',
            source: `Gmail API · ${linkedEmails[linkedEmails.length - 1]}`,
          },
        ]);
      }
    }, 600);
  };

  const presetScreenshots = [
    {
      label: '📸 Frame: Gargantua Wormhole',
      title: 'Interstellar',
      year: '2014 · Christopher Nolan',
      rating: 'IMDb 8.7/10 · OMDb Verified',
      platform: 'Included in your active Netflix & Prime Video',
    },
    {
      label: '📸 Frame: Night City Neon Dogtown',
      title: 'Cyberpunk 2077: Phantom Liberty',
      year: '2023 · CD Projekt Red',
      rating: 'RAWG 4.6/5 · Metacritic 89',
      platform: 'Available on PC / GeForce NOW',
    },
    {
      label: '📸 Frame: Arrakis Sandworm Rider',
      title: 'Dune: Part Two',
      year: '2024 · Denis Villeneuve',
      rating: 'IMDb 8.5/10 · OMDb Verified',
      platform: 'Available on JioCinema / Apple TV+',
    },
  ];

  return (
    <div className="app-replica">
      <div className="replica-topbar">
        <div className="replica-brand">
          <span className="replica-logo-icon">◈</span>
          <div>
            <strong className="replica-app-name">NexusSubs</strong>
            <span className="replica-app-tag">Gmail Multi-OAuth + Gemini 2.5 Vision</span>
          </div>
        </div>

        <div className="replica-nav-tabs">
          <button
            type="button"
            className={`replica-tab ${tab === 'dashboard' ? 'is-active' : ''}`}
            onClick={() => setTab('dashboard')}
          >
            <Mail size={13} /> Subscription Hub
          </button>
          <button
            type="button"
            className={`replica-tab ${tab === 'chatbot' ? 'is-active' : ''}`}
            onClick={() => setTab('chatbot')}
          >
            <Eye size={13} /> Nexus AI (Vision + Chat)
          </button>
          <button
            type="button"
            className={`replica-tab ${tab === 'live' ? 'is-active' : ''}`}
            onClick={() => setTab('live')}
          >
            <ExternalLink size={13} /> Live Vercel View
          </button>
        </div>

        <button type="button" className="replica-icon-pill" onClick={triggerGmailSync}>
          <RefreshCw size={13} className={syncing ? 'spin-anim' : ''} />
          <span>{syncing ? 'Scanning Gmail...' : 'Scan Gmail API'}</span>
        </button>
      </div>

      {tab === 'dashboard' && (
        <div className="nexus-body">
          <div className="nexus-oauth-bar">
            <div className="oauth-pills">
              <span className="oauth-label">Linked OAuth Inboxes:</span>
              {linkedEmails.map((em) => (
                <span key={em} className="oauth-chip">
                  ● {em}
                </span>
              ))}
            </div>
            <form
              className="oauth-add-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (newEmailInput.includes('@')) {
                  setLinkedEmails((prev) => [...prev, newEmailInput.trim()]);
                  setNewEmailInput('');
                  triggerGmailSync();
                }
              }}
            >
              <input
                type="email"
                placeholder="Link another Gmail..."
                value={newEmailInput}
                onChange={(e) => setNewEmailInput(e.target.value)}
                className="replica-input-sm"
              />
              <button type="submit" className="lab-action-btn">
                + Link OAuth
              </button>
            </form>
          </div>

          <div className="lab-metrics-strip">
            <div className="lab-stat">
              <span className="lab-stat-k">Total Monthly Spend</span>
              <span className="lab-stat-v accent">₹{totalBurn.toLocaleString('en-IN')}/mo</span>
            </div>
            <div className="lab-stat">
              <span className="lab-stat-k">Active Subscriptions</span>
              <span className="lab-stat-v">{subs.length} Services Tracked</span>
            </div>
            <div className="lab-stat">
              <span className="lab-stat-k">Renewal Alert</span>
              <span className="lab-stat-v" style={{ color: '#fbbf24' }}>
                1 Expiring Within 72h
              </span>
            </div>
          </div>

          <div className="lab-list">
            {subs.map((s) => (
              <div key={s.id} className="lab-row-item">
                <div>
                  <div className="lab-item-title">
                    {s.serviceName}
                    <span className={`lab-micro-badge ${s.status === 'expiring' ? '' : 'emerald'}`}>
                      {s.nextDueDate}
                    </span>
                  </div>
                  <div className="lab-item-sub">{s.source}</div>
                </div>
                <div className="lab-row-right">
                  <span className="lab-price">₹{s.amount}/mo</span>
                  <button
                    type="button"
                    className="lab-action-btn"
                    onClick={() => setSubs((prev) => prev.filter((item) => item.id !== s.id))}
                    title="Simulate Cancel Subscription"
                  >
                    <Trash2 size={12} /> Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'chatbot' && (
        <div className="nexus-chat-body">
          <div className="lab-chip-row">
            <span className="oauth-label">Test Screenshot Identification:</span>
            {presetScreenshots.map((shot, idx) => (
              <button
                key={shot.label}
                type="button"
                className={`lab-chip ${selectedShot === idx ? 'is-active' : ''}`}
                onClick={() => {
                  setSelectedShot(idx);
                  setChatHistory((prev) => [
                    ...prev,
                    {
                      role: 'user',
                      text: `[Uploaded Screenshot: ${shot.label.replace('📸 Frame: ', '')}.png] — Identify this media`,
                    },
                    {
                      role: 'ai',
                      text: 'Identified via Gemini 2.5 Flash Vision + Catalog API:',
                      mediaCard: {
                        title: shot.title,
                        year: shot.year,
                        rating: shot.rating,
                        platform: shot.platform,
                      },
                    },
                  ]);
                }}
              >
                {shot.label}
              </button>
            ))}
          </div>

          <div className="chat-stream-box">
            {chatHistory.slice(-4).map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.role}`}>
                <p>{msg.text}</p>
                {msg.mediaCard && (
                  <div className="chat-media-popup">
                    <div className="chat-media-head">
                      <strong>{msg.mediaCard.title}</strong>
                      <span className="lab-micro-badge emerald">{msg.mediaCard.rating}</span>
                    </div>
                    <div className="lab-item-sub">{msg.mediaCard.year}</div>
                    <div className="chat-media-stream">▶ {msg.mediaCard.platform}</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <form
            className="poke-custom-tx-bar"
            onSubmit={(e) => {
              e.preventDefault();
              if (!chatInput.trim()) return;
              const q = chatInput.trim();
              setChatInput('');
              setChatHistory((prev) => [
                ...prev,
                { role: 'user', text: q },
                {
                  role: 'ai',
                  text: `Based on "${q}" and your active Netflix + Game Pass subscriptions, I recommend watching Severance / Dark or playing Alan Wake 2.`,
                },
              ]);
            }}
          >
            <input
              type="text"
              placeholder="Ask Nexus AI for mood recommendations or cancellation steps..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="replica-input-sm"
              style={{ flex: 1 }}
            />
            <button type="submit" className="lab-seg-btn is-active">
              <Send size={13} /> Ask Gemini
            </button>
          </form>
        </div>
      )}

      {tab === 'live' && (
        <div className="replica-iframe-container">
          <iframe
            src="https://nexussubs.vercel.app/"
            title="NexusSubs Live Deployment"
            className="replica-live-iframe"
          />
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   3. PLACEMENT READY / FDSA REPLICA (Code Editor + 15 Tests + Tree Visualizer)
   ============================================================================ */
const FdsaReplica: React.FC = () => {
  const [mode, setMode] = useState<'editor' | 'visualizer' | 'live'>('editor');
  const [company, setCompany] = useState<'Google' | 'Amazon' | 'Microsoft'>('Google');
  const [lang, setLang] = useState<'javascript' | 'python' | 'cpp'>('javascript');
  const [treeInput, setTreeInput] = useState<string>('[1, 2, 3, 4, 5, null, 7]');
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'passed'>('passed');

  const starterTemplates: Record<'javascript' | 'python' | 'cpp', string> = {
    javascript: `function maxPathSum(root) {\n  let maxGain = -Infinity;\n  function dfs(node) {\n    if (!node) return 0;\n    const left = Math.max(0, dfs(node.left));\n    const right = Math.max(0, dfs(node.right));\n    maxGain = Math.max(maxGain, node.val + left + right);\n    return node.val + Math.max(left, right);\n  }\n  dfs(root);\n  return maxGain;\n}`,
    python: `class Solution:\n    def maxPathSum(self, root: Optional[TreeNode]) -> int:\n        self.max_sum = float('-inf')\n        def dfs(node):\n            if not node: return 0\n            l = max(0, dfs(node.left))\n            r = max(0, dfs(node.right))\n            self.max_sum = max(self.max_sum, node.val + l + r)\n            return node.val + max(l, r)\n        dfs(root)\n        return self.max_sum`,
    cpp: `class Solution {\npublic:\n    int maxGain = INT_MIN;\n    int dfs(TreeNode* node) {\n        if (!node) return 0;\n        int l = max(0, dfs(node->left));\n        int r = max(0, dfs(node->right));\n        maxGain = max(maxGain, node->val + l + r);\n        return node->val + max(l, r);\n    }\n};`,
  };

  const [code, setCode] = useState<string>(starterTemplates.javascript);

  const runSandboxTests = () => {
    setTestStatus('running');
    setTimeout(() => setTestStatus('passed'), 450);
  };

  // Parse tree array for interactive SVG Tree Visualizer
  let parsedTree: (number | null)[] = [1, 2, 3, 4, 5, null, 7];
  try {
    const arr = JSON.parse(treeInput);
    if (Array.isArray(arr)) parsedTree = arr.slice(0, 7);
  } catch {
    // keep fallback
  }

  const nodeCoords = [
    { idx: 0, x: 240, y: 38, parent: null },
    { idx: 1, x: 130, y: 105, parent: 0 },
    { idx: 2, x: 350, y: 105, parent: 0 },
    { idx: 3, x: 75, y: 175, parent: 1 },
    { idx: 4, x: 185, y: 175, parent: 1 },
    { idx: 5, x: 295, y: 175, parent: 2 },
    { idx: 6, x: 405, y: 175, parent: 2 },
  ];

  return (
    <div className="app-replica">
      <div className="replica-topbar">
        <div className="replica-brand">
          <span className="replica-logo-icon">🚀</span>
          <div>
            <strong className="replica-app-name">Placement Ready (FDSA)</strong>
            <span className="replica-app-tag">{company} OT Simulator · 1,800 Problems</span>
          </div>
        </div>

        <div className="replica-nav-tabs">
          <button
            type="button"
            className={`replica-tab ${mode === 'editor' ? 'is-active' : ''}`}
            onClick={() => setMode('editor')}
          >
            <Terminal size={13} /> Code Sandbox (15 Tests)
          </button>
          <button
            type="button"
            className={`replica-tab ${mode === 'visualizer' ? 'is-active' : ''}`}
            onClick={() => setMode('visualizer')}
          >
            <Cpu size={13} /> Binary Tree Visualizer
          </button>
          <button
            type="button"
            className={`replica-tab ${mode === 'live' ? 'is-active' : ''}`}
            onClick={() => setMode('live')}
          >
            <ExternalLink size={13} /> Live App (fdsa-two.vercel.app)
          </button>
        </div>

        <div className="replica-controls">
          {(['Google', 'Amazon', 'Microsoft'] as const).map((c) => (
            <button
              key={c}
              type="button"
              className={`cam-btn ${company === c ? 'is-active' : ''}`}
              onClick={() => setCompany(c)}
            >
              {c} OT
            </button>
          ))}
        </div>
      </div>

      {mode === 'editor' && (
        <div className="fdsa-split-grid">
          <div className="fdsa-editor-pane">
            <div className="fdsa-editor-bar">
              <div className="lab-seg">
                {(['javascript', 'python', 'cpp'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    className={`cam-btn ${lang === l ? 'is-active' : ''}`}
                    onClick={() => {
                      setLang(l);
                      setCode(starterTemplates[l]);
                    }}
                  >
                    {l === 'cpp' ? 'C++ 20' : l === 'python' ? 'Python 3' : 'JavaScript (Browser VM)'}
                  </button>
                ))}
              </div>
              <button type="button" className="lab-seg-btn is-active" onClick={runSandboxTests}>
                <Play size={12} /> Run 15 Unit Tests
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="fdsa-code-textarea"
              rows={8}
              spellCheck={false}
            />
          </div>

          <div className="fdsa-output-pane">
            <div className="fdsa-output-head">
              <span>SANDBOX EXECUTION CONSOLE</span>
              <span className="lab-micro-badge emerald">
                {testStatus === 'running' ? 'EXECUTING...' : '15 / 15 TEST CASES PASSED (14ms)'}
              </span>
            </div>
            <div className="fdsa-cases-grid">
              {Array.from({ length: 15 }, (_, idx) => (
                <div key={idx} className="fdsa-case-pill">
                  <CheckCircle2 size={12} className="emerald-icon" />
                  <span>Case #{idx + 1}</span>
                </div>
              ))}
            </div>
            <div className="fdsa-scorecard-foot">
              <span>
                OT Verdict: <strong style={{ color: '#10b981' }}>OFFER FIT (100% Accuracy)</strong>
              </span>
              <span>Anti-Cheat Lock: Active</span>
            </div>
          </div>
        </div>
      )}

      {mode === 'visualizer' && (
        <div className="fdsa-vis-body">
          <div className="poke-custom-tx-bar" style={{ marginBottom: '0.85rem' }}>
            <span>Level-Order Array Input:</span>
            <input
              type="text"
              value={treeInput}
              onChange={(e) => setTreeInput(e.target.value)}
              className="replica-input-sm"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              className="lab-action-btn"
              onClick={() => setTreeInput('[10, 5, 15, 3, 7, 12, 20]')}
            >
              Load BST Sample
            </button>
          </div>

          <svg viewBox="0 0 480 220" className="fdsa-tree-svg">
            {nodeCoords.map((n) => {
              if (n.parent === null || parsedTree[n.idx] === null || parsedTree[n.idx] === undefined)
                return null;
              const p = nodeCoords[n.parent];
              return (
                <line
                  key={`edge-${n.idx}`}
                  x1={p.x}
                  y1={p.y}
                  x2={n.x}
                  y2={n.y}
                  stroke="rgba(255, 82, 39, 0.55)"
                  strokeWidth="2"
                />
              );
            })}
            {nodeCoords.map((n) => {
              const val = parsedTree[n.idx];
              if (val === null || val === undefined) return null;
              return (
                <g key={`node-${n.idx}`}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r="20"
                    fill="#141722"
                    stroke="#FF5227"
                    strokeWidth="2.2"
                  />
                  <text
                    x={n.x}
                    y={n.y + 4}
                    textAnchor="middle"
                    fill="#F4F1EA"
                    fontSize="12"
                    fontFamily="JetBrains Mono"
                    fontWeight="700"
                  >
                    {val}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {mode === 'live' && (
        <div className="replica-iframe-container">
          <iframe
            src="https://fdsa-two.vercel.app/"
            title="Placement Ready FDSA Live App"
            className="replica-live-iframe"
          />
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   4. AURA MOTORS REPLICA (Showroom Stock + Side-by-Side Compare + Commission)
   ============================================================================ */
const AuraMotorsReplica: React.FC = () => {
  const [view, setView] = useState<'showroom' | 'compare' | 'commission'>('showroom');
  const [vehicles, setVehicles] = useState([
    {
      id: 'v1',
      name: 'Porsche 911 GT3 RS (992)',
      category: 'Track Coupe',
      hp: '518 BHP',
      accel: '3.0s (0–100)',
      topSpeed: '296 km/h',
      price: 34500000,
      stock: 2,
    },
    {
      id: 'v2',
      name: 'Tesla Model S Plaid',
      category: 'Tri-Motor EV',
      hp: '1,020 BHP',
      accel: '1.99s (0–100)',
      topSpeed: '322 km/h',
      price: 18500000,
      stock: 1,
    },
    {
      id: 'v3',
      name: 'BMW M8 Competition Gran Coupé',
      category: 'Executive GT',
      hp: '617 BHP',
      accel: '3.2s (0–100)',
      topSpeed: '305 km/h',
      price: 24400000,
      stock: 0,
    },
  ]);

  const [paint, setPaint] = useState<{ name: string; add: number }>({
    name: 'Obsidian Metallic',
    add: 0,
  });
  const [wheels, setWheels] = useState<{ name: string; add: number }>({
    name: '21" Forged Magnesium',
    add: 1450000,
  });

  const handlePurchase = (id: string) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id && v.stock > 0 ? { ...v, stock: v.stock - 1 } : v))
    );
  };

  const handleRestock = (id: string) => {
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, stock: v.stock + 1 } : v)));
  };

  return (
    <div className="app-replica">
      <div className="replica-topbar">
        <div className="replica-brand">
          <span className="replica-logo-icon">🏎️</span>
          <div>
            <strong className="replica-app-name">AURA MOTORS</strong>
            <span className="replica-app-tag">TDD Inventory System · 32/32 Suites Passed (81.8%)</span>
          </div>
        </div>

        <div className="replica-nav-tabs">
          <button
            type="button"
            className={`replica-tab ${view === 'showroom' ? 'is-active' : ''}`}
            onClick={() => setView('showroom')}
          >
            <Car size={13} /> Showroom Inventory
          </button>
          <button
            type="button"
            className={`replica-tab ${view === 'compare' ? 'is-active' : ''}`}
            onClick={() => setView('compare')}
          >
            <GitCompare size={13} /> Telemetry Compare
          </button>
          <button
            type="button"
            className={`replica-tab ${view === 'commission' ? 'is-active' : ''}`}
            onClick={() => setView('commission')}
          >
            <Sliders size={13} /> Bespoke Commission
          </button>
        </div>
      </div>

      {view === 'showroom' && (
        <div className="lab-body">
          <div className="aura-grid">
            {vehicles.map((v) => (
              <div key={v.id} className="aura-car-card">
                <div className="aura-car-top">
                  <span className="lab-micro-badge">{v.category}</span>
                  <span className={`lab-micro-badge ${v.stock > 0 ? 'emerald' : ''}`}>
                    {v.stock > 0 ? `IN STOCK: ${v.stock} UNITS` : 'SOLD OUT (QTY: 0)'}
                  </span>
                </div>
                <h5 className="aura-car-title">{v.name}</h5>
                <div className="aura-specs-row">
                  <span>{v.hp}</span>
                  <span>·</span>
                  <span>{v.accel}</span>
                  <span>·</span>
                  <span>{v.topSpeed}</span>
                </div>
                <div className="aura-price">₹{(v.price / 10000000).toFixed(2)} Cr</div>

                <div className="aura-actions">
                  <button
                    type="button"
                    disabled={v.stock === 0}
                    className={`aura-buy-btn ${v.stock === 0 ? 'is-disabled' : ''}`}
                    onClick={() => handlePurchase(v.id)}
                  >
                    {v.stock === 0 ? 'Purchase Disabled (TDD Guard)' : 'Purchase Vehicle (-1)'}
                  </button>
                  <button
                    type="button"
                    className="lab-action-btn"
                    onClick={() => handleRestock(v.id)}
                    title="Admin POST /:id/restock"
                  >
                    + Admin Restock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'compare' && (
        <div className="lab-body">
          <div className="aura-compare-table">
            <div className="aura-comp-row head">
              <span>Telemetry Metric</span>
              <span>Porsche 911 GT3 RS</span>
              <span>Tesla Model S Plaid</span>
            </div>
            <div className="aura-comp-row">
              <span>Peak Output</span>
              <span>518 BHP (Naturally Aspirated)</span>
              <strong style={{ color: '#10b981' }}>1,020 BHP (Tri-Motor Winner)</strong>
            </div>
            <div className="aura-comp-row">
              <span>0–100 km/h Sprint</span>
              <span>3.0 seconds</span>
              <strong style={{ color: '#10b981' }}>1.99 seconds (Winner)</strong>
            </div>
            <div className="aura-comp-row">
              <span>Cornering Downforce</span>
              <strong style={{ color: '#10b981' }}>860 kg @ 285 km/h (DRS Winner)</strong>
              <span>Active Aero Sedan</span>
            </div>
          </div>
        </div>
      )}

      {view === 'commission' && (
        <div className="lab-body">
          <div className="lab-metrics-strip">
            <div className="lab-stat">
              <span className="lab-stat-k">Base Chassis</span>
              <span className="lab-stat-v">Porsche 911 GT3 RS (₹3.45 Cr)</span>
            </div>
            <div className="lab-stat">
              <span className="lab-stat-k">Selected Finish &amp; Forged Pack</span>
              <span className="lab-stat-v">{paint.name} + {wheels.name}</span>
            </div>
            <div className="lab-stat">
              <span className="lab-stat-k">Commission Total</span>
              <span className="lab-stat-v accent">
                ₹{((34500000 + paint.add + wheels.add) / 10000000).toFixed(2)} Cr
              </span>
            </div>
          </div>
          <div className="lab-chip-row">
            {[
              { name: 'Obsidian Metallic (+₹0)', add: 0 },
              { name: 'PTS Rubystar Neo (+₹9.5L)', add: 950000 },
              { name: 'Weissach Carbon Exposed (+₹28L)', add: 2800000 },
            ].map((p) => (
              <button
                key={p.name}
                type="button"
                className={`lab-chip ${paint.name === p.name ? 'is-active' : ''}`}
                onClick={() => setPaint(p)}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   5. BINKEYIT REPLICA (Quick-Commerce Cart + Gemini AI + Socket.io Map)
   ============================================================================ */
const BinkeyitReplica: React.FC = () => {
  const [tab, setTab] = useState<'store' | 'live'>('store');
  const [cart, setCart] = useState<{ name: string; price: number; qty: number }[]>([
    { name: 'Epigamia Greek Yogurt', price: 120, qty: 1 },
    { name: 'Davidoff Cold Brew Coffee', price: 240, qty: 1 },
  ]);
  const [wpIndex, setWpIndex] = useState<number>(2);

  const waypoints = [
    { name: 'Manipal Dark Store', coord: '13.3525° N, 74.7928° E', eta: '9 mins' },
    { name: 'Syndicate Circle', coord: '13.3510° N, 74.7911° E', eta: '6 mins' },
    { name: 'MIT Gate 2', coord: '13.3491° N, 74.7892° E', eta: '3 mins' },
    { name: 'Hostel Block 14', coord: '13.3476° N, 74.7875° E', eta: 'Arrived!' },
  ];

  const aiBundles = [
    {
      label: '✨ Gemini: High-Protein Smoothie Kit',
      items: [
        { name: 'Epigamia Greek Yogurt', price: 120, qty: 1 },
        { name: 'Quaker Rolled Oats 500g', price: 95, qty: 1 },
        { name: 'Whole Truth Peanut Butter', price: 185, qty: 1 },
      ],
    },
    {
      label: '✨ Gemini: All-Nighter Hackathon Pack',
      items: [
        { name: 'Monster Ultra White ×2', price: 250, qty: 1 },
        { name: 'Lindt 70% Dark Chocolate', price: 190, qty: 1 },
        { name: 'Blue Tokai Cold Brew Can', price: 150, qty: 1 },
      ],
    },
  ];

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="app-replica">
      <div className="replica-topbar">
        <div className="replica-brand">
          <span className="replica-logo-icon">⚡</span>
          <div>
            <strong className="replica-app-name">Binkeyit</strong>
            <span className="replica-app-tag">10-Minute Delivery · Gemini Cart AI + Socket.io Map</span>
          </div>
        </div>

        <div className="replica-nav-tabs">
          <button
            type="button"
            className={`replica-tab ${tab === 'store' ? 'is-active' : ''}`}
            onClick={() => setTab('store')}
          >
            <ShoppingCart size={13} /> AI Cart &amp; Live Rider Map
          </button>
          <button
            type="button"
            className={`replica-tab ${tab === 'live' ? 'is-active' : ''}`}
            onClick={() => setTab('live')}
          >
            <ExternalLink size={13} /> Live App (binkeyit-online.vercel.app)
          </button>
        </div>
      </div>

      {tab === 'store' ? (
        <div className="lab-body">
          <div className="lab-chip-row">
            {aiBundles.map((b) => (
              <button
                key={b.label}
                type="button"
                className="lab-chip is-active"
                onClick={() => setCart(b.items)}
              >
                {b.label}
              </button>
            ))}
          </div>

          <div className="fdsa-split-grid">
            <div className="lab-list">
              {cart.map((c, idx) => (
                <div key={idx} className="lab-row-item">
                  <span className="lab-item-title">{c.name}</span>
                  <span className="lab-price">₹{c.price}</span>
                </div>
              ))}
              <div className="lab-row-item" style={{ borderColor: '#FF5227' }}>
                <strong>Cart Total (Instant Dispatch)</strong>
                <strong className="lab-stat-v accent">₹{cartTotal}</strong>
              </div>
            </div>

            <div className="lab-vision-card">
              <div className="lab-item-title">
                <MapPin size={14} /> Live Socket.io + Leaflet Courier Telemetry
              </div>
              <p className="lab-item-sub" style={{ margin: '0.35rem 0 0.75rem' }}>
                Click any waypoint to simulate Socket.io GPS emission:
              </p>
              <div className="lab-badges-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                {waypoints.map((wp, i) => (
                  <button
                    key={wp.name}
                    type="button"
                    className={`lab-badge-cell ${i <= wpIndex ? 'is-unlocked' : ''}`}
                    onClick={() => setWpIndex(i)}
                  >
                    <span>
                      0{i + 1}. {wp.name} ({wp.eta})
                    </span>
                  </button>
                ))}
              </div>
              <div className="lab-vision-foot">
                <span className="lab-stream-status">
                  GPS: <code>{waypoints[wpIndex].coord}</code>
                </span>
                <span className="lab-micro-badge emerald">ETA: {waypoints[wpIndex].eta}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="replica-iframe-container">
          <iframe
            src="https://binkeyit-online.vercel.app/"
            title="Binkeyit Live App"
            className="replica-live-iframe"
          />
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   6. AUTOREGRESSIVE NLP REPLICA (Exact RTX 4060 Benchmarks & Token Streamer)
   ============================================================================ */
const AutoregressiveReplica: React.FC = () => {
  const [arch, setArch] = useState<'LSTM' | 'GRU' | 'Simple RNN' | 'Bidirectional RNN'>('LSTM');
  const [temp, setTemp] = useState<'0.2' | '0.7' | '1.2'>('0.7');
  const [streamStep, setStreamStep] = useState<number>(28);

  const benchmarks = {
    LSTM: {
      params: '2,091,574',
      valLoss: '4.8432 (Best)',
      ppl: '126.88',
      top1: '18.79%',
      top5: '41.44%',
      latency: '0.630 ms/tok',
      samples: {
        '0.2':
          'sherlock holmes took the letter from the table and said that he had been in the house , and that he was a very small of the house , and that he had been in the room ...',
        '0.7':
          'sherlock holmes took the letter from the table and looked over the other , and his head was a few words which had been drawn down the stairs . the morning of the window was a little light upon the stairs ...',
        '1.2':
          'sherlock holmes took the letter from the table and seemed rapidly by a light was indeed very little , however . you are too good a fellow , for the 85 of your letter ...',
      },
      distinct1: { '0.2': '0.531', '0.7': '0.756', '1.2': '0.875' },
      repRate: { '0.2': '21.1%', '0.7': '1.3% (Optimal)', '1.2': '0.0%' },
    },
    GRU: {
      params: '1,992,758 (-98K vs LSTM)',
      valLoss: '4.8807',
      ppl: '131.73',
      top1: '18.12%',
      top5: '40.12%',
      latency: '0.554 ms/tok',
      samples: {
        '0.2':
          'sherlock holmes took the letter from the table and looked at the door , and i could see that he had been in the matter of the door ...',
        '0.7':
          'sherlock holmes took the letter from the table and handed it to watson with a sharp nod . the paper was heavy and bore the postmark of charing cross ...',
        '1.2':
          'sherlock holmes took the letter from the table and vanished behind the velvet curtain while three cabs rattled fiercely past baker street ...',
      },
      distinct1: { '0.2': '0.519', '0.7': '0.725', '1.2': '0.862' },
      repRate: { '0.2': '21.1%', '0.7': '2.6%', '1.2': '0.0%' },
    },
    'Simple RNN': {
      params: '1,795,126',
      valLoss: '5.0717',
      ppl: '159.45',
      top1: '18.13%',
      top5: '39.08%',
      latency: '0.167 ms/tok (Fastest)',
      samples: {
        '0.2':
          'sherlock holmes took the letter from the table and the man who had been in the room and the room was a little man ...',
        '0.7':
          'sherlock holmes took the letter from the table and went to the door of the street where the cab was waiting in the dark ...',
        '1.2':
          'sherlock holmes took the letter from the table and cried out that the colonel had left his hat beside the gasogene ...',
      },
      distinct1: { '0.2': '0.542', '0.7': '0.768', '1.2': '0.842' },
      repRate: { '0.2': '16.5%', '0.7': '2.6%', '1.2': '0.0%' },
    },
    'Bidirectional RNN': {
      params: '3,021,878',
      valLoss: '5.2430',
      ppl: '189.23',
      top1: '16.51%',
      top5: '36.58%',
      latency: '0.224 ms/tok',
      samples: {
        '0.2':
          'sherlock holmes took the letter from the table and that he was in the house and that he was in the house ...',
        '0.7':
          'sherlock holmes took the letter from the table and observed the singular affair of the noble client with deep contemplation ...',
        '1.2':
          'sherlock holmes took the letter from the table and remarked upon the curious footsteps along the damp gravel path ...',
      },
      distinct1: { '0.2': '0.448', '0.7': '0.695', '1.2': '0.865' },
      repRate: { '0.2': '26.3%', '0.7': '2.6%', '1.2': '0.0%' },
    },
  };

  const current = benchmarks[arch];
  const words = current.samples[temp].split(' ');
  const visibleText = words.slice(0, streamStep).join(' ');

  const replayStream = () => {
    setStreamStep(8);
    let step = 8;
    const timer = setInterval(() => {
      step += 2;
      setStreamStep(step);
      if (step >= words.length) clearInterval(timer);
    }, 70);
  };

  return (
    <div className="app-replica">
      <div className="replica-topbar">
        <div className="replica-brand">
          <span className="replica-logo-icon">🧠</span>
          <div>
            <strong className="replica-app-name">PyTorch CUDA Autoregressive Engine</strong>
            <span className="replica-app-tag">
              Sherlock Holmes Corpus (121,942 Tokens · 4,406 Vocab · RTX 4060)
            </span>
          </div>
        </div>

        <div className="replica-nav-tabs">
          {(['LSTM', 'GRU', 'Simple RNN', 'Bidirectional RNN'] as const).map((m) => (
            <button
              key={m}
              type="button"
              className={`replica-tab ${arch === m ? 'is-active' : ''}`}
              onClick={() => {
                setArch(m);
                replayStream();
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="lab-body">
        <div className="lab-metrics-strip">
          <div className="lab-stat">
            <span className="lab-stat-k">Val Perplexity / Loss</span>
            <span className="lab-stat-v accent">
              {current.ppl} PPL ({current.valLoss})
            </span>
          </div>
          <div className="lab-stat">
            <span className="lab-stat-k">Top-1 / Top-5 Next-Token Acc</span>
            <span className="lab-stat-v emerald">
              {current.top1} / {current.top5}
            </span>
          </div>
          <div className="lab-stat">
            <span className="lab-stat-k">Trainable Params &amp; Latency</span>
            <span className="lab-stat-v">
              {current.params} · {current.latency}
            </span>
          </div>
        </div>

        <div className="lab-chip-row" style={{ alignItems: 'center' }}>
          <span className="oauth-label">Softmax Temperature (T):</span>
          {(['0.2', '0.7', '1.2'] as const).map((tVal) => (
            <button
              key={tVal}
              type="button"
              className={`lab-chip ${temp === tVal ? 'is-active' : ''}`}
              onClick={() => {
                setTemp(tVal);
                replayStream();
              }}
            >
              T = {tVal} ({tVal === '0.2' ? 'Low Entropy' : tVal === '0.7' ? 'Optimal Coherent' : 'High Diversity'})
            </button>
          ))}
          <button type="button" className="lab-action-btn" onClick={replayStream}>
            <RotateCcw size={12} /> Stream Tokens
          </button>
        </div>

        <div className="lab-vision-card">
          <div className="lab-item-sub" style={{ marginBottom: '0.4rem' }}>
            Autoregressive Decode (<code>L = 20</code> context window):
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', lineHeight: 1.6 }}>
            {visibleText}
            <span className="cursor-blink">▋</span>
          </p>
          <div className="lab-vision-foot">
            <span className="lab-stream-status">
              Distinct-1 (Lexical Diversity): <strong>{current.distinct1[temp]}</strong>
            </span>
            <span className="lab-micro-badge emerald">
              3-Gram Repetition Rate: {current.repRate[temp]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const InteractiveSystemLab: React.FC<InteractiveSystemLabProps> = ({ system }) => {
  switch (system.interactiveDemoType) {
    case 'pokefinance':
      return <PokeFinanceReplica />;
    case 'nexussubs':
      return <NexusSubsReplica />;
    case 'fdsa':
      return <FdsaReplica />;
    case 'auramotors':
      return <AuraMotorsReplica />;
    case 'binkeyit':
      return <BinkeyitReplica />;
    case 'autoregressive':
    default:
      return <AutoregressiveReplica />;
  }
};
