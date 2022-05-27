
$(document).on('click', '#window-7 .btn_cadstroNewColab', function(e){
  e.preventDefault()
$('#form_new_colaborador').submit()
});

$(document).on('submit', '#window-7 #form_new_colaborador', function(e) {
  e.preventDefault();
  var formData = new FormData(this);
  var form = $(this);

  
  macOSNotif({autoDismiss:5,title:'Sucesso',subtitle:'Aguarde, estamos compactando a imagem de perfil',theme:macOSNotifThemes.Dark, btn2Text:null})
  $('#window-7').remove();

  $.ajax({
    type: "POST",
    enctype: 'multipart/form-data',
    url: '/cadastro_new_colaborador',
   
    data: formData,
    processData: false,
    contentType: false, // serializes the form's elements.
    success: function(data) {
     
      tabela_colaboradoresRH.ajax.reload();
      macOSNotif({autoDismiss:5,title:'Sucesso',subtitle:'Novo colaborador cadastrado',theme:macOSNotifThemes.Dark, btn2Text:null})
      
    }
  })

});

function readURL(input) {

  if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
          $('#window-7 #janelaIMG').attr('src', e.target.result);
      }

      reader.readAsDataURL(input.files[0]);
  }
}

$(document).on('change', '#window-7 #imgColaborador', function(e){
  readURL(this);
});


$(document).on('click', '#window-7 #janelaIMG', function(e){
  e.preventDefault()
$('#imgColaborador').click()
});



$(document).on('click', '#window-6 .btn_add_colaborador', function(e){
    e.preventDefault()
  
  open_app('7', 'Cadastro de colaborador', '60%', '80%', )
  
});


$(document).on('input', '#window-6 .input_pesquisa_colaboradores_portal_rh', function(e){
    e.preventDefault()
  
    tabela_colaboradoresRH.search($(this).val()).draw()
  
});

  

$(document).on('click', '#window-7 .btn_close_newColaborador', function(e){
    e.preventDefault()
  
  $('#window-7').remove();
  
});


function cadastro_colaborador(){
  $('#window-7 input[name=cpf]').mask('000.000.000-00', {reverse: true});
  $('#window-7 input[name=telefone]').mask('(00) 0 0000-0000');
  $('#window-7 input[name=cep]').mask('00000-000');

  $.ajax({
    type: 'POST',
    url: '/lista_filial',
    success: function (data) {

      $("select[name=filial]").html('')
      data.forEach(element => {
          $("#window-7 select[name=filial]").append('<option value="'+element.id_filial+'" >'+element.nome+'</option>')
          
      });

    }

  })





  


}

function info_colaborador(variaveis){
var vars = JSON.parse(variaveis)[0];

$('#window-8 input[name=cpf]').mask('000.000.000-00', {reverse: true});
$('#window-8 input[name=telefone]').mask('(00) 0 0000-0000');
$('#window-8 input[name=cep]').mask('00000-000');

$.ajax({
  type: 'POST',
  url: '/lista_filial',
  success: function (data) {

    $("select[name=filial]").html('')
    data.forEach(element => {
        $("#window-8 select[name=filial]").append('<option value="'+element.id_filial+'" >'+element.nome+'</option>')
        
    });

  }

})



$("#window-8 input[name=nome]").val(vars.nome)
$("#window-8 input[name=data_nascimento]").val(vars.nascimento)
$("#window-8 input[name=pai]").val(vars.pai)
$("#window-8 input[name=mae]").val(vars.mae)
$("#window-8 input[name=admissao]").val(vars.admissao)
$("#window-8 input[name=bairro]").val(vars.bairro)
$("#window-8 input[name=cargo]").val(vars.cargo)
$("#window-8 input[name=categoria_cnh]").val(vars.categoria_cnh)
$("#window-8 input[name=cep]").val(vars.cep)
$("#window-8 input[name=cpf]").val(vars.cpf)
$("#window-8 input[name=email_corporativo]").val(vars.email_corporativo)
$("#window-8 input[name=email_pessoal]").val(vars.email_pessoal)
$("#window-8 input[name=login_sistema]").val(vars.email_sistema)
$("#window-8 input[name=emissao_rg]").val(vars.emissao_rg)
$("#window-8 input[name=endereco]").val(vars.endereco)
$("#window-8 input[name=escala]").val(vars.escala)
$("#window-8 input[name=estado]").val(vars.estado)

$('#window-8 select[name=filial] option[value="'+vars.filial+'"]').prop("selected", true);

$("#window-8 input[name=moda_pagamento]").val(vars.moda_pagamento)
$("#window-8 input[name=municipio]").val(vars.municipio)
$("#window-8 input[name=nacionalidade]").val(vars.nacionalidade)
$("#window-8 input[name=naturalidade]").val(vars.naturalidade)
$("#window-8 input[name=nr_cnh]").val(vars.nr_cnh)
$("#window-8 text[name=observacoes]").val(vars.observacoes)
$("#window-8 input[name=orgao]").val(vars.orgao)
$("#window-8 input[name=pis]").val(vars.pis)
$("#window-8 input[name=raca_cor]").val(vars.raca_cor)
$("#window-8 input[name=remuneracao]").val(vars.remuneracao)
$("#window-8 input[name=rg]").val(vars.rg)
$("#window-8 input[name=senha_sistema]").val(vars.senha_sistema)

$("#window-8 #janelaIMG").attr('src', vars.img_sistema)


$('#window-8 select[name=status_sistema] option[value="'+vars.sistema_status+'"]').prop("selected", true);


$("#window-8 input[name=telefone]").val(vars.telefone)
$("#window-8 input[name=validade_cnh]").val(vars.validade_cnh)
$("#window-8 .btnexcluicolaborador").attr('id', vars.id_colaboradores)
$("#window-8 .btn_salvacolab").attr('id', vars.id_colaboradores)
$("#window-8 input[name=id_colaborador]").val(vars.id_colaboradores)


}

