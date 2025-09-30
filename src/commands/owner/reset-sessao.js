const { PREFIX } = require(`${BASE_DIR}/config`);
const fs = require("node:fs");
const path = require("node:path");
const { WarningError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "reset-sessao",
  description: "Apaga TUDO da pasta de sessão do Baileys (precisará ler o QR novamente).",
  commands: ["reset-sessao", "reset-sessão", "hard-reset-session"],
  usage: `${PREFIX}reset-sessao`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendWarningReply, sendSuccessReply, isGroupWithLid }) => {
    if (isGroupWithLid) {
      throw new WarningError("Este comando não pode ser usado em comunidades.");
    }

    const baileysFolder = path.resolve(process.cwd(), "assets", "auth", "baileys");

    try {
      if (!fs.existsSync(baileysFolder)) {
        await sendWarningReply("Pasta de sessão não encontrada.");
        return;
      }

      for (const file of fs.readdirSync(baileysFolder)) {
        const filePath = path.join(baileysFolder, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      }

      await sendSuccessReply(
        "Sessão apagada com sucesso. Reinicie o bot e faça login escaneando o QR."
      );
    } catch (error) {
      await sendWarningReply(`Falha ao apagar sessão: ${error.message}`);
    }
  },
};
