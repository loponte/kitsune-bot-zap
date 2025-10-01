const { PREFIX, ASSETS_DIR } = require(`${BASE_DIR}/config`);
const { InvalidParameterError, WarningError } = require(`${BASE_DIR}/errors`);
const { toUserOrGroupJidWithRealNumber, getRealPhoneNumber } = require(`${BASE_DIR}/utils`);
const path = require("node:path");
const fs = require("node:fs");

module.exports = {
  name: "beijar",
  description: "Beija um usuário que você ama.",
  commands: ["beijar", "beijo", "kiss"],
  usage: `${PREFIX}beijar @usuario`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    args,
    isReply,
    replyJid,
    userJid,
    remoteJid,
    socket,
    sendGifFromFile,
    sendErrorReply,
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



    // Obtém os números reais para exibição
    const userMentionNumber = await getRealPhoneNumber(socket, userJid, remoteJid);
    const targetMentionNumber = await getRealPhoneNumber(socket, targetJid, remoteJid);



    if (userJid === targetJid) {
      return sendErrorReply("Você não pode beijar a si mesmo! 😅");
    }

    const caption = `@${userMentionNumber} beijou @${targetMentionNumber}!`;

    const dir = path.resolve(ASSETS_DIR, "images", "funny", "beijar");
    const files = fs.existsSync(dir)
      ? fs.readdirSync(dir).filter((file) => file.endsWith(".mp4"))
      : [];

    if (files.length === 0) {
      throw new WarningError(
        "Nenhum GIF de beijo foi encontrado na pasta de assets."
      );
    }

    const randomFile = files[Math.floor(Math.random() * files.length)];
    const filePath = path.resolve(dir, randomFile);

    await sendGifFromFile(filePath, caption, [userJid, targetJid], true);
  },
};
