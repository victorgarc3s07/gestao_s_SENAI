// const db = require('../config/db'); // Importar a conexão com o banco
// const jwt = require('jsonwebtoken');
// //------------------------ROTAS POST-------------------------------------------------------------------------------------------------
// const addCurso = async (req, res) => {
//     const { nome, matriculas_previstas, turno, ch_total, modalidade, financiamento, localidade, turma, data_inicio, data_fim } = req.body;
//     try {
//         // Verificação de duplicidade
//         const [duplicidade] = await db.execute(
//             'SELECT * FROM curso WHERE nome = ? AND turma = ? AND data_inicio = ? AND data_fim = ?',
//             [nome, turma, data_inicio, data_fim]
//         );
//         if (duplicidade.length > 0) {
//             return res.status(400).send('Curso duplicado.');
//         }
//         // Curso não existe, então adiciona
//         const [resultado] = await db.execute(
//             `INSERT INTO curso (nome, matriculas_previstas, turno, ch_total, modalidade, financiamento, localidade, 
//                 turma, data_inicio, data_fim) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//             [ nome, matriculas_previstas, turno, ch_total, modalidade, financiamento, localidade, turma,
//                 data_inicio, data_fim]
//         );
//         return res.status(201).send('Curso adicionado com sucesso!');
//     } catch (error) {
//         console.error('Erro ao processar a requisição.', error);
//         return res.status(500).send('Erro ao processar a requisição.');
//     }
// };
// const addDocente = async (req, res) => {
//     const { matricula, nome, email, telefone, id_curso, curso_matriculado } = req.body;
//     console.log('Dados recebidos no corpo da requisição:', req.body);
//     // Definir valores padrão
//     const senha = "000000";  // Senha padrão
//     const setor = "docente";  // Setor padrão
//     try {
//         //analisar a duplicidade, cursos de mesmo nome possuem cod diferentes? 
//         const [resultado] = await db.execute(
//             `INSERT INTO docente (matricula, nome, email, senha, setor, telefone, id_curso, curso_matriculado) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//             [ matricula, nome, email, senha, setor, telefone, id_curso, curso_matriculado ]
//         );
//         return res.status(201).send('Docente adicionado com sucesso!');
//     } catch (error) {
//         console.error('Erro ao processar a requisição.', error);
//         return res.status(500).send('Erro ao processar a requisição.');
//     }
// };
// //------------------------ROTAS GET-------------------------------------------------------------------------------------------------
// const buscarCursos = async (req, res) => {
//     try {
//         const [resultado] = await db.execute(
//             `SELECT * FROM curso`
//         );
//         return res.json(resultado);
//     } catch (error) {
//         console.error('Erro ao processar a requisição.', error);
//         return res.status(500).send('Erro ao processar a requisição.');
//     }
// }
// const buscarCursosVigentes = async (req, res) => {
//     try {
//         const [attCursosVigentes] = await db.execute('CALL AtualizarCursosVigentes()');
//         const [resultado] = await db.execute(
//             `SELECT * FROM cursos_vigentes`
//         );
//         return res.json(resultado);
//     } catch (error) {
//         console.error('Erro ao processar a requisição.', error);
//         return res.status(500).send('Erro ao processar a requisição.');
//     }   
// };
// const buscarCursosConcluidos = async (req, res) => {
//     try {
//         const [attCursosConcluidos] = await db.execute('CALL AtualizarCursosConcluidos()');
//         const [resultado] = await db.execute(
//             `SELECT * FROM cursos_concluidos`
//         );
//         return res.json(resultado);
//     } catch (error) {
//         console.error('Erro ao processar a requisição.', error);
//         return res.status(500).send('Erro ao processar a requisição.');
//     }  
// };
// const buscarDocentes = async (req, res) => {
//     try {
//         const [resultado] = await db.execute(
//             `SELECT id, matricula, nome, email, telefone, id_curso, curso_matriculado FROM docente`
//         );
//         return res.json(resultado);
//     } catch (error) {
//         console.error('Erro ao processar a requisição.', error);
//         return res.status(500).send('Erro ao processar a requisição.');
//     }  
// };
// //------------------------ROTAS PATCH-------------------------------------------------------------------------------------------------
// //------------------------ROTAS DELETE-------------------------------------------------------------------------------------------------
// const delDocente = async (req, res) => {
//     try {
//         const { id } = req.params; // Obtém o ID dos parâmetros da rota
//         if (!id) {
//             return res.status(400).send('ID do docente é necessário.');
//         }
//         const [resultado] = await db.execute(
//             `DELETE FROM docente WHERE id = ?`, [id] // Passa o ID como parâmetro
//         );
//         if (resultado.affectedRows === 0) {
//             return res.status(404).send('Docente não encontrado.');
//         }
//         return res.status(200).json({ message: 'Docente deletado com sucesso.' });
//     } catch (error) {
//         console.error('Erro ao processar a requisição.', error);
//         return res.status(500).send('Erro ao processar a requisição.');
//     }  
// };
// const delCursoVigente = async (req, res) => {
//     try {
//         const { id_curso } = req.params; // Obtém o ID dos parâmetros da rota
//         if (!id_curso) {
//             return res.status(400).send('ID do curso é necessário.');
//         }
//         const [resultado] = await db.execute(
//             `DELETE FROM cursos_vigentes WHERE id_curso = ?`, [id_curso] // Passa o ID como parâmetro
//         );
//         if (resultado.affectedRows === 0) {
//             return res.status(404).send('Curso vigente não encontrado.');
//         }
//         return res.status(200).json({ message: 'Curso vigente deletado com sucesso.' });
//     } catch (error) {
//         console.error('Erro ao processar a requisição.', error);
//         return res.status(500).send('Erro ao processar a requisição.');
//     }  
// };
// module.exports = {
//     addCurso,
//     //addMateriais,
//     addDocente,
//     buscarCursos,
//     buscarCursosVigentes,
//     buscarCursosConcluidos,
//     //buscarKits,
//     buscarDocentes,
//     //editarCurso,
//     //editarDocente,
//     //editarMateriais,
//     //editarKit,
//     //editarFotoPerfil,
//     //addAssinatura,
//     delDocente,
//     delCursoVigente
// }

