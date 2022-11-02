const express = require ('express')
const app = express()
const axios = require('axios')
//estamos aplicando um middleware
app.use(express.json())


const lembretes = {}
let contador = 0

//GET obter a lista de lembretes
//192.168.15.7:4000/lembretes
app.get('/lembretes', (req, res) => {
  res.send(lembretes)
})

//POST cadastrar um lembrete novo
//192.168.15.7:4000/lembretes
// {texto: 'Fazer café'}
app.post('/lembretes', async (req, res) => {
  contador++
  // const texto = req.body.texto  
  const { texto } = req.body;
  lembretes[contador] = {contador, texto};
  await axios.post("http://barramento-de-eventos-service:10000/eventos", {
    tipo: "LembreteCriado",
    dados: {
      contador,
      texto,
    },
  });
  res.status(201).send(lembretes[contador]);
})

app.post('/eventos', (req, res) => {
  console.log(req.body);
  res.status(200).send({msg: 'ok'});
})

app.listen(4000, () => {
  console.log('Nova versão');
  console.log('Chamando barramento-de-eventos-service');
  console.log ('Lembretes. Porta 4000');
});