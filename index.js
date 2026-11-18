
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();


const recintos = require(__dirname + '/routes/recintos');
const eventos = require(__dirname + '/routes/eventos');


mongoose.connect(process.env.URL_BD)
    .then(() => {
        console.log('Conectado a la base de datos');
    })
    .catch((error) => {
        console.log('Error conectando a la base de datos:', error);
    });


let app = express();


app.use(express.json());


app.use('/recintos', recintos);
app.use('/eventos', eventos);


const puerto = process.env.PUERTO || process.env.PORT || 8080;
app.listen(puerto, () => {
    console.log('Servidor escuchando en el puerto', puerto);
});

