var tabela_visitantes;

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
         "order": [ 0, "desc" ],
        "ajax": {
            "url": "/QueryTabelaVisitantes",
            "type": "POST",
        },
    "language": {
            "url": "//cdn.datatables.net/plug-ins/1.11.5/i18n/pt-BR.json"
       }
  })


}