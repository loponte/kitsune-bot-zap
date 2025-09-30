/**
 * Serviço para buscar GIFs de anime de diferentes categorias
 */

const axios = require('axios');

/**
 * Categorias de GIFs disponíveis
 * @type {Object}
 */
const GIF_CATEGORIES = {
  HUG: 'hug',
  KISS: 'kiss',
  SLAP: 'slap',
  PUNCH: 'punch',
  FIGHT: 'fight',
  FEED: 'feed'
};

/**
 * Busca um GIF aleatório de anime baseado na categoria
 * @param {string} category - Categoria do GIF (hug, kiss, slap, etc)
 * @returns {Promise<string>} URL do GIF
 */
const getRandomAnimeGif = async (category) => {
  try {
    // Usando a API pública Waifu.pics para GIFs de anime
    const response = await axios.get(`https://api.waifu.pics/sfw/${category}`);
    
    if (response.data && response.data.url) {
      return response.data.url;
    }
    
    throw new Error(`Não foi possível encontrar GIF para a categoria: ${category}`);
  } catch (error) {
    console.error(`Erro ao buscar GIF de anime (${category}):`, error.message);
    // Retorna null em caso de erro para que o código possa usar uma imagem local como fallback
    return null;
  }
};

module.exports = {
  GIF_CATEGORIES,
  getRandomAnimeGif
};