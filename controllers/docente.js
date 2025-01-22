import db from '../config/db.js'; // Importa a conexão com o banco
import jwt from 'jsonwebtoken';
// //------------------------ROTAS GET
//---------CARREGAR CURSOS VIGENTES----------
export const buscarCursosVigentes = async (req, res) => {
  try {
    // 1. Extrai o token do cabeçalho Authorization
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido.' });
    }
    // 2. Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded; // Desestrutura o email do payload do token
    const {senha} = decoded
    // 3. Busca o nome do usuário na tabela usuarios
    const [userResult] = await db.query(
      'SELECT nome FROM cadastro WHERE email = ?',
      [email]
    );
    if (userResult.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    const { nome } = userResult[0]; // Nome do usuário
    // 4. Busca os cursos onde professor = nome_usuario
    const [cursosResult] = await db.query(
      'SELECT nome_curso FROM cursos_vigentes WHERE docente = ?',
      [nome]
    );
    if (cursosResult.length === 0) {
      return res.status(404).json({ message: 'Nenhum curso encontrado para este professor.' });
    }
    // 5. Retorna a lista de cursos
    res.status(200).json({ cursos: cursosResult });
    console.log(senha)
  } catch (err) {
    console.error('Erro ao buscar cursos:', err);
    res.status(500).json({ message: 'Erro ao buscar cursos.' });
  }
}; 

// ====== CARREGAR CURSOS CONCLUÍDOS ========

 export const carregarCursosConcluídos = async (req, res)=>{
   try {
     const token = req.headers.authorization?.split(' ')[1];
     if(!token) {
       return res.status(401).json({message: 'Token não fornecido'})
     }

     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     const {email} = decoded;
     
     const [userResult] = await db.query('SELECT nome FROM docente WHERE email=?', [email])

     if (userResult.length === 0) {
          return res.status(404).json({ message: 'Curso não encontrado.' });
        }
        const { nome } = userResult[0];
        // 4. Busca os cursos onde professor = nome_usuario
        const [cursosResult] = await db.query(
          `SELECT *
          FROM cursos_concluidos
          WHERE docente=?`,
        [nome]);
      if (cursosResult.length === 0) {
        return res.status(404).json({ message: 'Nenhum curso encontrado para este professor.' });
      }
    // 5. Retorna a lista de cursos
      console.log(cursosResult)
      return res.status(200).json({ cursos:cursosResult });
      } catch (err) {
      console.error('Erro ao buscar cursos Concluidos:', err);
      
      res.status(500).json({ message: 'Erro ao buscar cursos Concluidos.', err });
      }
    };
   

// ----- BUSCAR CURSOS CONCLUIDOS --------
export const buscarCursosConcluidos = async (req, res) => {
  try {
    
    const {data_inicio, data_fim} = req.body;
    // 1. Extrai o token do cabeçalho Authorization
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido.' });
    }
    // 2. Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded; // Desestrutura o email do payload do token
    // 3. Busca o nome do usuário na tabela usuarios
    const [userResult] = await db.query(
      'SELECT nome FROM docente WHERE email = ?',
      [email]
    );
    if (userResult.length === 0) {
      return res.status(404).json({ message: 'Curso não encontrado.' });
    }
    const { nome } = userResult[0];
    // 4. Busca os cursos onde professor = nome_usuario
    const [cursosResult] = await db.query(
      `SELECT *
      FROM cursos_concluidos
      WHERE docente=? AND data_inicio >= ?
      AND data_fim <= ?;`,
    [nome, data_inicio, data_fim]);
  if (cursosResult.length === 0) {
    return res.status(404).json({ message: 'Nenhum curso encontrado para este professor.' });
  }
// 5. Retorna a lista de cursos
  console.log(cursosResult)
  return res.status(200).json({ cursos:cursosResult });
  } catch (err) {
  console.error('Erro ao buscar cursos Concluidos:', err);
  
  res.status(500).json({ message: 'Erro ao buscar cursos Concluidos.', err });
  }
};

//========== buscar cursos concluidos em pesquisa

export const buscarCursosConcluidosPorPesquisa = async (req, res) => {
  try {
    
    const {query} = req.body;
    // 1. Extrai o token do cabeçalho Authorization
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido.' });
    }
    // 2. Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded; // Desestrutura o email do payload do token
    // 3. Busca o nome do usuário na tabela usuarios
    const [userResult] = await db.query(
      'SELECT nome FROM docente WHERE email = ?',
      [email]
    );
    if (userResult.length === 0) {
      return res.status(404).json({ message: 'Curso não encontrado.' });
    }
    const { nome } = userResult[0];
    // 4. Busca os cursos onde professor = nome_usuario
    // if(query.length === 0){
    //   const results = db.query(
    //     "select * from cursos_concluidos where docente = ?",
    //     [nome]
    //   )
    //   return res.status(200).json({ cursos:results });
    // }
    const [cursosResult] = await db.query(
      `SELECT * FROM cursos_concluidos WHERE docente=? AND nome_curso LIKE ? OR data_inicio LIKE ? OR data_fim LIKE ?`,
    [nome,`%${query}%`, `%${query}%`, `%${query}%`]);
  if (cursosResult.length === 0) {
    return res.status(404).json({ message: 'Nenhum curso encontrado para este professor.' });
  }
// 5. Retorna a lista de cursos
  console.log(cursosResult)
  return res.status(200).json({ cursos:cursosResult });
  } catch (err) {
  console.error('Erro ao buscar cursos Concluidos:', err);
  
  res.status(500).json({ message: 'Erro ao buscar cursos Concluidos.', err });
  }
};


