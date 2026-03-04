const CARD_MESSAGES = {
  1: [
    { text: "恭喜社交瘋狗脫離8年苦海，\n終於遇到好好對你的人！要好好愛惜自己啦！\n祝你生日快樂～熱戀forever～", from: "資屬於你" },
    { text: "華華～生日快樂！\n角落生物區的聊天夥伴～希望你每天都開開心心！\n今年的願望都能如期實現！✿✿✿", from: "Marina" },
    { text: "祝福 華華：\n生日快樂 幸福到永遠～～", from: "Vivian" },
  ],
  2: [
    { text: "TTo 龍包馬麻：\n恭喜邁入30大關🎉生日快樂！\n希望小燒包快快好起來，以後才能騎在你頭上！\n\\祝福龍包一家健康平安//", from: "Jo是愛你" },
    { text: "歡迎加入3字頭的隊伍啦，\n表格開始要填下一個區間了ＸＤＤ\n30歲生日快樂，坐等有天媽媽不想努力了，\n小籠包發達帶你飛！", from: "資屬於你" },
    { text: "葛瑞～\n生日快樂꒰✧₍ᐢ. .ᐢ₎✧꒱", from: "Marina" },
    { text: "祝福 Grace：\n生日快樂 天天Happy～\n寶寶平安健康長大", from: "Vivian" },
  ],
  3: [
    { text: "Ally 生日快樂( ˶ˊᵕˋ)੭♡", from: "Marina" },
    { text: "祝福 Ally：\n生日快樂 事事順心！\n貓貓平安快樂", from: "Vivian" },
    { text: "愛Ｑ包～Ally 生日快樂！\n在業務的威壓下又平安度過一年了 辛苦了！！\n祝你別再被業務糾纏，可以安心快樂度過這一年ＸＤＤ", from: "資屬於你" },
    { text: "To 艾利高\n生日快樂～\n然後新的一年還是得賭博！支持你🎉\n祝你盲盒扭蛋都歐氣爆棚😎\n最後\\奧客戶退散//！", from: "資屬於你" },

  ],
  4: [
    { text: "感謝天使主管罩著軟爛的我們，\n天天都要跟業務還有客戶周旋過招辛苦啦！\n祝你生日快樂，奧客戶通通退散！", from: "資屬於你" },
    { text: "Sunny生日快樂～～\n感覺你都會默默觀察大家的喜好，覺得非常厲害。\n協助其他組的工作的時候，\n覺得你很霸氣的回是他們當天需求太晚提出，\n不用讓我加班做，真是太讚了!!\n", from: "Marina" },
    { text: "祝福 Sunny：\n生日快樂 心想事成～！！", from: "Vivian" },

  ],
  5: [
    { text: "Ann～生日快樂^⑉･-･⑉^ ੭", from: "Marina" },
    { text: "祝福 Ann：\n生日快樂 天天開心", from: "Vivian" },
    { text: "To 安安\nㄋㄏㄢㄢㄕㄖㄎㄌ！！\n今年很可惜不能一起幫你慶生🥲祝你順順利利！\n等待你回歸～～", from: "Jo是愛你" },
  ],
};


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
let currentPool = [];
let currentMsgIndex = 0;

// 避免同一張卡連續抽到同一句
const lastMsgIndexByCard = Object.create(null);

function getPool(cardNo) {
  return CARD_MESSAGES[Number(cardNo)] || [];
}

function pickMessageIndexNoRepeat(pool, cardNo) {
  if (!pool || pool.length <= 1) return 0;

  let idx = Math.floor(Math.random() * pool.length);
  const last = lastMsgIndexByCard[cardNo];

  if (typeof last === "number" && idx === last) idx = (idx + 1) % pool.length;
  lastMsgIndexByCard[cardNo] = idx;
  return idx;
}

