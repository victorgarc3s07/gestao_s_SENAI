import db from '../config/db.js'; // Conexão com o MySQL
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendEmail } from '../services/emailService.js'; // Importação ajustada para ES Modules

export const cadastro = async (req, res) => {
  const { nome, email, senha, setor } = req.body;
  try {
      const [existingUser] = await db.query('SELECT * FROM cadastro WHERE email = ?', [email]);
      if (existingUser.length > 0) {
          return res.status(400).send('Usuário já cadastrado.');
      }
      const hashedSenha = await bcrypt.hash(senha, 10);
      await db.query('INSERT INTO cadastro (nome, email, senha, setor) VALUES (?, ?, ?, ?)', [nome, email, hashedSenha, setor]);
      res.status(201).json({ message: 'Usuário cadastrado com sucesso.' });
  } catch (err) {
      console.error('Erro ao cadastrar usuário:', err);
      res.status(500).send('Erro ao cadastrar usuário.');
  }
};
export const login = async (req, res) => {
  const { email, senha } = req.body;
  try {
      let [user] = await db.query('SELECT * FROM cadastro WHERE email = ?', [email]);
      if (user.length === 0) {
          [user] = await db.query('SELECT * FROM docente WHERE email = ?', [email]);
      }
      if (user.length === 0) {
          return res.status(400).send('Credenciais inválidas (email)');
      }
      const isMatch = await bcrypt.compare(senha, user[0].senha);
      if (!isMatch) {
          if (user[0].senha === '000000') {
              return res.status(401).json({
                  message: 'Primeiro login. Por favor, atualize sua senha.',
                  requiresPasswordChange: true,
              });
          }
          return res.status(400).send('Credenciais inválidas (senha)');
      }
      req.session.usuario = {
          id: user[0].id,
          nome: user[0].nome,
          email: user[0].email,
          setor: user[0].setor,
      };
      const token = jwt.sign(
          { userId: user[0].id, email: user[0].email, nome: user[0].nome, setor: user[0].setor },
          process.env.JWT_SECRET,
          { expiresIn: '60m' }
      );
      res.json({
          token,
          usuario: { id: user[0].id, email: user[0].email, nome: user[0].nome, setor: user[0].setor },
      });
  } catch (err) {
      console.error('Erro ao autenticar usuário:', err);
      res.status(500).send('Erro ao autenticar usuário');
  }
};
export const requestResetSenha = async (req, res) => {
  const { email } = req.body;
  try {
      let user;
      let tabela;
      [user] = await db.query('SELECT * FROM cadastro WHERE email = ?', [email]);
      if (user.length > 0) {
          tabela = 'cadastro';
      } else {
          [user] = await db.query('SELECT * FROM docente WHERE email = ?', [email]);
          if (user.length > 0) {
              tabela = 'docente';
          }
      }
      if (!tabela) {
          return res.status(400).send('Usuário não encontrado');
      }
      const token = crypto.randomBytes(20).toString('hex');
      const expireDate = new Date(Date.now() + 3600000);
      await db.query(`UPDATE ${tabela} SET reset_senha = ?, reset_senha_expires = ? WHERE email = ?`, [token, expireDate, email]);
      const resetLink = `http://localhost:3001/reset-senha/${token}`;
      await sendEmail(email, 'Recuperação de Senha', `Por favor, clique no link para redefinir sua senha: ${resetLink}`);
      res.status(200).send('E-mail de recuperação de senha enviado.');
  } catch (err) {
      console.error('Erro ao solicitar redefinição de senha:', err);
      res.status(500).send('Erro ao solicitar redefinição de senha');
  }
};
export const resetSenha = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
      const queries = [
          { table: 'cadastro', query: 'SELECT id FROM cadastro WHERE reset_senha = ? AND reset_senha_expires > NOW()' },
          { table: 'docente', query: 'SELECT id FROM docente WHERE reset_senha = ? AND reset_senha_expires > NOW()' },
      ];
      let user = null;
      let tableName = null;
      for (const { table, query } of queries) {
          const [result] = await db.query(query, [token]);
          if (result.length > 0) {
              user = result[0];
              tableName = table;
              break;
          }
      }
      if (!user) {
          return res.status(400).send('Solicitação de redefinição de senha não encontrada.');
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.query(
          `UPDATE ${tableName} SET senha = ?, reset_senha = NULL, reset_senha_expires = NULL WHERE id = ?`,
          [hashedPassword, user.id]
      );
      res.status(200).send('Senha redefinida com sucesso.');
  } catch (err) {
      console.error('Erro ao redefinir senha:', err);
      res.status(500).send('Erro ao redefinir senha');
  }
};

export const buscarSetor = async (req, res) => {
  try {
    // 1. Extrai o token do cabeçalho Authorization
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido.' });
    }
    // 2. Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const setor = decoded.setor; // Desestrutura o nome do payload do token
    if (!setor) {
      return res.status(404).json({ error: 'Setor não encontrado no token' });
    }
    // Retornar o nome como JSON
    return res.status(200).json({ setor });
  } catch (err) {
    console.error('Erro ao buscar setor do usuário:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

export const buscarNome = async (req, res) => {
  try {
    // 1. Extrai o token do cabeçalho Authorization
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido.' });
    }
    // 2. Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const nome = decoded.nome; // Desestrutura o nome do payload do token
    if (!nome) {
      return res.status(404).json({ error: 'Setor não encontrado no token' });
    }
    // Retornar o nome como JSON
    return res.status(200).json({ nome });
  } catch (err) {
    console.error('Erro ao buscar nome do usuário:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};


export const logout = async (req, res) => {
  try {
    // Verifica se a sessão está ativa (ou se o usuário está autenticado)
    if (!req.session.usuario) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }
    // 1. Destroi a sessão do usuário
    req.session.destroy((err) => {
      if (err) {
        // Se ocorrer erro ao destruir a sessão, retorna um erro
        return res.status(500).json({ message: 'Erro ao tentar destruir a sessão' });
      }
      // 2. Limpa o cookie da sessão
      res.clearCookie('connect.sid');
      // 3. Responde ao cliente confirmando o logout
      return res.status(200).json({ message: 'Logout bem-sucedido' });
    });
  } catch (err) {
    console.error('Erro ao tentar fazer logout:', err);
    return res.status(500).json({ message: 'Erro no servidor ao tentar fazer logout' });
  }
};
