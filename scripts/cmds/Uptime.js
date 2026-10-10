const os = require("os");

module.exports = {
  config: {
    name: "uptime",
    version: "2.0",
    author: "Derla x Meta AI",
    countDown: 5,
    role: 0,
    shortDescription: "Uptime stylé",
    longDescription: "Affiche l'uptime avec décor",
    category: "system"
  },

  onStart: async function ({ api, event }) {
    const uptimeSec = process.uptime();
    const d = Math.floor(uptimeSec / 86400);
    const h = Math.floor((uptimeSec % 86400) / 3600);
    const m = Math.floor((uptimeSec % 3600) / 60);
    const s = Math.floor(uptimeSec % 60);

    const memUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const cpu = os.cpus()[0].model;
    const ping = Date.now() - event.timestamp;

    const msg = `
╭───『 ⏰ 𝗨𝗣𝗧𝗜𝗠𝗘 𝗦𝗬𝗦𝗧𝗘𝗠 』───╮
│
│ 🤖 𝗕𝗢𝗧 : ${global.GoatBot.config.nickNameBot || "En Ligne ✅"}
│
│ ┌─⏳ 𝗧𝗘𝗠𝗣𝗦 𝗗'𝗔𝗖𝗧𝗜𝗩𝗜𝗧𝗘
│ │ 📅 ${d} Jour(s)
│ │ 🕒 ${h} Heure(s)
│ │ ⏱️ ${m} Minute(s)
│ │ ⚡ ${s} Seconde(s)
│ └───────────────
│
│ ┌─💻 𝗦𝗬𝗦𝗧𝗘𝗠𝗘
│ │ 🧠 CPU : ${os.arch()}
│ │ 💾 RAM : ${memUsed} MB / ${(os.totalmem()/1024/1024/1024).toFixed(1)} GB
│ │ 🖥️ OS : ${os.type()} ${os.release()}
│ │ 📶 PING : ${ping} ms
│ └───────────────
│
│ 🌍 Heure BF : ${new Date().toLocaleTimeString("fr-FR", {timeZone: "Africa/Ouagadougou"})}
│
╰───『 ✨ 𝗗𝗘𝗥𝗟𝗔 𝗕𝗢𝗧 ✨ 』───╯
`.trim();

    return api.sendMessage(msg, event.threadID, event.messageID);
  }
};
