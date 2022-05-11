import mysql from 'mysql'
import express from 'express'
const app = express()
import path from 'path'
import cors from 'cors'
import http from 'http'
import bodyParser from 'body-parser';
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import ejs from 'ejs';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const port = 6150

app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname);

const server = http.Server(app);

app.use('/', express.static(path.join(__dirname, '../public')))


    // conexao banco de dados
var connection = mysql.createConnection({
    host: "144.22.225.253",
    user: "aplicacao",
    port: "3306",
    password: "conline@2510A",
    database: "SIRIUS",
    charset: "utf8mb4"
  });

  // execusão da conexao com o banco de dados
  connection.connect(function(err) {
    if(err){
      console.log('ERRO AO ACESSAR DB --> MYSQL')
    }else{
        console.log('CONECTADO DB --> MYSQL')
    }
  }); 

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home.html'))
  })

  server.listen(port, function () {
    console.log(`Servidor Carregado http://localhost:${server.address().port}`);
});