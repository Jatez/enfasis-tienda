const express = require('express');
const pool = require('../databaseConfig');

const tiendaRoute = express.Router()

tiendaRoute.get('/',async (req, res) => {
  const result = await pool.query('SELECT * FROM tienda');
  res.send(result.rows);
});

tiendaRoute.post('/', async (req, res) => {
  const { nombre } = req.body;
  const result = await pool.query('INSERT INTO tienda (nombre) VALUES ($1) RETURNING *', [nombre]);
  res.send(result.rows[0]);
});

tiendaRoute.put('/:id', async (req, res) => {
  const { nombre } = req.body;
  const { id } = req.params;
  const result = await pool.query('UPDATE tienda SET nombre = $1 WHERE id = $2 RETURNING *', [nombre, id]);
  res.send(result.rows[0]);
});

tiendaRoute.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM tienda WHERE id = $1', [id]);
  res.sendStatus(204);
});


module.exports = tiendaRoute