/* =========================================
   基本変数
   ========================================= */
:root {
    --bg-dark: #020b18;
    --text-main: #f1f5f9;
    --cyan-primary: #22d3ee;
    --cyan-bright: #67e8f9;
    --blue-deep: #061e38;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
    font-family: 'Noto Sans JP', sans-serif;
    background-color: var(--bg-dark);
    color: var(--text-main);
    overflow-x: hidden;
}

/* =========================================
   ナビゲーション (ロゴ修正済み)
   ========================================= */
.navbar {
    position: fixed;
    top: 0; left: 0; right: 0; z-index: 50;
    background: rgba(2, 11, 24, 0.9);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(8, 145, 178, 0.3);
    padding: 12px 16px;
}
.nav-container { max-width: 1280px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
.nav-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }

/* ロゴ部分の修正: 元サイトの明るいシアンを再現 */
.logo-icon-box {
    width: 40px; height: 40px;
    background: linear-gradient(to bottom right, #22d3ee, #0891b2);
    border-radius: 12px; padding: 2px;
}
.logo-inner {
    background: #031329; /* 少しだけ明るい紺色 */
    width: 100%; height: 100%; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
}
.logo-inner i { color: #22d3ee; width: 22px; height: 22px; }
.logo-title {
    font-family: 'Cinzel', serif; font-weight: 700; font-size: 20px;
    background: linear-gradient(to right, #a5f3fc, #7dd3fc, #60a5fa);
    -webkit-background-clip: text; background-clip: text; color: transparent;
}
.logo-subtitle { font-size: 10px; color: rgba(34, 211, 238, 0.7); font-family: 'Rajdhani'; text-transform: uppercase; }

.nav-links { display: none; gap: 8px; }
@media (min-width: 1024px) { .nav-links { display: flex; } }
.nav-links a { text-decoration: none; color: #cbd5e1; font-size: 14px; padding: 6px 10px; }
.btn-primary { background: linear-gradient(to right, #22d3ee, #2563eb); color: #020617; font-weight: 700; padding: 8px 16px; border-radius: 10px; }

/* =========================================
   ヒーローセクション (説明文幅 修正)
   ========================================= */
.hero { padding: 140px 20px 80px; text-align: center; position: relative; z-index: 10; }
.hero-title { font-family: 'Cinzel'; font-size: clamp(2.5rem, 8vw, 4.5rem); font-weight: 900; margin-bottom: 16px; }
.hero-subtitle { font-size: 1.5rem; font-weight: 700; color: #7dd3fc; margin-bottom: 16px; }

/* 修正: 2行で綺麗に収まるように幅を広く設定 */
.hero-description {
    max-width: 800px;
    margin: 0 auto 32px;
    color: #cbd5e1;
    line-height: 1.7;
    font-size: 16px;
}

/* 潜水艦カードなどは省略せずそのまま定義 */
.sub-visual-card { background: rgba(6, 30, 56, 0.8); border: 1px solid #155e75; border-radius: 20px; padding: 24px; max-width: 450px; margin: 0 auto; }
.submarine-body { position: relative; width: 180px; height: 100px; background: #eab308; border-radius: 50px; border: 3px solid #451a03; margin: 40px auto; }
.sub-cockpit { position: absolute; top: -15px; left: 45px; width: 90px; height: 45px; background: rgba(186,230,253,0.5); border-radius: 45px 45px 0 0; border: 2px solid #451a03; }

/* =========================================
   グリッドレイアウト (ここが今回のメイン修正)
   ========================================= */
.section { max-width: 1200px; margin: 0 auto; padding: 80px 20px; position: relative; z-index: 10; }
.grid-2col { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }

/* 指示のあった箇所: 強制的に2列（計4マス）にする設定 */
.grid-2col-fixed {
    display: grid;
    grid-template-columns: 1fr; /* スマホは1列 */
    gap: 24px;
}

@media (min-width: 768px) {
    .grid-2col-fixed {
        grid-template-columns: repeat(2, 1fr); /* PCは元のサイト通り2列に固定 */
    }
}

.depth-zone { padding: 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
.zone-sky { background: #021329; border-color: #0ea5e9; }
.zone-blue { background: #031533; border-color: #2563eb; }
.zone-indigo { background: #08123b; border-color: #4f46e5; }
.zone-purple { background: #140b2e; border-color: #a855f7; }

/* =========================================
   その他コンポーネント (装飾)
   ========================================= */
.card-glass { background: rgba(6, 30, 56, 0.7); backdrop-filter: blur(10px); border-radius: 16px; padding: 24px; border: 1px solid rgba(34,211,238,0.2); }
.grid-4col { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
.light-card { background: #020d1c; border: 2px solid; padding: 20px; border-radius: 16px; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
.stat-card { background: #020e21; padding: 20px; border-radius: 12px; border: 1px solid #155e75; }

.calc-card { background: #041c38; padding: 32px; border-radius: 24px; border: 1px solid #0e7490; }
.calc-results { display: flex; gap: 16px; margin-top: 20px; background: #010813; padding: 20px; border-radius: 12px; }
.result-box { flex: 1; text-align: center; }
.rb-value { display: block; font-size: 24px; font-weight: 900; color: #22d3ee; }

.footer { padding: 40px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); }

/* 背景の泡アニメーション */
@keyframes floatBubble {
    0% { transform: translateY(0); opacity: 0; }
    50% { opacity: 0.4; }
    100% { transform: translateY(-100vh); opacity: 0; }
}
.ambient-background { position: fixed; inset: 0; pointer-events: none; }
.bubble { position: absolute; bottom: -20px; width: 10px; height: 10px; background: rgba(34,211,238,0.2); border-radius: 50%; animation: floatBubble 10s infinite linear; }

/* モーダル */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 100; display: flex; align-items: center; justify-content: center; }
.hidden { display: none; }
.modal-window { background: #020e21; border: 2px solid #22d3ee; border-radius: 20px; width: 90%; max-width: 700px; padding: 20px; }
