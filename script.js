const MESSAGES = [
  { text: "生日快樂！願你今年的運氣像宇宙補給一樣源源不絕🚀", from: "宇宙司令部" },
  { text: "願你每個願望都像任務指令：收到、執行、成功✅", from: "K小隊" },
  { text: "祝你今年：睡飽、吃好、心情穩定（像基地系統一樣）", from: "值星官" },
  { text: "願你被世界溫柔對待，也被自己好好照顧🤍", from: "溫柔派代表" },
  { text: "今天你最大：想吃蛋糕就吃兩塊，這是軍令😎", from: "甜點軍法處" },
  { text: "願你的人生永遠有帥氣進場特效：閃亮到發光💫", from: "舞台組" },
  { text: "祝你今年做什麼都順，連排隊都遇到快線", from: "時間管理部" },
  { text: "願你遇到的都是好事，壞事都自動略過（skip）", from: "系統管理員" },
  { text: "生日快樂！願你每天都能笑到眼睛眯成一條線😆", from: "快樂供應商" },
  { text: "祝你今年：靈感爆棚、能量爆表、壓力爆掉（掰）", from: "能量補給站" },
  { text: "願你一路開掛，但還是保持可愛（重點）", from: "可愛稽查隊" },
  { text: "願你每一次努力都被看見，每一次溫柔都被回應🌷", from: "你身邊的人" },
  { text: "祝你今年：喜歡的都買得起，不喜歡的都放得下🫶", from: "理財&放下小組" }
];

// ===== DOM =====
const modal = document.getElementById("modal");
const msgText = document.getElementById("msgText");
const fromLine = document.getElementById("fromLine");

const btnRandom = document.getElementById("btnRandom");
const btnCopy = document.getElementById("btnCopy");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");

// ===== 狀態 =====
let currentCard = null;
let currentMsgIndex = 0;

// 避免連續抽到同一句（隨機用）
let lastMsgIndex = -1;
function pickMessageIndexNoRepeat() {
  if (MESSAGES.length <= 1) return 0;
  let idx = Math.floor(Math.random() * MESSAGES.length);
  if (idx === lastMsgIndex) idx = (idx + 1) % MESSAGES.length;
  lastMsgIndex = idx;
  return idx;
}

function renderMessage() {
  const m = MESSAGES[currentMsgIndex];
  msgText.textContent = m.text;
  fromLine.textContent = m.from ? `From：${m.from}` : "From：（未署名）";
}

function openModal(cardNo, msgIndex) {
  currentCard = cardNo;
  currentMsgIndex = msgIndex;
  renderMessage();

  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// 關閉：遮罩或 X
modal.addEventListener("click", (e) => {
  if (e.target?.dataset?.close) closeModal();
});

// 左右切換
function prevMsg() {
  currentMsgIndex = (currentMsgIndex - 1 + MESSAGES.length) % MESSAGES.length;
  renderMessage();
}
function nextMsg() {
  currentMsgIndex = (currentMsgIndex + 1) % MESSAGES.length;
  renderMessage();
}
btnPrev.addEventListener("click", prevMsg);
btnNext.addEventListener("click", nextMsg);

// 隨機一則
btnRandom.addEventListener("click", () => {
  currentMsgIndex = pickMessageIndexNoRepeat();
  renderMessage();
});

// 複製（含 From）
btnCopy.addEventListener("click", async () => {
  const m = MESSAGES[currentMsgIndex];
  const text = m.from ? `${m.text}\nFrom：${m.from}` : m.text;

  try {
    await navigator.clipboard.writeText(text);
    btnCopy.textContent = "已複製 ✅";
    setTimeout(() => (btnCopy.textContent = "複製祝福 📋"), 900);
  } catch {
    btnCopy.textContent = "複製失敗 🫣";
    setTimeout(() => (btnCopy.textContent = "複製祝福 📋"), 900);
  }
});

// 鍵盤支援
window.addEventListener("keydown", (e) => {
  const opened = modal.getAttribute("aria-hidden") === "false";
  if (!opened) return;

  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowLeft") prevMsg();
  if (e.key === "ArrowRight") nextMsg();
});

// ===== 卡片：翻牌後才開彈窗 =====
document.querySelectorAll(".card").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.disabled) return;
    btn.disabled = true;

    const cardNo = btn.dataset.card;
    const msgIndex = pickMessageIndexNoRepeat();

    btn.classList.add("is-flipping");

    const FLIP_MS = 720; // 對齊 CSS transition
    setTimeout(() => {
      openModal(cardNo, msgIndex);

      setTimeout(() => {
        btn.classList.remove("is-flipping");
        btn.disabled = false;
      }, 260);
    }, FLIP_MS);
  });
});

