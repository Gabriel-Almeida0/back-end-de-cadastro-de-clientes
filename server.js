require('dotenv').config();
const express = require('express');
const Joi = require('joi');
const { findClienteById, insertCliente, updateCliente, deleteCliente } = require('./db');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

const clienteSchema = Joi.object({
  nome: Joi.string().min(3).required(),
  idade: Joi.number().integer().min(18).required(),
  celular: Joi.string().pattern(/^\d{2}\d{9}$/).required(),
});

const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erro: 'Erro interno no servidor!' });
};

app.get('/cliente/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const cliente = await findClienteById(id);

    if (cliente.length === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado!' });
    }

    res.json(cliente[0]);
  } catch (err) {
    next(err);
  }
});

app.post('/cadastro', async (req, res, next) => {
  const { error } = clienteSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ erro: error.details[0].message });
  }

  const { nome, idade, celular } = req.body;

  try {
    const result = await insertCliente(nome, idade, celular);
    const id = result.insertId;

    res.status(201).json({ mensagem: `Cliente ${nome} cadastrado com sucesso!`, cliente: { id, nome, idade, celular } });
  } catch (err) {
    next(err);
  }
});

app.put('/cliente/:id', async (req, res, next) => {
  const { id } = req.params;
  const { nome, idade, celular } = req.body;

  try {
    const cliente = await findClienteById(id);

    if (cliente.length === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado!' });
    }

    await updateCliente(id, nome, idade, celular);

    res.status(200).json({ mensagem: `Cliente ${id} atualizado com sucesso!` });
  } catch (err) {
    next(err);
  }
});

app.patch('/cliente/:id', async (req, res, next) => {
  const { id } = req.params;
  const { nome, idade, celular } = req.body;

  try {
    const cliente = await findClienteById(id);

    if (cliente.length === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado!' });
    }

    await updateCliente(id, nome, idade, celular);
    res.status(200).json({ mensagem: `Cliente ${id} atualizado parcialmente com sucesso!` });
  } catch (err) {
    next(err);
  }
});

app.delete('/cliente/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const cliente = await findClienteById(id);

    if (cliente.length === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado!' });
    }

    await deleteCliente(id);

    res.status(200).json({ mensagem: `Cliente ${id} deletado com sucesso!` });
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
