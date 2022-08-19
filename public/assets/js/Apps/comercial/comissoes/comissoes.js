$(document).on('click', '.open_cadComissionado', function(e){
    e.preventDefault()
 
  console.log('dsadsa')
    open_app('11', 'Adicionar Comissionado', '460px', '250px', )
  
  })

//   $(document).on('click', '.btn_add_comissionado', function(e){
//     e.preventDefault()
 
//     open_app('11', 'Adicionar Comissionado', '460px', '250px', )
  
//   })


  $(document).on('click', '.btn_confirmarPgtos', function(e){
    e.preventDefault()
 
    open_app('12', 'Confirmar pagamentos', '1500px', '700px', )
  
  })

  $(document).on('click', '.btn_close_comissionado', function(e){
    e.preventDefault()
 
  $('#window-11').remove()
  
  })

  $(document).on('click', '.btn_excluir_comissionado', function(e){
    e.preventDefault()
    var id = $(this).attr('data-id')
    console.log(id)
  
    $.ajax({
        type: 'POST',
        url: '/remove_comissionado',
        data:{id:id},
        success: function (data) {
            tabela_ConfComissoes.ajax.reload();
         
        }
    
      })
  })
 

  $(document).on('click', '.btn_cad_comissionado', function(e){
    e.preventDefault()
 
    form = $("#from_cad_comissionado").serialize();

    if($('#from_cad_comissionado #colaboradores').val() != null && $('#from_cad_comissionado #ValorMin').val() != '' && $('#from_cad_comissionado #ValorMax').val() != '' && $('#from_cad_comissionado #Porcentagem').val() != ''){
        $.ajax({
            type: 'POST',
            url: '/cad_comissionado',
            data: form,
            processData: false,
            success: function (data) {
        
        
              if(data == 'sucesso'){
                tabela_ConfComissoes.ajax.reload();
                $('#from_cad_comissionado #colaboradores').val('')
                $('#from_cad_comissionado #ValorMin').val('')
                $('#from_cad_comissionado #ValorMax').val('')
                // $('#window-3').remove();
                // tabela_visitantes.ajax.reload();
                macOSNotif({autoDismiss:5,title:'Sucesso',subtitle:'Comissionado adicionado com sucesso.', btn2Text:null})
        
              }
            
            }
        
          })

    }
    
  
  })


  

  //ativa o menu alternativo para o aplicativo
  $(document).on('mousedown', '#tabela_ConfComissoes tr', function(e){
    var saida = $(this).find('td')[7];
   
    
    $(document).find('.window_opt').css('display', 'none');

  var el = $(this);
      menu = 'div.window_opt';
      H = el.height()-40;
      posX = e.pageX;
      posY = e.pageY;

    if( e.button == 2 ) {
      var id = $(this).attr('id')
        $(menu).html('')

        if(id){

          
            var btn = `
            <button class="menu-item abrir_comissionado" data-id="${id}">Abrir</button>
            <button class="menu-item btn_excluir_comissionado" data-id="${id}">Excluir</button>
            `


        $(menu).append(btn)
        $(menu).css({"position":"absolute", "top":posY-(H+H/2),"left":posX,"display":'block',"z-index":"9999"});
        }
        
        
       
    }
  
});

  



  function page_cad_comissoes(){

    $.ajax({
        type: 'POST',
        url: '/lista_colaboradores',
        success: function (data) {
          $("select[name=colaboradores]").html('')
          data.forEach(element => {
              $("#window-11 select[name=colaboradores]").append('<option value="'+element.id_colaboradores+'" >'+element.nome+'</option>')
              
          });
        }
    
      })

      

  }




  function TabelaConfComissoes(filtros){
    
    // $('#tabela_Fechamento_Processo').dataTable().fnClearTable();
    $('#tabela_ConfComissoes').dataTable().fnDestroy();


tabela_ConfComissoes = $('#tabela_ConfComissoes').DataTable({
        "paging":   false,
        "ordering": true,
        "info":     false,
        "lengthChange": false,
        "rowId": "id",
        "columns": [
            {"data": "nome"},
            {"data": "ValorMinimo"},
            {"data": "ValorMaximo"},
            {"data": "Porcentagem"},

         ],
        "order": [ 0, "desc"],
        "ajax": {
            "url": "/QueryTabelaConfComissoes",
            "type": "POST",
            "data": {tipo:1}
        },
    "language": {
            "url": "//cdn.datatables.net/plug-ins/1.11.5/i18n/pt-BR.json"
       }
  })

}

