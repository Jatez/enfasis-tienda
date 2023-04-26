const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./src/database');
const cliente = require("./src/routes/cliente");
const tienda = require("./src/routes/tienda");
const pedido = require("./src/routes/pedido");
const serverless = require('serverless-http');
const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());

app.use('/cliente' , cliente)
app.use('/tienda',tienda)
app.use('/pedido', pedido)

exports.handler = serverless(app);

app.listen(port, () => {
    console.log('Server listening on port 3000');
  });