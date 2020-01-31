var app = require('express')();
var chatServer = require('http').Server(app);
var io = require('socket.io')(chatServer);
var cors = require('cors')
var { addUser, getUser } = require('./users')


require('dotenv').config();
app.use(cors())
io.on('connection', (socket) => {
  console.log('io connected')
    socket.on('join', ({ name, room}, callback) => {
      const { error, user } = addUser({ id: socket.id, name, room})
      if(error) return callback(error)
      socket.emit('message', { user: 'admin', text: `welcome ${user.name} has joined`})
      socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined`})
      socket.join(user.room)
      callback()
    })

    socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id)
      io.to(user.room).emit('message', { user: "name", text: message })
      callback()
    })

    socket.on('disconnect', () => {
      console.log(`user has disconnected`)
    })
  });

chatServer.listen(4000, function(){
  console.log('listening on *:3000');
});