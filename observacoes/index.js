const express = require ('express')
const app = express()
const axios = require('axios');
//erro comum: esquecer de chamar a função
//json 
//não faça isso: app.use(express.json)
app.use(express.json())

const {v4 : uuidv4} = require('uuid');

const observacoesPorLembreteId = {};

const funcoes = {
    ObservacaoClassificada: (observacao) => {
        const observacoes = 
            observacoesPorLembreteId[observacao.lembreteId];
        let obsParaAtualizar = observacoes.find(o => o.id === observacao.id);
        obsParaAtualizar = observacao.status;
        axios.post('http://192.168.15.7:10000/eventos', {
            tipo: "ObservacaoAtualizada",
            dados: {
                id: observacao.id,
                texto: observacao.texto,
                lembreteId: observacao.lembreteId,
                status: observacao.status
            }
        });
    }
}

//192.168.15.7:5000/lembretes/123456/observacoes
app.post('/lembretes/:id/observacoes', async (req, res) => {
    const idObs = uuidv4();
    const { texto } = req.body;
    //req.params dá acesso à lista de parâmetros da URL
    const observacoesDoLembrete = 
        observacoesPorLembreteId[req.params.id] || [];
    observacoesDoLembrete.push({id: idObs, texto, status: 'aguardando'});
    observacoesPorLembreteId[req.params.id] = observacoesDoLembrete;
    await axios.post('http://192.168.15.7:10000/eventos', {
        tipo: 'ObservacaoCriada',
        dados: {
            id: idObs,
            texto,
            lembreteId: req.params.id,
            status: 'aguardando'
        }
    })
    res.status(201).send(observacoesDoLembrete);
})

//192.168.15.7:5000/lembretes/abcd/observacoes
app.get('/lembretes/:id/observacoes', (req, res) => {
    res.send(observacoesPorLembreteId[req.params.id] || []);
})

app.post('/eventos', (req, res) => {
  try{
    funcoes[req.body.tipo](req.body.dados);  
  }
  catch (ex){
    console.log(ex)
    console.log(req.body)
  }
  res.status(200).send({msg: 'ok'})
})
  
app.listen(5000, () => console.log('Observações. Porta 5000.'))