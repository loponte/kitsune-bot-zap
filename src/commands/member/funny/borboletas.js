const { PREFIX } = require(`${BASE_DIR}/config`);
const { WarningError } = require(`${BASE_DIR}/errors`);
const axios = require("axios");

module.exports = {
  name: "borboletas",
  description: "Envia uma imagem aleatória de borboletas na natureza.",
  commands: ["borboletas", "borboleta", "butterfly"],
  usage: `${PREFIX}borboletas`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    socket,
    remoteJid,
    sendErrorReply,
  }) => {
    try {
      // Usando a API do Unsplash para buscar imagens de borboletas
      const accessKey = "pdrq0Of5R-wAq8yhN3WY0tA7YH0RWc9URlOjxdT6D3c"; // Substitua pela sua chave da API
      const searchTerms = ["butterfly", "butterfly nature", "butterfly flower", "butterfly garden", "butterfly plant"];
      const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
      
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(randomTerm)}&per_page=30&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${accessKey}`
          }
        }
      );

      const data = response.data;
      
      if (!data.results || data.results.length === 0) {
        throw new WarningError("Nenhuma imagem de borboleta foi encontrada no momento.");
      }

      // Seleciona uma imagem aleatória dos resultados
      const randomPhoto = data.results[Math.floor(Math.random() * data.results.length)];
      const imageUrl = randomPhoto.urls.regular;
      const photographer = randomPhoto.user.name;
      const photographerProfile = randomPhoto.user.links.html;

      // Monta a legenda com créditos (obrigatório pela API do Unsplash)
      const caption = `🦋 *Borboleta na Natureza* 🦋\n\n📸 Foto por: ${photographer}\n🔗 Unsplash: ${photographerProfile}?utm_source=kitsune-bot&utm_medium=referral`;

      // Envia a imagem
      await socket.sendMessage(remoteJid, {
        image: { url: imageUrl },
        caption: caption
      });

      // Registra o download conforme as diretrizes da API do Unsplash
      if (randomPhoto.links.download_location) {
        axios.get(randomPhoto.links.download_location, {
          headers: {
            'Authorization': `Client-ID ${accessKey}`
          }
        }).catch(() => {}); // Ignora erros no registro de download
      }

    } catch (error) {
      console.error("Erro no comando borboletas:", error);
      
      if (error instanceof WarningError) {
        return sendErrorReply(error.message);
      }
      
      return sendErrorReply("Ocorreu um erro ao buscar a imagem de borboleta. Tente novamente mais tarde.");
    }
  },
};