const validarEmail = (email) => {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(email);
};

const validarSenha = (senha) => {
  // Mínimo 6 caracteres
  return senha && senha.length >= 6;
};

const validarNome = (nome) => {
  // Mínimo 3 letras sem números
  return nome && nome.length >= 3 && !/\d/.test(nome);
};

const validarDadosRegistro = (dados) => {
  const erros = [];

  if (!dados.nome) {
    erros.push('Nome é obrigatório');
  } else if (!validarNome(dados.nome)) {
    erros.push('Nome deve ter pelo menos 3 caracteres e sem números');
  }

  if (!dados.email) {
    erros.push('Email é obrigatório');
  } else if (!validarEmail(dados.email)) {
    erros.push('Email inválido');
  }

  if (!dados.senha) {
    erros.push('Senha é obrigatória');
  } else if (!validarSenha(dados.senha)) {
    erros.push('Senha deve ter pelo menos 6 caracteres');
  }

  return {
    valido: erros.length === 0,
    erros
  };
};

const validarDadosLogin = (dados) => {
  const erros = [];

  if (!dados.email) {
    erros.push('Email é obrigatório');
  } else if (!validarEmail(dados.email)) {
    erros.push('Email inválido');
  }

  if (!dados.senha) {
    erros.push('Senha é obrigatória');
  }

  return {
    valido: erros.length === 0,
    erros
  };
};

module.exports = {
  validarEmail,
  validarSenha,
  validarNome,
  validarDadosRegistro,
  validarDadosLogin
};