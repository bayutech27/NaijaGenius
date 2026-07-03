/* ============================================================
   NAIJAGENIUS DASHBOARD — themed to match games.html/css
   (same background gradient, same accent palette, same inset
   "platter" card treatment used across the game screen)
   ============================================================ */

/* ----- RESET & BASE ----- */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    /* Hide scrollbars everywhere */
    scrollbar-width: none; /* Firefox */
}
*::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
}

html, body {
    overflow-x: hidden;
    max-width: 100%;
    -webkit-overflow-scrolling: touch;
}

body {
    font-family: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #FFFFFF;
    min-height: 100vh;
    font-weight: 400;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background:
        radial-gradient(circle at 6% 0%, rgba(120, 160, 255, 0.16), transparent 32%),
        radial-gradient(circle at 94% 0%, rgba(255, 150, 200, 0.12), transparent 32%),
        linear-gradient(180deg, #120B2E 0%, #1A1030 22%, #2A1035 50%, #3D1420 78%, #4A1A18 100%);
    background-attachment: fixed;
}

/* ----- TYPOGRAPHY ----- */
.brand-logo {
    font-family: 'Orbitron', monospace;
    font-weight: 800;
    font-size: 1.5rem;
    letter-spacing: -0.5px;
}
.naija-white { color: #FFFFFF; }
.genius-mint { color: #FFD700; font-style: normal; }

.stat-value,
.best-score-value {
    font-family: 'Orbitron', monospace;
    font-weight: 700;
    letter-spacing: -0.02em;
}

.section-title,
.page-title,
.mode-name,
.lane-name,
.balance-label,
.stat-label,
.greeting-text,
.greeting-sub,
.section-link,
.mode-questions {
    font-family: 'Poppins', sans-serif;
}

/* Shared "platter" inset treatment */
.level-display,
.stats-row,
.mode-btn,
.stat-detail,
.shop-item,
.leaderboard-item,
.lane-card,
.ad-life-container,
.settings-item {
    box-shadow:
        inset 0 4px 12px rgba(0, 0, 0, 0.4),
        0 2px 8px rgba(0, 0, 0, 0.25);
}

/* ----- HEADER ----- */
.app-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 72px;
    background: rgba(10, 8, 24, 0.55);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    z-index: 1000;
    padding: 0 1rem;
}

.header-container {
    max-width: 1200px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 0.75rem;
}

.stat-badge-group {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: rgba(20, 24, 46, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 40px;
    padding: 0.3rem 0.5rem;
    box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.35);
}

/* ---- Removed header divider ---- */
.header-divider {
    display: none;
}

/* Stats badges – with labels */
.stat-badge {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.15rem 0.3rem;
    border-radius: 30px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #f0f3fa;
}
.stat-badge i {
    font-size: 1.1rem;
}
.stat-label-text {
    font-weight: 400;
    color: #a0b3d9;
    margin-right: -0.1rem;
    font-size: 0.75rem;
}
.stat-badge span:not(.stat-label-text):not(.stat-add-btn *) {
    font-weight: 700;
}

.stat-add-btn {
    width: 20px;
    height: 20px;
    min-height: 20px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, #3E7BFF, #1A4FA0);
    color: #FFFFFF;
    font-size: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    margin-left: 0.15rem;
}

/* Settings Gear – same styling as old bell */
.icon-btn {
    background: rgba(20, 24, 46, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #FFD700;
    font-size: 1.25rem;
    cursor: pointer;
    position: relative;
    padding: 0.55rem;
    border-radius: 50%;
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
    flex-shrink: 0;
    box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.35);
}
.icon-btn:hover { color: #3E7BFF; }

/* ----- MAIN LAYOUT ----- */
.main-content {
    padding-top: 88px;
    padding-bottom: 96px;
    max-width: 600px;
    width: 100%;
    margin: 0 auto;
    padding-left: 1rem;
    padding-right: 1rem;
    overflow-x: hidden;
}

/* ----- PAGE SECTIONS ----- */
.page-section {
    display: none;
    animation: fadeUp 0.3s ease-out;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
}
.page-section.active-section { display: block; }

@keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
.fade-in-up {
    animation: fadeUp 0.4s ease-out forwards;
    opacity: 0;
}

/* ============================================================
   HOME PAGE – increased heights by 40% (all containers & items)
   ============================================================ */

/* ----- GREETING ----- */
.greeting-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.05rem;          /* 0.75 * 1.4 */
    margin-bottom: 1.68rem; /* 1.2 * 1.4 */
}
.greeting-copy { flex: 1; min-width: 0; }
.greeting-text {
    font-size: 1.54rem;    /* 1.1 * 1.4 */
    font-weight: 500;
    color: #D7DCEC;
    line-height: 1.2;
}
.greeting-text span#greetingName {
    display: inline;
    font-size: 3.08rem;    /* 2.2 * 1.4 */
    font-weight: 800;
    color: #FFFFFF;
    letter-spacing: -0.02em;
    margin-left: 0.2rem;
}
.greeting-sub {
    font-size: 1.33rem;    /* 0.95 * 1.4 */
    font-weight: 400;
    color: #8C97B8;
    margin-top: 0.2rem;
}

.hero-logo-wrap {
    flex-shrink: 0;
    width: 182px;          /* 130 * 1.4 */
    height: 182px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.hero-logo-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
.hero-logo-fallback {
    display: none;
    width: 100%;
    height: 100%;
    position: relative;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}
.hero-flag {
    position: absolute;
    top: -4px;
    left: 4px;
    font-size: 2.52rem;    /* 1.8 * 1.4 */
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
}
.hero-bulb {
    position: absolute;
    top: -10px;
    right: 0;
    font-size: 3.36rem;    /* 2.4 * 1.4 */
    filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.7));
}
.hero-logo-text {
    font-family: 'Orbitron', monospace;
    font-weight: 900;
    font-size: 2.24rem;    /* 1.6 * 1.4 */
    line-height: 1.05;
    text-shadow: 0 2px 8px rgba(0,0,0,0.6);
    letter-spacing: -0.02em;
    position: relative;
    display: inline-block;
}
.hero-logo-text em { font-style: normal; }

