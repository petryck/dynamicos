
var info_user = {
    id:1,
    name: 'Petryck William'
}

$(document).on('click', '.menu', function(e){
    var menu = $(this).attr('data-menu');
    $('.menu_box').css('display', 'none')
    $('*[data-box="'+menu+'"]').css('display', 'block')
})

$('body').click(function(e) {
        if(!$(e.target).hasClass('menu')){
            $('.menu_box').css('display', 'none')
        }
 });


 function open_app(id) {
var id = id;

$.ajax({
    url:"/OpenApp",
    type:'get',
    data:{
         id : id,
    },
    datatype:'JSON',
    beforeSend : function(){
         
    }
})
.done(function(retorno){

    if(retorno.status == true){

        var id_janela = $('#window-'+retorno.id+'').length
       if(id_janela == 0){
        var win = new WinBox(retorno.name, {
            url: ""+retorno.page+"",
            id: "window-"+retorno.id,
            top:28.8,
            bottom: 95,
            background: "#120d19e3",
            max: false,
            class: ["no-full"],
            x: "center",
            y: "center",
            width: ""+retorno.w+"",
            height: ""+retorno.h+""
        })

        // win.buttons = {
        //     minimize: function(){

        //         alert('dsads')
        //     }
        // }

       }else{
        $('#window-'+retorno.id+'').click()
       }
        // dop();

       
    }else{
        alert('você não tem acesso')
    }
    
})
.fail(function(jqXHR, textStatus, msg){
    alert(msg);
});

   
}