// ===== 流星雨 Canvas：方向統一 + 分布平均 =====
const canvas = document.getElementById("meteorCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const meteors = [];

/**
 * ✅ 統一方向：固定「往右下」斜飛
 * 入口：沿著畫面上邊 + 左邊平均灑點進來（分布會很平均）
 */
function spawnMeteor() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  // 入口只取 TOP 或 LEFT，平均選
  const fromTop = Math.random() < 0.5;

  let x, y;
  if (fromTop) {
    x = Math.random() * w;
    y = -60 - Math.random() * 120;
  } else {
    x = -60 - Math.random() * 120;
    y = Math.random() * h;
  }

  const len = 110 + Math.random() * 180;
  const speed = 7 + Math.random() * 9;
  const life = 45 + Math.random() * 35;
  const width = 1.1 + Math.random() * 1.8;

  // 方向統一：往右下（角度在 35°~55°之間微幅飄）
  const angle = (Math.PI / 180) * (35 + Math.random() * 20);
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;

  meteors.push({ x, y, vx, vy, len, life, width, t: 0 });
}

let tick = 0;
function loop() {
  tick++;

  // 常駐小雨 + 偶爾小爆發
  if (Math.random() < 0.035) spawnMeteor();
  if (tick % 260 === 0) {
    const burst = 5 + Math.floor(Math.random() * 6);
    for (let i = 0; i < burst; i++) setTimeout(spawnMeteor, i * 120);
  }

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let i = meteors.length - 1; i >= 0; i--) {
    const m = meteors[i];
    m.t++;
    m.x += m.vx;
    m.y += m.vy;

    const alpha = Math.max(0, 1 - m.t / m.life);

    const x2 = m.x - m.vx * (m.len / 10);
    const y2 = m.y - m.vy * (m.len / 10);

    const grad = ctx.createLinearGradient(m.x, m.y, x2, y2);
    grad.addColorStop(0, `rgba(255,255,255,${0.9 * alpha})`);
    grad.addColorStop(0.4, `rgba(124,255,178,${0.55 * alpha})`);
    grad.addColorStop(1, `rgba(49,231,255,0)`);

    ctx.strokeStyle = grad;
    ctx.lineWidth = m.width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    if (m.t > m.life || m.x > window.innerWidth + 400 || m.y > window.innerHeight + 400) {
      meteors.splice(i, 1);
    }
  }

  requestAnimationFrame(loop);
}
loop();

// ===== 進站圖片 Popup：可 X 關閉 + 5 秒自動消失 =====
const entryPopup = document.getElementById("entryPopup");
const popupCloseBtn = document.getElementById("popupCloseBtn");

let popupTimer = null;

function closeEntryPopup() {
  if (!entryPopup) return;

  entryPopup.setAttribute("aria-hidden", "true");
  stopConfetti();

  if (popupTimer) {
    clearTimeout(popupTimer);
    popupTimer = null;
  }
}

// 點 X 關閉
popupCloseBtn?.addEventListener("click", closeEntryPopup);

// （可選）點黑色遮罩也關閉：想要就保留，不想要就刪掉
entryPopup?.addEventListener("click", (e) => {
  if (e.target?.classList?.contains("popupOverlay")) closeEntryPopup();
});

// 頁面載入後彈出
window.addEventListener("load", () => {
  openEntryPopup();
});

// ===== Confetti（在 Popup 圖片後面）=====
const confettiCanvas = document.getElementById("confettiCanvas");
const confettiCtx = confettiCanvas?.getContext("2d");

let confettiRAF = null;
let confettiActiveUntil = 0;
let confettiPieces = [];
let confettiStartAt = 0;

