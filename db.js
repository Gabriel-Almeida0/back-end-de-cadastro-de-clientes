// db.js
require('dotenv').config();  // Carregar variáveis de ambiente do .env

const mysql = require('mysql2/promise');  // Usar a versão com Promise

// Configuração do pool de conexões do MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Funções para manipulação do banco de dados
const findClienteById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM clientes WHERE id = ?', [id]);
  return rows;
};

const insertCliente = async (nome, idade, celular) => {
  const [result] = await pool.execute(
    'INSERT INTO clientes (nome, idade, celular) VALUES (?, ?, ?)', 
    [nome, idade, celular]
  );
  return result;
};

const updateCliente = async (id, nome, idade, celular) => {
  const [result] = await pool.execute(
    'UPDATE clientes SET nome = ?, idade = ?, celular = ? WHERE id = ?',
    [nome, idade, celular, id]
  );
  return result;
};

const deleteCliente = async (id) => {
  const [result] = await pool.execute('DELETE FROM clientes WHERE id = ?', [id]);
  return result;
};

module.exports = {
  findClienteById,
  insertCliente,
  updateCliente,
  deleteCliente,
  pool
};
