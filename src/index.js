const {generateMessage, generateLocationMessage} = require('./utils/message');
const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const {addUser, getUser, getUsersInRoom, removeUser} = require('./utils/users');
const publicDirectoryPath = path.join(__dirname, '../public');


app.use(express.json());
app.use(express.static(publicDirectoryPath));

// let count = 0;
io.on('connection', (socket) => {
  socket.on('messageSend', (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback('Not Allowed');
    }
    io.emit('message', generateMessage(message));
    callback();
  });

  socket.on('join', ({name, room}, callback)=>{
    const {error, user} =addUser({id: socket.id, username: name, room});
    if (error) {
     return callback(error);
    }
    socket.join(user.room);
    socket.emit('message', generateMessage('Welcome'));
    socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined`));// send message to all except the one who has joined
    callback();
  });

  socket.on('SendLocation', (location, callback)=>{
    io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${location.latitude},${location.longitute}`));
    callback();
  });

  socket.on('disconnect', ()=>{
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', generateMessage(`${user.username} has left`));
    }
  });
});

const port = process.env.PORT || 3012;

server.listen(port, ()=>{
  console.log('listening on ', port);
});
