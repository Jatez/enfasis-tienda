const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./src/database');
const cliente = require("./src/routes/cliente");
const tienda = require("./src/routes/tienda");
const pedido = require("./src/routes/pedido");
const serverless = require('serverless-http');
const AWS = require('aws-sdk');
const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());

app.use('/cliente' , cliente)
app.use('/tienda',tienda)
app.use('/pedido', pedido)


// Configura el cliente de AWS SQS
const sqs = new AWS.SQS({
  region: 'us-east-2',
  accessKeyId: 'AKIAQPIRACLLDBMTRGP5',
  secretAccessKey: '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'
});

// Configura el analizador de solicitudes POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define la ruta POST que almacena en la cola SQS
app.post('/', (req, res) => {
  const nombre = req.body.nombre;
  console.log(nombre)
  const params = {
    MessageBody: JSON.stringify({ nombre: nombre }),
    QueueUrl: 'https://sqs.us-east-2.amazonaws.com/032784782038/enfasis-tienda'
  };
console.log(params)
  sqs.sendMessage(params, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error al enviar mensaje a la cola SQS');
    } else {
      console.log(data);
      res.send('Mensaje enviado correctamente a la cola SQS');
    }
  });
});

exports.handler = serverless(app);

app.listen(port, () => {
    console.log('Server listening on port 3000');
  });