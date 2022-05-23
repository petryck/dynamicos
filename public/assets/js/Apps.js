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