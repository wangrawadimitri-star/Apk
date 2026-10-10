const fs = require("fs-extra");
const path = require("path");
const DATA = path.join(__dirname, "..", "..", "cache", "slot.json");

function load() {
  fs.ensureDirSync(path.dirname(DATA));
  if (!fs.existsSync(DATA)) fs.writeJsonSync(DATA, {});
  return fs.readJsonSync(DATA);
}
function save(d) { fs.writeJsonSync(DATA, d); }
function fmt(n) {
  if (n >= 1e18) return (n / 1e18).toFixed(2) + "Qi";
  if (n >= 1e15) return (n / 1e15).toFixed(2) + "Qa";
  if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(2) + "k";
  return Math.floor(n).toString();
}
function parseBet(s) {
  if (!s) return null;
  s = s.toString().toLowerCase().replace(/@/g, "").replace(/\$/g, "").trim();
  let m = 1;
  if (s.endsWith("qi")) { m = 1e18; s = s.slice(0, -2); }
  else if (s.endsWith("qa")) { m = 1e15; s = s.slice(0, -2); }
  else if (s.endsWith("q")) { m = 1e15; s = s.slice(0, -1); }
  else if (s.endsWith("k")) { m = 1e3; s = s.slice(0, -1); }
  else if (s.endsWith("m")) { m = 1e6; s = s.slice(0, -1); }
  else if (s.endsWith("b")) { m = 1e9; s = s.slice(0, -1); }
  else if (s.endsWith("t")) { m = 1e12; s = s.slice(0, -1); }
  const n = parseFloat(s); return isNaN(n)? null : n * m;
}

async function doSlot(api, event, bet) {
  const { threadID, messageID, senderID } = event;
  const db = load();
  if (!db[senderID]) db[senderID] = { balance: 150000, spins: 0, maxSpins: 10, lastReset: Date.now() };
  const u = db[senderID];

  if (Date.now() - (u.lastReset || 0) > 86400000) { u.spins = 0; u.lastReset = Date.now(); save(db); }
  if (u.spins >= u.maxSpins) return api.sendMessage(`❌ Tu as fini tes ${u.maxSpins}/10 essais!\n⏳ Reviens demain`, threadID, messageID);
  if (bet > u.balance) return api.sendMessage(`❌ T'as que ${fmt(u.balance)}$`, threadID, messageID);

  const syms = ["🔔", "⭐", "🍒", "💎", "🍀"];
  const r1 = syms[Math.floor(Math.random() * 5)], r2 = syms[Math.floor(Math.random() * 5)], r3 = syms[Math.floor(Math.random() * 5)];
  let win = 0, label = "", emoji = "💸";
  if (r1 === r2 && r2 === r3) { win = bet * 10; label = `JACKPOT ${r1} +${fmt(win)}$ x10`; emoji = "💎"; }
  else if (r1 === r2 || r2 === r3 || r1 === r3) { win = bet * 2; label = `PAIR +${fmt(win)}$ x2`; emoji = "🎉"; }
  else { win = -bet; label = `LOSE -${fmt(bet)}$`; }

  u.balance += win; u.spins++; save(db);
  return api.sendMessage(`▬▬▬▬▬▬▬\n│ 🎰 SLOT [ ${r1} | ${r2} | ${r3} ]\n│ 💰 Bet: ${fmt(bet)}$\n│ ${emoji} ${label}\n│ 💳 ${fmt(u.balance)}$\n│ 🎲 ${u.spins}/${u.maxSpins}\n▬▬▬▬▬▬▬`, threadID, messageID);
}

module.exports = {
  config: {
    name: "slot",
    aliases: ["daa", "cm"],
    version: "11.0",
    author: "Derla",
    role: 0,
    shortDescription: { en: "Jeu slot machine" },
    longDescription: { en: "Jeu slot machine avec pari" },
    category: "game",
    guide: { en: "{pn} 10k | {pn} 1m | slot 10k (sans prefix)" }
  },
  onStart: async function ({ api, event, args }) {
    let bet = null;
    for (let a of args) { let b = parseBet(a); if (b && b > 0) bet = b; }
    if (bet && bet > 0) return doSlot(api, event, bet);
    return api.sendMessage(`🎰 SLOT\nUtilisation:\n• slot 10k\n•.slot 1m\n• slot 1000`, event.threadID, event.messageID);
  },
  onChat: async function ({ api, event }) {
    const body = (event.body || "").toLowerCase().trim();
    if (!body.startsWith("slot ")) return;
    const match = body.match(/slot\s+(\d+(\.\d+)?\s*(?:qi|qa|q|k|m|b|t)?)/i);
    if (!match) return;
    const bet = parseBet(match[1]);
    if (bet) return doSlot(api, event, bet);
  }
};
