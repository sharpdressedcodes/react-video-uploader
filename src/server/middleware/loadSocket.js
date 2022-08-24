
ioServer.on('connection', socket => {

    console.log('io server::connection');

    //socket.on('encode', data => {});
    //socket.on('progress', progress => {});
    //socket.on('complete', () => {});
    socket.on('message', message => {
        console.log('io server::message', message);
    });
    socket.on('disconnect', () => {
        console.log('io server::disconnect');
    });

    socket.emit('message', 'ela from server');
});
