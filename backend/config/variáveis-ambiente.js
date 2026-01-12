require('dotenv').config();

module.exports = {
  PORTA: process.env.PORTA || 3000,
  URI_MONGO: process.env.URI_MONGO || 'mongodb://localhost:27017/trivio',
  CHAVE_JWT: process.env.CHAVE_JWT || 'sua_chave_secreta_super_segura_aqui',
  AMBIENTE: process.env.AMBIENTE || 'desenvolvimento',
  SALT_BCRYPT: parseInt(process.env.SALT_BCRYPT) || 10,
  URL_FRONTEND: process.env.URL_FRONTEND || 'http://localhost:3001'
};
