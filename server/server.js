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
import sql from 'mssql'
import * as compressImage from '../server/src/imgcompress.js';
import nodemailer from 'nodemailer'
import * as json2csv  from 'json2csv';
import * as pdf from 'pdf-creator-node';
import { table } from 'console'
import { clearScreenDown } from 'readline'


var lista_email = '';

// compressImage

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const port = 6050

app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname);

const server = http.Server(app);

app.use('/', express.static(path.join(__dirname, '../public')))




const connStr = {
  user: 'hc_conline_consulta',
  password: '3C23D35C-84F4-4205-80A2-D59D58A81BEF',
  database: 'headcargo_conline',
  requestTimeout: 130000,
  port:9322,
  server: 'CONLINE.SQL.HEADCARGO.COM.BR',
  pool: {
    max: 99999,
    min: 0,
    idleTimeoutMillis: 130000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
    enableArithAbort: true,
    idleTimeoutMillis: 130000
  }
}

sql.connect(connStr).then(conn => {
  global.conn = conn
  console.log('🤖 CONECTADO A DB --> HEADCARGO ')


}).catch(err => console.log(err));


    // conexao banco de dados
var connection = mysql.createConnection({
    host: "144.22.181.195",
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


  function send_email(mailOptions){
  

    var remetente = nodemailer.createTransport({
      name: 'no-reply@conline-news.com',
      host:'mail.conline-news.com',
      service:'mail.conline-news.com',
      port: 465,
      secure: true,
      pool:false,
      rateDelta:1000,
      rateLimit: 1000,
      auth:{
      user: 'sirius@conline-news.com',
      pass: 'mce191919aA' },
      debug : true
      });

      //  var remetente = nodemailer.createTransport({
      // service:'gmail',
      // auth:{
      // user: 'sirius@conline-news.com',
      // pass: 'mce191919aA' }
      // });

  //  var mailOptions = {
  //         from: 'Marketing ConLine <marketing@conline-news.com>',
  //         to: element.Email,
  //         subject: '[ConLine]-Calendário de Feriados',
  //         html: modelo_html
  //       };


  remetente.sendMail(mailOptions, function(error, info){
 

    if (error) {
    // console.log(error);
    console.log(error)
  
    } else {

    console.log('Email enviado com sucesso.');
    }

    
    // console.log(info)
    // sleep(4000)
  });



}
function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join('-');
}

app.get('/export_csv', (req, res) => {

var arrayLiteral2 = [];
var sql = `Select * From vis_Fechamento_Processo WHERE IdLogistica_House IN (${req.query.processos}) ORDER BY IdLogistica_House asc`;
      console.log(sql)

        global.conn.request()
        .query(sql)
        .then(result => {


          result.recordset.forEach(e => {

            let Data_Compensacao_Convertido = new Date(e.Data_Compensacao_Convertido)
          
  

            let numero = e.Valor_Estimado;
            let numeroFormatado = parseFloat(numero.toString().replace(",", ".")).toFixed(2);
            console.log(numeroFormatado); // -120,12

            var objeto = {
              Modalidade: e.Modalidade,
              NumeroProcesso: e.Numero_Processo,
              DataCompensacao: Data_Compensacao_Convertido,
              TipoCarga: e.Tipo_Carga,
              Cliente: e.Cliente == '' || e.Cliente == null ? 'Sem Seleção' : titleize(e.Cliente, 'cliente'),
              Vendedor: e.Vendedor == '' || e.Vendedor == null ? 'Sem Seleção' : titleize(e.Vendedor, 'vendedor'),
              InsideSales: e.Inside_Sales == '' || e.Inside_Sales == null ? 'Sem Seleção' : titleize(e.Inside_Sales, 'inside'),
              Importador: e.Importador == '' || e.Importador == null ? 'Sem Seleção' : titleize(e.Importador, 'importador'),
              Exportador: e.Exportador == '' || e.Exportador == null ? 'Sem Seleção' : titleize(e.Exportador, 'exportador'),
              ComissaoVendedor: e.Comissao_Vendedor_Pago == 1 ? 'Pago' : 'Pendente',
              ComissaoIS: e.Comissao_Inside_Sales_Pago == 1 ? 'Pago' : 'Pendente',
              ValorEstimado: e.Valor_Estimado.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}),
              ValorEfetivo: e.Valor_Efetivo.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}),
              Restante: e.Restante.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}),
              CalculoComissao: numeroFormatado
              
          }
         
         
          arrayLiteral2.push(objeto);
          })

          const myData = arrayLiteral2;

  

    const fields = [
      {
      label: 'Modalidade',
      value: 'Modalidade'
    },{
      label: 'Processo',
      value: 'NumeroProcesso'
    },{
      label: 'Data Compensacao',
      value: 'DataCompensacao'
    },{
      label: 'Tipo Carga',
      value: 'TipoCarga'
    },{
      label: 'Cliente',
      value: 'Cliente'
    },{
      label: 'Vendedor',
      value: 'Vendedor'
    },{
      label: 'Inside Sales',
      value: 'InsideSales'
    },{
      label: 'Importador',
      value: 'Importador'
    },{
      label: 'Exportador',
      value: 'Exportador'
    },{
      label: 'Comissao Vendedor',
      value: 'ComissaoVendedor'
    },{
      label: 'Comissao IS',
      value: 'ComissaoIS'
    },{
      label: 'Valor Estimado',
      value: 'ValorEstimado'
    },{
      label: 'Valor Efetivo',
      value: 'ValorEfetivo'
    },{
      label: 'Restante',
      value: 'Restante'
    },{
      label: 'Calculo Para Comissao',
      value: 'CalculoComissao'
    }
    
  ];
    
    const opts = { 
      delimiter: ';',
      encoding: 'ISO 8859-1',
      fields,
      excelStrings:true, 
      withBOM: true
    };

    const parser = new json2csv.Parser(opts);
  
    const csv = parser.parse(myData);

    res.header('Content-type', 'text/csv; charset=utf-8');
    // res.header('Content-disposition', 'attachment; filename=excel.csv'); 
    // res.write(Buffer.from('EFBBBF', 'hex')); // BOM header
    res.attachment(req.query.nome_doc+(new Date()).getTime()+'.csv');
    res.status(200).send(csv);

   })

   


})
var Row_process = 'dsa';
var mensagem_email_comissao = ``;
async function CREATETABLE_COMISSOES(processos, tipo, mensagem, codigo, data){
  

  return new Promise((resolve,reject)=>{
    var valor_total = 0;
    mensagem_email_comissao = mensagem;
    var sql = `Select * From vis_Fechamento_Processo WHERE IdLogistica_House IN (${processos}) ORDER BY IdLogistica_House asc`;
   
    

        global.conn.request()
        .query(sql)
        .then(result => {
          
          
          if(tipo == 1){
            var id_pessoa = result.recordset[0]['IdVendedor']

          }else if(tipo == 2){
            var id_pessoa = result.recordset[0]['IdInsideSales']
          }


          
          
          Row_process = `<tr>
          <td style="border-color:black;border-style:solid;border-width:1px;font-weight: 900;text-align: center">REFERENCIA</td>
          <td style="border-color:black;border-style:solid;border-width:1px;font-weight: 900;text-align: center">CLIENTE</td>
          <td style="border-color:black;border-style:solid;border-width:1px;font-weight: 900;text-align: center">VENDEDOR</td>
          <td style="border-color:black;border-style:solid;border-width:1px;font-weight: 900;text-align: center">INSIDE</td>
          <td style="border-color:black;border-style:solid;border-width:1px;font-weight: 900;text-align: center">PROFIT</td>
          <td style="border-color:black;border-style:solid;border-width:1px;font-weight: 900;text-align: center">%</td>
          <td style="border-color:black;border-style:solid;border-width:1px;font-weight: 900;text-align: center">COMISSÃO</td>
          </tr>`;
          var conut_row = 0;

        
          // LISTA PROCESSOS DO HEADCARGO
          result.recordset.forEach(e => {
            
    
            
            let Data_Compensacao_Convertido = new Date(e.Data_Compensacao_Convertido)
          
            Data_Compensacao_Convertido.setDate(Data_Compensacao_Convertido.getDate() + 1);
            Data_Compensacao_Convertido = Data_Compensacao_Convertido.toLocaleDateString("pt-US") 

            var sql = `SELECT * FROM colaboradores WHERE id_colab_head = ${id_pessoa}`;


          connection.query(sql, function(err2, resultsColaborador){
                  var id = resultsColaborador[0]['id_colaboradores'];
                  //  lista_email = 'petryck.leite@conlinebr.com.br'
                  // lista_email = 'comissao-adm@conlinebr.com.br;'+resultsColaborador[0]['email_corporativo'];
                    lista_email = 'comissao-adm@conlinebr.com.br;';
                 

                      var sql = `SELECT * FROM Comissoes WHERE IdColaborador = ${id} AND Tipo = ${tipo}`;
                  
                        connection.query(sql, function(err2, resultsComissoes){
                    
                         
                          
                          // resultsComissoes[0]['id_colaboradores']
                        
                          resultsComissoes.forEach(element => {
                            
                            // console.log(e.Valor_Estimado, element.ValorInicio)
                            //   console.log(e.Valor_Estimado, element.ValorFinal)

                            if(e.Valor_Estimado < 0){
                              var real_estimado = 0
                            }else{
                              var real_estimado = e.Valor_Estimado
                            }

                           
                            console.log(e.Numero_Processo, real_estimado, element.ValorInicio, element.ValorFinal)

                            if(real_estimado >= element.ValorInicio && real_estimado < element.ValorFinal ){
                              conut_row++
                              

                              var comissao = (e.Valor_Estimado / 100) * element.Porcentagem;

                              // if(tipo == 1){
                              //   var comissao = (e.Valor_Estimado / 100) * element.Porcentagem;
                              // }else if(tipo == 2){
                              //   element.Porcentagem = 1;
                              //   var comissao = (e.Valor_Estimado / 100) * 1;
                              // }

                              // Row_process += `<tr>
                              // <td style="border-color:black;border-style:solid;border-width:1px;white-space: nowrap;">${e.Numero_Processo}</td>
                              // <td style="border-color:black;border-style:solid;border-width:1px;">${e.Cliente == '' || e.Cliente == null ? 'Sem Seleção' : titleize(e.Cliente, 'cliente')}</td>
                              // <td style="border-color:black;border-style:solid;border-width:1px;white-space: nowrap;padding: 8px;">${e.Vendedor == '' || e.Vendedor == null ? 'Sem Seleção' : titleize(e.Vendedor, 'vendedor')}</td>
                              // <td style="border-color:black;border-style:solid;border-width:1px;white-space: nowrap;padding: 8px;">${e.Inside_Sales == '' || e.Inside_Sales == null ? 'Sem Seleção' : titleize(e.Inside_Sales, 'inside')}</td>
                              // <td style="border-color:black;border-style:solid;border-width:1px;text-align: right;white-space: nowrap;">${e.Valor_Estimado.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                              // <td style="border-color:black;border-style:solid;border-width:1px;text-align: center;white-space: nowrap;padding: 8px;">${element.Porcentagem}%</td>
                              // <td style="border-color:black;border-style:solid;border-width:1px;text-align: right;white-space: nowrap;padding: 8px;"><strong>${comissao.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</strong></td>
                              // </tr>`;
                              
                     
                              Row_process += `<tr>
                              <td style="border-color:black;border-style:solid;border-width:1px;white-space: nowrap;">${e.Numero_Processo}</td>
                              <td style="border-color:black;border-style:solid;border-width:1px;white-space: nowrap;">${e.Cliente == '' || e.Cliente == null ? 'Sem Seleção' : titleize(e.Cliente.slice(0, 20), 'cliente')}</td>
                              <td style="border-color:black;border-style:solid;border-width:1px;white-space: nowrap;padding: 8px;">${e.Vendedor == '' || e.Vendedor == null ? 'Sem Seleção' : titleize(e.Vendedor, 'vendedor')}</td>
                              <td style="border-color:black;border-style:solid;border-width:1px;white-space: nowrap;padding: 8px;">${e.Inside_Sales == '' || e.Inside_Sales == null ? 'Sem Seleção' : titleize(e.Inside_Sales, 'inside')}</td>
                              <td style="border-color:black;border-style:solid;border-width:1px;text-align: right;white-space: nowrap;">${e.Valor_Estimado.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                              <td style="border-color:black;border-style:solid;border-width:1px;text-align: center;white-space: nowrap;padding: 8px;">${element.Porcentagem}%</td>
                              <td style="border-color:black;border-style:solid;border-width:1px;text-align: right;white-space: nowrap;padding: 8px;"><strong>${comissao.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</strong></td>
                              </tr>`;
                             

                              valor_total = valor_total+comissao;


                      
                                var sql = `INSERT INTO Relatorio_comissoes (Codigo, IdProcesso, Referencia, Comissao, Data, Vendedor, Inside, Profit, Porcentagem, Comissao_valor) 
                                            VALUES
                                           ('${codigo}', '${e.IdLogistica_House}','${e.Numero_Processo}', ${tipo}, '${data}', '${e.Vendedor == '' || e.Vendedor == null ? 'Sem Seleção' : titleize(e.Vendedor, 'vendedor')}', '${e.Inside_Sales == '' || e.Inside_Sales == null ? 'Sem Seleção' : titleize(e.Inside_Sales, 'inside')}','${e.Valor_Estimado.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}','${element.Porcentagem}','${comissao.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}' )`

                                          connection.query(sql, function(err2, results){
                                            if(err2){
                                              console.log(err2)
                                            }
                                          })
                             


                                          
                            }else{
                             
                              // console.log(e.Numero_Processo, real_estimado, element.ValorInicio, element.ValorFinal)
                            }

                          });

                        
                          if(result.recordset.length == conut_row){
                       
                            if(tipo == 1){
                              var nome = result.recordset[0]['Vendedor'];
                              mensagem_email_comissao += `<br> Comissionado: <strong> ${titleize(nome, 'cliente')}<strong>`;
                              
                    
                              }else if(tipo == 2){
                                var nome = result.recordset[0]['Inside_Sales'];
                                mensagem_email_comissao += `<br> Comissionado: <strong> ${titleize(nome, 'cliente')}<strong>`;
                              }

                       
                            Row_process += `<tr>
                              <td colspan="6" style="border-color:black;border-style:solid;border-width:1px;text-align: right;padding-right:8px;">COMISSÃO TOTAL</td>
                              <td style="border-color:black;border-style:solid;border-width:1px;text-align: right;white-space: nowrap;padding: 8px;"><strong>${valor_total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</strong></td>
                              </tr>`;

                        console.log('ainda to carregando os dados')
                              // return Row_process;
                              // console.table(e)
                              
                              resolve(); 
                           }
                      
                        })
         
        
          })
          
          // console.log(result.recordset.length, conut_row)
        

          
     
          })

         
          // // return Row_process;

          
          
          


             
   })
   

  });
}



