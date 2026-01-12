const { verificarToken, extrairTokenDoHeader } = require('../utils/gerador-token');

const verificarAutenticacao = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extrairTokenDoHeader(authHeader);

    if (!token) {
      return res.status(401).json({ sucesso: false, erro: 'Token não fornecido' });
    }

    const resultado = verificarToken(token);

    if (!resultado.valido) {
      return res.status(401).json({ sucesso: false, erro: 'Token inválido ou expirado' });
    }

    req.idUsuario = resultado.dados.idUsuario;
    next();
  } catch (erro) {
    console.error('Erro na autenticação:', erro.message);
    res.status(500).json({ sucesso: false, erro: 'Erro na autenticação' });
  }
};

module.exports = verificarAutenticacao;
