const mongoose = require('mongoose');
const { URI_MONGO } = require('./variáveis-ambiente');

const conectarBancoDados = async () => {
  try {
    await mongoose.connect(URI_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ Banco de dados conectado com sucesso');
  } catch (erro) {
    console.error('✗ Erro ao conectar banco de dados:', erro.message);
    process.exit(1);
  }
};

const desconectarBancoDados = async () => {
  try {
    await mongoose.disconnect();
    console.log('✓ Banco de dados desconectado');
  } catch (erro) {
    console.error('✗ Erro ao desconectar banco de dados:', erro.message);
  }
};

module.exports = {
  conectarBancoDados,
  desconectarBancoDados
};
