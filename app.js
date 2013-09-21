var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(80);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');    
    }
    res.writeHead(200);
    res.end(data);
  });
}

function broardcastTime(element,value) {
  s=Date();
  console.log('========>'+s);
  element.emit('news',s);
}

clients=[];

io.sockets.on('disconnect', function (socket) {
   console.log('delete ==>'+socket);
   clients.delete(socket);
});

io.sockets.on('connection', function (socket) {
  clients.push(socket);

  socket.on('my other event', function (data) {
    clients.forEach(broardcastTime);
  }); 
  socket.on('cpu',function(data) {
    socket.emit('news',200);
  });
});