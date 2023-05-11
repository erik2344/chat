$(function(){
    const socket=io();
    var nick='';


    //acceder a los elementos del DOM

    const messageForm=$('#message-form');
    const messageBox=$('#message');
    const chat=$('#chat');

    const nickForm=$('#nick-form');
    const nickError=$('#nick-error');
    const nickName=$('#nick-name');

    const userNames=$('#usernames');

    //eventos

    //enviamos un mensaje al servidor
    messageForm.submit(event => {
        event.preventDefault();
        socket.emit('enviar mensaje', messageBox.val());
        messageBox.val('');
    });

    //obtenemos respuesta del servidor
    socket.on('nuevo mensaje', function(datos){

        let color="#f4f4f4";

        if(nick==datos.username){
            color="#9ff4c5";
        }

        chat.append(`<div class="msg-area mb-2 d-flex" style="background-color:${color}"<b>${datos.username} :</b><p class="msg">${datos.msg}</p></div>`);
    });


    //Nuevo usuario:

    nickForm.submit(event => {
            event.preventDefault();

            socket.emit('nuevo usuario', nickName.val(), datos=>{

                if(datos){
                    nick=nickName.val();
                    $('#nick-wrap').hide();
                    $('#content-wrap').show();
                }else{
                    nickError.html('<div class="alert alert-danger">El usuario ya existe</div>');
                }

            nickName=val('');

        });
    });

    //obtener el array de usuarios conectados:
    socket.on('nombre usuario', datos=>{
        let html='';
        let color='';
        let salir='';

        for(let i=0; i<datos.length; i++){
            if(nick==datos[i]){
                color="#027f43"
                salir='<a clas="enlace-salir" href="/">Salir</a>'
            }else{
                color="#000"
                salir='';
            }

            html+=`<p style="color: ${color}">${datos[i]} ${salir}</p>`;
        }

        userNames.html(html);
    });


})