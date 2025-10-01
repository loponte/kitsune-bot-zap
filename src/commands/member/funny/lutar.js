const { PREFIX, ASSETS_DIR } = require(`${BASE_DIR}/config`);
const { InvalidParameterError, WarningError } = require(`${BASE_DIR}/errors`);
const { toUserOrGroupJidWithRealNumber, getRealPhoneNumber } = require(`${BASE_DIR}/utils`);
const path = require("node:path");
const fs = require("node:fs");

module.exports = {
  name: "lutar",
  description: "Luta com um usuário.",
  commands: ["lutar", "fight"],
  usage: `${PREFIX}lutar @usuario`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    sendGifFromFile,
    sendGifFromURL,
    sendErrorReply,
    userJid,
    replyJid,
    args,
    isReply,
    socket,
    remoteJid,
  }) => {
    let targetJid;
    
    if (isReply) {
      targetJid = replyJid;
    } else if (args[0]) {
      // Passa o remoteJid (groupJid) para a função
      targetJid = await toUserOrGroupJidWithRealNumber(args[0], socket, remoteJid);
    } else {
      throw new InvalidParameterError(
        "Você precisa mencionar alguém ou responder a uma mensagem!"
      );
    }

    if (!targetJid) {
      await sendErrorReply(
        "Você precisa mencionar um usuário ou responder uma mensagem para lutar."
      );

      return;
    }

    // Obter números reais usando a nova função
    const userMentionNumber = await getRealPhoneNumber(socket, userJid, remoteJid);
    const targetMentionNumber = await getRealPhoneNumber(socket, targetJid, remoteJid);
    
    const caption = `@${userMentionNumber} lutou com @${targetMentionNumber}!`;

    const dir = path.resolve(ASSETS_DIR, "images", "funny", "lutar");
    const files = fs.existsSync(dir)
      ? fs.readdirSync(dir).filter((file) => file.endsWith(".mp4"))
      : [];

    if (files.length === 0) {
      throw new WarningError(
        "Nenhum GIF de luta foi encontrado na pasta de assets."
      );
    }

    const randomFile = files[Math.floor(Math.random() * files.length)];
    const filePath = path.resolve(dir, randomFile);

    await sendGifFromFile(filePath, caption, [userJid, targetJid], true);
  },
};
