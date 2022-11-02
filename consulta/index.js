const express = require ('express')
const axios = require ('axios')
const app = express()
// const bodyParser = require ('body-parser')
// app.use(bodyParser.json())
app.use(express.json())

const baseConsulta = {}

const funcoes = {
  LembreteCriado: (lembrete) => {
    baseConsulta[lembrete.contador] = lembrete
  },
  ObservacaoCriada: (observacao) => {
    const observacoes = baseConsulta[observacao.lembreteId]['observacoes'] || []
    observacoes.push(observacao)
    baseConsulta[observacao.lembreteId]['observacoes'] = observacoes
  },
  ObservacaoAtualizada: (observacao) =>  {
    const observacoes = baseConsulta[observacao.lembreteId]['observacoes']
    const indice = observacoes.findIndex(o => o.id === observacao.id)
    observacoes[indice] = observacao  
  }
}

//192.168.15.7:6000/lembretes
app.get('/lembretes', (req, res) => {
  res.status(200).send(baseConsulta);
})

//192.168.15.7:6000/eventos
app.post('/eventos', (req, res) => {
  try{
    funcoes[req.body.tipo](req.body.dados);
  }catch(e){
    console.log(req.body)
    console.log(e)
  }
  res.status(200).send(baseConsulta);
})

app.listen('6000', async () => {
  console.log('Consultas. Porta 6000.')
  try{
    const resp = await axios.get('http://barramento-de-eventos-service:10000/eventos')
    resp.data.forEach((valor, indice, colecao) => {
      try{
        funcoes[valor.tipo](valor.dados)
      }catch(ex){} 
    })
  }
  catch (e){
  }
})