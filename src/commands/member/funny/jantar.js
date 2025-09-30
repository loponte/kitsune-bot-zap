const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const { toUserOrGroupJid, onlyNumbers } = require(`${BASE_DIR}/utils`);
const path = require("node:path");
const fs = require("node:fs");
const { ASSETS_DIR } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "jantar",
  description: "Convite um usuário para jantar.",
  commands: ["jantar", "janta"],
  usage: `${PREFIX}jantar @usuario`,
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
        "Você precisa mencionar um usuário ou responder uma mensagem para jantar."
      );

      return;
    }

    const userNumber = onlyNumbers(userJid || "");
    const targetNumber = onlyNumbers(targetJid || "");
    const caption = `@${userNumber} foi a um jantar com @${targetNumber}!`;

    const dir = path.resolve(ASSETS_DIR, "images", "funny", "jantar");
    const files = fs.existsSync(dir)
      ? fs.readdirSync(dir).filter((f) => /\.(mp4|gif|webm|mov)$/i.test(f))
      : [];

    const chosen = files.length
      ? files[Math.floor(Math.random() * files.length)]
      : "gintama-gintoki.mp4";

    const filePath = path.resolve(
      ASSETS_DIR,
      "images",
      "funny",
      files.length ? "jantar" : "",
      chosen
    );

    await sendGifFromFile(filePath, caption, [userJid, targetJid].filter(Boolean));
  },
};
