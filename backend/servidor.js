const express = require('express');
const cors = require('cors');
const { conectarBancoDados } = require('./config/banco-de-dados');
const { PORTA, URL_FRONTEND } = require('./config/variáveis-ambiente');
const usuarioRotas = require('./rotas/usuarioRotas');

const app = express();

// configurar CORS
app.use(cors({
  origin: URL_FRONTEND,
  credentials: true
}));

// mwiddleware paoradra parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logs
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  next();
});

// Conectar ao banco de dados
conectarBancoDados();

// Rotas
app.use('/api/usuarios', usuarioRotas);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    mensagem: 'Bem-vindo ao backend TRIVIO',
    versao: '1.0.0',
    endpoints: {
      autenticacao: '/api/usuarios',
      usuario: '/api/usuarios'
    }
  });
});

// Tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ sucesso: false, erro: 'Rota não encontrada' });
});

// Tratamento de erros
app.use((erro, req, res, next) => {
  console.error('Erro no servidor:', erro);
  res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
});

// Aqqui e manjei  , Iniciar o servidor, aqui eu cozinhei
app.listen(PORTA, () => {
  console.log(`
╔═════════════════════════════════════════╗
║     TRIVIO BACKEND - SERVIDOR ATIVO     ║
╠═════════════════════════════════════════╣
║ Porta: ${PORTA}                           ║
║ URL: http://localhost:${PORTA}            ║
║ Pronto para receber requisições!       ║
╚═════════════════════════════════════════╝
  `);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (erro) => {
  console.error('Erro não tratado:', erro);
  process.exit(1);
});

module.exports = app;
// man, ja nao seei mais o que colocar aqui  ta foda isso aqui man, sla, teste