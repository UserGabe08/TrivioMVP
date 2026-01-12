const bcrypt = require('bcryptjs');
const Usuario = require('../modelos/usuarioModelo');
const { validarDadosRegistro, validarDadosLogin } = require('../utils/validador');
const { gerarToken } = require('../utils/gerador-token');
const { SALT_BCRYPT } = require('../config/variáveis-ambiente');

const registrar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const validacao = validarDadosRegistro({ nome, email, senha });
    if (!validacao.valido) {
      return res.status(400).json({ sucesso: false, erros: validacao.erros });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(409).json({ sucesso: false, erro: 'Email já registrado' });
    }

    const senhaHash = await bcrypt.hash(senha, SALT_BCRYPT);

    const novoUsuario = new Usuario({
      nome,
      email,
      senha: senhaHash
    });

    await novoUsuario.save();

    const token = gerarToken(novoUsuario._id);

    res.status(201).json({
      sucesso: true,
      mensagem: 'Usuário registrado com sucesso',
      token,
      usuario: {
        id: novoUsuario._id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        pontuacao: novoUsuario.pontuacao,
        nivelAtual: novoUsuario.nivelAtual
      }
    });
  } catch (erro) {
    console.error('Erro ao registrar:', erro.message);
    res.status(500).json({ sucesso: false, erro: 'Erro ao registrar usuário' });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const validacao = validarDadosLogin({ email, senha });
    if (!validacao.valido) {
      return res.status(400).json({ sucesso: false, erros: validacao.erros });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ sucesso: false, erro: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ sucesso: false, erro: 'Credenciais inválidas' });
    }

    usuario.dataUltimoLogin = new Date();
    await usuario.save();

    const token = gerarToken(usuario._id);

    res.json({
      sucesso: true,
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        pontuacao: usuario.pontuacao,
        nivelAtual: usuario.nivelAtual
      }
    });
  } catch (erro) {
    console.error('Erro ao fazer login:', erro.message);
    res.status(500).json({ sucesso: false, erro: 'Erro ao fazer login' });
  }
};

const obterPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.idUsuario).select('-senha');

    if (!usuario) {
      return res.status(404).json({ sucesso: false, erro: 'Usuário não encontrado' });
    }

    res.json({
      sucesso: true,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        pontuacao: usuario.pontuacao,
        nivelAtual: usuario.nivelAtual,
        dataUltimoLogin: usuario.dataUltimoLogin,
        criadoEm: usuario.createdAt
      }
    });
  } catch (erro) {
    console.error('Erro ao obter perfil:', erro.message);
    res.status(500).json({ sucesso: false, erro: 'Erro ao obter perfil' });
  }
};

const atualizarPontuacao = async (req, res) => {
  try {
    const { pontos } = req.body;

    if (typeof pontos !== 'number' || pontos < 0) {
      return res.status(400).json({ sucesso: false, erro: 'Pontos inválidos' });
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.idUsuario,
      { $inc: { pontuacao: pontos } },
      { new: true }
    ).select('-senha');

    res.json({
      sucesso: true,
      mensagem: 'Pontuação atualizada',
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        pontuacao: usuario.pontuacao,
        nivelAtual: usuario.nivelAtual
      }
    });
  } catch (erro) {
    console.error('Erro ao atualizar pontuação:', erro.message);
    res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar pontuação' });
  }
};

const atualizarNivel = async (req, res) => {
  try {
    const { nivelAtual } = req.body;

    if (!Number.isInteger(nivelAtual) || nivelAtual < 1) {
      return res.status(400).json({ sucesso: false, erro: 'Nível inválido' });
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.idUsuario,
      { nivelAtual },
      { new: true }
    ).select('-senha');

    res.json({
      sucesso: true,
      mensagem: 'Nível atualizado',
      usuario: {
        id: usuario._id,
        nivelAtual: usuario.nivelAtual,
        pontuacao: usuario.pontuacao
      }
    });
  } catch (erro) {
    console.error('Erro ao atualizar nível:', erro.message);
    res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar nível' });
  }
};

const listarTodosUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({ ativo: true })
      .select('-senha')
      .sort({ pontuacao: -1 })
      .limit(100);

    res.json({
      sucesso: true,
      total: usuarios.length,
      usuarios
    });
  } catch (erro) {
    console.error('Erro ao listar usuários:', erro.message);
    res.status(500).json({ sucesso: false, erro: 'Erro ao listar usuários' });
  }
};

module.exports = {
  registrar,
  login,
  obterPerfil,
  atualizarPontuacao,
  atualizarNivel,
  listarTodosUsuarios
};