app.post('/send_mail_comissoes', async (req, res) => {
  var data = formatDate(new Date())
  var processos = JSON.parse(req.body.processos);
  var codigo = req.body.codigo;
  var responsavel = req.body.responsavel;
  var tipo = req.body.tipo;



  var de_new = new Date(req.body.de+'T00:00:00')
  var ate_new = new Date(req.body.ate+'T00:00:00')
  var new_data_de = padTo2Digits(de_new.getDate())+'/'+padTo2Digits(de_new.getMonth() + 1)+'/'+de_new.getFullYear();
  var new_data_ate = padTo2Digits(ate_new.getDate())+'/'+padTo2Digits(ate_new.getMonth() + 1)+'/'+ate_new.getFullYear();
    


 
  var assunto = `[ConLine]- Pagamento Comissões`;
  if(tipo == 1){
    var mensagem_email = `Olá, segue processos para pagamento de comissão <strong>Vendedor</strong>.`;
        mensagem_email += `<br> De: <strong> ${new_data_de}</strong> Até: <strong> ${new_data_ate}</strong>`;
  }else if(tipo == 2){
    var mensagem_email = `Olá, segue processos para pagamento de comissão <strong>Inside</strong>.`;
        mensagem_email += `<br> De: <strong> ${new_data_de}</strong> Até: <strong> ${new_data_ate}</strong>`;
  }

await CREATETABLE_COMISSOES(processos, tipo, mensagem_email, codigo, data);

console.log('ja enviei o email')

    

   ejs.renderFile(path.join(__dirname, '../public/Apps/TemplatesEmail/Comissaos_VendedorInside.ejs'), { responsavel:responsavel, texto: mensagem_email_comissao, processos: Row_process, codigo: codigo }, function (err, data) {
    if (err) {
        console.log(err);
    } else {
        var mailOptions = {
                from: 'Sirius OS <sirius@conline-news.com>',
                to: lista_email,
                subject: assunto,
                html: data
              };
              send_email(mailOptions)


              
              res.send('ok')
    }
    
    });

})

