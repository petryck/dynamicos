var info_users;

var info_user = {
  id:1,
  name: 'Petryck William'
}


if(!localStorage.getItem("info_usuario_sirius_os")){
  window.location.href = "/login";
}else{
  info_users = JSON.parse(localStorage.getItem("info_usuario_sirius_os"));
  
}

console.log(info_users)

setInterval(() => {
  verifica_login()
}, 30000);

function verifica_login(){

  if(!localStorage.getItem("info_usuario_sirius_os")){
    window.location.href = "/login";
  }else{
    info_users = JSON.parse(localStorage.getItem("info_usuario_sirius_os"));
    
  }
}



//desabilita o botão secundário do mouse
$(document).bind("contextmenu",function(e){
    return false;
});

$(document).on('click', '.menu', function(e){
    var menu = $(this).attr('data-menu');
    $('.menu_box').css('display', 'none')
    $('*[data-box="'+menu+'"]').css('display', 'block')
})

$(document).on('click', 'body', function(e){
        if(!$(e.target).hasClass('menu')){
            $('.menu_box').css('display', 'none')
        }

        $(document).find('.window_opt').css('display', 'none');    
 });


 function open_app(id, name, w, h, classe) {

    if(classe){
        var classes2 = ["no-full", ""+classe+""]
    }else{
    var classes2 = ["no-full"]
    }

$.ajax({
    url:"/OpenApp",
    type:'get',
    data:{
         id : id,
    },
    beforeSend : function(){
         
    }
})
.done(function(retorno){



        var id_janela = $('#window-'+id+'').length


       if(id_janela == 0){
        var win = new WinBox(name, {
            html: ""+retorno+"",
            id: "window-"+id,
            top:28.8,
            bottom: 30,
            background: "#120d19fc",
            max: false,
            class: classes2,
            x: "center",
            y: "center",
            width: ""+w+"",
            height: ""+h+""
        })


       }else{
        $('#window-'+retorno.id+'').click()
       }
        // dop();

       
  
    
})
.fail(function(jqXHR, textStatus, msg){
    alert(msg);
});

   
}


$(document).on('keyup', '.input_search_visitantes', function(e){
    e.preventDefault()
    tabela_visitantes.search($(this).val()).draw()
  
  });


$(document).on('click', '.nav-link', function(e){

var input = $(this).attr('data-input');

if(input){
    
    $('.inputsearch').css('display', 'none')

    $('.'+input+'').css('display', 'block')
}

});


$(document).on('input', '#window-3 #seleciona_visitante', function() {

  
    var opt = $('#lista_visitantes').find('option[value="'+$(this).val()+'"]');
    var id_visitante = opt.length ? opt.attr('id') : null;
  
    if(id_visitante != null){
  
  
      $.ajax({
        type: 'POST',
        data: {id_visitante:id_visitante},
        url: '/consulta_visitante',
        success: function (data) {
          console.log(data[0]['documento'])
  
          $('#id_cad_visitante').val(id_visitante)
  
          $('#documento').val(data[0]['documento'])
          $('#documento').prop( "readonly", true );
  
        }
    
      })
    }else{
      $('#id_cad_visitante').val(null)
      $('#documento').val('')
      $('#documento').prop( "readonly", false );
    }
  
  
  
  });

  $(document).on('keyup', '#from_cad_visitante #documento', function(e) {

    var str = $(this).val()
    str = str.replace(/[^a-z0-9 ]/g, '');
    str = str.replace(/^\s+|\s+$/g, '');
    $(this).val(str)
  
  });
  



