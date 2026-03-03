// ===== 祝福訊息（13個）=====
const MESSAGES = [
  "生日快樂！願你今年的運氣像 Wi-Fi 一樣滿格📶",
  "願你每個願望都像按電梯一樣：按了就到✨",
  "祝你今年：錢包鼓、睡得飽、煩惱少（標配三件套）",
  "願你被世界溫柔對待，也被自己好好照顧🤍",
  "今天你最大：想吃蛋糕就吃兩塊，沒人能管你😎",
  "願你的人生永遠有轉場特效：帥到發光💫",
  "祝你今年做什麼都順，連排隊都遇到快線",
  "願你遇到的都是好事，壞事都自動略過（skip）",
  "生日快樂！願你每天都能笑到眼睛眯成一條線😆",
  "祝你今年：靈感爆棚、能量爆表、壓力爆掉（掰掰）",
  "願你一路開掛，但還是保持可愛（重點）",
  "願你每一次努力都被看見，每一次溫柔都被回應🌷",
  "祝你今年：喜歡的都買得起，不喜歡的都放得下🫶"
];

// ===== DOM =====
const modal = document.getElementById("modal");
const msgText = document.getElementById("msgText");
const pickedCardChip = document.getElementById("pickedCardChip");
const pickedMsgChip = document.getElementById("pickedMsgChip");
const btnAgain = document.getElementById("btnAgain");
const btnCopy = document.getElementById("btnCopy");

let lastMsgIndex = -1;
let currentCard = null;
let currentMsgIndex = null;

// 隨機抽訊息（避免連續同一句）
function pickMessageIndex() {
  if (MESSAGES.length <= 1) return 0;

  let idx = Math.floor(Math.random() * MESSAGES.length);
  if (idx === lastMsgIndex) {
    idx = (idx + 1 + Math.floor(Math.random() * (MESSAGES.length - 1))) % MESSAGES.length;
  }
  lastMsgIndex = idx;
  return idx;
}

function openModal(cardNo, msgIndex) {
  currentCard = cardNo;
  currentMsgIndex = msgIndex;

  msgText.textContent = MESSAGES[msgIndex];
  pickedCardChip.textContent = `Card #${cardNo}`;
  pickedMsgChip.textContent = `Message #${String(msgIndex + 1).padStart(2, "0")}`;

  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// 卡片點擊
document.querySelectorAll(".card").forEach((btn) => {
  btn.addEventListener("click", () => {
    const cardNo = btn.dataset.card;
    const msgIndex = pickMessageIndex();
    openModal(cardNo, msgIndex);
  });
});

// 關閉（點遮罩或 X）
modal.addEventListener("click", (e) => {
  const close = e.target?.dataset?.close;
  if (close) closeModal();
});

// ESC 關閉
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
    closeModal();
  }
});

// 再抽一句
btnAgain.addEventListener("click", () => {
  const msgIndex = pickMessageIndex();
  openModal(currentCard ?? "?", msgIndex);
});

// 複製祝福
btnCopy.addEventListener("click", async () => {
  const text = msgText.textContent || "";
  try {
    await navigator.clipboard.writeText(text);
    btnCopy.textContent = "已複製 ✅";
    setTimeout(() => (btnCopy.textContent = "複製祝福 📋"), 900);
  } catch {
    // fallback：選取文字讓使用者手動複製
    const range = document.createRange();
    range.selectNodeContents(msgText);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    btnCopy.textContent = "手動複製中 🫣";
    setTimeout(() => (btnCopy.textContent = "複製祝福 📋"), 900);
  }
});
