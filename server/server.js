import mysql from 'mysql'
import express from 'express'
const app = express()
import path from 'path'
import fs from 'fs'
import cors from 'cors'
import http from 'http'
import formidable from 'formidable'
import bodyParser from 'body-parser';
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import ejs from 'ejs';
import * as compressImage from '../server/src/imgcompress.js';
import { Console } from 'console'

// compressImage

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


  app.post('/login_email', (req, res) => {
    var email = req.body.email;
  
  
    var sql = `SELECT * FROM colaboradores WHERE email_sistema = '${email}'`;
    connection.query(sql, function(err2, results){
  
      if(results.length > 0){
        res.json(results);
      }else{
        res.json('error');
      }
  
    })
  
  })

  app.post('/login_senha', (req, res) => {
    var email = req.body.email;
    var senha = req.body.senha;
  
    var sql = `SELECT * FROM colaboradores WHERE email_sistema = '${email}' AND senha_sistema = '${senha}'`;
    connection.query(sql, function(err2, results){
  
      if(results.length > 0){
        res.json(results);
      }else{
        res.json('error');
      }
  
    })
  
  })

  app.post('/info_user', (req, res) => {
    var id = req.body.id;
  
    var sql = `SELECT * FROM colaboradores WHERE id_colaboradores = '${id}'`;
    connection.query(sql, function(err2, results){
  
      if(results.length > 0){
        res.json(results);
      }else{
        res.json('error');
      }
  
    })
  
  })

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home.html'))
  })

  app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home.html'))
  })

  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'))
  })



  app.get('/OpenApp', (req, res) => {
    var id = req.query.id;

    var sql = `SELECT * FROM SIRIUS.modulos WHERE IdModulo = ${id}`;

      connection.query(sql, function(err2, results){
   

        res.render(path.join(__dirname, '../public/Apps/'+results[0]['Adress']+'.html'))

        // if(results.length > 0){
  
        //   var saida = {
        //     id:results[0]['IdModulo'],
        //     page:'Apps/'+results[0]['Adress']+'.html',
        //     w:results[0]['w'],
        //     h:results[0]['h'],
        //     name:results[0]['Name'],
        //     status: true
        //   }
        //   res.json(saida)

        // }else{
        //   var saida = {
        //     status: false
        //   }
        //   res.json(saida);
        // }
      
      })

  })

  app.post('/remove_visita', (req, res) => {
    var id_visita = req.body.id;
    var sql = `DELETE FROM visitas WHERE (id_visitas = ${id_visita})`;
    connection.query(sql, function(err2, results){
      console.log(err2)
      res.json('sucesso');
    })
  })



  app.post('/edita_visita', (req, res) => {
    var id_visita = req.body.id_visita;
    var filial = req.body.filial;
    var acompanhante = req.body.acompanhante;
    var data_saida = '';
    var motivo = req.body.motivo;
  
    if(req.body.data_saida != null && req.body.data_saida != ''){
      data_saida = req.body.data_saida+'Z';
      data_saida = new Date(data_saida).getTime();
    }
    console.log(data_saida)
    
  
    var sql = `UPDATE visitas 
                  SET data_saida = '${data_saida}',
                      motivo = '${motivo}',
                      acompanhante = '${acompanhante}',
                      filial = '${filial}'
                  WHERE (id_visitas = ${id_visita})`;
  
    connection.query(sql, function(err2, results){
      console.log(err2)
      res.json('sucesso');
    })
  
  
  
  })

  // var local = path.join(__dirname, '../public/assets/UPLOAD/colaboradores');
  // compressImage.compressImage(path.join(__dirname, '../public/assets/UPLOAD/colaboradores/118.jpg'), local)


  app.post('/cadastro_new_colaborador', async (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {

    const extensaoArquivo = files.imgColaborador.originalFilename.split('.')[1];
    const oldpath = files.imgColaborador.filepath;

    const newpath = path.join(__dirname, '../public/assets/UPLOAD/colaboradores', Math.random()+'.'+extensaoArquivo);

    var url_img = 'assets/UPLOAD/colaboradores/'+files.imgColaborador.originalFilename
      
    fs.renameSync(oldpath, newpath);

   
        var sql = `INSERT INTO colaboradores (nome, nascimento, pai, mae, naturalidade, nacionalidade, raca_cor, cep, endereco, bairro, municipio, cpf, rg, orgao, estado, emissao_rg, telefone, email_corporativo, email_pessoal,nr_cnh, categoria_cnh, validade_cnh, cargo, admissao, pis, escala, moda_pagamento, remuneracao, observacoes, sistema_status, email_sistema, senha_sistema, img_sistema, filial) 
        VALUES 
        ('${fields.nome}','${fields.data_nascimento}','${fields.pai}','${fields.mae}','${fields.naturalidade}','${fields.nacionalidade}','${fields.raca_cor}','${fields.cep}','${fields.endereco}','${fields.bairro}','${fields.municipio}','${fields.cpf}','${fields.rg}','${fields.orgao}','${fields.estado}','${fields.emissao_rg}','${fields.telefone}','${fields.email_corporativo}','${fields.email_pessoal}','${fields.nr_cnh}','${fields.categoria_cnh}','${fields.validade_cnh}','${fields.cargo}','${fields.admissao}','${fields.pis}','${fields.escala}','${fields.moda_pagamento}','${fields.remuneracao}','${fields.observacoes}',${fields.status_sistema},'${fields.login_sistema}','${fields.senha_sistema}','${url_img}',${fields.filial})`;

        connection.query(sql, function(err2, results){
       

          if(results){
            var url_img = 'assets/UPLOAD/colaboradores/'+results.insertId+'.webp'

            const newpath2 = path.join(__dirname, '../public/assets/UPLOAD/colaboradores', results.insertId+'.'+extensaoArquivo);

            const convertido = path.join(__dirname, '../public/assets/UPLOAD/colaboradores', results.insertId+'.webp');

            fs.renameSync(newpath, newpath2);
            var sql = `UPDATE colaboradores SET img_sistema = '${url_img}' WHERE (id_colaboradores = ${results.insertId})`
            connection.query(sql, function(err2, results){})

              compressImage.compressImage(newpath2, convertido).then(function(valor) {
              res.json(results.insertId);
             })

            
          }

          
          
        })
  
       
      
    });

  
  })




  app.post('/salvar_colaborador', async (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
 
    
      if(files.imgColaborador.size > 0){
        console.log('tem imagem')

        const extensaoArquivo = files.imgColaborador.originalFilename.split('.')[1];
        const oldpath = files.imgColaborador.filepath;
    
        const newpath = path.join(__dirname, '../public/assets/UPLOAD/colaboradores', Math.random()+'.'+extensaoArquivo);
    
        var url_img = 'assets/UPLOAD/colaboradores/'+files.imgColaborador.originalFilename
          
        fs.renameSync(oldpath, newpath);
    
       
        //     var sql = `INSERT INTO colaboradores (nome, nascimento, pai, mae, naturalidade, nacionalidade, raca_cor, cep, endereco, bairro, municipio, cpf, rg, orgao, estado, emissao_rg, telefone, email_corporativo, email_pessoal,nr_cnh, categoria_cnh, validade_cnh, cargo, admissao, pis, escala, moda_pagamento, remuneracao, observacoes, sistema_status, email_sistema, senha_sistema, img_sistema, filial) 
        //     VALUES 
        //     ('${fields.nome}','${fields.data_nascimento}','${fields.pai}','${fields.mae}','${fields.naturalidade}','${fields.nacionalidade}','${fields.raca_cor}','${fields.cep}','${fields.endereco}','${fields.bairro}','${fields.municipio}','${fields.cpf}','${fields.rg}','${fields.orgao}','${fields.estado}','${fields.emissao_rg}','${fields.telefone}','${fields.email_corporativo}','${fields.email_pessoal}','${fields.nr_cnh}','${fields.categoria_cnh}','${fields.validade_cnh}','${fields.cargo}','${fields.admissao}','${fields.pis}','${fields.escala}','${fields.moda_pagamento}','${fields.remuneracao}','${fields.observacoes}',${fields.status_sistema},'${fields.login_sistema}','${fields.senha_sistema}','${url_img}',${fields.filial})`;
            
        var sql = `UPDATE SIRIUS.colaboradores 
        SET 
        nome = '${fields.nome}',
        nascimento = '${fields.data_nascimento}',
        pai = '${fields.pai}',
        mae = '${fields.mae}',
        naturalidade = '${fields.naturalidade}',
        nacionalidade = '${fields.nacionalidade}',
        raca_cor = '${fields.raca_cor}',
        cep = '${fields.cep}',
        endereco = '${fields.endereco}',
        bairro = '${fields.bairro}',
        municipio = '${fields.municipio}',
        cpf = '${fields.cpf}',
        rg = '${fields.rg}',
        orgao = '${fields.orgao}',
        estado = '${fields.estado}',
        emissao_rg = '${fields.emissao_rg}',
        telefone = '${fields.telefone}',
        email_corporativo = '${fields.email_corporativo}',
        email_pessoal = '${fields.email_pessoal}',
        nr_cnh = '${fields.nr_cnh}',
        categoria_cnh = '${fields.categoria_cnh}',
        validade_cnh = '${fields.validade_cnh}',
        cargo = '${fields.cargo}',
        admissao = '${fields.admissao}',
        pis = '${fields.pis}',
        escala = '${fields.escala}',
        moda_pagamento = '${fields.moda_pagamento}',
        remuneracao = '${fields.remuneracao}',
        observacoes = '${fields.observacoes}',
        sistema_status = '${fields.status_sistema}',
        email_sistema = '${fields.login_sistema}',
        senha_sistema = '${fields.senha_sistema}',
        img_sistema = '${url_img}',
        filial = '${fields.filial}'
        WHERE (id_colaboradores = '${fields.id_colaborador}')`

            connection.query(sql, function(err2, results){
           
    
              if(results){
                var url_img = 'assets/UPLOAD/colaboradores/'+fields.id_colaborador+'.webp'
    
                const newpath2 = path.join(__dirname, '../public/assets/UPLOAD/colaboradores', fields.id_colaborador+'.'+extensaoArquivo);
    
                const convertido = path.join(__dirname, '../public/assets/UPLOAD/colaboradores', fields.id_colaborador+'.webp');
    
                fs.renameSync(newpath, newpath2);
                var sql = `UPDATE colaboradores SET img_sistema = '${url_img}' WHERE (id_colaboradores = ${fields.id_colaborador})`
                connection.query(sql, function(err2, results){})
    
                  compressImage.compressImage(newpath2, convertido).then(function(valor) {
                    
                  res.json(fields.id_colaborador);

                 })
    
                
              }
    
              
              
            })
      

      }else{
        console.log('nao tem imagem')
        var sql = `UPDATE SIRIUS.colaboradores 
        SET 
        nome = '${fields.nome}',
        nascimento = '${fields.data_nascimento}',
        pai = '${fields.pai}',
        mae = '${fields.mae}',
        naturalidade = '${fields.naturalidade}',
        nacionalidade = '${fields.nacionalidade}',
        raca_cor = '${fields.raca_cor}',
        cep = '${fields.cep}',
        endereco = '${fields.endereco}',
        bairro = '${fields.bairro}',
        municipio = '${fields.municipio}',
        cpf = '${fields.cpf}',
        rg = '${fields.rg}',
        orgao = '${fields.orgao}',
        estado = '${fields.estado}',
        emissao_rg = '${fields.emissao_rg}',
        telefone = '${fields.telefone}',
        email_corporativo = '${fields.email_corporativo}',
        email_pessoal = '${fields.email_pessoal}',
        nr_cnh = '${fields.nr_cnh}',
        categoria_cnh = '${fields.categoria_cnh}',
        validade_cnh = '${fields.validade_cnh}',
        cargo = '${fields.cargo}',
        admissao = '${fields.admissao}',
        pis = '${fields.pis}',
        escala = '${fields.escala}',
        moda_pagamento = '${fields.moda_pagamento}',
        remuneracao = '${fields.remuneracao}',
        observacoes = '${fields.observacoes}',
        sistema_status = '${fields.status_sistema}',
        email_sistema = '${fields.login_sistema}',
        senha_sistema = '${fields.senha_sistema}',
        filial = '${fields.filial}'
        WHERE (id_colaboradores = '${fields.id_colaborador}')`

        connection.query(sql, function(err2, results){
          console.log(err2)
       console.log(results)
          res.json(results)
        })

      }

       
      
    });

  
  })

  app.post('/excluir_colaborador', (req, res) => {
    var id_colab = req.body.id;
    var sql = `DELETE FROM SIRIUS.colaboradores WHERE (id_colaboradores = '${id_colab}');`;
    connection.query(sql, function(err2, results){
      res.json(results);
    })
  })

  app.post('/lista_colaboradores', (req, res) => {
  
    var sql = `SELECT * FROM SIRIUS.colaboradores`;
    connection.query(sql, function(err2, results){
      res.json(results);
    })
  })

  app.post('/lista_filial', (req, res) => {
  
    var sql = `SELECT * FROM SIRIUS.filial`;
    connection.query(sql, function(err2, results){
      res.json(results);
    })
  
  })

  app.post('/lista_visistantes', (req, res) => {
  
    var sql = `SELECT * FROM cad_visitantes`;
    connection.query(sql, function(err2, results){
      res.json(results);
    })
  })

  app.post('/consulta_visitante', (req, res) => {
    var id_visitante = req.body.id_visitante;
    
    var sql = `SELECT * FROM cad_visitantes WHERE id_cad_visitantes = ${id_visitante}`;
    connection.query(sql, function(err2, results){
      res.json(results);
    })
  })

  app.post('/cad_visitante', (req, res) => {



    
    var nome = req.body.nome;
    var documento = req.body.documento;
    var filial = req.body.filial;
    var acompanhante = req.body.acompanhante;
    var data_entrada = req.body.data_entrada+'Z';
    var motivo_entrada = req.body.motivo_entrada;
    var data_cadastro = new Date().getTime();
  
    data_entrada = new Date(data_entrada).getTime();
  
  
  
    var sql = `SELECT * FROM SIRIUS.cad_visitantes WHERE documento = ${documento}`;
  
  
    connection.query(sql, function(err2, results){
  
  
      if(results.length > 0){
        var id_visitante = results[0]['id_cad_visitantes'];
  
        sql = `INSERT INTO visitas (visitante, data_entrada, acompanhante, filial, motivo, data_cadastro) 
                VALUES ('${id_visitante}', '${data_entrada}','${acompanhante}','${filial}','${motivo_entrada}','${data_cadastro}')`;
  
        connection.query(sql, function(err2, results){
          res.json('sucesso');
        })
  
      }else{
  
        sql = `INSERT INTO cad_visitantes (nome, documento, data_cadastro) VALUES ('${nome}', '${documento}','${data_cadastro}')`;
        connection.query(sql, function(err2, results){
          var id_visitante = results.insertId;
     
  
        if(results.affectedRows > 0){
  
          sql = `INSERT INTO visitas (visitante, data_entrada, acompanhante, filial, motivo, data_cadastro) 
          VALUES (${id_visitante}, '${data_entrada}',${acompanhante},${filial},'${motivo_entrada}','${data_cadastro}')`;
  
          connection.query(sql, function(err2, results){
     
            res.json('sucesso');
          })
        }
          
  
  
        })
  
      }
  
         
    })
  
  })

  app.get('/InfoColaborador', (req, res) => {

    var id = req.query.id;

    var sql = `SELECT *
    FROM SIRIUS.colaboradores 
    WHERE id_colaboradores = ${id}`;


    connection.query(sql, function(err2, results){

      res.render(path.join(__dirname, '../public/Apps/administrativo/RecursosHumanos/infoColaborador.html'), {
        colabs:results
      });
    })

    

  
})


  app.get('/InfoVisitante', (req, res) => {

    var id = req.query.id;

    var sql = `SELECT *, 
    SIRIUS.colaboradores.nome as nome_acompanhante, 
    SIRIUS.cad_visitantes.nome as nome_visitantes,
    SIRIUS.filial.nome as nome_filial
    FROM SIRIUS.visitas 
    JOIN SIRIUS.cad_visitantes ON SIRIUS.cad_visitantes.id_cad_visitantes = SIRIUS.visitas.visitante
    JOIN SIRIUS.colaboradores ON SIRIUS.colaboradores.id_colaboradores = SIRIUS.visitas.acompanhante
    JOIN SIRIUS.filial ON SIRIUS.filial.id_filial = SIRIUS.visitas.filial WHERE id_visitas = ${id}`;


    connection.query(sql, function(err2, results){

      res.render(path.join(__dirname, '../public/Apps/administrativo/visitantes/InfoVisitante.html'), {

        documento:results[0]['documento'],
        nome:results[0]['nome_visitantes'],
        id:results[0]['id_visitas'],
        acompanhante:results[0]['acompanhante'],
        filial:results[0]['id_filial'],
        motivo:results[0]['motivo'],
        data_entrada:results[0]['data_entrada'],
        data_saida:results[0]['data_saida']
      });
    })

    

  
})


  app.get('/SaidaVisitante', (req, res) => {

      var id = req.query.id;
  
      var sql = `SELECT *, 
      SIRIUS.colaboradores.nome as nome_acompanhante, 
      SIRIUS.cad_visitantes.nome as nome_visitantes,
      SIRIUS.filial.nome as nome_filial
      FROM SIRIUS.visitas 
      JOIN SIRIUS.cad_visitantes ON SIRIUS.cad_visitantes.id_cad_visitantes = SIRIUS.visitas.visitante
      JOIN SIRIUS.colaboradores ON SIRIUS.colaboradores.id_colaboradores = SIRIUS.visitas.acompanhante
      JOIN SIRIUS.filial ON SIRIUS.filial.id_filial = SIRIUS.visitas.filial WHERE id_visitas = ${id}`;
  
  
      connection.query(sql, function(err2, results){

        res.render(path.join(__dirname, '../public/Apps/administrativo/visitantes/SaidaVisitante.html'), {
  
          documento:results[0]['documento'],
          nome:results[0]['nome_visitantes'],
          id:results[0]['id_visitas'],
          acompanhante:results[0]['acompanhante'],
          filial:results[0]['id_filial'],
          motivo:results[0]['motivo'],
          data_entrada:results[0]['data_entrada'],
          data_saida:results[0]['data_saida']
        });
      })
  
      

    
  })

  app.post('/salva_saida_visitante', (req, res) => {
  

    var id_visita = req.body.id;
    var data_saida = req.body.data+'Z';
  
    var data_daisa_convert = new Date(data_saida).getTime();
  
    var sql = `UPDATE visitas SET data_saida = '${data_daisa_convert}' WHERE (id_visitas = ${id_visita})`;
  
    connection.query(sql, function(err2, results){
    
      res.json('sucesso');
    })
  
  })


  
  app.post('/QueryTabelaColaboradoresRH', function (req, res) {
    var arrayLiteral2 = [];
    
    var sql = `SELECT SIRIUS.filial.nome as NomeFilial,
                      SIRIUS.colaboradores.nome as NomeColaborador,
                      SIRIUS.colaboradores.cpf as CpfColaborador,
                      SIRIUS.colaboradores.email_corporativo as EmailSistema,
                      SIRIUS.colaboradores.img_sistema as ImagemColaborador,
                      SIRIUS.filial.id_filial as IdFilial,
                        Case 
                          when SIRIUS.colaboradores.sistema_status = 0 Then 'Inativo'
                          when SIRIUS.colaboradores.sistema_status = 1 Then 'Ativo' End as StatusSistema,
                      SIRIUS.colaboradores.id_colaboradores as IdColaborador FROM SIRIUS.colaboradores
                      JOIN SIRIUS.filial ON SIRIUS.colaboradores.filial = SIRIUS.filial.id_filial`;
  
            connection.query(sql, function(err2, results){
                
              results.forEach(e => {
         
                
                
               var objeto = {
                  id: e.IdColaborador,
                  foto:'<img src="'+e.ImagemColaborador+'" style="width: 45px;border-radius: 17%; max-height: 45px;background: white;">',
                  nome: '<span style="white-space: nowrap;">'+capitalizeFirst(e.NomeColaborador)+'</span>',
                  cpf:e.CpfColaborador,
                  filial:e.NomeFilial,
                  email_sistema:e.EmailSistema,
                  StatusSistema:e.StatusSistema,
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
                // var ap = "AM";
                // if (hour   > 11) { ap = "PM";             }
                // if (hour   > 12) { hour = hour - 12;      }
                // if (hour   == 0) { hour = 12;             }
                if (hour   < 10) { hour   = "0" + hour;   }
                if (minute < 10) { minute = "0" + minute; }
              
                
              
              
                var data_entrada = dia+'-'+mes+'-'+ano;
                var hora_entrada = hour + ':' + minute + ' ';
  
                if(e.data_saida != null && e.data_saida != ''){
                  var data_saida = new Date(parseInt(e.data_saida));
                  var hour_saida   = data_saida.getUTCHours();
                  var minute_saida = data_saida.getUTCMinutes();
                  var ap_saida = "AM";
                  // if (hour_saida   > 11) { ap_saida = "PM";             }
                  // if (hour_saida   > 12) { hour_saida = hour_saida - 12;      }
                  // if (hour_saida   == 0) { hour_saida = 12;             }
                  if (hour_saida   < 10) { hour_saida   = "0" + hour_saida;   }
                  if (minute_saida < 10) { minute_saida = "0" + minute_saida; }
                  var hora_saida = hour_saida + ':' + minute_saida + ' ';
                }else{
                  var hora_saida = '';  
                }
                
                
                
               var objeto = {
                  id: e.id_visitas,
                  data: '<span style="display:none">'+ano+'-'+mes+'-'+' '+dia+e.data_entrada+'</span><span style="white-space: nowrap;">'+data_entrada+'</span>',
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