// const express = require('express');
// const router = express.Router();
// const autentication = require('../controllers/authentication');
// const authMiddleware = require('../middleware/authorization')

// router.post('/login', autentication.login); //login
// router.post('/cadastro', autentication.cadastro); //cadastro
// router.get('/usuario/setor',authMiddleware, autentication.buscarSetor); //buscar setor
// router.get('/usuario/nome', authMiddleware, autentication.buscarNome); //buscar nome p/ saudação
// router.post('/request-reset-senha', autentication.requestResetSenha);
// router.post('/reset-senha', autentication.resetSenha);
// router.post('/logout', authMiddleware, autentication.logout);

// module.exports = router;

import express from 'express';
import * as autentication from '../controllers/authentication.js'; // Importa todas as funções exportadas no arquivo
import authMiddleware from '../middleware/authorization.js'; // Importa o middleware

const router = express.Router();

// Rotas definidas
router.post('/login', autentication.login); // login
router.post('/cadastro', autentication.cadastro); // cadastro
router.get('/usuario/setor', authMiddleware, autentication.buscarSetor); // buscar setor
router.get('/usuario/nome', authMiddleware, autentication.buscarNome); // buscar nome para saudação
router.post('/request-reset-senha', autentication.requestResetSenha); // solicitar redefinição de senha
router.post('/reset-senha', autentication.resetSenha); // redefinir senha
router.post('/logout', authMiddleware, autentication.logout); // logout

export default router; // Exporta o roteador como padrão
