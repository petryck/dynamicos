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



  app.get('/OpenApp', (req, res) => {
    var id = req.query.id;

    var sql = `SELECT * FROM SIRIUS.modulos WHERE IdModulo = ${id}`;

      connection.query(sql, function(err2, results){

        if(results.length > 0){
  
          var saida = {
            id:results[0]['IdModulo'],
            page:'Apps/'+results[0]['Adress']+'.html',
            w:results[0]['w'],
            h:results[0]['h'],
            name:results[0]['Name'],
            status: true
          }
          res.json(saida)

        }else{
          var saida = {
            status: false
          }
          res.json(saida);
        }
      
      })

  })


  app.post('/QueryTabelaVisitantes', function (req, res) {
    var arrayLiteral2 = [];
    
    var sql = `SELECT *, 
    SIRIUS.colaboradores.nome as nome_acompanhante, 
    SIRIUS.cad_visitantes.nome as nome_visitantes,
    SIRIUS.filial.nome as nome_filial
    FROM SIRIUS.visitas 
    JOIN SIRIUS.cad_visitantes ON SIRIUS.cad_visitantes.id_cad_visitantes = SIRIUS.visitas.visitante
    JOIN SIRIUS.colaboradores ON SIRIUS.colaboradores.id_colaboradores = SIRIUS.visitas.acompanhante
    JOIN SIRIUS.filial ON SIRIUS.filial.id_filial = SIRIUS.visitas.filial`;
  
  
  
  
  
    
            connection.query(sql, function(err2, results){
                
              results.forEach(e => {
                var button_temp = '';
                var cor = 'btn-success';
  
                if(e.data_saida == null || e.data_saida == ''){
                  cor = 'btn-danger'
                  button_temp = `<button class="menu-item btn_modal" data-altura="255px" data-largura="536px" data-janela="administrativo/Add_saida_visitantes" id="${e.id_visitas}">Saída</button>`;
                }
  
  
  
  
               
  
  
  
                var btn = `<div class="btn_toogle">
                <button type="button" class="btn ${cor} btn_tootle_open">
                  <i class="bi bi-list"></i>
                </button>
                <div class="container window_opt" style="min-width: 0;width: 125px;">
                  <button class="menu-item btn_modal" data-altura="462px" data-largura="689px" data-janela="administrativo/Info_visitantes" id="${e.id_visitas}">Abrir</button> 
                 
                   ${button_temp}
                  
               </div>
               </div>`;
  
  
               var data_entrou = new Date(parseInt(e.data_entrada));
        
                var dia  = data_entrou.getDate().toString().padStart(2, '0');
                var mes  = (data_entrou.getMonth()+1).toString().padStart(2, '0'); //+1 pois no getMonth Janeiro começa com zero.
                var ano  = data_entrou.getFullYear();
  
                var hour   = data_entrou.getUTCHours();
                var minute = data_entrou.getUTCMinutes();
                var ap = "AM";
                if (hour   > 11) { ap = "PM";             }
                if (hour   > 12) { hour = hour - 12;      }
                if (hour   == 0) { hour = 12;             }
                if (hour   < 10) { hour   = "0" + hour;   }
                if (minute < 10) { minute = "0" + minute; }
              
                
              
              
                var data_entrada = dia+'-'+mes+'-'+ano;
                var hora_entrada = hour + ':' + minute + ' ' + ap;
  
                if(e.data_saida != null && e.data_saida != ''){
                  var data_saida = new Date(parseInt(e.data_saida));
                  var hour_saida   = data_saida.getUTCHours();
                  var minute_saida = data_saida.getUTCMinutes();
                  var ap_saida = "AM";
                  if (hour_saida   > 11) { ap_saida = "PM";             }
                  if (hour_saida   > 12) { hour_saida = hour_saida - 12;      }
                  if (hour_saida   == 0) { hour_saida = 12;             }
                  if (hour_saida   < 10) { hour_saida   = "0" + hour_saida;   }
                  if (minute_saida < 10) { minute_saida = "0" + minute_saida; }
                  var hora_saida = hour_saida + ':' + minute_saida + ' ' + ap_saida;
                }else{
                  var hora_saida = '';  
                }
                
                
                
               var objeto = {
                  id: e.id_visitas,
                  data: '<span style="display:none">'+ano+'-'+mes+'-'+dia+'</span><span style="white-space: nowrap;">'+data_entrada+'</span>',
                  visitante: '<span style="white-space: nowrap;">'+capitalizeFirst(e.nome_visitantes)+'</span>',
                  documento: e.documento,
                  acompanhante: e.nome_acompanhante,
                  filial: e.nome_filial,
                  motivo: '<span style="white-space: nowrap;width: 12em;overflow: hidden;text-overflow: ellipsis;">'+e.motivo+'</span>',
                  hora_entrada: '<span style="white-space: nowrap;">'+hora_entrada+'</span>',
                  hora_saida:'<span style="white-space: nowrap;">'+hora_saida+'</span>'
                  
              }
            
  
  
              arrayLiteral2.push(objeto);
              })
              
              
              
              let saida = {
                "draw": 1,
                "recordsTotal": results.length,
                "recordsFiltered": results.length,
                "data": arrayLiteral2
              } 
  
  
              res.json(saida)
            })
  })

  function capitalizeFirst(str) {
    var subst = str.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
    return subst;
  }



  server.listen(port, function () {
    console.log(`Servidor Carregado http://localhost:${server.address().port}`);
});