function resizeConfettiCanvas() {
  if (!confettiCanvas || !confettiCtx) return;

  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const w = window.innerWidth;
  const h = window.innerHeight;

  confettiCanvas.width = Math.floor(w * dpr);
  confettiCanvas.height = Math.floor(h * dpr);
  confettiCanvas.style.width = w + "px";
  confettiCanvas.style.height = h + "px";

  confettiCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function spawnConfettiWave(count = 220) {
  if (!confettiCanvas) return;

  const w = window.innerWidth;
  const h = window.innerHeight;

  for (let i = 0; i < count; i++) {
    // 讓彩帶「一進站就佈滿整個畫面」：從畫面上方到中段隨機生成
    const x = Math.random() * w;
    const y = -Math.random() * (h * 0.6);

    const vx = (Math.random() - 0.5) * 1.6;      // 左右飄
    const vy = 2.2 + Math.random() * 4.6;        // 下落速度
    const g = 0.02 + Math.random() * 0.05;       // 重力

    confettiPieces.push({
      x, y, vx, vy, g,
      w: 6 + Math.random() * 8,
      h: 10 + Math.random() * 14,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.22,
      life: 260 + Math.floor(Math.random() * 140),
      t: 0,
      hue: Math.floor(Math.random() * 360),
      alpha: 0.95
    });
  }
}

function drawConfettiFrame(now) {
  if (!confettiCtx || !confettiCanvas) return;

  const w = window.innerWidth;
  const h = window.innerHeight;

  confettiCtx.clearRect(0, 0, w, h);

  // 在前幾秒持續補貨，讓畫面保持「一直有彩帶」
  if (now < confettiActiveUntil) {
    // 避免太多顆卡住：上限 520
    if (confettiPieces.length < 520) {
      spawnConfettiWave(10);
    }
  }

  for (let i = confettiPieces.length - 1; i >= 0; i--) {
    const p = confettiPieces[i];
    p.t++;

    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.g;
    p.rot += p.vr;

    const lifeAlpha = Math.max(0, 1 - p.t / p.life) * p.alpha;

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rot);

    confettiCtx.fillStyle = `hsla(${p.hue}, 95%, 62%, ${lifeAlpha})`;
    confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);

    confettiCtx.restore();

    // 清掉離場的
    if (p.t > p.life || p.y > h + 120 || p.x < -120 || p.x > w + 120) {
      confettiPieces.splice(i, 1);
    }
  }

  // 還有彩帶或仍在補貨期就繼續
  if (confettiPieces.length > 0 || now < confettiActiveUntil) {
    confettiRAF = requestAnimationFrame(drawConfettiFrame);
  } else {
    confettiCtx.clearRect(0, 0, w, h);
    confettiRAF = null;
  }
}

function startConfetti() {
  if (!confettiCanvas || !confettiCtx) return;

  resizeConfettiCanvas();

  // 先鋪一波，立刻滿版
  confettiPieces = [];
  spawnConfettiWave(260);

  // 接著 4.8 秒內持續補貨，直到 popup 自動關閉差不多時間
  confettiActiveUntil = performance.now() + 4800;

  if (confettiRAF) cancelAnimationFrame(confettiRAF);
  confettiRAF = requestAnimationFrame(drawConfettiFrame);
}

function stopConfetti() {
  if (!confettiCanvas || !confettiCtx) return;
  if (confettiRAF) cancelAnimationFrame(confettiRAF);
  confettiRAF = null;
  confettiActiveUntil = 0;
  confettiPieces = [];
  confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", () => {
  const opened = entryPopup?.getAttribute("aria-hidden") === "false";
  if (opened) resizeConfettiCanvas();
});



function setRealVh() {
  document.documentElement.style.setProperty("--real-vh", `${window.innerHeight}px`);
}
window.addEventListener("resize", setRealVh);
window.addEventListener("orientationchange", setRealVh);
setRealVh();


function openEntryPopup() {
  if (!entryPopup) return;

  entryPopup.setAttribute("aria-hidden", "false");

  requestAnimationFrame(() => {
    resizeConfettiCanvas();
    startConfetti();
  });

  popupTimer = setTimeout(() => {
    closeEntryPopup();
  }, 5000);
}
