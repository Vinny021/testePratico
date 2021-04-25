//Ligação com Banco de Dados
const Cidade = require('./models/Cidade')

const axios = require('axios');
const handlebars = require('express-handlebars')
const path = require('path');

const bodyParser = require('body-parser')
const express = require('express');

const app = express();

const apiKey = 'e306bc0cb38032abdae3550cf4782400';
let dados ='';
let parametro = 'numero'

// Config

  //Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')
  
  //Body Parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

  //Public 
  app.use(express.static(path.join(__dirname, "public")))

//HomePage
  app.get('/', function(req, res){
    Cidade.findAll({order: [[parametro, 'DESC']], limit: 5}).then(function(cidades){
      res.render('home', {cidades: cidades})
    })
  })


  app.post('/', function(req, res){
    //Recebe o nome digitado pelo usuário
    nomeDigitado = req.body.cidadeDigitada
    
    //Configurando axios para pegar informação do Banco de Dados
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${nomeDigitado}&appid=${apiKey}&units=metric`
    axios
      .get(url) //Tenta acessar os dados da cidade digitada
      .then(response => {  //Acesso aos dados com Sucesso
        dados = response
        Cidade.findOne({ where: {nome: nomeDigitado} }).then(function(result) { //Busca se a cidade já se encontra no database
          if(result == null){ //Caso não, cria a cidade
            Cidade.create({
              nome: nomeDigitado, 
              numero: 1
            })
          }else{ //Caso encontre, coleta o numero de pesquisas que a cidade possui 
            numeroDePesquisas = result.dataValues.numero
            Cidade.update({  //Atualiza o numero de pesquisas
              numero: numeroDePesquisas+1,
            }, {
              where: {
                nome: nomeDigitado
              }
            });
          }
        })
        //Renderiza a Home com os dados climáticos da cidade
        Cidade.findAll({order: [[parametro, 'DESC']], limit: 5}).then(function(cidades){
          res.render('home', {cidades: cidades, response:dados}) 
        })
      })
      //Se a cidade digitada não se encontra na API retorna uma mensagem que a cidade não existe
      .catch(error =>
      Cidade.findAll({order: [[parametro, 'DESC']], limit: 5}).then(function(cidades){
        res.render('home', {cidades: cidades, response:dados, error:error})
      }));
  })

app.listen(8081, function(){
  console.log("Servidor rodando em https://localhost:8081")
})

