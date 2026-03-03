// ===== 祝福訊息（13）=====
const MESSAGES = [
  "生日快樂！願你今年的運氣像宇宙補給一樣源源不絕🚀",
  "願你每個願望都像任務指令：收到、執行、成功✅",
  "祝你今年：睡飽、吃好、心情穩定（像基地系統一樣）",
  "願你被世界溫柔對待，也被自己好好照顧🤍",
  "今天你最大：想吃蛋糕就吃兩塊，這是軍令😎",
  "願你的人生永遠有帥氣進場特效：閃亮到發光💫",
  "祝你今年做什麼都順，連排隊都遇到快線",
  "願你遇到的都是好事，壞事都自動略過（skip）",
  "生日快樂！願你每天都能笑到眼睛眯成一條線😆",
  "祝你今年：靈感爆棚、能量爆表、壓力爆掉（掰）",
  "願你一路開掛，但還是保持可愛（重點）",
  "願你每一次努力都被看見，每一次溫柔都被回應🌷",
  "祝你今年：喜歡的都買得起，不喜歡的都放得下🫶"
];

// ===== DOM =====
const modal = document.getElementById("modal");
const msgText = document.getElementById("msgText");
const fromLine = document.getElementById("fromLine");
const pickedCardChip = document.getElementById("pickedCardChip");
const pickedMsgChip = document.getElementById("pickedMsgChip");

const btnRandom = document.getElementById("btnRandom");
const btnCopy = document.getElementById("btnCopy");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");

const fromInput = document.getElementById("fromInput");
const fromClear = document.getElementById("fromClear");

// ===== 狀態 =====
let currentCard = null;
let currentMsgIndex = 0;

// 避免連續同一句（用於隨機）
let lastMsgIndex = -1;
function pickMessageIndexNoRepeat() {
  if (MESSAGES.length <= 1) return 0;
  let idx = Math.floor(Math.random() * MESSAGES.length);
  if (idx === lastMsgIndex) idx = (idx + 1) % MESSAGES.length;
  lastMsgIndex = idx;
  return idx;
}

function getFromText() {
  const v = (fromInput?.value || "").trim();
  return v ? `From：${v}` : "";
}

function renderMessage() {
  msgText.textContent = MESSAGES[currentMsgIndex];
  pickedCardChip.textContent = `Card #${currentCard ?? "?"}`;
  pickedMsgChip.textContent = `Message #${String(currentMsgIndex + 1).padStart(2, "0")} / 13`;

  const f = getFromText();
  fromLine.textContent = f ? f : "From：（未署名）";
  fromLine.style.opacity = f ? "1" : ".75";
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

// 署名即時更新（彈窗開著時也會同步）
fromInput?.addEventListener("input", () => {
  if (modal.getAttribute("aria-hidden") === "false") renderMessage();
});
fromClear?.addEventListener("click", () => {
  fromInput.value = "";
  if (modal.getAttribute("aria-hidden") === "false") renderMessage();
});

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

// 複製（會帶 From）
btnCopy.addEventListener("click", async () => {
  const main = msgText.textContent || "";
  const f = getFromText();
  const text = f ? `${main}\n${f}` : main;

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
  if (opened) {
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") prevMsg();
    if (e.key === "ArrowRight") nextMsg();
  }
});

// ===== 卡片：翻牌後才開彈窗 =====
document.querySelectorAll(".card").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.disabled) return;

    // 先鎖住，避免連點把宇宙打結
    btn.disabled = true;

    const cardNo = btn.dataset.card;
    const msgIndex = pickMessageIndexNoRepeat();

    // 開始翻牌
    btn.classList.add("is-flipping");

    // 翻牌時間（對齊 CSS transition 0.72s）
    const FLIP_MS = 720;

    // 翻完再跳祝福
    setTimeout(() => {
      openModal(cardNo, msgIndex);

      // 小延遲後翻回來，並解鎖
      setTimeout(() => {
        btn.classList.remove("is-flipping");
        btn.disabled = false;
      }, 260);
    }, FLIP_MS);
  });
});

// ===== 流星雨 Canvas（沿用）=====
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
function spawnMeteor() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  const x = w + Math.random() * w * 0.2;
  const y = Math.random() * h * 0.35;

  const len = 120 + Math.random() * 160;
  const speed = 8 + Math.random() * 10;
  const angle = Math.PI * (0.70 + Math.random() * 0.08);
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;

  const life = 40 + Math.random() * 30;
  const width = 1.2 + Math.random() * 1.8;

  meteors.push({ x, y, vx, vy, len, life, width, t: 0 });
}

let tick = 0;
function loop() {
  tick++;

  if (Math.random() < 0.04) spawnMeteor();
  if (tick % 240 === 0) {
    const burst = 6 + Math.floor(Math.random() * 6);
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

    if (m.t > m.life || m.x < -300 || m.y > window.innerHeight + 300) {
      meteors.splice(i, 1);
    }
  }

  requestAnimationFrame(loop);
}
loop();