function TabelaConfComissoes_inside(filtros){
    
  // $('#tabela_Fechamento_Processo').dataTable().fnClearTable();
  $('#tabela_ConfComissoes_inside').dataTable().fnDestroy();


tabela_ConfComissoes_inside = $('#tabela_ConfComissoes_inside').DataTable({
      "paging":   false,
      "ordering": true,
      "info":     false,
      "lengthChange": false,
      "rowId": "id",
      "columns": [
          {"data": "nome"},
          {"data": "ValorMinimo"},
          {"data": "ValorMaximo"},
          {"data": "Porcentagem"},

       ],
      "order": [ 0, "desc"],
      "ajax": {
          "url": "/QueryTabelaConfComissoes",
          "type": "POST",
          "data": {tipo:2}
      },
  "language": {
          "url": "//cdn.datatables.net/plug-ins/1.11.5/i18n/pt-BR.json"
     }
})

}




function TabelaHistoricoComissoes_funcao(id){
  console.log('dsadsa')
$('#TabelaHistoricoComissoes').dataTable().fnClearTable();
$('#TabelaHistoricoComissoes').dataTable().fnDestroy();

TabelaHistoricoComissoes = $('#TabelaHistoricoComissoes').DataTable({
    "paging":   false,
    "ordering": true,
    "info":     false,
    "lengthChange": false,
    "rowId": "id",
    "columns": [
        {"data": "Data"},
        {"data": "Codigo"},
        {"data": "Processo"},
        {"data": "Comissionado"},
        {"data": "Vendedor"},
        {"data": "Inside"},
        {"data": "Profit"},
        {"data": "Porcentagem"},
        {"data": "Comissao_valor"},
        {"data": "Status"},
        

     ],
    "order": [ 0, "desc"],
    "ajax": {
        "url": "/QueryTabelaHistoricoComissao",
        "type": "POST",
        "data":{codigo:id},
        "dataSrc": function ( json ) {
  
   
       if(json.recordsTotal > 0){
        $('.btn_Realiza_Pagamento').attr('disabled', false)
       }else{
        $('.btn_Realiza_Pagamento').attr('disabled', true)
       }
          return json.data;
      }  
    },
"language": {
        "url": "//cdn.datatables.net/plug-ins/1.11.5/i18n/pt-BR.json"
   }
})




setTimeout(() => {
  console.log()
}, 3000);


}


$(document).on('click', '.btn_PesquisaCodigo', function(e){
e.preventDefault()
var referencia = $('.input_search_CodigoComissao').val();
console.log(referencia)

TabelaHistoricoComissoes_funcao(referencia)




})


$(document).on('click', '.btn_Realiza_Pagamento', function(e){
  e.preventDefault()
  var codigo = $('.input_search_CodigoComissao').val();
  $('.btn_Realiza_Pagamento').attr('disabled', true);

  $.ajax({
    type: 'POST',
    url: '/BaixaComissao_relatorio',
    data:{codigo:codigo},
    success: function (data) {
      if(data == 'sucesso'){
        macOSNotif({autoDismiss:5,title:'Sucesso',subtitle:'Baixas confirmadas.', btn2Text:null})

        console.log('foi')
        
        setTimeout(() => {
          TabelaHistoricoComissoes.ajax.reload();
        }, 3000);
      }
      
    }

  })

  

  
  })

