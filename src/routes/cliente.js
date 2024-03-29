const express = require('express');
const pool = require('../databaseConfig');
const redis = require('redis');
const {host,psswd }= require('../../redisConfig');

const redisClient = redis.createClient({
    // rediss for TLS
    url:`rediss://${host}:6380`,
    password: psswd
});

const clienteRoute = express.Router()

clienteRoute.get('/', async (req, res) => {
  await redisClient.connect();

  redisClient.get('Clientes',async(err,reply)=> {
    if(reply){
      return res.json(JSON.parse(reply));
    }

    const result = await pool.query('SELECT * FROM cliente');

    redisClient.set('Clientes', JSON.stringify(result.rows), (err,reply) => {
      if(err) console.log(err);
  
      console.log(reply);
  
      res.json(result.rows);
    });
  
  
    res.json(result.rows); // Envía los resultados de la consulta como respuesta en formato JSON
    await redisClient.disconnect();
  });
});

clienteRoute.post('/', async (req, res) => {
  const { nombre } = req.body;
  const result = await pool.query('INSERT INTO cliente (nombre) VALUES ($1) RETURNING *', [nombre]);
  res.send(result.rows[0]);
});

clienteRoute.put('/:id', async (req, res) => {
  const { nombre } = req.body;
  const { id } = req.params;
  const result = await pool.query('UPDATE cliente SET nombre = $1 WHERE id = $2 RETURNING *', [nombre, id]);
  res.send(result.rows[0]);
});

clienteRoute.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('DELETE FROM cliente WHERE id = $1', [id]);
  res.sendStatus(204);
});

module.exports = clienteRoute