/* ----- SPARKLE / FIREWORKS ANIMATION ----- */
.sparkle-text {
    position: relative;
}
.sparkle-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: visible;
}
.sparkle {
    position: absolute;
    font-size: 1.96rem;    /* 1.4 * 1.4 */
    animation: sparkleFloat 3s ease-in-out infinite;
}
.sparkle-1 { top: -10%; left: -10%; animation-delay: 0s; }
.sparkle-2 { top: -15%; right: -5%; animation-delay: 0.6s; }
.sparkle-3 { bottom: 10%; left: -8%; animation-delay: 1.2s; }
.sparkle-4 { bottom: 5%; right: -6%; animation-delay: 1.8s; }
.sparkle-5 { top: 30%; left: 50%; animation-delay: 2.4s; }

@keyframes sparkleFloat {
    0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 0; }
    20% { opacity: 1; }
    80% { opacity: 1; }
    100% { transform: translate(20px, -30px) scale(1.4) rotate(30deg); opacity: 0; }
}

/* ----- LEVEL DISPLAY (avatar + level side‑by‑by) — gap increased by 40% ----- */
.level-display {
    display: flex;
    align-items: center;
    gap: 6.72rem;          /* 4.8 * 1.4 */
    margin-bottom: 2.94rem; /* 2.1 * 1.4 */
    background: linear-gradient(160deg, rgba(48, 38, 84, 0.85), rgba(20, 16, 42, 0.92));
    backdrop-filter: blur(8px);
    border-radius: 30.8px;  /* 22 * 1.4 */
    padding: 1.68rem 1.96rem; /* 1.2*1.4, 1.4*1.4 */
    border: none;
    position: relative;
}
.level-display::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 30.8px;
    padding: 2px;
    background: linear-gradient(150deg, #FF9A3E 0%, #7C4FE0 45%, #3E63E8 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    opacity: 0.7;
}

