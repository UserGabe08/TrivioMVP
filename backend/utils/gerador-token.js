const jwt = require('jsonwebtoken');
const { CHAVE_JWT } = require('../config/variáveis-ambiente');

const gerarToken = (idUsuario, expiracaoEm = '7d') => {
  try {
    const token = jwt.sign(
      { idUsuario },
      CHAVE_JWT,
      { expiresIn: expiracaoEm }
    );
    return token;
  } catch (erro) {
    console.error('Erro ao gerar token:', erro.message);
    return null;
  }
};

const verificarToken = (token) => {
  try {
    const decodificado = jwt.verify(token, CHAVE_JWT);
    return { valido: true, dados: decodificado };
  } catch (erro) {
    return { valido: false, erro: erro.message };
  }
};

const extrairTokenDoHeader = (authHeader) => {
  if (!authHeader) return null;
  
  const partes = authHeader.split(' ');
  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    return null;
  }
  
  return partes[1];
};

module.exports = {
  gerarToken,
  verificarToken,
  extrairTokenDoHeader
};
