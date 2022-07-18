var tabela_visitantes;
var tabela_colaboradoresRH;

function TabelaVisitantes(){

  tabela_visitantes = $('#tabela_visitantes').DataTable({
        "paging":   false,
        "ordering": true,
        "info":     false,
        "lengthChange": false,
        "rowId": "id",
        "columns": [
            {"data": "data"},
            {"data": "visitante"},
            {"data": "documento"},
            {"data": "acompanhante"},
            {"data": "filial"},
            {"data": "motivo"},
            {"data": "hora_entrada"},
            {"data": "hora_saida"}
         ],
         "order": [ 0, "desc"],
         "order": [ 7, "asc"],
        "ajax": {
            "url": "/QueryTabelaVisitantes",
            "type": "POST",
        },
    "language": {
            "url": "//cdn.datatables.net/plug-ins/1.11.5/i18n/pt-BR.json"
       }
  })


}


function TabelaColaboradoresRH(){


  tabela_colaboradoresRH = $('#tabela_colaboradoresRH').DataTable({
        "paging":   false,
        "ordering": true,
        "info":     false,
        "lengthChange": false,
        "rowId": "id",
        "columns": [
            {"data": "foto"},
            {"data": "nome"},
            {"data": "cpf"},
            {"data": "filial"},
            {"data": "email_sistema"},
            {"data": "StatusSistema"}
         ],
         "order": [ 0, "desc"],
        "ajax": {
            "url": "/QueryTabelaColaboradoresRH",
            "type": "POST",
        },
    "language": {
            "url": "//cdn.datatables.net/plug-ins/1.11.5/i18n/pt-BR.json"
       }
  })


}

function TabelaFechamentoProcesso(){

          // <th scope="col">Modalidade</th>
          // <th scope="col">N° Processo</th>
          // <th scope="col">Data compensação</th>
          // <th scope="col">Tipo carga</th>
          // <th scope="col">Cliente</th>
          // <th scope="col">Vendedor</th>
          // <th scope="col">Inside sales</th>
          // <th scope="col">Importador</th>
          // <th scope="col">Exportador</th>
          // <th scope="col">Comissão vendedor</th>
          // <th scope="col">Comissão IS</th>
          // <th scope="col">Valor Estimado</th>
          // <th scope="col">Valor Efetivo</th>
          // <th scope="col">Restante</th>
          console.log('vis_Fechamento_Processo')

  tabela_colaboradoresRH = $('#tabela_Fechamento_Processo').DataTable({
        "paging":   false,
        "ordering": true,
        "info":     false,
        "lengthChange": false,
        "rowId": "id",
        "columns": [
            {"data": "Id"},
            {"data": "Modalidade"},
            {"data": "NumeroProcesso"},
            {"data": "DataCompensacao"},
            {"data": "TipoCarga"},
            {"data": "Cliente"},
            {"data": "Vendedor"},
            {"data": "InsideSales"},
            {"data": "Importador"},
            {"data": "Exportador"},
            {"data": "ComissaoVendedor"},
            {"data": "ComissaoIS"},
            {"data": "ValorEstimado"},
            {"data": "ValorEfetivo"},
            {"data": "Restante"}

         ],
         "order": [ 0, "desc"],
        "ajax": {
            "url": "/vis_Fechamento_Processo",
            "type": "POST",
            "async": true
        },
    "language": {
            "url": "//cdn.datatables.net/plug-ins/1.11.5/i18n/pt-BR.json"
       }
  })



}