/*------ BUSCAR SOLICITAÇÕES --------- */
//1. Visualizar todas as solicitações
export const TodasSolicitacoes = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    //1.
    if(!token) {
      return res.status(401).json({message: 'Token não fornecido'})
    }
    //2.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const {nome_usuario} = decoded;
    // //3.
    // const [ userResult ] = await db.query('SELECT nome FROM docente WHERE email = ?', [email]);
    // if(userResult.length === 0) {
    //   res.status(404).json({message : 'usuário não encontrado'});
    // }

    // const { nome_usuario } = userResult[0];
    //4.
    const nome_curso = await db.query(
      'SELECT nome FROM curso WHERE docente = ?',
      [nome_usuario])

    if(!nome_curso) {
      console.log('curso não encontrado')
      res.status(404).send('Nenhum curso encontrado')
    }
    //5.
    const soliciticao = await db.query(
      'SELECT * FROM materiais WHERE nome_curso', [nome_curso],
      (err, result) => {
        if(err) {
          console.log('Erro no controlador: ', err)
          res.status(500).json({err})
        } else {
          console.log('Deu bom')
          res.status(200).json({soliciticao})
        }
      }
    )

  } catch(error) {
    res.status(500).json({error});
    console.log(error);
  }
};

//2. visualizar todos os kits de um curso especifico

// export const TodosKits = async (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     //1.
//     if(!token) {
//       return res.status(401).json({message: 'Token não fornecido'})
//     }
//     //2.
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const { email } = decoded;
//     //3.
//     const nome_usuario = await db.query('SELECT nome FROM docente WHERE email = ?', [email]);

//     const nome = nome_usuario[0][0].nome
//     console.log("nome usuário: ", nome)

//     //3.1
//     const nome_curso = await db.query('SELECT nome FROM curso WHERE docente = ?', [nome]);
    
//     if(!nome_curso || nome_curso.length === 0 || nome_curso[0].length === 0) {
//       return res.status(404).json({message: 'Nenhum curso encontrado'});
//     }
    
//     const curso = nome_curso[0][0].nome;
//     const curso_matriculado = curso;
    
//     console.log("curso matriculado: ", curso_matriculado)
//     //4.
//     const result = await db.query('SELECT nome_kit FROM kit WHERE curso = ?',
//       [curso_matriculado]
//     );

//     console.log(result[0])
//     if(result.length === 0) {
//       res.status(404).json({message : 'curso não possui kits'});
//     }
//     res.status(200).json(result[0]);
//   } catch(error) {
//     res.status(500).send(error);
//     console.log(error);
//   }
// };

// export const TodosMateriais = async (req, res) => {
//   try {
//     //1.
//     const token = req.headers.authorization?.split(' ')[1];
//     if(!token) {
//       return res.status(401).json({message: 'Token não fornecido'})
//     }
//     //2.
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const { email } = decoded;

//     const nome_usuario = await db.query('SELECT nome FROM docente WHERE email = ?', [email]);

//     const nome = nome_usuario[0][0].nome
//     console.log("nome usuário: ", nome)

//     const nome_curso = await db.query('SELECT nome FROM curso WHERE docente = ?', [nome]);
    
//     if(!nome_curso || nome_curso.length === 0 || nome_curso[0].length === 0) {
//       return res.status(404).json({message: 'Nenhum curso encontrado'});
//     }
    
//     const curso = nome_curso[0][0].nome;
//     console.log("Curso matriculado: ", curso)
  
//     const kitDidatico = await db.query('SELECT nome_kit FROM kit WHERE curso = ?',[curso]
//     );
//     const nome_kit = kitDidatico[0][0].nome_kit;
//     console.log("Nome do kit didático: ", nome_kit);

//     //3. 
//     const kitMateriais = await db.query(
//       'SELECT* FROM materiais WHERE nome_kit = ?', [nome_kit]);

//     const materiais_kit = kitMateriais[0];

//     //4.
//     if(materiais_kit.length === 0) {
//       console.log('Nenhum material encontrado')
//       res.status(404).json({message: 'Sem material'})
//     }

//     res.status(200).json(materiais_kit[0])
    
//   } catch(error) {
//     console.error('Erro encontrado: ', error);
//     res.status(500).json({message: 'Erro no controlador'})
//   }

// }








