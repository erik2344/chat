module.exports = (io) => {
    let nickNames = [];
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#00ffff', '#ffff00', '#ff8000', '#8000ff'];

    function getRandomColor() {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    io.on('connection', (socket) => {
        socket.on('enviar mensaje', (datos) => {
            io.sockets.emit('nuevo mensaje', {
                msg: datos,
                username: socket.nickname
            });
        });

        socket.on('nuevo usuario', (datos, callback) => {
            if (nickNames.indexOf(datos) !== -1) {
                callback(false);
            } else {
                callback(true);
                socket.nickname = datos;
                socket.color = getRandomColor();
                nickNames.push(socket.nickname);
                io.sockets.emit('nombre usuario', nickNames);
            }
        });

        socket.on('disconnect', () => {
            if (!socket.nickname) {
                return;
            } else {
                nickNames.splice(nickNames.indexOf(socket.nickname), 1);
                io.sockets.emit('nombre usuario', nickNames);
            }
        });
    });
}
