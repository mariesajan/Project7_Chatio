var express = require('express'),
    app = express(),
    path = require('path'),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    usernames = [];

app.use('/js',express.static(path.join(__dirname,'public/js')));

server.listen((process.env.PORT || 3000), function() {
    console.log('server is listening to 3000.......');
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/views/index.html');
});

io.on('connection', function(socket) {

    socket.on('chat message', function(data) {
        io.emit('chat message', data);
    });

    socket.on('disconnect', function() {
        //socket.username will be undefined if here is any error with username and then disconnects. So no updation iof usernames should happen
        if (socket.username != undefined) {
            var index = usernames.indexOf(socket.username);
            usernames.splice(index, 1);
            updateUsernames();
        }
    });

    socket.on('new user', function(uname, callback) {
        if (usernames.indexOf(uname) != -1) {
            socket.emit('error found', {
                msg: "Username already taken"
            });
            callback(false);
        } else {
            callback(true);
            socket.username = uname;
            usernames.push(socket.username);
            updateUsernames();
        }
    });

    function updateUsernames() {
        io.emit('username', usernames);
    }
});
