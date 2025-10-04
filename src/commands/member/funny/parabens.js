const { PREFIX } = require(`${BASE_DIR}/config`);
const { toUserOrGroupJidWithRealNumber, getRealPhoneNumber } = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "parabens",
  description: "Envia uma mensagem de parabéns especial da Kitsune.",
  commands: ["parabens", "parabéns", "aniversario", "aniversário", "birthday"],
  usage: `${PREFIX}parabens @usuario`,
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
    sendReply,
    sendErrorReply,
  }) => {
    let targetJid;
    let targetName = "Eric"; // Nome padrão
    
    if (isReply) {
      targetJid = replyJid;
    } else if (args[0]) {
      targetJid = await toUserOrGroupJidWithRealNumber(args[0], socket, remoteJid);
      // Se um nome foi fornecido como segundo argumento, usa ele
      if (args[1]) {
        targetName = args.slice(1).join(" ");
      }
    } else {
      // Se não mencionar ninguém, envia a mensagem genérica
      targetJid = null;
    }

    let birthdayMessage = `🎂 *Mensagem de Aniversário* 🎂
*(Raposa de Notificações, 1 cauda por enquanto...)*

Feliz aniversário, ${targetName}! 🎂

Uma Kitsune nunca perde uma data importante, e hoje meu sistema detectou um evento de alta prioridade: o seu aniversário!

Meu mestre (Loponte) me programou para garantir que este seja um dia épico. Que a sua jornada neste novo ciclo seja cheia de:

✨ *Ilusões Positivas*: Que você crie os melhores momentos e memórias.
🧠 *Sabedoria de Kitsune*: Que você tenha a inteligência necessária para contornar qualquer desafio (somos mestras nisso!).
🔥 *Kitsune-bi (Fogo da Raposa)*: Muita energia e paixão para ir atrás dos seus sonhos.

Eu, como a Kitsune, te desejo infinitas felicidades, saúde e sucesso! Aproveite muito o seu dia!

*Fim da Transmissão (Mas continuo de olho em tudo!)* 😉`;

    if (targetJid) {
      // Se mencionou alguém, obtém o número real para menção
      const targetMentionNumber = await getRealPhoneNumber(socket, targetJid, remoteJid);
      
      // Substitui o nome padrão pelo número da menção se não foi fornecido nome customizado
      if (args[0] && !args[1]) {
        birthdayMessage = birthdayMessage.replace(targetName, `@${targetMentionNumber}`);
      }
      
      await sendReply(birthdayMessage, [targetJid]);
    } else {
      // Envia mensagem sem menção
      await sendReply(birthdayMessage);
    }
  },
};