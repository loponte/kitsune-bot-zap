const { getContent, compareUserJidWithOtherNumber } = require("../utils");
const { errorLog, infoLog } = require("../utils/logger");
const {
  readGroupRestrictions,
  readRestrictedMessageTypes,
} = require("../utils/database");
const { BOT_NUMBER, OWNER_NUMBER, OWNER_LID } = require("../config");

exports.messageHandler = async (socket, webMessage) => {
  try {
    if (!webMessage?.key) {
      return true;
    }

    const { remoteJid, fromMe, id: messageId } = webMessage.key;

    if (fromMe) {
      return true;
    }

    const userJid = webMessage.key?.participant || webMessage.key?.remoteJid;

    if (!userJid) {
      return true;
    }

    const isBotOrOwner =
      compareUserJidWithOtherNumber({ userJid, otherNumber: OWNER_NUMBER }) ||
      compareUserJidWithOtherNumber({ userJid, otherNumber: BOT_NUMBER }) ||
      userJid === OWNER_LID;

    if (isBotOrOwner) {
      return true;
    }

    const antiGroups = readGroupRestrictions();

    const messageType = Object.keys(readRestrictedMessageTypes()).find((type) =>
      getContent(webMessage, type)
    );

    if (!messageType) {
      return true;
    }

    const isAntiActive = !!antiGroups[remoteJid]?.[`anti-${messageType}`];

    if (!isAntiActive) {
      return true;
    }

    await socket.sendMessage(remoteJid, {
      delete: {
        remoteJid,
        fromMe,
        id: messageId,
        participant: userJid,
      },
    });
    return true;
  } catch (error) {
    errorLog(
      `Erro ao processar mensagem restrita. Verifique se eu estou como admin do grupo! Detalhes: ${error.message}`
    );
    return true;
  }
};