import db from '../config/db.js'; // Importa a conexão com o banco
import jwt from 'jsonwebtoken';

// ------------------------ ROTAS POST ------------------------
export const addCurso = async (req, res) => {
    const { nome, matriculas_previstas, turno, ch_total, modalidade, financiamento, localidade, turma, data_inicio, data_fim } = req.body;
    try {
        const [duplicidade] = await db.query(
            'SELECT * FROM curso WHERE nome = ? AND turma = ? AND data_inicio = ? AND data_fim = ?',
            [nome, turma, data_inicio, data_fim]
        );
        if (duplicidade.length > 0) {
            return res.status(400).send('Curso duplicado.');
        }
        const [resultado] = await db.execute(
            `INSERT INTO curso (nome, matriculas_previstas, turno, ch_total, modalidade, financiamento, localidade, turma, data_inicio, data_fim) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nome, matriculas_previstas, turno, ch_total, modalidade, financiamento, localidade, turma, data_inicio, data_fim]
        );
        return res.status(201).send('Curso adicionado com sucesso!');
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};

export const addDocente = async (req, res) => {
    const { matricula, nome, email, telefone, id_curso, curso_matriculado } = req.body;
    const senha = "000000";
    const setor = "docente";
    try {
        const [resultado] = await db.execute(
            `INSERT INTO docente (matricula, nome, email, senha, setor, telefone, id_curso, curso_matriculado) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [matricula, nome, email, senha, setor, telefone, id_curso, curso_matriculado]
        );
        return res.status(201).send('Docente adicionado com sucesso!');
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};

// ------------------------ ROTAS GET ------------------------
export const buscarCursos = async (req, res) => {
    try {
        const [resultado] = await db.query('SELECT * FROM curso');
        return res.json(resultado);
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};

export const buscarCursosVigentes = async (req, res) => {
    try {
        await db.execute('CALL AtualizarCursosVigentes()');
        const [resultado] = await db.query('SELECT * FROM cursos_vigentes');
        return res.json(resultado);
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};

export const buscarCursosConcluidos = async (req, res) => {
    try {
        await db.execute('CALL AtualizarCursosConcluidos()'); // oque é isso elaine?
        const [resultado] = await db.execute('SELECT * FROM cursos_concluidos');
        return res.json(resultado);
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};

export const buscarDocentes = async (req, res) => {
    try {
        const [resultado] = await db.execute(
            `SELECT id, matricula, nome, email, telefone, id_curso, curso_matriculado FROM docente`
        );
        return res.json(resultado);
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};

// ------------------------ ROTAS DELETE ------------------------
export const delDocente = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send('ID do docente é necessário.');
        }
        const [resultado] = await db.execute('DELETE FROM docente WHERE id = ?', [id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).send('Docente não encontrado.');
        }
        return res.status(200).json({ message: 'Docente deletado com sucesso.' });
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};

export const delCursoVigente = async (req, res) => {
    try {
        const { id_curso } = req.params;
        if (!id_curso) {
            return res.status(400).send('ID do curso é necessário.');
        }
        const [resultado] = await db.execute('DELETE FROM cursos_vigentes WHERE id_curso = ?', [id_curso]);
        if (resultado.affectedRows === 0) {
            return res.status(404).send('Curso vigente não encontrado.');
        }
        return res.status(200).json({ message: 'Curso vigente deletado com sucesso.' });
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};

// ------------------------ EXPORTAÇÃO ------------------------