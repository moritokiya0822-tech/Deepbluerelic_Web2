/**
 * Deep Blue Relic - JavaScript Logic
 */

// --- 1. グローバル変数 & オーディオ設定 ---
let audioCtx = null;
let isMuted = false;

function getAudioContext() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

function toggleMute() {
    isMuted = !isMuted;
    const icon = document.getElementById('sound-icon');
    icon.setAttribute('data-lucide', isMuted ? 'volume-x' : 'volume-2');
    lucide.createIcons(); // アイコン再描画
}

function playAudio(type) {
    if (isMuted) return;
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        
        if (type === 'sonar') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(840, now);
            osc.frequency.exponentialRampToValueAtTime(420, now + 0.9);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(now + 0.9);
        } else if (type === 'bubble') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(750, now + 0.12);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(now + 0.12);
        } else if (type === 'emp') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.5);
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(now + 0.5);
        }
    } catch (e) {
        console.error("Audio Playback Error:", e);
    }
}

// --- 2. ステータスシミュレーター ---
const STATS_DATA = [
    { id: 'armor', name: '装甲厚', desc: '障害物や敵生物との衝突ダメージを軽減。', 
        formula: (l) => `HP: ${l}` },
    { id: 'thrust', name: '推進推力', desc: '潜水艦の巡航速度と加速力を向上。', 
        formula: (l) => `速度: ${(1 + (l - 1) * 0.22).toFixed(2)}倍` },
    { id: 'control', name: '姿勢制御', desc: '旋回性能と機動性を強化。', 
        formula: (l) => `制動補正: +${(l * 0.55).toFixed(2)}` },
    { id: 'pressure', name: '耐圧効率', desc: '深海の水圧による酸素消費の加速を大幅緩和。', 
        formula: (l) => `耐圧耐性: ${Math.min(100, Math.round((l - 1) * 11.1))}%` },
    { id: 'emp', name: 'EMP放電', desc: '周囲の敵生物を一時的に麻痺・無力化。', 
        formula: (l) => {
            const range = (4.5 + (l - 1) * 1).toFixed(1);
            const duration = (1.0 + (l - 1) * 0.5).toFixed(1);
            const ct = 14 - (l - 1) * 1;
            return `範囲:${range} / 停止:${duration}s / CT:${ct}s`;
        }
    },
    
    { id: 'radar', name: '探索レーダー', desc: '暗闇の中で光球や遺物を感知する範囲を拡大。', 
        formula: (l) => {
            const range = 6 + (l - 1) * 2;
            const arrows = Math.floor(l / 3);
            return `範囲:${range} / 矢印:+${arrows}`;
        }
    },
];

let currentStatLevels = { armor: 1, thrust: 1, control: 1, pressure: 1, emp: 1, radar: 1 };