function renderMessage() {
  if (!currentPool || currentPool.length === 0) {
    msgText.textContent = "（這張卡目前還沒放祝福🥲）";
    fromLine.textContent = "From：（未署名）";
    return;
  }

  const m = currentPool[currentMsgIndex];
  // 支援換行：在 text 內寫 "\\n"（兩個字元：\ + n）
  msgText.innerHTML = String(m.text ?? "").replace(/\n/g, "<br>");
  fromLine.textContent = m.from ? `From：${m.from}` : "From：（未署名）";
}

function openModal(cardNo, msgIndex) {
  currentCard = cardNo;
  currentPool = getPool(cardNo);

  if (!currentPool || currentPool.length === 0) {
    currentMsgIndex = 0;
  } else {
    const safe = Number(msgIndex) || 0;
    currentMsgIndex = ((safe % currentPool.length) + currentPool.length) % currentPool.length;
  }

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
  if (!currentPool || currentPool.length === 0) return;
  currentMsgIndex = (currentMsgIndex - 1 + currentPool.length) % currentPool.length;
  renderMessage();
}
function nextMsg() {
  if (!currentPool || currentPool.length === 0) return;
  currentMsgIndex = (currentMsgIndex + 1) % currentPool.length;
  renderMessage();
}
btnPrev.addEventListener("click", prevMsg);
btnNext.addEventListener("click", nextMsg);

// 隨機一則
btnRandom.addEventListener("click", () => {
  if (!currentPool || currentPool.length === 0) return;
  currentMsgIndex = pickMessageIndexNoRepeat(currentPool, currentCard);
  renderMessage();
});

// 複製（含 From）
btnCopy.addEventListener("click", async () => {
  if (!currentPool || currentPool.length === 0) return;

  const m = currentPool[currentMsgIndex];
  const text = m.from ? `${m.text}
From：${m.from}` : String(m.text ?? "");

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
    const pool = getPool(cardNo);
    const msgIndex = pickMessageIndexNoRepeat(pool, cardNo);

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

const CONFETTI_PALETTE = [160, 190, 320, 45];

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

function spawnConfettiBurst(count = 90) {
  if (!confettiCanvas) return;

  const w = window.innerWidth;
  const h = window.innerHeight;

  const originX = w * 0.5;
  const originY = h * 0.4;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2; // 0~360°
    const speed = 2.8 + Math.random() * 4.2;  // 不要太爆
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    const g = 0.03 + Math.random() * 0.05; // 稍微往下墜

    confettiPieces.push({
      x: originX,
      y: originY,
      vx, vy, g,
      w: 3 + Math.random() * 4,
      h: 7 + Math.random() * 7,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.18,
      life: 180 + Math.floor(Math.random() * 90),
      t: 0,
      hue: CONFETTI_PALETTE[Math.floor(Math.random() * CONFETTI_PALETTE.length)],
      alpha: 0.9
    });
  }
}

function drawConfettiFrame(now) {
  if (!confettiCtx || !confettiCanvas) return;

  const w = window.innerWidth;
  const h = window.innerHeight;

  confettiCtx.clearRect(0, 0, w, h);

  if (now < confettiActiveUntil) {
    if (confettiPieces.length < 180 && now % 2 < 1) {
      spawnConfettiBurst(4);
    }
  }

  for (let i = confettiPieces.length - 1; i >= 0; i--) {
    const p = confettiPieces[i];
    p.t++;

    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.g;
    p.rot += p.vr;

    p.vx *= 0.99;
    p.vy *= 0.99;

    const lifeAlpha = Math.max(0, 1 - p.t / p.life) * p.alpha;

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rot);

    confettiCtx.fillStyle = `hsla(${p.hue}, 70%, 65%, ${lifeAlpha})`;
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

  // ✅ 中央噴灑：不要太密、不要太花
  confettiPieces = [];
  spawnConfettiBurst(90);

  // 小補貨 2.2 秒，讓視覺更滑順（但不會越來越多）
  confettiActiveUntil = performance.now() + 2200;

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
