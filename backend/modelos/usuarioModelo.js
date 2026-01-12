const mongoose = require('mongoose');

const esquemaUsuario = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /.+\@.+\..+/
    },
    senha: {
      type: String,
      required: true,
      minlength: 6
    },
    pontuacao: {
      type: Number,
      default: 0
    },
    nivelAtual: {
      type: Number,
      default: 1
    },
    ativo: {
      type: Boolean,
      default: true
    },
    dataUltimoLogin: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

const Usuario = mongoose.model('Usuario', esquemaUsuario);

module.exports = Usuario;