function renderStats() {
    const container = document.getElementById('stats-container');
    if (!container) return;
    
    container.innerHTML = '';
    let totalParts = 0;

    STATS_DATA.forEach(stat => {
        const lvl = currentStatLevels[stat.id];
        totalParts += (lvl - 1);

        const card = document.createElement('div');
        card.className = 'stat-card';
        card.innerHTML = `
            <div>
                <div class="stat-header">
                    <h3 class="stat-name">【${stat.name}】</h3>
                    <span class="stat-level">Lv.${lvl}/10</span>
                </div>
                <p class="stat-desc">${stat.desc}</p>
                <div class="stat-current-value">現在値: <strong>${stat.formula(lvl)}</strong></div>
            </div>
            <div>
                <div class="stat-progress-bar">
                    ${Array.from({ length: 10 }).map((_, i) => `<div class="bar-segment ${i < lvl ? 'active' : ''}"></div>`).join('')}
                </div>
                <div class="stat-controls">
                    <button onclick="changeStat('${stat.id}', -1)" class="btn-adjust minus">-</button>
                    <button onclick="changeStat('${stat.id}', 1)" class="btn-adjust plus">+</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    
    document.getElementById('total-parts-text').innerText = '🔴 必要パーツ: ' + totalParts + ' / 54個';
}

function changeStat(id, delta) {
    currentStatLevels[id] = Math.max(1, Math.min(10, currentStatLevels[id] + delta));
    playAudio('bubble');
    renderStats();
}

function setPreset(type) {
    if (type === 'beginner') currentStatLevels = { armor: 3, thrust: 4, control: 2, pressure: 5, emp: 3, radar: 3 };
    else if (type === 'deep') currentStatLevels = { armor: 7, thrust: 6, control: 5, pressure: 10, emp: 8, radar: 7 };
    else if (type === 'max') currentStatLevels = { armor: 10, thrust: 10, control: 10, pressure: 10, emp: 10, radar: 10 };
    else if (type === 'reset') currentStatLevels = { armor: 1, thrust: 1, control: 1, pressure: 1, emp: 1, radar: 1 };
    
    playAudio('bubble');
    renderStats();
}

// --- 3. 酸素消費計算機 ---
function calcOxygen() {
    const depth = parseInt(document.getElementById('depth-slider').value);
    const pressure = parseInt(document.getElementById('pressure-slider').value);
    
    document.getElementById('depth-val').innerText = depth + ' m';
    document.getElementById('pressure-val').innerText = 'Lv.' + pressure;

    // 1. 基本的な消費量（0m地点。レベルを上げても変化しない）
    const baseDrain = 1.0;
    // 2. 深度による増加分（ペナルティ）を計算
    const depthPenalty = depth / 100;
    // 3. ペナルティ分だけを耐圧レベルで割って軽減
    const mitigatedPenalty = depthPenalty / pressure;
    // 4. 合計の消費スピードを算出
    const drain = (baseDrain + mitigatedPenalty).toFixed(2);
    const survival = Math.round(300 / parseFloat(drain));

    document.getElementById('drain-result').innerHTML = drain + ' <small>/秒</small>';
    document.getElementById('time-result').innerHTML = survival + ' <small>秒</small>';
    
    const advice = document.getElementById('depth-advice');
    if (depth < 200) advice.innerText = '💡 陽光層（0〜200m）：水圧の影響は軽微。初心者でも安全に光球を回収できます。';
    else if (depth < 700) advice.innerText = '💡 薄光層（200〜700m）：酸素の減りが加速。耐圧効率Lv.3以上が有効です。';
    else if (depth < 1200) advice.innerText = '💡 無光層（700〜1200m）：水圧が激化。耐圧効率Lv.6以上かつEMPを活用して探索しましょう。';
    else advice.innerText = '💡 超深海（1200m+）：極限水圧！耐圧効率Lv.9〜10が揃って初めて探索可能です。';
}

// --- 4. FAQ アコーディオン ---
const FAQ_DATA = [
    { q: '深海で酸素が急激になくなるのはなぜですか？', a: '深度が深くなるほど水圧が高まり、酸素の減少スピードが加速度的に増加します。これを防ぐには【耐圧効率】を強化する必要があります。' },
    { q: 'ステータス強化のおすすめ優先順位は？', a: '【耐圧効率】＞【推進推力】＞【EMP】＞【装甲厚】の順が初心者にはおすすめです。' },
    { q: '潜るたびに0mからやり直しになりますか？', a: 'いいえ。深海にある「紫の光（セーブポイント）」に触れれば、次回からその深度を選択して開始できます。' },
    { q: '敵に囲まれて逃げられない時の対処法は？', a: '【EMP】スキルを発動してください。周囲の敵を数秒間完全フリーズさせることができます。' }
];

function renderFaq() {
    const container = document.getElementById('faq-container');
    if (!container) return;
    
    container.innerHTML = '';
    FAQ_DATA.forEach((item, idx) => {
        const wrap = document.createElement('div');
        wrap.className = 'faq-item';
        wrap.innerHTML = `
            <div class="faq-question" onclick="toggleFaq(${idx})">
                <h4><span class="faq-q-prefix">Q.</span> ${item.q}</h4>
                <i data-lucide="chevron-down"></i>
            </div>
            <div class="faq-answer" id="faq-ans-${idx}">${item.a}</div>
        `;
        container.appendChild(wrap);
    });
    lucide.createIcons();
}

function toggleFaq(idx) {
    const items = document.querySelectorAll('.faq-item');
    items[idx].classList.toggle('active');
}

// --- 5. ミニゲーム・シミュレーター ---
let isPlaying = false;
let gameState = {
    x: 320, y: 50, vx: 0, vy: 0,
    depth: 0, o2: 100, hp: 100, redParts: 0, relics: 0,
    entities: [],
    particles: [],
    empCooldown: 0
};
let keys = {};

function openModal() {
    document.getElementById('sim-modal').classList.remove('hidden');
    playAudio('sonar');
}

function closeModal() {
    document.getElementById('sim-modal').classList.add('hidden');
    isPlaying = false;
}

function startGame() {
    document.getElementById('game-overlay').classList.add('hidden');
    isPlaying = true;
    gameState = {
        x: 320, y: 40, vx: 0, vy: 0,
        depth: 0, o2: 100, hp: 100, redParts: 0, relics: 0,
        empCooldown: 0,
        entities: [], particles: []
    };

    // エンティティ生成
    for (let i = 0; i < 25; i++) {
        const rand = Math.random();
        gameState.entities.push({
            x: 40 + Math.random() * 560,
            y: 120 + i * 80 + Math.random() * 40,
            type: rand < 0.35 ? 'red' : rand < 0.65 ? 'yellow' : rand < 0.85 ? 'white' : 'enemy',
            radius: rand < 0.85 ? 9 : 14,
            vx: (Math.random() - 0.5) * 1.2,
            frozen: 0
        });
    }
    requestAnimationFrame(gameLoop);
}

function triggerGameEMP() {
    if (!isPlaying || gameState.empCooldown > 0) return;
    playAudio('emp');
    gameState.empCooldown = 180;
    gameState.entities.forEach(e => { if (e.type === 'enemy') e.frozen = 240; });
    gameState.particles.push({ type: 'emp-wave', x: gameState.x, y: gameState.y, r: 10, alpha: 1 });
}

function gameLoop() {
    if (!isPlaying) return;
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');

    // 入力更新
    let ax = (keys['ArrowRight'] || keys['KeyD'] ? 1 : 0) - (keys['ArrowLeft'] || keys['KeyA'] ? 1 : 0);
    let ay = (keys['ArrowDown'] || keys['KeyS'] ? 1.2 : 0) - (keys['ArrowUp'] || keys['KeyW'] ? 1 : 0);

    gameState.vx = gameState.vx * 0.90 + ax * 0.55;
    gameState.vy = gameState.vy * 0.90 + ay * 0.55;
    gameState.x = Math.max(25, Math.min(canvas.width - 25, gameState.x + gameState.vx));
    gameState.y = Math.max(30, gameState.y + gameState.vy);
    gameState.depth = Math.floor(gameState.y * 3.2);

    // 酸素計算
    const dFactor = 1 + Math.pow(gameState.depth / 300, 1.4);
    gameState.o2 = Math.max(0, gameState.o2 - 0.04 * dFactor);
    if (gameState.empCooldown > 0) gameState.empCooldown--;

    // 終了判定
    if (gameState.o2 <= 0 || gameState.hp <= 0) {
        isPlaying = false;
        document.getElementById('overlay-title').innerText = '潜水限界・浮上';
        document.getElementById('overlay-desc').innerText = '酸素枯渇または損傷。強化して再挑戦しましょう！';
        document.getElementById('game-overlay').classList.remove('hidden');
    }
    if (gameState.depth >= 1200) {
        isPlaying = false;
        confetti();
        document.getElementById('overlay-title').innerText = '🎉 深淵到達！';
        document.getElementById('overlay-desc').innerText = '最深部で「形見のペンダント」を発見しました！';
        document.getElementById('game-overlay').classList.remove('hidden');
    }

    // HUD更新
    document.getElementById('hud-depth').innerText = gameState.depth + 'm';
    document.getElementById('hud-o2').innerText = Math.round(gameState.o2) + '%';
    document.getElementById('hud-hp').innerText = gameState.hp;
    document.getElementById('hud-red').innerText = gameState.redParts;
    document.getElementById('hud-relic').innerText = gameState.relics + '個';

    // 描画
    ctx.fillStyle = '#020b18';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 深度線
    ctx.strokeStyle = 'rgba(14, 116, 144, 0.2)';
    for (let y = 0; y < canvas.height; y += 80) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // エンティティ更新
    gameState.entities.forEach(e => {
        if (e.frozen > 0) e.frozen--;
        else { e.x += e.vx; if (e.x < 30 || e.x > canvas.width - 30) e.vx *= -1; }

        const dist = Math.hypot(gameState.x - e.x, (gameState.y % 350) - (e.y % 350));
        if (dist < e.radius + 15) {
            if (e.type === 'red') { gameState.redParts++; playAudio('bubble'); e.y = 9999; }
            else if (e.type === 'yellow') { gameState.relics++; playAudio('bubble'); e.y = 9999; }
            else if (e.type === 'white') { gameState.o2 = Math.min(100, gameState.o2 + 25); playAudio('bubble'); e.y = 9999; }
            else if (e.type === 'enemy' && e.frozen <= 0) { gameState.hp -= 20; playAudio('emp'); e.frozen = 60; }
        }

        ctx.beginPath();
        ctx.arc(e.x, e.y % 360, e.radius, 0, Math.PI * 2);
        if (e.type === 'red') ctx.fillStyle = '#ef4444';
        else if (e.type === 'yellow') ctx.fillStyle = '#f59e0b';
        else if (e.type === 'white') ctx.fillStyle = '#fff';
        else ctx.fillStyle = e.frozen > 0 ? '#38bdf8' : '#e11d48';
        ctx.fill();
    });

    // 潜水艦
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.ellipse(gameState.x, gameState.y % 350, 20, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(gameLoop);
}

// キー入力イベント
window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'Space') { e.preventDefault(); triggerGameEMP(); }
});
window.addEventListener('keyup', e => keys[e.code] = false);

// --- 6. 初期化 ---
window.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    renderStats();
    calcOxygen();
    renderFaq();
});
