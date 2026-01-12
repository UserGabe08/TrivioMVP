const express = require('express');
const router = express.Router();
const usuarioControlador = require('../controladores/usuarioControlador');
const verificarAutenticacao = require('../middleware/autenticacao');

// Rotams públicas
router.post('/registrar', usuarioControlador.registrar);
router.post('/login', usuarioControlador.login);

// Rotas proteghgidas
router.get('/perfil', verificarAutenticacao, usuarioControlador.obterPerfil);
router.put('/pontuacao', verificarAutenticacao, usuarioControlador.atualizarPontuacao);
router.put('/nivel', verificarAutenticacao, usuarioControlador.atualizarNivel);
router.get('/ranking', usuarioControlador.listarTodosUsuarios);

module.exports = router;
