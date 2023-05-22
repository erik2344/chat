$(function() {
    const socket = io();
    var nick = '';
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#00ffff', '#ffff00', '#ff8000', '#8000ff'];
    const userColors = {};

    // Función para obtener un color aleatorio de la lista
    function getRandomColor() {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Obtener el color del usuario o generar uno nuevo si no existe
    function getUserColor(username) {
        if (userColors.hasOwnProperty(username)) {
            return userColors[username];
        } else {
            const color = getRandomColor();
            userColors[username] = color;
            return color;
        }
    }

    // Acceder a los elementos del DOM

    const messageForm = $('#message-form');
    const messageBox = $('#message');
    const chat = $('#chat');

    const nickForm = $('#nick-form');
    const nickError = $('#nick-error');
    const nickName = $('#nick-name');

    const userNames = $('#usernames');

    // Eventos

    // Enviamos un mensaje al servidor
    messageForm.submit(event => {
        event.preventDefault();
        socket.emit('enviar mensaje', messageBox.val());
        messageBox.val('');
    });

    // Obtenemos respuesta del servidor
    socket.on('nuevo mensaje', function(datos) {
        const color = getUserColor(datos.username);

        chat.append(`<div class="msg-area mb-2 d-flex" style="background-color:${color}"><b>${datos.username} :</b><p class="msg">${datos.msg}</p></div>`);
    });

    // Nuevo usuario
    nickForm.submit(event => {
        event.preventDefault();

        socket.emit('nuevo usuario', nickName.val(), datos => {
            if (datos) {
                nick = nickName.val();
                $('#nick-wrap').hide();
                $('#content-wrap').show();
            } else {
                nickError.html('<div class="alert alert-danger">El usuario ya existe</div>');
            }

            nickName.val('');
        });
    });

    // Obtener el array de usuarios conectados
    socket.on('nombre usuario', datos => {
        let html = '';
        let salir = '';

        for (let i = 0; i < datos.length; i++) {
            const username = datos[i];
            const color = getUserColor(username);

            if (nick == username) {
                salir = '<a clas="enlace-salir" href="/">Salir</a>';
            } else {
                salir = '';
            }

            html += `<p style="color: ${color}">${username} ${salir}</p>`;
        }

        userNames.html(html);
    });
});
