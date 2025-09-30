/**
 * Menu do bot
 *
 * @author Dev Lop
 */
const { BOT_NAME } = require("./config");
const packageInfo = require("../package.json");
const { readMore } = require("./utils");
const { getPrefix } = require("./utils/database");

exports.menuMessage = (groupJid) => {
  const date = new Date();

  const prefix = getPrefix(groupJid);

  return `╭━━⪩ BEM VINDO(A)! ⪨━━${readMore()}
▢
▢ • ${BOT_NAME}
▢ • Data: ${date.toLocaleDateString("pt-br")}
▢ • Prefixo: ${prefix}
▢
╰━━─「🪐」─━━

╭━━⪩ FIGURINHAS ⪨━━
▢
▢ • ${prefix}rename - (renomeia uma figurinha)
▢ • ${prefix}to-image - (transforma uma figurinha estática em imagem)
▢ • ${prefix}sticker - (cria figurinha de imagem, gif ou vídeo)
▢
╰━━─「⭐」─━━

╭━━⪩ PRINCIPAL ⪨━━
▢
▢ • ${prefix}cep - (busca informações de um CEP)
▢ • ${prefix}fake-chat - (faz uma conversa fake)
▢ • ${prefix}gerar-link - (gera um link de conversa)
▢
╰━━─「🚀」─━━

╭━━⪩ BRINCADEIRAS ⪨━━
▢
▢ • ${prefix}abracar - (abraça um usuário)
▢ • ${prefix}beijar - (beija um usuário)
▢ • ${prefix}dado - (joga um dado)
▢ • ${prefix}jantar - (convida um usuário para jantar)
▢ • ${prefix}lutar - (lutar com um usuário)
▢ • ${prefix}socar - (soca um usuário)
▢ • ${prefix}perfil - (mostra o perfil de um usuário)
▢
╰━━─「🎡」─━━

╭━━⪩ ADMINS ⪨━━
▢
▢ • ${prefix}fechar - (somente adms mandam mensagem)
▢ • ${prefix}abrir - (abre o grupo)
▢ • ${prefix}add-auto-responder
▢ • ${prefix}delete-auto-responder
▢ • ${prefix}agendar-mensagem - (agenda uma mensagem)
▢ • ${prefix}welcome (1/0) - (mensagem de boas-vindas)
▢ • ${prefix}exit (1/0) - (mensagem de saida)
▢ • ${prefix}anti-audio (1/0) - (anti-audio)
▢ • ${prefix}anti-document (1/0) - (anti-document)
▢ • ${prefix}anti-event (1/0) - (anti-event)
▢ • ${prefix}anti-image (1/0) - (anti-image)
▢ • ${prefix}anti-link (1/0) - (anti-link)
▢ • ${prefix}anti-product (1/0) - (anti-product)
▢ • ${prefix}anti-sticker (1/0) - (anti-sticker)
▢ • ${prefix}anti-video (1/0) - (anti-video)
▢ • ${prefix}auto-responder (1/0) - (auto-responder)
▢ • ${prefix}only-admin (1/0)
▢ • ${prefix}promover - (promove um usuário)
▢ • ${prefix}rebaixar - (rebaixa um usuário)
▢ • ${prefix}mute - (muta um usuário)
▢ • ${prefix}unmute - (desmuta um usuário)
▢ • ${prefix}ban - (banir um usuário)
▢ • ${prefix}delete - (deleta uma mensagem)
▢ • ${prefix}hidetag - (marcar todos os usuarios)
▢ • ${prefix}limpar - (limpa o chat)
▢ • ${prefix}link-grupo - (mostra o link do grupo)
▢ • ${prefix}list-auto-responder - (lista os auto-responders)
▢
╰━━─「🌙」─━━`;
};
