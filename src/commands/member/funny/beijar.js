const { PREFIX, OWNER_NUMBER } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { toUserOrGroupJid, onlyNumbers, compareUserJidWithOtherNumber } = require(`${BASE_DIR}/utils`);
const path = require("node:path");
const fs = require("node:fs");
const { ASSETS_DIR } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "beijar",
  description: "Beija um usuário que você ama.",
  commands: ["beijar", "beija", "beijo", "kiss"],
  usage: `${PREFIX}beijar @usuario`,
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
  }) => {
    if (!args.length && !isReply) {
      throw new InvalidParameterError(
        "Você precisa mencionar ou marcar um membro!"
      );
    }

    const targetJid = isReply ? replyJid : toUserOrGroupJid(args[0]);

    if (!targetJid) {
      await sendErrorReply(
        "Você precisa mencionar um usuário ou responder uma mensagem para beijar."
      );

      return;
    }

    // Detecta se o dono é mencionado e usa o número correto
    const isOwnerExecuting = compareUserJidWithOtherNumber({ userJid, otherNumber: OWNER_NUMBER });
    const isOwnerTarget = compareUserJidWithOtherNumber({ userJid: targetJid, otherNumber: OWNER_NUMBER });
    
    const userNumber = isOwnerExecuting ? OWNER_NUMBER : onlyNumbers(userJid || "");
    const targetNumber = isOwnerTarget ? OWNER_NUMBER : onlyNumbers(targetJid || "");
    const caption = `@${userNumber} beijou @${targetNumber}!`;

    const dir = path.resolve(ASSETS_DIR, "images", "funny", "beijar");
    const files = fs.existsSync(dir)
      ? fs.readdirSync(dir).filter((f) => /\.(mp4|gif|webm|mov)$/i.test(f))
      : [];

    const chosen = files.length
      ? files[Math.floor(Math.random() * files.length)]
      : "kiss.mp4";

    const filePath = path.resolve(
      ASSETS_DIR,
      "images",
      "funny",
      files.length ? "beijar" : "",
      chosen
    );

    await sendGifFromFile(filePath, caption, [userJid, targetJid].filter(Boolean));
  },
};
