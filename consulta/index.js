const express = require ('express')
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
  }
}

//localhost:6000/lembretes
app.get('/lembretes', (req, res) => {

})

//localhost:6000/eventos
app.post('/eventos', (req, res) => {

})

app.listen('6000', () => console.log('Consultas. Porta 6000.'))