.avatar-level-wrap {
    position: relative;
    flex-shrink: 0;
}
.user-avatar {
    width: 103.6px;        /* 74 * 1.4 */
    height: 103.6px;
    background: linear-gradient(135deg, #FFD700, #FF9A3E);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-weight: 700;
    font-size: 1.54rem;    /* 1.1 * 1.4 */
    color: #0A0A0F;
    border: 3px solid #FFFFFF;
    overflow: hidden;
    box-shadow: 0 4px 14px rgba(0,0,0,0.35), inset 0 2px 8px rgba(0,0,0,0.2);
    position: relative;
}
.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.avatar-fallback {
    display: none;
    align-items: center;
    justify-content: center;
}
.avatar-edit-btn {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 33.6px;         /* 24 * 1.4 */
    height: 33.6px;
    min-height: 33.6px;
    border-radius: 50%;
    background: #3E7BFF;
    border: 2px solid #0A0A0F;
    color: #fff;
    font-size: 0.84rem;    /* 0.6 * 1.4 */
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

/* Level info container (badge + name + progress) */
.level-info-container {
    display: flex;
    align-items: center;
    gap: 1.12rem;          /* 0.8 * 1.4 */
    flex: 1;
    min-width: 0;
}

.shield-badge {
    flex-shrink: 0;
    width: 70px;           /* 50 * 1.4 */
    height: 78.4px;        /* 56 * 1.4 */
    background: #1A1D2E;
    clip-path: polygon(50% 0%, 100% 20%, 100% 70%, 50% 100%, 0% 70%, 0% 20%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 2px solid #FFD700;
    box-shadow: inset 0 3px 8px rgba(0,0,0,0.5), 0 0 14px rgba(255,215,0,0.25);
}
.shield-badge .level-badge-img {
    width: 70%;
    height: 70%;
    object-fit: contain;
}

.level-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.84rem;          /* 0.6 * 1.4 */
    min-width: 0;
}
.level-label {
    align-self: flex-start;
    font-size: 0.98rem;    /* 0.7 * 1.4 */
    font-weight: 600;
    text-transform: uppercase;
    color: #C9B6FF;
    letter-spacing: 0.05em;
    background: rgba(124, 79, 224, 0.25);
    border: 1px solid rgba(124, 79, 224, 0.4);
    padding: 0.1rem 0.6rem;
    border-radius: 20px;
    margin-bottom: 0.05rem;
}
.level-name {
    font-size: 1.82rem;    /* 1.3 * 1.4 */
    font-weight: 800;
    color: #FFFFFF;
    line-height: 1.15;
}
.level-star { font-size: 0.9rem; }

/* XP progress – pushed down */
.xp-progress {
    display: flex;
    align-items: center;
    gap: 0.7rem;           /* 0.5 * 1.4 */
    width: 100%;
    background: rgba(0,0,0,0.3);
    border-radius: 8.4px;   /* 6 * 1.4 */
    height: 9.8px;          /* 7 * 1.4 */
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);
    margin-top: 0.2rem;
}
.xp-bar {
    height: 9.8px;          /* 7 * 1.4 */
    background: linear-gradient(90deg, #7C4FE0, #3E7BFF);
    border-radius: 8.4px;
    transition: width 0.3s ease;
    box-shadow: 0 0 8px rgba(124, 79, 224, 0.5);
}
.xp-text {
    font-size: 1.12rem;    /* 0.8 * 1.4 */
    font-weight: 600;
    color: #E4E8F5;
    white-space: nowrap;
}

/* ----- STATS ROW ----- */
.stats-row {
    display: flex;
    align-items: stretch;
    background: linear-gradient(160deg, rgba(48, 38, 84, 0.85), rgba(20, 16, 42, 0.92));
    border-radius: 25.2px;   /* 18 * 1.4 */
    padding: 1.12rem 1.96rem; /* 0.8*1.4, 1.4*1.4 */
    margin-bottom: 2.38rem;  /* 1.7 * 1.4 */
    width: 100%;
}
.stats-divider { display: none; }
.stat-card {
    background: transparent;
    border-radius: 0;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 0.98rem;          /* 0.7 * 1.4 */
    opacity: 0;
    animation: fadeUp 0.4s ease-out forwards;
    width: auto;
    flex: 1;
    min-width: 0;
}
.stat-icon {
    font-size: 1.54rem;    /* 1.1 * 1.4 */
    color: #fff;
    flex-shrink: 0;
    width: 47.6px;         /* 34 * 1.4 */
    height: 47.6px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #3E7BFF, #1A4FA0);
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
}
.stat-card:last-child .stat-icon {
    background: linear-gradient(135deg, #FFD700, #FF9A3E);
}
.stat-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
}
.stat-label {
    font-size: 1.05rem;    /* 0.75 * 1.4 */
    font-weight: 600;
    color: #C9D3EE;
    order: -1;
}
.stat-value {
    font-size: 1.82rem;    /* 1.3 * 1.4 */
    font-weight: 700;
    color: #FFFFFF;
    word-break: break-word;
    overflow-wrap: break-word;
}
.stat-caption {
    font-size: 0.91rem;    /* 0.65 * 1.4 */
    font-weight: 400;
    color: #9AA5C7;
}

/* ----- ACTIVE CHALLENGE (now empty for AdMob) ----- */
.challenge-section {
    margin: 0 0 2.38rem 0; /* 1.7 * 1.4 */
    min-height: 84px;      /* 60 * 1.4 */
}
.challenge-section > .section-title { display: none; }
.challenge-card-large { display: none; }

/* ----- CHOOSE A MODE ----- */
.mode-section {
    margin-top: 0.7rem;    /* 0.5 * 1.4 */
}
.mode-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.7rem;           /* 0.5 * 1.4 */
    margin-bottom: 1.54rem; /* 1.1 * 1.4 */
    font-size: 1.05rem;    /* 0.75 * 1.4 */
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #C9B6FF;
}
.mode-title i.fa-crown {
    color: #FFD700;
    font-size: 1.19rem;    /* 0.85 * 1.4 */
}
.title-line {
    flex: 1;
    max-width: 84px;       /* 60 * 1.4 */
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201, 182, 255, 0.5), transparent);
}
.mode-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: stretch;
    gap: 0.98rem;          /* 0.7 * 1.4 */
    width: 100%;
    perspective: 900px;
}
.mode-btn {
    border: none;
    border-radius: 28px;    /* 20 * 1.4 */
    padding: 1.568rem 0.588rem; /* 1.12*1.4, 0.42*1.4 */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 0.28rem;           /* 0.2 * 1.4 */
    width: 100%;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.2s ease;
    text-decoration: none;
    color: #FFFFFF;
    min-height: 313.6px;    /* 224 * 1.4 */
    position: relative;
    overflow: hidden;
}
.mode-btn-red {
    background: linear-gradient(160deg, #FF5757 0%, #C21E1E 100%);
    transform-origin: right center;
    transform: perspective(900px) rotateY(20deg);
}
.mode-btn-red:hover {
    transform: perspective(900px) rotateY(20deg) translateY(-6px);
}
.mode-btn-blue {
    background: linear-gradient(160deg, #3E8BFF 0%, #1440C2 100%);
}
.mode-btn-blue:hover {
    transform: translateY(-6px);
}
.mode-btn-green {
    background: linear-gradient(160deg, #3FE07E 0%, #0F9C4E 100%);
    transform-origin: left center;
    transform: perspective(900px) rotateY(-20deg);
}
.mode-btn-green:hover {
    transform: perspective(900px) rotateY(-20deg) translateY(-6px);
}
.mode-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex: 1;
    background: transparent;
    border-radius: 0;
}
.mode-icon {
    font-size: 4.9rem;      /* 3.5 * 1.4 */
    color: rgba(255,255,255,0.92);
    filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));
}
.animate-icon {
    animation: iconFloat 2.4s ease-in-out infinite;
}
@keyframes iconFloat {
    0%   { transform: translateY(0); }
    50%  { transform: translateY(-6px); }
    100% { transform: translateY(0); }
}
.mode-btn:nth-child(2) .animate-icon { animation-delay: 0.3s; }
.mode-btn:nth-child(3) .animate-icon { animation-delay: 0.6s; }

.mode-details {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 0;
}
.mode-name {
    font-weight: 800;
    font-size: 1.54rem;    /* 1.1 * 1.4 */
    color: #FFFFFF;
    letter-spacing: -0.01em;
    line-height: 1.15;
    text-align: center;
    text-shadow: 0 2px 6px rgba(0,0,0,0.3);
}
.mode-questions {
    width: 100%;
    text-align: center;
    font-size: 1.05rem;    /* 0.75 * 1.4 */
    color: #FFFFFF;
    font-weight: 700;
    background: transparent;
    padding: 0.2rem 0.3rem 0;
}
.mode-arrow { display: none; }

