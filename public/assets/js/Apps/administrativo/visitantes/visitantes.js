

//ativa o menu alternativo para o aplicativo
  $(document).on('mousedown', '#tabela_visitantes tr', function(e){

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
        <button class="menu-item InfoVisitante" data-id="${id}">Abrir</button>
        <button class="menu-item SaidaVisitante" data-id="${id}">Saída</button>
        <button class="menu-item" data-id="${id}">Excluir</button>
        `


        $(menu).append(btn)
        $(menu).css({"position":"absolute", "top":posY-(H+H/2),"left":posX,"display":'block',"z-index":"9999"});
        }
        
        
       
    }
  
});



$(document).on('keyup', '.input_search_visitantes', function(e){
  e.preventDefault()
  tabela_visitantes.search($(this).val()).draw()

});



$(document).on('click', '.SaidaVisitante', function(e){
  e.preventDefault()

  var id = $(this).attr('data-id')

  $.ajax({
    url:"/SaidaVisitante",
    type:'get',
    data:{
         id : id,
    },
    beforeSend : function(){
         
    }
})
.done(function(retorno){



        var id_janela = $('#window-4').length


       if(id_janela == 0){
        var win = new WinBox('Saída', {
            html: ""+retorno+"",
            id: "window-4",
            top:28.8,
            bottom: 95,
            background: "#120d19e3",
            max: false,
            class: ["no-full", "max-saida_visitante"],
            x: "center",
            y: "center",
            width: "464",
            height: "245"
        })

       }else{
        $('#window-4').click()
       }
        // dop();

       
  
    
})
.fail(function(jqXHR, textStatus, msg){
    alert(msg);
});


});



$(document).on('click', '.InfoVisitante', function(e){
  e.preventDefault()
  var id = $(this).attr('data-id')

  $.ajax({
    url:"/InfoVisitante",
    type:'get',
    data:{
         id : id,
    },
    beforeSend : function(){
         
    }
})
.done(function(retorno){

        var id_janela = $('#window-5').length


       if(id_janela == 0){
        var win = new WinBox('Saída', {
            html: ""+retorno+"",
            id: "window-5",
            top:28.8,
            bottom: 95,
            background: "#120d19e3",
            max: false,
            class: ["no-full", "max-defined"],
            x: "center",
            y: "center",
            width: "768",
            height: "538"
        })

       }else{
        $('#window-5').click()
       }
        // dop();

       
  
    
})
.fail(function(jqXHR, textStatus, msg){
    alert(msg);
});


});

$(document).on('click', '.btn_adiciona_visitante', function(e){
  e.preventDefault()

open_app('3', 'Adicionar Visitante', '40%', '60%', 'max-defined')

});

$(document).on('click', '.btn_close_adiciinarVisistante', function(e){
  e.preventDefault()

  $('#window-3').remove()

});


$(document).on('click', '.btn_confirma_visitante', function(e){
  e.preventDefault()

  if($('#from_cad_visitante #seleciona_visitante').val() != null && $('#from_cad_visitante #seleciona_visitante').val() != '' && $('#from_cad_visitante #documento').val() != '' && $('#from_cad_visitante #documento').val() != ''){
form = $("#from_cad_visitante").serialize();

  $.ajax({
    type: 'POST',
    url: '/cad_visitante',
    data: form,
    processData: false,
    success: function (data) {


      if(data == 'sucesso'){

        $('#window-3').remove();
        tabela_visitantes.ajax.reload();

      }
    
    }

  })
  }
  

});

$(document).on('click', '.btn_confirma_saida', function(e){
  e.preventDefault()
  var data_saida = $('#from_saida_visitante #data_saida_visitante').val()
  var id_saida = $('#from_saida_visitante #id_visita_saida_visitante').val()

  $.ajax({
    type: 'POST',
    url: '/salva_saida_visitante',
    data: {id:id_saida,data:data_saida},
    success: function (data) {


      if(data == 'sucesso'){

        $('#modal_geral').css('display', 'none')
        $('.corpo_modal').html('')
        tabela_visitantes.ajax.reload();
        $('#window-4').remove()

      }
    
    }

  })


});

$(document).on('click', '#btn_confirma_visita', function(e){
  e.preventDefault()

  form = $("#from_edita_visita").serialize();


  $.ajax({
    type: 'POST',
    url: '/edita_visita',
    data: form,
    processData: false,
    success: function (data) {


      if(data == 'sucesso'){

        $('#modal_geral').css('display', 'none')
        $('.corpo_modal').html('')
        tabela_visitantes.ajax.reload();

      }
    
    }

  })

});





function page_cad_visitantes(){

  var d = new Date();
var dateTimeLocalValue = (new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()).slice(0, -1);
var dateControl = document.querySelector('#window-3 input[type="datetime-local"]');
dia_hora = dateTimeLocalValue.split('.')[0].split(':')[0]
minutos = dateTimeLocalValue.split('.')[0].split(':')[1]
var retorno = dia_hora+':'+minutos
dateControl.value = retorno




$.ajax({
      type: 'POST',
      url: '/lista_colaboradores',
      success: function (data) {
        $("select[name=acompanhante]").html('')
        data.forEach(element => {
            $("#window-3 select[name=acompanhante]").append('<option value="'+element.id_colaboradores+'" >'+element.nome+'</option>')
            
        });
      }
  
    })


    $.ajax({
      type: 'POST',
      url: '/lista_filial',
      success: function (data) {

        $("select[name=filial]").html('')
        data.forEach(element => {
            $("#window-3 select[name=filial]").append('<option value="'+element.id_filial+'" >'+element.nome+'</option>')
            
        });

      }
  
    })


    $.ajax({
      type: 'POST',
      url: '/lista_visistantes',
      success: function (data) {
        

        $("#window-3 #lista_visitantes").html('')
        data.forEach(element => {

            $("#window-3 #lista_visitantes").append('<option id="'+element.id_cad_visitantes+'" value="'+element.id_cad_visitantes+' - '+element.nome+'">'+element.documento+'</option>')
            
        });

      }
  
    })

}


function page_saida_visitantes(){

  var d = new Date();
  var dateTimeLocalValue = (new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()).slice(0, -1);
  var dateControl = document.querySelector('input[type="datetime-local"]');
  dia_hora = dateTimeLocalValue.split('.')[0].split(':')[0]
  minutos = dateTimeLocalValue.split('.')[0].split(':')[1]
  var retorno = dia_hora+':'+minutos
  dateControl.value = retorno
  
var input = document.querySelector("#from_saida_visitante #name");
input.addEventListener("keypress", function(e) {
  if(!checkChar(e)) {
  e.preventDefault();
}
});

function checkChar(e) {
  var char = String.fromCharCode(e.keyCode);

  var pattern = '[a-zA-Z0-9]';
  if (char.match(pattern)) {
  return true;
}
}
  
}

function page_info_visitantes(filial, acompanhante, data_entrada, data_saida){


  var d = new Date(parseInt(data_entrada));
  var dateTimeLocalValue = d.toISOString().slice(0, -1);

  dia_hora = dateTimeLocalValue.split('.')[0].split(':')[0]
  minutos = dateTimeLocalValue.split('.')[0].split(':')[1]
  data_entrada = dia_hora+':'+minutos


  $('#data_entrada').val(data_entrada)


    
      if(data_saida != null && data_saida != ''){
          var d = new Date(parseInt(data_saida));
          var dateTimeLocalValue = d.toISOString().slice(0, -1)
          
          dia_hora = dateTimeLocalValue.split('.')[0].split(':')[0]
          minutos = dateTimeLocalValue.split('.')[0].split(':')[1]
          data_saida = dia_hora+':'+minutos


          $('#data_saida').val(data_saida)
      }



  


  $.ajax({
    type: 'POST',
    url: '/lista_filial',
    success: function (data) {

      $("#filial_visitante").html('')
      data.forEach(element => {

          console.log(filial)

          if(element.id_filial == filial){
              $("#filial_visitante").append('<option selected value="'+element.id_filial+'" >'+element.nome+'</option>')
          }else{
              $("#filial_visitante").append('<option value="'+element.id_filial+'" >'+element.nome+'</option>')
          }
          
          
      });

    }

  })


  $.ajax({
    type: 'POST',
    url: '/lista_visistantes',
    success: function (data) {
        console.log(data)

      $("#acompanhante_visitante").html('')
      data.forEach(element => {


          if(element.id_filial == acompanhante){
              $("#acompanhante_visitante").append('<option selected id="'+element.id_cad_visitantes+'" value="'+element.id_cad_visitantes+' - '+element.nome+'">'+element.documento+'</option>')
          }else{
              $("#acompanhante_visitante").append('<option id="'+element.id_cad_visitantes+'" value="'+element.id_cad_visitantes+' - '+element.nome+'">'+element.documento+'</option>')
          }

      
          
      });

    }

  })


  $.ajax({
    type: 'POST',
    url: '/lista_colaboradores',
    success: function (data) {
      $("select[name=acompanhante]").html('')
      data.forEach(element => {

          if(element.id_colaboradores == acompanhante){
              $("#acompanhante_visitante").append('<option selected value="'+element.id_colaboradores+'" >'+element.nome+'</option>')
          }else{
              $("#acompanhante_visitante").append('<option value="'+element.id_colaboradores+'" >'+element.nome+'</option>')
          }
          
      });
    }

  })

}