$(document).on('click', '.open_cadComissionado', function(e){
    e.preventDefault()
 
  console.log('dsadsa')
    open_app('11', 'Adicionar Comissionado', '460px', '250px', )
  
  })

//   $(document).on('click', '.btn_add_comissionado', function(e){
//     e.preventDefault()
 
//     open_app('11', 'Adicionar Comissionado', '460px', '250px', )
  
//   })


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
    // $('#tabela_ConfComissoes').dataTable().fnDestroy();


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
        },
    "language": {
            "url": "//cdn.datatables.net/plug-ins/1.11.5/i18n/pt-BR.json"
       }
  })

}
  