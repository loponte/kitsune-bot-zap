const { PREFIX } = require(`${BASE_DIR}/config`);
const { badMacHandler } = require(`${BASE_DIR}/utils/badMacHandler`);
const { WarningError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "limpar-sessao",
  description:
    "Remove arquivos de sessão problemáticos do Baileys (preserva creds.json).",
  commands: ["limpar-sessao", "limpar-sessão", "fix-session", "clear-session"],
  usage: `${PREFIX}limpar-sessao`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendSuccessReply, sendWarningReply, isGroup, isGroupWithLid }) => {
    if (isGroupWithLid) {
      throw new WarningError("Este comando não pode ser usado em comunidades.");
    }

    const cleared = badMacHandler.clearProblematicSessionFiles();

    if (cleared) {
      await sendSuccessReply(
        "Arquivos de sessão problemáticos removidos. Reinicie o bot para reconectar."
      );
      return;
    }

    await sendWarningReply(
      "Não havia arquivos de sessão problemáticos para remover ou ocorreu um erro."
    );
  },
};


