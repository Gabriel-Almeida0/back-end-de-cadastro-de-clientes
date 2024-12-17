// server.js
require('dotenv').config();
const express = require('express');
const Joi = require('joi');
const { findClienteById, insertCliente, updateCliente, deleteCliente } = require('./db');  // Importar funções para manipulação no banco

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Validação de dados de cadastro usando Joi
const clienteSchema = Joi.object({
  nome: Joi.string().min(3).required(),
  idade: Joi.number().integer().min(18).required(),
  celular: Joi.string().pattern(/^\d{2}\d{9}$/).required(), // Validação de celular (DDD + 9 números)
});

// Middleware para lidar com erros
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erro: 'Erro interno no servidor!' });
};

// Rota GET - Recupera informações de um cliente com base no ID
app.get('/cliente/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const cliente = await findClienteById(id);

    if (cliente.length === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado!' });
    }

    res.json(cliente[0]);
  } catch (err) {
    next(err);  // Passa para o middleware de erro
  }
});

// Rota POST - Cadastra um cliente com nome, idade, celular
app.post('/cadastro', async (req, res, next) => {
  const { error } = clienteSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ erro: error.details[0].message });
  }

  const { nome, idade, celular } = req.body;

  try {
    // Adiciona o cliente ao banco de dados
    const result = await insertCliente(nome, idade, celular);

    // O ID será gerado automaticamente pelo banco de dados
    const id = result.insertId;

    res.status(201).json({ mensagem: `Cliente ${nome} cadastrado com sucesso!`, cliente: { id, nome, idade, celular } });
  } catch (err) {
    next(err);  // Passa para o middleware de erro
  }
});

// Rota PUT - Atualiza informações de um cliente
app.put('/cliente/:id', async (req, res, next) => {
  const { id } = req.params;
  const { nome, idade, celular } = req.body;

  try {
    const cliente = await findClienteById(id);

    if (cliente.length === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado!' });
    }

    // Atualiza o cliente no banco de dados
    await updateCliente(id, nome, idade, celular);

    res.status(200).json({ mensagem: `Cliente ${id} atualizado com sucesso!` });
  } catch (err) {
    next(err);  // Passa para o middleware de erro
  }
});

// Rota PATCH - Atualiza parcialmente as informações de um cliente
app.patch('/cliente/:id', async (req, res, next) => {
  const { id } = req.params;
  const { nome, idade, celular } = req.body;

  try {
    const cliente = await findClienteById(id);

    if (cliente.length === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado!' });
    }

    // Atualiza parcialmente o cliente no banco de dados
    await updateCliente(id, nome, idade, celular);  // Pode ser modificado para aceitar atualizações parciais
    res.status(200).json({ mensagem: `Cliente ${id} atualizado parcialmente com sucesso!` });
  } catch (err) {
    next(err);  // Passa para o middleware de erro
  }
});

// Rota DELETE - Deleta um cliente com base no ID
app.delete('/cliente/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const cliente = await findClienteById(id);

    if (cliente.length === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado!' });
    }

    // Deleta o cliente no banco de dados
    await deleteCliente(id);

    res.status(200).json({ mensagem: `Cliente ${id} deletado com sucesso!` });
  } catch (err) {
    next(err);  // Passa para o middleware de erro
  }
});

// Middleware de erro
app.use(errorHandler);

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
