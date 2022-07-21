var info_users;
var tabela_visitantes;
var tabela_colaboradoresRH;
var tabela_Fechamento_Processo;

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


// $(document).on("click", "#tabela_Fechamento_Processo th.select-checkbox", function() {
//   if ($("th.select-checkbox").hasClass("selected")) {
//     $('#tabela_Fechamento_Processo').rows().deselect();
//       $("th.select-checkbox").removeClass("selected");
//   } else {
//     $('#tabela_Fechamento_Processo').rows().select();
//       $("th.select-checkbox").addClass("selected");
//   }
// }).on("select deselect", function() {
//   ("Some selection or deselection going on")
//   if ($('#tabela_Fechamento_Processo').rows({
//           selected: true
//       }).count() !== $('#tabela_Fechamento_Processo').rows().count()) {
//       $("th.select-checkbox").removeClass("selected");
//   } else {
//       $("th.select-checkbox").addClass("selected");
//   }
// });

$(document).on("click", "#tabela_Fechamento_Processo th.select-checkbox", function() {
  if ($("th.select-checkbox").hasClass("selected")) {
      tabela_Fechamento_Processo.rows().deselect();
      $("th.select-checkbox").removeClass("selected");
  } else {
      tabela_Fechamento_Processo.rows().select();
      $("th.select-checkbox").addClass("selected");
  }
}).on("select deselect", function() {
  ("Some selection or deselection going on")
  if (tabela_Fechamento_Processo.rows({
          selected: true
      }).count() !== tabela_Fechamento_Processo.rows().count()) {
      $("th.select-checkbox").removeClass("selected");
  } else {
      $("th.select-checkbox").addClass("selected");
  }
});


$(document).on('keyup', '.input_search_visitantes', function(e){
    e.preventDefault()
    tabela_visitantes.search($(this).val()).draw()
  
  });
$(document).on('keyup', '.input_search_comissao_vendedores', function(e){
    e.preventDefault()
    tabela_Fechamento_Processo.search($(this).val()).draw()
  
});





$(document).on('click', '#clone_notificacao_selecao', function(e){
  e.preventDefault()

  $('.notificacao_selecao').css('display', 'none')

})


$(document).on('click', '#btn_pagar_vendedor', function(e){
  e.preventDefault()
  var lista_selecionados = tabela_Fechamento_Processo.rows({
    selected: true
}).ids()


var contagem_selecionados = [];
for (let index = 0; index < lista_selecionados.length; index++) {
contagem_selecionados.push(lista_selecionados[index])


}


$('body').append(`<iframe src="/export_csv?processos=${contagem_selecionados}" style="display:none;"></iframe>`);
  // $.ajax({
  //   type: 'POST',
  //   url: '/export_csv',
  //   data:{processos:JSON.stringify(contagem_selecionados)},
  //   success: function (data) {
  //     console.info(data)
  // // console.log(data)
         
    

  //   }

  // })

});

$(document).on('click', '#btn_pagar_inside', function(e){
  e.preventDefault()

alert('pagar inside')

});

$(document).on('click', '#btn_pagar_imprimir', function(e){
  e.preventDefault()

alert('Imprimir')

});




$(document).on('click', '.btn_envia_para_pagamento', function(e){


    var lista_selecionados = tabela_Fechamento_Processo.rows({
      selected: true
  }).ids()


console.log(lista_selecionados.length)
var contagem_selecionados = [];
for (let index = 0; index < lista_selecionados.length; index++) {
  contagem_selecionados.push(lista_selecionados[index])
  
  
}


console.log(contagem_selecionados)
  
  $('.notificacao_selecao').css('display', 'block')

  
  $('#numero_processo_selecionados_comissao').text(lista_selecionados.length)


  });




function lista_vendedores_comissao_comercial(){
  // <option value="1">Petryck William Silva Leite</option>

  $.ajax({
    type: 'POST',
    url: '/lista_vendedores',
    success: function (data) {
   
    $('#seleciona_vendedor').html('<option selected value="0">Todos</option>')
    $('#seleciona_IS').html('<option selected value="0">Todos</option>')
      data.forEach(element => {

        $('#seleciona_vendedor').append(`<option value="${element.IdPessoa}">${element.Nome}</option>`)
        $('#seleciona_IS').append(`<option value="${element.IdPessoa}">${element.Nome}</option>`)

      });

    

    }

  })
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join('-');
}


function setardatas(){
  var data = formatDate(new Date())
  $('#startDate_comissoes').val(data)
  $('#endDate_comissoes').val(data)
  
}

  
$(document).on('click', '.btn_filtrar_comissoesComerciais', function(e){
    e.preventDefault()



    var recebimento = {
      pendente:$('#checkRec_pendente').prop("checked"),
      sem_recebimento:$('#checkRec_SemRecebimento').prop("checked"),
      recebido:$('#checkRec_Recebido').prop("checked")
    }

    var pagamento = {
      pendente:$('#checkPag_Pendente').prop("checked"),
      sem_recebimento:$('#checkPag_SemPagamento').prop("checked"),
      pago:$('#checkPag_Pago').prop("checked")
    }

    var agente = {
      pendente:$('#checkAge_Pendente').prop("checked"),
      sem_recebimento:$('#checkAge_SemPagamento').prop("checked"),
      pago:$('#checkAge_Pago').prop("checked")
    }

    var comissaoVendedor = {
      pago:$('#checkComissaoVendedor_Pago').prop("checked"),
      sem_recebimento:$('#checkComissaoVendedor_SemPagamento').prop("checked")
    }

    var comissaoIS = {
      pago:$('#checkComissaoIS_Pago').prop("checked"),
      sem_recebimento:$('#checkComissaoIS_SemPagamento').prop("checked")
    }

    var calaborador = {
      vendedor:$('#seleciona_vendedor').val(),
      inside:$('#seleciona_IS').val()
    }

    var modal = {
      IM:$('#checkImpoIM').prop("checked"),
      EM:$('#checkImpoEM').prop("checked"),
      IA:$('#checkImpoIA').prop("checked"),
      EA:$('#checkImpoEA').prop("checked"),
      NA:$('#checkImpoNA').prop("checked"),
      CB:$('#checkImpoCB').prop("checked"),
      TE:$('#checkImpoTE').prop("checked"),
      TN:$('#checkImpoTN').prop("checked"),
      TI:$('#checkImpoTI').prop("checked")
    }

    var data = {
      de:$('#startDate_comissoes').val(),
      ate:$('#endDate_comissoes').val(),
    }


  var geral = {
      recebimento:recebimento,
      pagamento:pagamento,
      agente:agente,
      calaborador:calaborador,
      comissaoVendedor:comissaoVendedor,
      comissaoIS:comissaoIS,
      modal:modal,
      data:data
  }
    

    
var saida = JSON.stringify(geral);

    TabelaFechamentoProcesso(saida)

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
  



