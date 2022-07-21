

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

function TabelaFechamentoProcesso(filtros){
    
    // $('#tabela_Fechamento_Processo').dataTable().fnClearTable();
    $('#tabela_Fechamento_Processo').dataTable().fnDestroy();


tabela_Fechamento_Processo = $('#tabela_Fechamento_Processo').DataTable({
        "paging":   false,
        "ordering": true,
        "info":     false,
        "lengthChange": false,
        "rowId": "Id",
        "columns": [
            {"data": "check"},
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
         "columnDefs": [{
            "orderable": false,
            "className": 'select-checkbox',
            "targets": 0
        }],
        "select": {
            "style": 'os',
            "selector": 'td:first-child'
        },
         "order": [ 1, "asc"],
        "ajax": {
            "url": "/vis_Fechamento_Processo",
            "type": "POST",
            "dataType": "json",
            "data" : {
                filtro: filtros
            },
            "dataSrc": function ( json ) {
                //Make your callback here.
                
            return json.data;

            }  
                 },
    "language": {
            "url": "//cdn.datatables.net/plug-ins/1.11.5/i18n/pt-BR.json"
       }
  })

           

                



}