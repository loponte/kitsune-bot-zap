const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { toUserOrGroupJid, onlyNumbers } = require(`${BASE_DIR}/utils`);
const path = require("node:path");
const fs = require("node:fs");
const { ASSETS_DIR } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "socar",
  description: "Bate em um usuário com um soco.",
  commands: ["socar", "soca", "soco", "socao"],
  usage: `${PREFIX}socar @usuario`,
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
        "Você precisa mencionar um usuário ou responder uma mensagem para socar."
      );

      return;
    }

    const userNumber = onlyNumbers(userJid || "");
    const targetNumber = onlyNumbers(targetJid || "");
    const caption = `@${userNumber} deu um soco bombástico em @${targetNumber}!`;

    const dir = path.resolve(ASSETS_DIR, "images", "funny", "socar");
    const files = fs.existsSync(dir)
      ? fs.readdirSync(dir).filter((f) => /\.(mp4|gif|webm|mov)$/i.test(f))
      : [];

    const chosen = files.length
      ? files[Math.floor(Math.random() * files.length)]
      : "some-guy-getting-punch-anime-punching-some-guy-anime.mp4";

    const filePath = path.resolve(
      ASSETS_DIR,
      "images",
      "funny",
      files.length ? "socar" : "",
      chosen
    );

    await sendGifFromFile(filePath, caption, [userJid, targetJid].filter(Boolean));
  },
};
