const express = require('express');
const pool = require('../database');

const pedidoRoute = express.Router()

pedidoRoute.get('/',async (req, res) => {
  const result = await pool.query('SELECT * FROM pedido');
  res.send(result.rows);
});

pedidoRoute.post('/', async (req, res) => {
  const { fk_cliente, fk_tienda } = req.body;
  const result = await pool.query('INSERT INTO pedido (fk_cliente, fk_tienda ) VALUES ($1, $2) RETURNING id', [fk_cliente, fk_tienda ]);
  const id = result.rows[0].id;
  const link = `https://images-pedidos-enfasis.s3.us-east-2.amazonaws.com/Pedido-Gracias.png/${id}`;
  res.send(link);
});

pedidoRoute.put('/:id', async (req, res) => {
  const { fk_cliente, fk_tienda } = req.body;
  const { id } = req.params;
  try {
    const result = await pool.query('UPDATE pedido SET fk_cliente=$1, fk_tienda =$2 WHERE id=$3 RETURNING id', [fk_cliente, fk_tienda , id]);
    const link = `https://images-pedidos-enfasis.s3.us-east-2.amazon/pedido/${result.rows[0].id}`;
    res.send(link);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar pedido');
  }
});

pedidoRoute.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM pedido WHERE id = $1', [id]);
  res.sendStatus(204);
});

module.exports = pedidoRoute