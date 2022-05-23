
$(document).on('click', '.btn_cadstroNewColab', function(e){
  e.preventDefault()
$('#form_new_colaborador').submit()
});

$(document).on('submit', '#form_new_colaborador', function(e) {
  e.preventDefault();
  var formData = new FormData(this);
  var form = $(this);

  console.log(formData)

  $.ajax({
    type: "POST",
    enctype: 'multipart/form-data',
    url: '/cadastro_new_colaborador',
    data: formData,
    processData: false,
    contentType: false, // serializes the form's elements.
    success: function(data) {
      console.log(data)
    }
  })

});

function readURL(input) {

  if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
          $('#janelaIMG').attr('src', e.target.result);
      }

      reader.readAsDataURL(input.files[0]);
  }
}

$(document).on('change', '#imgColaborador', function(e){
  readURL(this);
});


$(document).on('click', '#janelaIMG', function(e){
  e.preventDefault()
$('#imgColaborador').click()
});



$(document).on('click', '.btn_add_colaborador', function(e){
    e.preventDefault()
  
  open_app('7', 'Cadastro de colaborador', '60%', '80%', )
  
});


$(document).on('input', '.input_pesquisa_colaboradores_portal_rh', function(e){
    e.preventDefault()
  
    tabela_colaboradoresRH.search($(this).val()).draw()
  
});

  

$(document).on('click', '.btn_close_newColaborador', function(e){
    e.preventDefault()
  
  $('#window-7').remove();
  
});