app.post('/send_mail_comissoes_nao_usar', (req, res) => {
  var data = formatDate(new Date())

  var processos = JSON.parse(req.body.processos);

// console.log(processos)

processos.forEach(element => {

  console.log(element)
});


  res.send('ok')

  return false;

  var html = `<center style="width: 100%; table-layout: fixed;">
  <div style="background-color: #f8f9fa; width: 100%; max-width: 600px; margin: 0 auto;">
    <table class="m_-284055676835661507container" style="max-width: 600px; width: 600px; word-break: break-word; margin: 0 auto;" role="presentation" border="0" width="600" cellspacing="0" cellpadding="0" align="center" bgcolor="#FFFFFF">
      <tbody>
        <tr>
          <td id="m_-284055676835661507moduleContainer" style="background-color: #ffffff;" align="center" valign="top" bgcolor="#ffffff">
            <table id="m_-284055676835661507headerLogoCTAModulefea5f133-4261-4101-ace3-f19e2be0486d" style="max-width: 600px; width: 100%; background: #f8f9fa;" role="presentation" border="0" width="600" cellspacing="0" cellpadding="0" align="center">
              <tbody>
                <tr>
                  <td id="m_-284055676835661507header-Logo-cta0a4e22de-622c-4c98-9dc7-25eb34d738f0" class="m_-284055676835661507header" dir="ltr" style="padding: 24px 24px 24px 30px;" valign="top">
                    <table style="max-width: 600px; width: 100%;" role="presentation" border="0" width="600" cellspacing="0" cellpadding="0" align="left">
                      <tbody>
                        <tr>
                          <td class="m_-284055676835661507width50 m_-284055676835661507pad-l0" style="font-family: 'Google Sans', 'Noto Sans JP', Arial, sans-serif; padding-left: 20px; font-size: 14px; vertical-align: middle; width: 99.6283%; text-align: right;" align="left" valign="middle" width="300">
                            <p>
                              <img class="m_-284055676835661507logo m_-284055676835661507no-arrow CToWUd" style="float: left;" src="https://conlinebr.com.br/logosirius_preta.png" alt="Google Cloud" width="154" height="61" />Rafael Magalh&atilde;es
                            </p>
                            <p>${data}</p>
                          </td>
                          <td class="m_-284055676835661507showMobileHeaderCTA" style="font-family: 'Google Sans', 'Noto Sans JP', Arial, sans-serif; font-size: 14px; vertical-align: middle; width: 55.7621%; text-align: right; display: none;" align="right" valign="middle" width="300">
                            <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="right">
                              <tbody>
                                <tr>
                                  <td dir="ltr" style="border-radius: 4px;" align="right" bgcolor="#1a73e8">
                                    <a class="m_-284055676835661507whiteText" style="font-family: 'Google Sans','Noto Sans JP',Arial,sans-serif; color: #ffffff; text-decoration: none; font-size: 14px; letter-spacing: 1px; font-weight: bold; border-radius: 4px; border: 1px solid #1a73e8; margin: 0; padding: 14px 16px 14px 16px; display: inline-block;" href="https://go.cloudplatformonline.com/ODA4LUdKVy0zMTQAAAGFu64YaFlB_CTrqKZdd6nw54VKpoijqn9z6z0Iu0R9XB3LClbCbQUq9KfEltcl-sGBc-Vrseo=" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://go.cloudplatformonline.com/ODA4LUdKVy0zMTQAAAGFu64YaFlB_CTrqKZdd6nw54VKpoijqn9z6z0Iu0R9XB3LClbCbQUq9KfEltcl-sGBc-Vrseo%3D&amp;source=gmail&amp;ust=1658425432932000&amp;usg=AOvVaw0E7TcrfN_UKeM4UpxY7Zhq">Baixe agora</a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <table id="m_-284055676835661507salutationModule" style="max-width: 600px; width: 100%;" role="presentation" border="0" width="600" cellspacing="0" cellpadding="0" align="center">
              <tbody>
                <tr>
                  <td class="m_-284055676835661507inner-container" dir="ltr" style="padding: 16px 50px 4px 50px;" valign="top">
                    <p id="m_-284055676835661507greeting" style="font-family: 'Google Sans Text&rsquo;,&rsquo;Noto Sans JP',Arial,sans-serif; font-size: 14px; line-height: 24px; color: #5f6368; text-align: left; margin: 0; padding: 0; font-weight: bold;">Ol&aacute;,</p>
                  </td>
                </tr>
              </tbody>
            </table>
            <table id="m_-284055676835661507bodyCopyModule" style="max-width: 600px; width: 100%;" role="presentation" border="0" width="600" cellspacing="0" cellpadding="0" align="center">
              <tbody>
                <tr>
                  <td class="m_-284055676835661507inner-container" dir="ltr" style="padding: 8px 50px 8px 50px;" valign="top">
                    <p id="m_-284055676835661507bodyCopy" style="font-family: 'Google Sans Text&rsquo;,&rsquo;Noto Sans JP',Arial,sans-serif; font-size: 14px; line-height: 24px; color: #5f6368; margin: 0; padding: 0; text-align: left;">
                      <strong>Segue processos liberados para pagamento de comiss&otilde;es</strong>
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <table id="m_-284055676835661507unorderedListModule1af4d590-54fa-4d56-80f6-d6af431bf449" style="max-width: 600px; width: 100%;" role="presentation" border="0" width="600" cellspacing="0" cellpadding="0" align="center">
              <tbody>
                <tr>
                  <td class="m_-284055676835661507inner-container" dir="ltr" style="padding: 8px 50px 8px 50px;" valign="top">
                    <div id="m_-284055676835661507UnorderedListf36fcae2-6463-4656-9a43-947d2d199022" style="font-family: 'Google Sans Text&rsquo;,&rsquo;Noto Sans JP',Arial,sans-serif; font-size: 14px; line-height: 24px; color: #5f6368; margin: 0; padding: 0; text-align: left;">
                      <ul style="padding: 0; margin: 0;">
                        <li>
                        <strong>Pr&aacute;ticas de seguran&ccedil;a:</strong>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
       
            <br />
            <table id="m_-284055676835661507footerModule" style="max-width: 600px; width: 100%; background: #f8f9fa;" role="presentation" border="0" width="600" cellspacing="0" cellpadding="0" align="center">
              <tbody>
                <tr>
                  <td class="m_-284055676835661507inner-container" style="padding: 40px 50px 0 50px;" valign="top">
                    <table style="max-width: 600px; width: 100%;" role="presentation" border="0" width="600" cellspacing="0" cellpadding="0" <tbody>
                      <tr>
                        <td>
                          <table style="width: 100%;" role="presentation" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                              <tr>
                                <td dir="ltr" style="padding-bottom: 16px;" align="left">
                                  <table style="width: 100%;" role="presentation" border="0" width="100%" cellspacing="0" cellpadding="0">
                                    <tbody>
                                      <tr>
                                        <td dir="ltr" style="vertical-align: middle;" align="left" valign="middle">
                                          <img id="m_-284055676835661507footerLogo" class="m_-284055676835661507no-arrow CToWUd" style="width: 109px; display: block; margin: 0px; border: none;" src="https://conlinebr.com.br/logosirius_preta.png" alt="Google Cloud" width="140" height="43" />
                                        </td>
                                        <td dir="ltr" style="vertical-align: middle; display: none!important;" align="right" valign="middle">
                                          <img id="m_-284055676835661507footerIcons" class="m_-284055676835661507no-arrow CToWUd" style="width: 137px; display: none!important; margin: 0; border: none;" src="https://conlinebr.com.br/logosirius_preta.png" width="137" />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td dir="ltr" style="font-family: 'Google Sans Text&rsquo;,&rsquo;Noto Sans JP',Arial,sans-serif; font-size: 12px; font-weight: 400; line-height: 18px; color: #5f6368; margin: 0; padding: 0; text-align: left; padding-bottom: 18px;">
                                  <div id="m_-284055676835661507footer-copyright-address">&copy; 2022 SiriusOS</div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td class="m_-284055676835661507inner-container m_-284055676835661507social-container" style="padding: 0 50px 40px 35px;" valign="top">
            <table style="max-width: 600px; width: 100%;" role="presentation" border="0" width="600" cellspacing="0" cellpadding="0">
              <tbody>
                <tr>
                  <td>
                    <table style="width: 100%;" role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tbody>
                        <tr>
                          <td align="left">
                            <div id="m_-284055676835661507footerlinks">
                              <table style="width: auto;" role="presentation" border="0" cellspacing="0" cellpadding="0">
                                <tbody>
                                  <tr>
                                    <td style="width: 48px; font-family: 'Roboto',Arial,sans-serif;" width="48">
                                      <img class="CToWUd" style="height: 48px;" src="https://ci3.googleusercontent.com/proxy/Ocfa0OsbBWMHgEVhCXF-bJGFcmjvAkiFsEYOTxWqnt3zTERwMJ2y6Z1Gi09_bVpTaDZgOa1QIuOv-qIR4pbCfbeBMJxgCIvYEVwg7-g5xARbyNVS2PVVR2U=s0-d-e1-ft#https://lp.cloudplatformonline.com/rs/808-GJW-314/images/blog-a11y.png" alt="Blog" height="48" border="0" />
                                    </td>
                                    <td style="width: 48px; padding-left: 10px; font-family: 'Roboto',Arial,sans-serif;" width="48">
                                      <img class="CToWUd" style="height: 48px;" src="https://ci5.googleusercontent.com/proxy/zYjPz8Z0RjuUpt9yF9HxxmDZo9_ACAJisQtVqZ7PpbcBOg8s0-qL678khRAjBHXR7JKFkUqhKxVagOdOIyU5RNH1Nq6dcI1LOZBDgZw8CjcFLvPKtIR3ryPe5g=s0-d-e1-ft#https://lp.cloudplatformonline.com/rs/808-GJW-314/images/github-a11y.png" alt="GitHub" height="48" border="0" />
                                    </td>
                                    <td style="width: 48px; padding-left: 10px; font-family: 'Roboto',Arial,sans-serif;" width="48">
                                      <img class="CToWUd" style="height: 48px;" src="https://ci5.googleusercontent.com/proxy/P4-kMwIH20UTWoMxQXfuxS8bDbU4p1VpRUfQRv2lniW3lDiHdFR9bT8kp4XSx0jwuXRDahWAWYkSFDICDtRkizBCm_40dhv5jwaKogi2Rsq5yYrqR_Jn3377Thka=s0-d-e1-ft#https://lp.cloudplatformonline.com/rs/808-GJW-314/images/linkedin-a11y.png" alt="LinkedIn" height="48" border="0" />
                                    </td>
                                    <td style="width: 48px; padding-left: 10px; font-family: 'Roboto',Arial,sans-serif;" width="48">
                                      <img class="CToWUd" style="height: 48px;" src="https://ci3.googleusercontent.com/proxy/RQaprs5bsnsypbF1Fk8FuGt0sK_SVYFedXHINuCu6LE8dC4lMjED0K_gEZReT8X1dHGaajLqlH7SbEdyN_kdJGF-qCO55wFB8xnX-pjwXhB93LFjMPMcZKyKcf8=s0-d-e1-ft#https://lp.cloudplatformonline.com/rs/808-GJW-314/images/twitter-a11y.png" alt="Twitter" height="48" border="0" />
                                    </td>
                                    <td style="width: 48px; padding-left: 10px; font-family: 'Roboto',Arial,sans-serif;" width="48">
                                      <img class="CToWUd" style="height: 48px;" src="https://ci6.googleusercontent.com/proxy/fDUrH2Y9sy86_A6NCrvXTHsY7et3rBY5y9YARJ1pYcLpO4BZufjHoHYor-OrgtRVhP9fbjrplysF_xCiNGd-Zb6SugBhXYkyquMPNGNMPnkCCkzU2PkikQbH_sGn=s0-d-e1-ft#https://lp.cloudplatformonline.com/rs/808-GJW-314/images/facebook-a11y.png" alt="Facebook" height="48" border="0" />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
  </div>
</center>`;


    var mailOptions = {
          from: 'Sirius OS <marketing@conline-news.com>',
          to: 'petryck.leite@conlinebr.com.br',
          subject: '[Sirius]- Pagamento Vendedor',
          html: html
        };
  send_email(mailOptions)

  // path.join(__dirname, '../public/Apps/'+results[0]['Adress']+'.html')

  res.send('ok')
})



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

  app.get('/loading', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/loading.html'))
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


// function titleize(text, onde) {
  
//   var loweredText = text.toLowerCase();
//   var words = loweredText.split(" ");
//   var words = loweredText.split("  ");
//   for (var a = 0; a < words.length; a++) {
//       var w = words[a];

//       var firstLetter = w[0];
//       console.log(firstLetter)
//       w = firstLetter + w.slice(1);

//       words[a] = w;
//   }
//   return words.join(" ");
// }

function titleize(str) {
  var subst = str.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
  return subst;
}

app.post('/lista_vendedores', (req, res) => {
  // var page = req.query.page;

  var sql = `Select
  Fnc.IdPessoa,
  Fnc.Nome,
  Fnc.Foto
From
  vis_Funcionario Fnc
Left Outer Join
  cad_Equipe_Tarefa_Membro Etm on Etm.IdFuncionario = Fnc.IdPessoa
Join
  cad_Equipe_Tarefa Etr on Etr.IdEquipe_Tarefa = Etm.IdEquipe_Tarefa and (Etr.IdEquipe_Tarefa = 62)
Where
  Fnc.Ativo = 1`;
      global.conn.request()
      .query(sql)
      .then(result => {

        res.json(result.recordset)
      })
      .catch(err => {
        console.log(err)
        return err;
      });


})

  app.post('/vis_Fechamento_Processo', (req, res) => {
    // console.log(req.body)
    var arrayLiteral2 = [];
    if(req.body.filtro){
      var filtros = JSON.parse(req.body.filtro)
      console.log(filtros)
  
    }


  var where = `WHERE IdLogistica_House is not null `;

// --------------------------------------------------------------------------------------------------------
  if(filtros.comissaoIS.pago == true && filtros.comissaoIS.sem_recebimento == true){
    where += `AND (Comissao_Inside_Sales_Pago = 1 OR Comissao_Inside_Sales_Pago = 0) `
  }else if(filtros.comissaoIS.pago == false && filtros.comissaoIS.sem_recebimento == false){

  }else if(filtros.comissaoIS.pago == true && filtros.comissaoIS.sem_recebimento == false){
    where += `AND Comissao_Inside_Sales_Pago = 1 `
  }else if(filtros.comissaoIS.pago == false && filtros.comissaoIS.sem_recebimento == true){
    where += `AND Comissao_Inside_Sales_Pago = 0 `
  }

// --------------------------------------------------------------------------------------------------------

  if(filtros.comissaoVendedor.pago == true && filtros.comissaoVendedor.sem_recebimento == true){
    where += `AND (Comissao_Vendedor_Pago = 1 OR Comissao_Vendedor_Pago = 0) `
  }else if(filtros.comissaoVendedor.pago == false && filtros.comissaoVendedor.sem_recebimento == false){

  }else if(filtros.comissaoVendedor.pago == true && filtros.comissaoVendedor.sem_recebimento == false){
    where += `AND Comissao_Vendedor_Pago = 1 `
  }else if(filtros.comissaoVendedor.pago == false && filtros.comissaoVendedor.sem_recebimento == true){
    where += `AND Comissao_Vendedor_Pago = 0 `
  }

// --------------------------------------------------------------------------------------------------------
// PENDENTER - Em aberto / Parcialmente pago
// SEM PAGAMENTO - Sem acerto agente
// PAGO - Pago

var codigo_agente = '';
var conatgem_agente = 0;
if(filtros.agente.pago == true){
  if(conatgem_agente == 0){
    codigo_agente += `3`
    conatgem_agente++;
  }else{
    codigo_agente += `,3`
  }
  
}

if(filtros.agente.sem_recebimento == true){
  if(conatgem_agente == 0){
    codigo_agente += `0`
    conatgem_agente++;
  }else{
    codigo_agente += `,0`
  }
}

if(filtros.agente.pendente == true){
  if(conatgem_agente == 0){
    codigo_agente += `1,2`
    conatgem_agente++;
  }else{
    codigo_agente += `,1,2`
  }
}

if(filtros.agente.pendente == false && filtros.agente.sem_recebimento == false && filtros.agente.pago == false){
  codigo_agente = `0,1,2,3`
}

where += `AND AgenteCodigo in (${codigo_agente}) `

// --------------------------------------------------------------------------------------------------------
var codigo_recebimento = '';
var conatagem_recebimento = 0;

if(filtros.recebimento.recebido == true){
  if(conatagem_recebimento == 0){
    codigo_recebimento += `3`
    conatagem_recebimento++;
  }else{
    codigo_recebimento += `,3`
  }
  
}

if(filtros.recebimento.sem_recebimento == true){
  if(conatagem_recebimento == 0){
    codigo_recebimento += `0`
    conatagem_recebimento++;
  }else{
    codigo_recebimento += `,0`
  }
}

if(filtros.recebimento.pendente == true){
  if(conatagem_recebimento == 0){
    codigo_recebimento += `1,2`
    conatagem_recebimento++;
  }else{
    codigo_recebimento += `,1,2`
  }
}

if(filtros.recebimento.pendente == false && filtros.recebimento.sem_recebimento == false && filtros.recebimento.recebido == false){
  codigo_recebimento = `0,1,2,3`
}

where += `AND RecebimentoCodigo in (${codigo_recebimento}) `

// --------------------------------------------------------------------------------------------------------
var codigo_pagamento = '';
var conatagem_pagamento = 0;

if(filtros.pagamento.pago == true){
  if(conatagem_pagamento == 0){
    codigo_pagamento += `3`
    conatagem_pagamento++;
  }else{
    codigo_pagamento += `,3`
  }
  
}

if(filtros.pagamento.sem_recebimento == true){
  if(conatagem_pagamento == 0){
    codigo_pagamento += `0`
    conatagem_pagamento++;
  }else{
    codigo_pagamento += `,0`
  }
}

if(filtros.pagamento.pendente == true){
  if(conatagem_pagamento == 0){
    codigo_pagamento += `1,2`
    conatagem_pagamento++;
  }else{
    codigo_pagamento += `,1,2`
  }
}

if(filtros.pagamento.pendente == false && filtros.pagamento.sem_recebimento == false && filtros.pagamento.pago == false){
  codigo_pagamento = `0,1,2,3`
}

where += `AND PagamentoCodigo in (${codigo_pagamento}) `

where += `AND Data_Compensacao_Convertido between '${filtros.data.de}' and '${filtros.data.ate}' `

// --------------------------------------------------------------------------------------------------------
if(filtros.calaborador.vendedor != 0){
  where += `AND IdVendedor = ${filtros.calaborador.vendedor} `
}

if(filtros.calaborador.inside != 0){
  where += `AND IdInsideSales = ${filtros.calaborador.inside} AND IdVendedor not in (${filtros.calaborador.inside})`
}

// --------------------------------------------------------------------------------------------------------

var element_contagem = 0;
var teste_saida = filtros.modal;
var modais_filtro = [];
modais_filtro.push(filtros.modal.EA);
modais_filtro.push(filtros.modal.EM);
modais_filtro.push(filtros.modal.TE);
modais_filtro.push(filtros.modal.IA);
modais_filtro.push(filtros.modal.IM);
modais_filtro.push(filtros.modal.TI);
modais_filtro.push(filtros.modal.NA);
modais_filtro.push(filtros.modal.CB);
modais_filtro.push(filtros.modal.TN);


modais_filtro.forEach(element => {

    if(element == true){
    element_contagem++;
    }

});
// for (let index = 0; index < modais_filtro.length; index++) {

//   console.log('dsa')
// console.log(modais_filtro[index])
//   // if(modais_filtro.modal[index] == true){
//   //   element++;
//   // }
  
// }






var contagem_modal = 0
var contagem_modal_or = 0

if(filtros.modal.IM == true && contagem_modal == 0){
  
  if(element_contagem > 1){
    where += `AND ( Modalidade = 'IM' `
  }else{
    where += `AND Modalidade = 'IM' `
  }
  contagem_modal++
}else if(filtros.modal.IM == true && contagem_modal > 0){
  if(contagem_modal_or == (element_contagem-2)){
    where += `OR Modalidade = 'IM') `
  }else{
    where += `OR Modalidade = 'IM' `
  }
  
  contagem_modal_or++
}

if(filtros.modal.IA == true && contagem_modal == 0){
  if(element_contagem > 1){
    where += `AND ( Modalidade = 'IA' `
  }else{
    where += `AND Modalidade = 'IA' `
  }
  contagem_modal++
}else if(filtros.modal.IA == true && contagem_modal > 0){
  if(contagem_modal_or == (element_contagem-2)){
    where += `OR Modalidade = 'IA') `
  }else{
    where += `OR Modalidade = 'IA' `
  }
  contagem_modal_or++
}

if(filtros.modal.EM == true && contagem_modal == 0){
  if(element_contagem > 1){
    where += `AND ( Modalidade = 'EM' `
  }else{
    where += `AND Modalidade = 'EM' `
  }
  contagem_modal++
}else if(filtros.modal.EM == true && contagem_modal > 0){
  if(contagem_modal_or == (element_contagem-2)){
    where += `OR Modalidade = 'EM') `
  }else{
    where += `OR Modalidade = 'EM' `
  }
  contagem_modal_or++
}

if(filtros.modal.EA == true && contagem_modal == 0){
  if(element_contagem > 1){
    where += `AND ( Modalidade = 'EA' `
  }else{
    where += `AND Modalidade = 'EA' `
  }
  contagem_modal++
}else if(filtros.modal.EA == true && contagem_modal > 0){
  if(contagem_modal_or == (element_contagem-2)){
    where += `OR Modalidade = 'EA') `
  }else{
    where += `OR Modalidade = 'EA' `
  }
  contagem_modal_or++
}

//----
if(filtros.modal.NA == true && contagem_modal == 0){
  if(element_contagem > 1){
    where += `AND ( Modalidade = 'NA' `
  }else{
    where += `AND Modalidade = 'NA' `
  }
  contagem_modal++
}else if(filtros.modal.NA == true && contagem_modal > 0){
  if(contagem_modal_or == (element_contagem-2)){
    where += `OR Modalidade = 'NA') `
  }else{
    where += `OR Modalidade = 'NA' `
  }
  contagem_modal_or++
}


if(filtros.modal.CB == true && contagem_modal == 0){
  if(element_contagem > 1){
    where += `AND ( Modalidade = 'CB' `
  }else{
    where += `AND Modalidade = 'CB' `
  }
  contagem_modal++
}else if(filtros.modal.CB == true && contagem_modal > 0){
  if(contagem_modal_or == (element_contagem-2)){
    where += `OR Modalidade = 'CB') `
  }else{
    where += `OR Modalidade = 'CB' `
  }
  contagem_modal_or++
}

if(filtros.modal.TE == true && contagem_modal == 0){
  if(element_contagem > 1){
    where += `AND ( Modalidade = 'TE' `
  }else{
    where += `AND Modalidade = 'TE' `
  }
  contagem_modal++
}else if(filtros.modal.TE == true && contagem_modal > 0){
  if(contagem_modal_or == (element_contagem-2)){
    where += `OR Modalidade = 'TE') `
  }else{
    where += `OR Modalidade = 'TE' `
  }
  contagem_modal_or++
}

if(filtros.modal.TN == true && contagem_modal == 0){
  if(element_contagem > 1){
    where += `AND ( Modalidade = 'TN' `
  }else{
    where += `AND Modalidade = 'TN' `
  }
  contagem_modal++
}else if(filtros.modal.TN == true && contagem_modal > 0){
  if(contagem_modal_or == (element_contagem-2)){
    where += `OR Modalidade = 'TN') `
  }else{
    where += `OR Modalidade = 'TN' `
  }
  contagem_modal_or++
}

if(filtros.modal.TI == true && contagem_modal == 0){
  if(element_contagem > 1){
    where += `AND ( Modalidade = 'TI' `
  }else{
    where += `AND Modalidade = 'TI' `
  }
  contagem_modal++
}else if(filtros.modal.TI == true && contagem_modal > 0){
  console.log('ors:'+contagem_modal_or, 'contagem:'+element_contagem)
  if(contagem_modal_or == (element_contagem-2)){
    where += `OR Modalidade = 'TI') `
  }else{
    where += `OR Modalidade = 'TI' `
  }
  contagem_modal_or++
}


// --------------------------------------------------------------------------------------------------------


      var sql = `Select * From vis_Fechamento_Processo ${where} ORDER BY IdLogistica_House asc`;
      console.log(sql)

        global.conn.request()
        .query(sql)
        .then(result => {

// console.log(result.recordset)
// console.log(filtros)
// console.log(sql)


          result.recordset.forEach(e => {
         
            let Data_Compensacao_Convertido = new Date(e.Data_Compensacao_Convertido)
          
            Data_Compensacao_Convertido.setDate(Data_Compensacao_Convertido.getDate() + 1);
            Data_Compensacao_Convertido = Data_Compensacao_Convertido.toLocaleDateString("pt-US") 


          
           
            var objeto = {
               check: '',
               Id: e.IdLogistica_House,
               Modalidade: e.Modalidade,
               NumeroProcesso: e.Numero_Processo,
               DataCompensacao: Data_Compensacao_Convertido,
               TipoCarga: e.Tipo_Carga,
               Cliente: e.Cliente == '' || e.Cliente == null ? 'Sem Seleção' : titleize(e.Cliente, 'cliente'),
               Vendedor: e.Vendedor == '' || e.Vendedor == null ? 'Sem Seleção' : titleize(e.Vendedor, 'vendedor'),
               InsideSales: e.Inside_Sales == '' || e.Inside_Sales == null ? 'Sem Seleção' : titleize(e.Inside_Sales, 'inside'),
               Importador: e.Importador == '' || e.Importador == null ? 'Sem Seleção' : titleize(e.Importador, 'importador'),
               Exportador: e.Exportador == '' || e.Exportador == null ? 'Sem Seleção' : titleize(e.Exportador, 'exportador'),
               ComissaoVendedor: e.Comissao_Vendedor_Pago == 1 ? 'Pago' : 'Pendente',
               ComissaoIS: e.Comissao_Inside_Sales_Pago == 1 ? 'Pago' : 'Pendente',
               ValorEstimado: e.Valor_Estimado.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}),
               ValorEfetivo: e.Valor_Efetivo.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}),
               Restante: e.Restante.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
           }
         


           arrayLiteral2.push(objeto);
           })

           let saida = {
            "draw": 1,
            "recordsTotal": result.recordset.length,
            "recordsFiltered": result.recordset.length,
            "data": arrayLiteral2
          } 


          res.json(saida)
          // console.log(saida)

      
      
      //  res.json(result.recordset)
        })
        .catch(err => {
          console.log(err)
          return err;
        });


  })


  app.post('/BaixaComissao_relatorio', function (req, res) {
  
    var codigo = req.body.codigo;

    var sql = `SELECT * FROM SIRIUS.Relatorio_comissoes WHERE Codigo = ${codigo}`;

    connection.query(sql, function(err2, results){

      results.forEach(element => {

        if(element.Comissao == 1){
          var sql = `update
          mov_Logistica_House
        Set
          Comissao_Vendedor_Pago = 1
        Where
        IdLogistica_house = ${element.IdProcesso}`;
        }else{
          var sql = `update
          mov_Logistica_House
        Set
        Comissao_Inside_Sales_Pago = 1
        Where
        IdLogistica_house = ${element.IdProcesso}`;
           
        }
        
              global.conn.request()
              .query(sql)
              .then(result_head => {

                var sql_2 = `UPDATE SIRIUS.Relatorio_comissoes SET Status = 1 WHERE IdProcesso = ${element.IdProcesso}`;

                  connection.query(sql_2, function(err2, results){
                    
                  })
                
              })

      });

      res.send('sucesso')
     
    })
 
  })
  app.post('/QueryTabelaHistoricoComissao', function (req, res) {
    var arrayLiteral2 = [];
    var codigo = req.body.codigo;
    console.log(codigo)


    var sql = `SELECT * FROM SIRIUS.Relatorio_comissoes WHERE Codigo = ${codigo}`;

    connection.query(sql, function(err2, results){
          results.forEach(e => {
            
                    
                    
            var objeto = {
              id: e.IdRelatorio_comissoes,
              Codigo:e.Codigo,
              Processo: e.Referencia,
              Comissionado: (e.Comissao == 1) ? 'Vendedor' : 'Inside',
              Profit:e.Profit,
              Data:e.Data,
              Vendedor:e.Vendedor,
              Inside:e.Inside,
              Porcentagem:e.Porcentagem+'%',
              Comissao_valor:e.Comissao_valor,
              Status:(e.status == 1) ? 'Pago' : 'Pendente'
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

  app.post('/remove_comissionado', (req, res) => {
  var id = req.body.id;

    var sql = `DELETE FROM Comissoes WHERE idComissoes = ${id}`;
    console.log(sql)
    connection.query(sql, function(err2, results){
      res.json(results);
    })
  })
  


  // app.post('/lista_colaboradores_comissao', (req, res) => {
  
  //   var sql = `SELECT nome,id_colaboradores FROM SIRIUS.colaboradores
  //   JOIN Comissoes ON colaboradores.id_colaboradores = Comissoes.IdColaborador
  //   GROUP BY id_colaboradores`;
  //   connection.query(sql, function(err2, results){
  //     res.json(results);
  //   })
  // })


  

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

  app.post('/open_config_comissoes', (req, res) => {
    var id = req.body.id;
    console.log('dsadsa')

    var sql = `SELECT * FROM Comissoes WHERE idComissoes = ${id}`;
    connection.query(sql, function(err2, results){
      res.json(results);
    })

  })
  app.post('/cad_comissionado', (req, res) => {
   
    var IdColaborador_com = req.body.colaboradores;
    var ValorMin_com = req.body.ValorMin;
    var ValorMax_com = req.body.ValorMax;
    var Porcentagem_com = req.body.Porcentagem;
    var Tipo = req.body.tipo;




    var sql = `INSERT INTO Comissoes (IdColaborador, ValorInicio, ValorFinal, Porcentagem, Tipo) 
    VALUES (${parseInt(IdColaborador_com)},${parseFloat(ValorMin_com)},${parseFloat(ValorMax_com)},${parseFloat(Porcentagem_com)}, ${Tipo})`;

    connection.query(sql, function(err2, results){
    

      res.json('sucesso');
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

  app.post('/QueryTabelaConfComissoes', function (req, res) {
    var arrayLiteral2 = [];
    // console.log(req.body.tipo)
    // console.log(req.query)
    


    var sql = `SELECT * FROM SIRIUS.Comissoes
               JOIN colaboradores ON Comissoes.IdColaborador = colaboradores.id_colaboradores WHERE Tipo = ${req.body.tipo}`;

    connection.query(sql, function(err2, results){
          results.forEach(e => {
            
                    
                    
            var objeto = {
              id: e.idComissoes,
              foto:'<img src="'+e.img_sistema+'" style="width: 45px;border-radius: 17%; max-height: 45px;background: white;">',
              nome: '<span style="white-space: nowrap;">'+capitalizeFirst(e.nome)+'</span>',
              ValorMinimo:e.ValorInicio.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}),
              ValorMaximo:e.ValorFinal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}),
              Porcentagem:e.Porcentagem+'%'
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
 


  app.post('/QueryRelatorioVisitantes', function (req, res) {
    var arrayLiteral2 = [];


    if(req.body.filtro){
      var filtros = JSON.parse(req.body.filtro)
  
    }


    if(filtros.acompanhante == 0){
      filtros.de = new Date(filtros.de+'Z').getTime();
      filtros.ate = new Date(filtros.ate+'Z').getTime();

      var WHERE = `WHERE data_entrada between '${filtros.de}' and '${filtros.ate}' `;
    }else{
      filtros.de = new Date(filtros.de+'Z').getTime();
      filtros.ate = new Date(filtros.ate+'Z').getTime();

      // var data_saida = req.body.data+'Z';
  
      // var data_daisa_convert = new Date(data_saida).getTime();
      var WHERE = `WHERE data_entrada between '${filtros.de}' and '${filtros.ate}' AND acompanhante = ${filtros.acompanhante}`;
    }

    

    var sql = `SELECT *, 
    SIRIUS.colaboradores.nome as nome_acompanhante, 
    SIRIUS.cad_visitantes.nome as nome_visitantes,
    SIRIUS.filial.nome as nome_filial
    FROM SIRIUS.visitas 
    JOIN SIRIUS.cad_visitantes ON SIRIUS.cad_visitantes.id_cad_visitantes = SIRIUS.visitas.visitante
    JOIN SIRIUS.colaboradores ON SIRIUS.colaboradores.id_colaboradores = SIRIUS.visitas.acompanhante
    JOIN SIRIUS.filial ON SIRIUS.filial.id_filial = SIRIUS.visitas.filial ${WHERE}`;

console.log(sql)
  
  
  
    
            connection.query(sql, function(err2, results){
                
              results.forEach(e => {
  
           
  
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




  app.get('/Gerar_PDF_relatorio_visitante', function (req, res) {


    var html = fs.readFileSync(path.join(__dirname, '../public/Apps/relatorios/PDFvisitantes.html'), "utf8");

    

    var options = {
      format: "A2",
      orientation: "portrait",
      border: "20mm",
      header: {
          height: "0mm",
      },
      footer: {
          height: "0mm",
          contents: {
              first: 'Documento gerado por SiriusOS - ConLine Serviço de Logística',
          }
      },
      childProcessOptions: { env: 
        { OPENSSL_CONF: '/dev/null', }, 
      },
  };

//------

var arrayLiteral2 = [];





if(req.query.acompanhante == 0){
  req.query.de = new Date(req.query.de+'Z').getTime();
  req.query.ate = new Date(req.query.ate+'Z').getTime();
  var WHERE = `WHERE data_entrada between '${req.query.de}' and '${req.query.ate}' `;
}else{
  req.query.de = new Date(req.query.de+'Z').getTime();
  req.query.ate = new Date(req.query.ate+'Z').getTime();

  // var data_saida = req.body.data+'Z';

  // var data_daisa_convert = new Date(data_saida).getTime();
  var WHERE = `WHERE data_entrada between '${req.query.de}' and '${req.query.ate}' AND acompanhante = ${req.query.acompanhante}`;
}



var sql = `SELECT *, 
SIRIUS.colaboradores.nome as nome_acompanhante, 
SIRIUS.cad_visitantes.nome as nome_visitantes,
SIRIUS.filial.nome as nome_filial
FROM SIRIUS.visitas 
JOIN SIRIUS.cad_visitantes ON SIRIUS.cad_visitantes.id_cad_visitantes = SIRIUS.visitas.visitante
JOIN SIRIUS.colaboradores ON SIRIUS.colaboradores.id_colaboradores = SIRIUS.visitas.acompanhante
JOIN SIRIUS.filial ON SIRIUS.filial.id_filial = SIRIUS.visitas.filial ${WHERE}`;



        connection.query(sql, function(err2, results){
            
          results.forEach(e => {

       

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
              nome: capitalizeFirst(e.nome_visitantes),
              documento:e.documento,
              acompanhante:e.nome_acompanhante,
              filial:e.nome_filial,
              data:data_entrada,
              entrada:hora_entrada,
              saida:hora_saida
              }
        


          arrayLiteral2.push(objeto);
          })
          
          
          
          var document = {
            html: html,
            data: {
              users: arrayLiteral2,
            },
            path: path.join(__dirname, '../public/Apps/administrativo/visitantes/UltimoRelatorioVisitante.pdf'),
            type: "buffer",
          };
        
          pdf.create(document, options)
          .then((ret) => {
            res.attachment('Relatorio de Visitantes.pdf')
            res.status(200).send(ret);
          })
          .catch((error) => {
            console.error(error);
          });
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