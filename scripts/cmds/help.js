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

    // Si pas d'argument => afficher le prefix
    if (!args[0]) {
      let body = `╭──『 PREFIX SYSTEM 』──╮
│
│ ✧ Prefix Groupe: ${prefix}
│ ✧ Prefix Global:.
│
╰──『 OWNER INFO 』──╯
│ 👑 Owner: Derla kirito
│ 🆔 Uid: ${uid}
│ 🔗 Lien: ${profileLink}
│
├─○ Astuce: Tape prefix set [nouveau prefix] pour changer
│
╰──『 Rem Bot V2.1 』──╯`;
      return message.reply(body);
    }

    // Changer le prefix: prefix set!
    if (args[0].toLowerCase() === "set" || args[0].toLowerCase() === "change") {
      let newPrefix = args[1];
      if (!newPrefix) return message.reply("❌ Mets un nouveau prefix! Ex: prefix set!");

      try {
        await threadsData.set(threadID, { data: { prefix: newPrefix } }, true);
        // Pour que Goat se souvienne aussi sur github
        await threadsData.set(threadID, newPrefix, "data.prefix");

        return message.reply(`✅ Nouveau prefix du groupe changé en: ${newPrefix}\nLe bot va s'en souvenir même après redémarrage.`);
      } catch (e) {
        return message.reply("❌ Erreur en sauvegardant le prefix: " + e.message);
      }
    }

    // Si l'utilisateur tape directement le nouveau prefix
    if (args[0].length === 1) {
       await threadsData.set(threadID, { data: { prefix: args[0] } }, true);
       return message.reply(`✅ Prefix changé en: ${args[0]}`);
    }
  }
};
