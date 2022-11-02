const express = require('express');
//para enviar eventos para os demais microsserviços
const axios = require('axios');

const app= express();
app.use(express.json());

const eventos  = []

app.get('/eventos', (req, res)=> {
  res.send(eventos)
})
app.post('/eventos', (req, res) => {
    const evento = req.body;
    eventos.push(evento)
    //envia o evento para o microsserviço de lembretes
    axios.post('http://lembretes-clusterip-service:4000/eventos', evento)
    .catch((err) => {
        console.log("Microsserviço de lembretes fora do ar.")
    });
    //envia o evento para o microsserviço de observações
    axios.post('http://observacoes-clusterip-service:5000/eventos', evento)
    .catch((err) => {
        console.log("Microsserviço de observações fora do ar.")
    });
    //envia o evento para o microsserviço de consulta
    axios.post('http://consulta-clusterip-service:6000/eventos', evento)
    .catch((err) => {
        console.log("Microsserviço de consultas fora do ar.")
    });
    //envia o evento para o microsserviço de classificação
    axios.post('http://classificacao-clusterip-service:7000/eventos', evento)
    .catch((err) => {
        console.log("Microsserviço de classificação fora do ar.")
    });

    res.status(200).send({msg: 'ok'});
});

app.listen(10000, () => {
    console.log('Chamando lenbretes-clusterip-service');
    console.log('Barramento de eventos. Porta 10000');
})