$(document).on('dblclick', '#window-6 #tabela_colaboradoresRH tr', function(e){
  e.preventDefault()

var id = $(this).attr('id')

$.ajax({
  url:"/InfoColaborador",
  type:'get',
  data:{
       id : id,
  },
  beforeSend : function(){
       
  }
})
.done(function(retorno){

      var id_janela = $('#window-8').length


     if(id_janela == 0){
      var win = new WinBox('Informações sobre o colaborador', {
          html: ""+retorno+"",
          id: "window-8",
          top:28.8,
          bottom: 95,
          background: "#120d19fc",
          max: false,
          class: ["no-full"],
          x: "center",
          y: "center",
          width: "1152",
          height: "649"
      })

     }else{
      $('#window-8').click()
     }
      // dop();

     

  
})
.fail(function(jqXHR, textStatus, msg){
  alert(msg);
});
});


$(document).on('click', '#window-8 .btn_close_newColaborador', function(e){
  e.preventDefault()

$('#window-8').remove();

});

$(document).on('click', '.btnexcluicolaborador_ok', function(e){
  e.preventDefault()
  var id = $(this).attr('id');

  $.ajax({
    type: 'POST',
    url: '/excluir_colaborador',
    data:{id:id},
    success: function (data) {

      macOSNotif({autoDismiss:5,title:'Sucesso',subtitle:'Colaborador removido do sistema',theme:macOSNotifThemes.Dark, btn2Text:null})
      tabela_colaboradoresRH.ajax.reload();
      $('#window-8').remove();
      $('#alerta_cert').css('opacity', '0')

      setTimeout(() => {
        $('#alerta_cert').remove();
        
      }, 500);
    
    
  
    }
  
  })



});

$(document).on('click', '#window-8 .btnexcluicolaborador', function(e){
  e.preventDefault()
  var id = $(this).attr('id');

var alerta = `<div class="dialog svelte-1g5ktxe" id="alerta_cert" tabindex="0" role="dialog" aria-labelledby="info-title" aria-describedby="info-description" style="transition:opacity 1s ease; opacity:0">
            <section class="theme-warning-section svelte-1pwt7pn">
              <h3 class="svelte-1pwt7pn">Remover registro do colaborador</h3>
              <p class="svelte-1pwt7pn">Você realmente gostaria de remover o registro do colaborador?</p>
              <div class="buttons svelte-1pwt7pn"><button class="svelte-1pwt7pn cancela_alerta">Não, cancelar</button> <button id="${id}" class="confirm svelte-1pwt7pn btnexcluicolaborador_ok">Sim, remover</button></div>
            </section>
</div>`;

$('.confirm_notificacao').html(alerta)

$('#alerta_cert').css('opacity', '1')


});

function readURL2(input) {

  if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
          $('#window-8 #janelaIMG').attr('src', e.target.result);
      }

      reader.readAsDataURL(input.files[0]);
  }
}

$(document).on('change', '#window-8 #imgColaborador', function(e){
  readURL2(this);
});
$(document).on('click', '#window-8 #janelaIMG', function(e){
  e.preventDefault()
  $('#window-8 #imgColaborador').click()
});


$(document).on('click', '#window-8 .btn_salvacolab', function(e) {
  e.preventDefault();
  var form = $('#form_info_colaborador')[0];

  var formData = new FormData(form);
  

 
  $('#window-8').remove();

  $.ajax({
    type: "POST",
    enctype: 'multipart/form-data',
    url: '/salvar_colaborador',
   
    data: formData,
    processData: false,
    contentType: false, // serializes the form's elements.
    success: function(data) {
     
      tabela_colaboradoresRH.ajax.reload();
      macOSNotif({autoDismiss:5,title:'Sucesso',subtitle:'Informações salvas',theme:macOSNotifThemes.Dark, btn2Text:null})
      
    }
  })

});


$(document).on('change', '#window-7 .switch_acessos', function(e) {
  var switch_ = $(this).prop("checked");
  
  if($(this).parent().hasClass('max-heigth100')){

    $(this).parent().removeClass('max-heigth100')
  }else{
    $(this).parent().addClass('max-heigth100')
  }
 
  
  if(switch_ == true){
  
  $(this).parent().find('.corpo_acessos').css('display', 'block')
  
  }else{
  
  $(this).parent().find('.corpo_acessos').css('display', 'none')
  
  }
  
  
  });






