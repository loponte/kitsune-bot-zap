/**
 * Direcionador
 * de comandos.
 *
 * @author Dev Lop
 */
const {
  DangerError,
  WarningError,
  InvalidParameterError,
} = require("../errors");
const { findCommandImport } = require(".");
const {
  verifyPrefix,
  hasTypeAndCommand,
  isLink,
  isAdmin,
  checkPermission,
  isBotOwner,
} = require("../middlewares");
const {
  isActiveGroup,
  getAutoResponderResponse,
  isActiveAutoResponderGroup,
  isActiveAntiLinkGroup,
  isActiveOnlyAdmins,
  getPrefix,
} = require("./database");
const { errorLog } = require("../utils/logger");
const path = require("node:path");
const { ONLY_GROUP_ID, BOT_EMOJI, ASSETS_DIR } = require("../config");
const { badMacHandler } = require("./badMacHandler");
const { menuMessage } = require("../menu");

// Evita respostas duplicadas para o mesmo ID de mensagem (eventos repetidos do upsert)
const respondedMessageIds = new Set();
// Cooldown por contato para evitar flood de help no privado
const lastHelpSentAtByJid = new Map();
const HELP_COOLDOWN_MS = 20000; // 20s

/**
 * @param {CommandHandleProps} paramsHandler
 * @param {number} startProcess
 */
exports.dynamicCommand = async (paramsHandler, startProcess) => {
  const {
    commandName,
    fullMessage,
    isLid,
    prefix,
    remoteJid,
    sendErrorReply,
    sendReact,
    sendReply,
    sendImageFromFile,
    sendWarningReply,
    socket,
    userJid,
    webMessage,
  } = paramsHandler;

  const isGroupChat = !!remoteJid?.endsWith("@g.us");

  // Help automático no privado quando a mensagem não for um comando (sem prefixo válido)
  if (!isGroupChat) {
    if (fullMessage && !verifyPrefix(prefix, remoteJid)) {
      const messageId = webMessage?.key?.id;
      if (messageId && respondedMessageIds.has(messageId)) {
        return;
      }

      const now = Date.now();
      const lastAt = lastHelpSentAtByJid.get(remoteJid) || 0;
      if (now - lastAt < HELP_COOLDOWN_MS) {
        return;
      }

      const groupPrefix = getPrefix(remoteJid);
      const imagePath = path.join(ASSETS_DIR, "images", "takeshi-bot.png");

      await sendImageFromFile(
        imagePath,
        `\n\nOlá, para fazer o comando de menu é /menu, mas vou te ajudar e ja te enviar!\n\n${menuMessage(remoteJid)}`
      );

      if (messageId) {
        respondedMessageIds.add(messageId);
      }

      lastHelpSentAtByJid.set(remoteJid, now);

      return;
    }
  }

  const activeGroup = isActiveGroup(remoteJid);

  if (activeGroup && isActiveAntiLinkGroup(remoteJid) && isLink(fullMessage)) {
    if (!userJid) {
      return;
    }

    if (!(await isAdmin({ remoteJid, userJid, socket }))) {
      await socket.groupParticipantsUpdate(remoteJid, [userJid], "remove");

      await sendReply(
        "Anti-link ativado! Você foi removido por enviar um link!"
      );

      await socket.sendMessage(remoteJid, {
        delete: {
          remoteJid,
          fromMe: false,
          id: webMessage.key.id,
          participant: webMessage.key.participant,
        },
      });

      return;
    }
  }

  const { type, command } = findCommandImport(commandName);

  if (ONLY_GROUP_ID && ONLY_GROUP_ID !== remoteJid) {
    return;
  }

  if (activeGroup) {
    if (
      !verifyPrefix(prefix, remoteJid) ||
      !hasTypeAndCommand({ type, command })
    ) {
      if (isActiveAutoResponderGroup(remoteJid)) {
        const response = getAutoResponderResponse(fullMessage);

        if (response) {
          await sendReply(response);
        }
      }

      return;
    }

    if (!(await checkPermission({ type, ...paramsHandler }))) {
      await sendErrorReply(
        "Você não tem permissão para executar este comando!"
      );
      return;
    }

    if (
      isActiveOnlyAdmins(remoteJid) &&
      !(await isAdmin({ remoteJid, userJid, socket }))
    ) {
      await sendWarningReply(
        "Somente administradores podem executar comandos!"
      );
      return;
    }
  }

  if (!isBotOwner({ userJid, isLid }) && !activeGroup) {
    if (
      verifyPrefix(prefix, remoteJid) &&
      hasTypeAndCommand({ type, command })
    ) {
      if (command.name !== "on") {
        await sendWarningReply(
          "Este grupo está desativado! Peça para o dono do grupo ativar o bot!"
        );
        return;
      }

      if (!(await checkPermission({ type, ...paramsHandler }))) {
        await sendErrorReply(
          "Você não tem permissão para executar este comando!"
        );
        return;
      }
    } else {
      return;
    }
  }

  if (!verifyPrefix(prefix, remoteJid)) {
    return;
  }

  const groupPrefix = getPrefix(remoteJid);

  if (fullMessage === groupPrefix) {
    await sendReact(BOT_EMOJI);
    await sendReply(
      `Este é meu prefixo! Use ${groupPrefix}menu para ver os comandos disponíveis!`
    );

    return;
  }

  if (!hasTypeAndCommand({ type, command })) {
    await sendWarningReply(
      `Comando não encontrado! Use ${groupPrefix}menu para ver os comandos disponíveis!`
    );

    return;
  }

  try {
    await command.handle({
      ...paramsHandler,
      type,
      startProcess,
    });
  } catch (error) {
    if (badMacHandler.handleError(error, `command:${command?.name}`)) {
      await sendWarningReply(
        "Erro temporário de sincronização. Tente novamente em alguns segundos."
      );
      return;
    }

    if (badMacHandler.isSessionError(error)) {
      errorLog(
        `Erro de sessão durante execução de comando ${command?.name}: ${error.message}`
      );
      await sendWarningReply(
        "Erro de comunicação. Tente executar o comando novamente."
      );
      return;
    }

    if (error instanceof InvalidParameterError) {
      await sendWarningReply(`Parâmetros inválidos! ${error.message}`);
    } else if (error instanceof WarningError) {
      await sendWarningReply(error.message);
    } else if (error instanceof DangerError) {
      await sendErrorReply(error.message);
    } else if (error.isAxiosError) {
      const messageText = error.response?.data?.message || error.message;
      const url = error.config?.url || "URL não disponível";

      const isSpiderAPIError = url.includes("api.spiderx.com.br");

      await sendErrorReply(
        `Ocorreu um erro ao executar uma chamada remota para ${
          isSpiderAPIError ? "a Spider X API" : url
        } no comando ${command.name}!
      
📄 *Detalhes*: ${messageText}`
      );
    } else {
      errorLog("Erro ao executar comando", error);
      await sendErrorReply(
        `Ocorreu um erro ao executar o comando ${command.name}!
      
📄 *Detalhes*: ${error.message}`
      );
    }
  }
};
