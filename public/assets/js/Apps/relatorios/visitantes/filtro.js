
function setardatas_relatorio_visitantes(){
    var data = formatDate(new Date())
    
    $('#startDate_relatorio_visistantes').val(data+' 00:00')
    $('#endDate_relatorio_visistante').val(data+' 23:59')
    
  }

function lista_colaboradores_relatorio_visitantes(){
    $.ajax({
        type: 'POST',
        url: '/lista_colaboradores',
        success: function (data) {
          $("#window-14 #seleciona_acompanhante_relatorio").html('<option selected value="0" >Todos</option>')
          data.forEach(element => {
              $("#window-14 #seleciona_acompanhante_relatorio").append('<option value="'+element.id_colaboradores+'" >'+element.nome+'</option>')
              
          });
        }
    
      })
}

$(document).on('click','.btn_gerar_pdf_relario_visistas', function(e){

 $('.btn_gerar_pdf_relario_visistas').attr('disabled', true)
 $('.btn_gerar_pdf_relario_visistas').text('Aguarde')
var de = $('#startDate_relatorio_visistantes').val();
var ate = $('#endDate_relatorio_visistante').val();
var acompanhante = $('#seleciona_acompanhante_relatorio').val();
   
 

   $('body').append(`<iframe src="/Gerar_PDF_relatorio_visitante?acompanhante=${acompanhante}&de=${de}&ate=${ate}" style="display: none;" frameborder="0"></iframe>`)

setTimeout(() => {
    $('.btn_gerar_pdf_relario_visistas').attr('disabled', false)
    $('.btn_gerar_pdf_relario_visistas').text('Gerar')
}, 4000);
})


$(document).on('click','.btn_filtrar_relatorio_visitantes', function(e){

    var filtros = {
        de:$('#startDate_relatorio_visistantes').val(),
        ate:$('#endDate_relatorio_visistante').val(),
        acompanhante:$('#seleciona_acompanhante_relatorio').val()
    }
    var filtros = JSON.stringify(filtros);

    $('#tabela_visitantes_relatorio').dataTable().fnDestroy();
    

    tabela_visitantes_relatorio = $('#tabela_visitantes_relatorio').DataTable({
        "paging":   false,
        "ordering": true,
        "info":     false,
        "lengthChange": false,
        "columns": [
            {"data": "visitante"},
            {"data": "documento"},
            {"data": "acompanhante"},
            {"data": "filial"},
            {"data": "data"},
            {"data": "hora_entrada"},
            {"data": "hora_saida"}

         ],
         "order": [ 1, "asc"],
        "ajax": {
            "url": "/QueryRelatorioVisitantes",
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

})
