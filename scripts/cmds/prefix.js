const fs = require("fs-extra");
const { utils } = global;
module.exports = {
  config: {
    name: "prefix",
    version: "2.1",
    author: "Derla kirito",
    role: 0,
    shortDescription: "Prefix décor + tag owner",
    category: "system",
    usePrefix: false
  },
  onStart: async function ({ api, event, args, message, threadsData }) {
    const { threadID } = event;
    let prefix = ".";
    try {
      let data = await threadsData.get(threadID);
      if (data && data.data && data.data.prefix) prefix = data.data.prefix;
    } catch {}

    const uid = "61556932235241";
    const profileLink = "https://www.facebook.com/profile.php?id=61556932235241";

    if (!args[0]) {
      let body =
`╭───『 PREFIX SYSTEM 』───╮
│
│ ✧ Prefix Groupe: ${prefix}
│ ✧ Prefix Global: @
│
├───『 OWNER INFO 』───
│ 👑 Owner: Derla kirito
│ 🆔 Uid: 61556932235241
│ 🔗 Lien: ${profileLink}
│
├─❍ Astuce: Tape prefix! pour changer
│
╰───『 Rem Bot V2.1 』───╯`;

      // Tag cliquable
      return api.sendMessage({
        body: body,
        mentions: [{ tag: "Derla kirito", id: uid }]
      }, threadID);
    }

    let newPrefix = args[0];
    try {
      await threadsData.set(threadID, newPrefix, "data.prefix");
      return api.sendMessage({
        body: `╭───✅ SUCCESS ───╮\n│ Nouveau Prefix: ${newPrefix}\n│\n├─👑 Modifié par Derla kirito\n│ 🆔 ${uid}\n╰────────────────╯`,
        mentions: [{ tag: "Derla kirito", id: uid }]
      }, threadID);
    } catch (e) {
      return message.reply(`❌ Erreur: ${e.message}`);
    }
  },
  onChat: async function ({ api, event, message, threadsData }) {
    if (!event.body) return;
    if (event.senderID == api.getCurrentUserID()) return;
    let body = event.body.trim().toLowerCase();
    if (body === "prefix" || body === "préfix" || body === "préfixe") {
      return this.onStart({ api, event, args: [], message, threadsData });
    }
  }
};