.mode-btn:disabled {
    cursor: not-allowed;
    filter: grayscale(0.5);
    opacity: 0.6;
    pointer-events: none;
}

/* Adjusted perspective for smaller screens */
@media (max-width: 420px) {
    .mode-btn-red { transform: perspective(700px) rotateY(12deg); }
    .mode-btn-red:hover { transform: perspective(700px) rotateY(12deg) translateY(-4px); }
    .mode-btn-green { transform: perspective(700px) rotateY(-12deg); }
    .mode-btn-green:hover { transform: perspective(700px) rotateY(-12deg) translateY(-4px); }
}

/* ----- SECTION HEADER (shared: Shop / Leaderboard) ----- */
.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
}
.section-header .section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.2rem;
    font-weight: 800;
    color: #FFFFFF;
}
.section-header .section-title i {
    font-size: 1rem;
}

/* ----- SHOP SECTION ----- */
.shop-coins-display {
    font-size: 0.8rem;
    font-weight: 600;
    color: #C9D3EE;
    background: rgba(20, 24, 46, 0.75);
    border: 1px solid rgba(255, 215, 0, 0.25);
    padding: 0.3rem 0.8rem;
    border-radius: 30px;
}
.shop-coins-display strong {
    color: #FFD700;
    font-family: 'Orbitron', monospace;
}
.shop-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 0.7rem;
    margin-top: 1rem;
}
.shop-item {
    background: linear-gradient(160deg, rgba(48, 38, 84, 0.85), rgba(20, 16, 42, 0.92));
    border: 1px solid rgba(255, 215, 0, 0.15);
    border-radius: 16px;
    padding: 0.7rem 0.4rem;
    text-align: center;
    transition: transform 0.2s, border-color 0.2s;
}
.shop-item:hover {
    transform: translateY(-3px);
    border-color: #FFD700;
}
.shop-item-icon {
    font-size: 1.6rem;
    color: #0A0A0F;
    margin-bottom: 0.3rem;
    width: 48px;
    height: 48px;
    line-height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FFD700, #FF9A3E);
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
.shop-item-info h4 {
    font-size: 0.8rem;
    color: #FFFFFF;
    margin: 0.2rem 0;
    font-weight: 700;
}
.shop-item-info p {
    font-size: 0.7rem;
    color: #9AA5C7;
    margin: 0.1rem 0;
}
.shop-buy-btn {
    background: linear-gradient(135deg, #3E7BFF, #1A4FA0);
    border: none;
    border-radius: 40px;
    padding: 0.4rem 0.5rem;
    font-weight: 700;
    font-size: 0.75rem;
    color: #FFFFFF;
    cursor: pointer;
    margin-top: 0.3rem;
    transition: opacity 0.2s, transform 0.2s;
    width: 100%;
}
.shop-buy-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}
.shop-buy-btn:not(:disabled):hover {
    transform: scale(1.03);
}
.ad-life-container {
    margin-top: 1.8rem;
    text-align: center;
    padding: 1rem 0.8rem;
    background: linear-gradient(150deg, #FF5757 0%, #C21E1E 100%);
    border-radius: 20px;
    border: none;
    position: relative;
    overflow: hidden;
    max-width: 50%;
    margin: 0 auto;
}
.ad-life-icon {
    font-size: 1.4rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 0.2rem;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
}
.ad-life-btn {
    background: #FFFFFF;
    border: none;
    border-radius: 40px;
    padding: 0.4rem 1rem;
    font-size: 0.7rem;
    font-weight: 800;
    color: #C21E1E;
    cursor: pointer;
    transition: transform 0.2s;
    display: block;
    margin: 0 auto;
}
.ad-life-btn:hover {
    transform: scale(1.05);
}
.ad-life-note {
    font-size: 0.55rem;
    color: rgba(255,255,255,0.85);
    margin-top: 0.2rem;
}

/* ----- MY STATS SECTION ----- */
.stats-full {
    padding: 0.5rem 0;
}
.stats-full > .section-title {
    font-size: 1.2rem;
    font-weight: 800;
    color: #FFFFFF;
}
.stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.7rem;
    margin-top: 0.8rem;
}
.stat-detail {
    background: linear-gradient(160deg, rgba(48, 38, 84, 0.85), rgba(20, 16, 42, 0.92));
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 16px;
    padding: 0.8rem 0.6rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
}
.stat-detail-icon {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    color: #fff;
    margin-bottom: 0.1rem;
    background: linear-gradient(135deg, #3E7BFF, #1A4FA0);
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
}
.stat-detail:nth-child(2) .stat-detail-icon { background: linear-gradient(135deg, #3FE07E, #0F9C4E); }
.stat-detail:nth-child(3) .stat-detail-icon { background: linear-gradient(135deg, #FFD700, #FF9A3E); }
.stat-detail:nth-child(4) .stat-detail-icon { background: linear-gradient(135deg, #FF6B6B, #C21E1E); }
.stat-detail:nth-child(5) .stat-detail-icon { background: linear-gradient(135deg, #FFD700, #E0A400); }
.stat-detail:nth-child(6) .stat-detail-icon { background: linear-gradient(135deg, #C9B6FF, #7C4FE0); }
.stat-detail-label {
    display: block;
    font-size: 0.65rem;
    color: #9AA5C7;
    font-weight: 500;
}
.stat-detail-value {
    font-size: 1.1rem;
    font-weight: 700;
    color: #FFFFFF;
    font-family: 'Orbitron', monospace;
}

/* ----- LEADERBOARD SECTION ----- */
.leaderboard-full {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    width: 100%;
}
.leaderboard-item {
    background: linear-gradient(160deg, rgba(48, 38, 84, 0.85), rgba(20, 16, 42, 0.92));
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 16px;
    padding: 0.8rem 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
}
.rank-badge {
    width: 38px;
    height: 38px;
    background: #1A1D2E;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-family: 'Orbitron', monospace;
    flex-shrink: 0;
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.4);
}
.rank-1 {
    color: #0A0A0F;
    background: linear-gradient(135deg, #FFD700, #FF9A3E);
    box-shadow: 0 0 14px rgba(255, 215, 0, 0.55);
}
.rank-2 {
    color: #0A0A0F;
    background: linear-gradient(135deg, #E4E8F0, #A8B2C4);
    box-shadow: 0 0 12px rgba(192, 192, 192, 0.4);
}
.rank-3 {
    color: #2A1200;
    background: linear-gradient(135deg, #E0A25E, #CD7F32);
    box-shadow: 0 0 12px rgba(205, 127, 50, 0.4);
}
.filter-select {
    background: rgba(20, 24, 46, 0.75);
    border: 1px solid rgba(255,255,255,0.1);
    color: #FFF;
    padding: 0.4rem 0.9rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-family: 'Poppins', sans-serif;
}
.leaderboard-full .leaderboard-item { margin-bottom: 0; }
.loading-skeleton {
    text-align: center;
    padding: 1.2rem;
    color: #9AA5C7;
    font-size: 0.85rem;
    background: rgba(20, 24, 46, 0.5);
    border-radius: 16px;
    animation: pulseFade 1.4s ease-in-out infinite;
}
@keyframes pulseFade {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
}

/* ----- PICK YOUR LANE (in-page tab) ----- */
#laneSection .lane-top-row {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin-bottom: 1.5rem;
}
#laneSection .hero-section {
    flex: 1;
    text-align: left;
}
#laneSection .page-title {
    font-size: 1.5rem;
    font-weight: 800;
    color: #FFFFFF;
    letter-spacing: -0.02em;
    line-height: 1.2;
}
#laneSection .page-subtitle {
    font-size: 0.85rem;
    font-weight: 400;
    color: #C9D3EE;
    margin-top: 0.2rem;
}

.lane-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.8rem;
}
.lane-card {
    background: linear-gradient(160deg, rgba(48, 38, 84, 0.85), rgba(20, 16, 42, 0.92));
    border: 1px solid rgba(255, 215, 0, 0.15);
    border-radius: 16px;
    padding: 1rem 0.6rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s, border-color 0.2s;
}
.lane-card:hover {
    transform: translateY(-3px);
    border-color: #FFD700;
}
.lane-icon {
    font-size: 2.2rem;
    margin-bottom: 0.3rem;
}
.lane-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}
.lane-name {
    font-weight: 700;
    font-size: 0.9rem;
    color: #FFFFFF;
    letter-spacing: -0.01em;
}
.lane-desc {
    font-size: 0.7rem;
    color: #9AA5C7;
    line-height: 1.2;
}
.lane-arrow {
    color: #3E7BFF;
    font-size: 1rem;
    margin-top: 0.3rem;
    transition: transform 0.2s ease;
}
.lane-card:hover .lane-arrow {
    transform: translateX(4px);
}

.back-arrow-btn {
    flex-shrink: 0;
    background: rgba(20, 24, 46, 0.8);
    border: 1px solid rgba(255, 215, 0, 0.4);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFD700;
    font-size: 1.05rem;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.4);
}
.back-arrow-btn:hover {
    background: rgba(255, 215, 0, 0.15);
    border-color: #FFD700;
}

/* ----- SETTINGS SECTION ----- */
.settings-container {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    margin-top: 1rem;
}
.settings-item {
    background: linear-gradient(160deg, rgba(48, 38, 84, 0.85), rgba(20, 16, 42, 0.92));
    border-radius: 16px;
    padding: 0.8rem 1rem;
    border: 1px solid rgba(255, 215, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.8rem;
}
.settings-item label {
    font-weight: 600;
    font-size: 0.9rem;
    color: #FFFFFF;
    min-width: 80px;
}
.settings-control {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    flex: 1;
    justify-content: flex-end;
}
.settings-control input[type="range"] {
    -webkit-appearance: none;
    width: 120px;
    height: 4px;
    background: rgba(255,255,255,0.2);
    border-radius: 2px;
    outline: none;
    transition: background 0.2s;
}
.settings-control input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #FFD700;
    cursor: pointer;
    box-shadow: 0 0 8px rgba(255,215,0,0.5);
}
.settings-control input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #FFD700;
    cursor: pointer;
    border: none;
}
#volumeValue {
    font-weight: 600;
    color: #FFD700;
    min-width: 40px;
    text-align: center;
}

/* Toggle switch */
.toggle-switch {
    position: relative;
    width: 48px;
    height: 26px;
}
.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}
.toggle-label {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255,255,255,0.2);
    border-radius: 26px;
    transition: 0.3s;
}
.toggle-label::before {
    content: "";
    position: absolute;
    height: 20px;
    width: 20px;
    left: 3px;
    bottom: 3px;
    background: #FFFFFF;
    border-radius: 50%;
    transition: 0.3s;
}
.toggle-switch input:checked + .toggle-label {
    background: #3E7BFF;
}
.toggle-switch input:checked + .toggle-label::before {
    transform: translateX(22px);
}

/* Edit name input & button */
.settings-name-control {
    gap: 0.5rem;
}
.settings-name-control input {
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    padding: 0.3rem 0.8rem;
    color: #FFFFFF;
    font-family: 'Poppins', sans-serif;
    font-size: 0.85rem;
    flex: 1;
    min-width: 100px;
    outline: none;
}
.settings-name-control input::placeholder {
    color: #9AA5C7;
}
.settings-name-control input:focus {
    border-color: #FFD700;
}
.settings-name-control button {
    background: linear-gradient(135deg, #3E7BFF, #1A4FA0);
    border: none;
    border-radius: 20px;
    padding: 0.3rem 1.2rem;
    font-weight: 600;
    font-size: 0.8rem;
    color: #FFFFFF;
    cursor: pointer;
    transition: opacity 0.2s;
}
.settings-name-control button:hover {
    opacity: 0.8;
}

/* ----- BOTTOM NAVIGATION (Mobile) ----- */
.bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 74px;
    background: #12151E;
    border-top: 1px solid rgba(255,255,255,0.06);
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-bottom: env(safe-area-inset-bottom);
    z-index: 1000;
}
.nav-item {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    position: relative;
    padding: 0.4rem;
    transition: transform 0.1s, color 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
    text-decoration: none;
    font-family: 'Poppins', sans-serif;
    flex: 1;
}
.nav-item:active { transform: scale(0.9); }
.nav-item.active { color: #3E7BFF; }

.nav-item i {
    font-size: 1.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #2a2a3a;
    color: #fff;
    transition: background 0.3s, transform 0.2s;
    box-shadow: inset 0 3px 8px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3);
}
.nav-item.active i {
    transform: scale(1.05);
}

.nav-item:nth-child(1) i { background: linear-gradient(160deg, #3E7BFF, #1A4FA0); color: #fff; }
.nav-item:nth-child(2) i { background: linear-gradient(160deg, #FFD700, #FF9A3E); color: #0A0A0F; }
.nav-item:nth-child(3) i { background: linear-gradient(160deg, #8B5CF6, #4B2A9E); color: #fff; }
.nav-item:nth-child(4) i { background: linear-gradient(160deg, #3FE07E, #0F9C4E); color: #0A0A0F; }

.nav-item.active i {
    box-shadow: inset 0 3px 8px rgba(0,0,0,0.4), 0 0 0 2px rgba(255,255,255,0.5), 0 4px 14px rgba(0,0,0,0.35);
}

.nav-label {
    font-size: 0.6rem;
    font-weight: 600;
    color: #B0B8C8;
    margin-top: 0.1rem;
}
.nav-item.active .nav-label {
    color: #3E7BFF;
}
.nav-dot {
    display: none;
}

/* ----- DESKTOP SIDEBAR ----- */
.desktop-sidebar { display: none; }
@media (min-width: 768px) {
    body { padding-left: 260px; }
    .desktop-sidebar {
        display: flex;
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        width: 260px;
        background: #0D1117;
        border-right: 1px solid rgba(255,255,255,0.08);
        padding-top: 80px;
    }
    .sidebar-nav {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0 1rem;
    }
    .sidebar-item {
        background: transparent;
        border: none;
        padding: 0.875rem 1rem;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 1rem;
        color: #B0B8C8;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s;
        font-weight: 500;
        text-decoration: none;
        width: 100%;
        text-align: left;
        font-family: 'Poppins', sans-serif;
    }
    .sidebar-item i { width: 24px; font-size: 1.25rem; }
    .sidebar-item:hover { background: #1A1D2E; color: #3E7BFF; }
    .sidebar-item.active {
        background: linear-gradient(135deg, #3E7BFF20, #FFD70020);
        color: #3E7BFF;
        border-left: 3px solid #3E7BFF;
    }
    .bottom-nav { display: none; }
    .main-content { max-width: 800px; padding-bottom: 2rem; }
    .stats-row { gap: 1rem; }
    .level-display { padding: 1rem 1.5rem; }
    .user-avatar { width: 90px; height: 90px; }
    .level-name { font-size: 1.6rem; }
    .mode-grid { gap: 1.5rem; }
    .mode-btn { min-height: 200px; }
    .mode-name { font-size: 1.2rem; }
    .mode-questions { font-size: 0.8rem; }
    .stats-grid { grid-template-columns: repeat(3, 1fr); }
    .lane-grid { gap: 1rem; }
    .lane-card { padding: 1.2rem 0.6rem; }
    .lane-name { font-size: 1rem; }
    .lane-desc { font-size: 0.75rem; }
}

/* ----- TOAST ----- */
.toast-container {
    position: fixed;
    bottom: 90px;
    left: 1rem;
    right: 1rem;
    z-index: 2000;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    pointer-events: none;
}
.toast {
    background: #1A1D2E;
    backdrop-filter: blur(10px);
    color: white;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border-left: 3px solid #3E7BFF;
    pointer-events: auto;
    animation: slideUp 0.3s ease;
    max-width: calc(100% - 2rem);
    font-family: 'Poppins', sans-serif;
}
@keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

/* ----- MOBILE ADJUSTMENTS – all home items scaled by 40% ----- */
@media (max-width: 600px) {
    .main-content {
        padding-top: 72px;
        padding-bottom: 74px;
    }

    /* ---- GREETING ---- */
    .greeting-wrapper {
        margin-bottom: 1.12rem;    /* 0.8 * 1.4 */
        gap: 0.7rem;              /* 0.5 * 1.4 */
    }
    .greeting-text {
        font-size: 1.26rem;        /* 0.9 * 1.4 */
    }
    .greeting-text span#greetingName {
        font-size: 2.52rem;        /* 1.8 * 1.4 */
        margin-left: 0.15rem;
    }
    .greeting-sub {
        font-size: 1.12rem;        /* 0.8 * 1.4 */
        margin-top: 0.1rem;
    }
    .hero-logo-wrap {
        width: 133px;              /* 95 * 1.4 */
        height: 133px;
    }
    .hero-logo-text {
        font-size: 1.75rem;        /* 1.25 * 1.4 */
    }
    .hero-flag { font-size: 2.1rem; }   /* 1.5 * 1.4 */
    .hero-bulb { font-size: 2.52rem; }  /* 1.8 * 1.4 */
    .sparkle { font-size: 1.54rem; }    /* 1.1 * 1.4 */

    /* ---- LEVEL DISPLAY ---- */
    .level-display {
        gap: 2.1rem;               /* 1.5 * 1.4 */
        padding: 1.12rem 1.4rem;   /* 0.8*1.4, 1*1.4 */
        margin-bottom: 1.12rem;    /* 0.8 * 1.4 */
        border-radius: 25.2px;     /* 18 * 1.4 */
    }
    .user-avatar {
        width: 95.2px;             /* 68 * 1.4 */
        height: 95.2px;
        font-size: 1.4rem;         /* 1 * 1.4 */
        border-width: 2px;
    }
    .avatar-edit-btn {
        width: 30.8px;             /* 22 * 1.4 */
        height: 30.8px;
        font-size: 0.77rem;        /* 0.55 * 1.4 */
    }
    .shield-badge {
        width: 67.2px;             /* 48 * 1.4 */
        height: 72.8px;            /* 52 * 1.4 */
    }
    .shield-badge .level-badge-img {
        width: 65%;
        height: 65%;
    }
    .level-info {
        gap: 0.42rem;              /* 0.3 * 1.4 */
    }
    .level-label {
        font-size: 0.84rem;        /* 0.6 * 1.4 */
        padding: 0.15rem 0.6rem;
        margin-bottom: 0.1rem;
    }
    .level-name {
        font-size: 1.54rem;        /* 1.1 * 1.4 */
    }
    .level-star { font-size: 0.85rem; }
    .xp-progress {
        height: 8.4px;             /* 6 * 1.4 */
        gap: 0.56rem;              /* 0.4 * 1.4 */
    }
    .xp-bar {
        height: 8.4px;
    }
    .xp-text {
        font-size: 0.98rem;        /* 0.7 * 1.4 */
    }

    /* ---- STATS ROW ---- */
    .stats-row {
        padding: 0.84rem 1.26rem;  /* 0.6*1.4, 0.9*1.4 */
        margin-bottom: 0.98rem;    /* 0.7 * 1.4 */
        border-radius: 22.4px;     /* 16 * 1.4 */
    }
    .stat-card {
        gap: 0.7rem;               /* 0.5 * 1.4 */
    }
    .stat-icon {
        width: 44.8px;             /* 32 * 1.4 */
        height: 44.8px;
        font-size: 1.19rem;        /* 0.85 * 1.4 */
    }
    .stat-value {
        font-size: 1.54rem;        /* 1.1 * 1.4 */
    }
    .stat-label {
        font-size: 0.98rem;        /* 0.7 * 1.4 */
    }
    .stat-caption {
        font-size: 0.84rem;        /* 0.6 * 1.4 */
    }

    /* ---- ACTIVE CHALLENGE (empty) ---- */
    .challenge-section {
        margin-bottom: 0.98rem;    /* 0.7 * 1.4 */
        min-height: 56px;          /* 40 * 1.4 */
    }

    /* ---- MODE SECTION ---- */
    .mode-section {
        margin-top: 0.42rem;       /* 0.3 * 1.4 */
    }
    .mode-title {
        margin-bottom: 0.84rem;    /* 0.6 * 1.4 */
        font-size: 0.98rem;        /* 0.7 * 1.4 */
        gap: 0.56rem;              /* 0.4 * 1.4 */
    }
    .mode-title i.fa-crown {
        font-size: 1.12rem;        /* 0.8 * 1.4 */
    }
    .title-line {
        max-width: 56px;           /* 40 * 1.4 */
    }
    .mode-grid {
        gap: 0.7rem;               /* 0.5 * 1.4 */
    }
    .mode-btn {
        padding: 0.84rem 0.35rem;  /* 0.6*1.4, 0.25*1.4 */
        min-height: 189px;         /* 135 * 1.4 */
        border-radius: 22.4px;     /* 16 * 1.4 */
        gap: 0.28rem;              /* 0.2 * 1.4 */
    }
    .mode-icon {
        font-size: 3.22rem;        /* 2.3 * 1.4 */
    }
    .mode-name {
        font-size: 1.26rem;        /* 0.9 * 1.4 */
    }
    .mode-questions {
        font-size: 0.84rem;        /* 0.6 * 1.4 */
        padding: 0.15rem 0.25rem;
    }
    .mode-btn-red { transform: perspective(700px) rotateY(14deg); }
    .mode-btn-red:hover { transform: perspective(700px) rotateY(14deg) translateY(-4px); }
    .mode-btn-green { transform: perspective(700px) rotateY(-14deg); }
    .mode-btn-green:hover { transform: perspective(700px) rotateY(-14deg) translateY(-4px); }
    .mode-btn-green .mode-name {
        margin-left: -0.18rem;
    }

    /* ---- Other tabs (unchanged) ---- */
    .stats-grid {
        grid-template-columns: 1fr 1fr;
        gap: 0.7rem;
    }
    .stat-detail {
        padding: 0.8rem 0.5rem;
    }
    .stat-detail-value {
        font-size: 1.1rem;
    }
    .stat-detail-label {
        font-size: 0.65rem;
    }
    .shop-grid {
        grid-template-columns: 1fr 1fr;
        gap: 0.7rem;
    }
    .shop-item {
        padding: 0.7rem 0.3rem;
    }
    .shop-item-icon {
        width: 48px;
        height: 48px;
        line-height: 48px;
        font-size: 1.6rem;
    }
    .shop-item-info h4 {
        font-size: 0.85rem;
    }
    .shop-item-info p {
        font-size: 0.75rem;
    }
    .shop-buy-btn {
        font-size: 0.75rem;
        padding: 0.35rem 0.35rem;
    }
    .ad-life-container {
        max-width: 75%;
        padding: 0.6rem 0.4rem;
        margin-top: 1.4rem;
    }
    .ad-life-icon {
        font-size: 1.4rem;
    }
    .ad-life-btn {
        font-size: 0.7rem;
        padding: 0.35rem 0.9rem;
    }
    .leaderboard-full {
        max-width: 350px;
        margin: 0 auto;
    }
    .leaderboard-item {
        padding: 0.7rem 0.9rem;
        gap: 0.7rem;
    }
    .bottom-nav {
        height: 66px;
    }
    .nav-item i {
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
    }
    .nav-label {
        font-size: 0.6rem;
    }
    .lane-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.7rem;
    }
    .lane-card {
        padding: 0.8rem 0.4rem;
    }
    .lane-icon {
        font-size: 1.9rem;
    }
    .lane-name {
        font-size: 0.85rem;
    }
    .lane-desc {
        font-size: 0.65rem;
    }
    .back-arrow-btn {
        width: 38px;
        height: 38px;
        font-size: 1rem;
    }
    .settings-item {
        gap: 0.6rem;
        padding: 0.8rem 0.9rem;
    }
    .settings-item label {
        font-size: 0.9rem;
        min-width: 75px;
    }
    .settings-name-control input {
        font-size: 0.85rem;
        min-width: 75px;
    }
    .settings-name-control button {
        font-size: 0.8rem;
        padding: 0.35rem 1rem;
    }
}

@media (max-width: 380px) {
    .greeting-text {
        font-size: 1.05rem;        /* 0.75 * 1.4 */
    }
    .greeting-text span#greetingName {
        font-size: 1.96rem;        /* 1.4 * 1.4 */
    }
    .greeting-sub {
        font-size: 0.91rem;        /* 0.65 * 1.4 */
    }
    .hero-logo-wrap {
        width: 112px;              /* 80 * 1.4 */
        height: 112px;
    }
    .hero-logo-text {
        font-size: 1.47rem;        /* 1.05 * 1.4 */
    }
    .level-display {
        gap: 1.54rem;              /* 1.1 * 1.4 */
        padding: 0.77rem 0.98rem;  /* 0.55*1.4, 0.7*1.4 */
    }
    .user-avatar {
        width: 78.4px;             /* 56 * 1.4 */
        height: 78.4px;
        font-size: 1.19rem;        /* 0.85 * 1.4 */
    }
    .shield-badge {
        width: 56px;               /* 40 * 1.4 */
        height: 61.6px;            /* 44 * 1.4 */
    }
    .level-name {
        font-size: 1.26rem;        /* 0.9 * 1.4 */
    }
    .xp-text {
        font-size: 0.84rem;        /* 0.6 * 1.4 */
    }
    .stat-value {
        font-size: 1.26rem;        /* 0.9 * 1.4 */
    }
    .stat-icon {
        width: 36.4px;             /* 26 * 1.4 */
        height: 36.4px;
        font-size: 0.98rem;        /* 0.7 * 1.4 */
    }
    .challenge-section {
        min-height: 42px;          /* 30 * 1.4 */
    }
    .mode-btn {
        min-height: 161px;         /* 115 * 1.4 */
        padding: 0.63rem 0.21rem;  /* 0.45*1.4, 0.15*1.4 */
    }
    .mode-icon {
        font-size: 2.66rem;        /* 1.9 * 1.4 */
    }
    .mode-name {
        font-size: 1.05rem;        /* 0.75 * 1.4 */
    }
    .mode-questions {
        font-size: 0.77rem;        /* 0.55 * 1.4 */
    }
    .mode-btn-red { transform: perspective(500px) rotateY(8deg); }
    .mode-btn-green { transform: perspective(500px) rotateY(-8deg); }
    .stat-badge-group { gap: 0.35rem; }
    .stat-label-text { display: none; }
    .nav-item i {
        width: 44px;
        height: 44px;
        font-size: 1.3rem;
    }
    .ad-life-container {
        max-width: 85%;
    }
    .stat-detail {
        max-width: 150px;
    }
    .shop-item {
        max-width: 140px;
    }
    .lane-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 520px) {
    .stat-badge {
        font-size: 0.85rem;
    }
    .shop-grid {
        gap: 0.5rem;
    }
    .shop-item {
        padding: 0.45rem 0.25rem;
    }
    .shop-item-icon {
        width: 40px;
        height: 40px;
        line-height: 40px;
        font-size: 1.4rem;
    }
    .shop-item-info h4 {
        font-size: 0.75rem;
    }
    .shop-item-info p {
        font-size: 0.65rem;
    }
    .shop-buy-btn {
        font-size: 0.65rem;
        padding: 0.3rem 0.35rem;
    }
    .ad-life-btn {
        font-size: 0.65rem;
        padding: 0.3rem 0.7rem;
    }
    .stat-detail {
        padding: 0.6rem 0.35rem;
    }
    .stat-detail-value {
        font-size: 1rem;
    }
    .stat-detail-label {
        font-size: 0.6rem;
    }
}

/* ----- TOUCH TARGETS & SMOOTH SCROLL ----- */
button, .nav-item, .sidebar-item, .challenge-card, .mode-btn, .lane-card {
    min-height: 44px;
    cursor: pointer;
}
html { scroll-behavior: smooth; }