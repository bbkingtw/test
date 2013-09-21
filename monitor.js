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
  function pingAllAndFeedback() {
    ping.pingAll(function(result){
      clients.forEach(function(socket, value) {
        socket.emit('news',Date()+'=>'+result);
      });
    });
  }

  clients.push(socket);

  socket.on('my other event', function (data) {
    clients.forEach(broardcastTime);
  }); 
  socket.on('cpu',function(data) {
    socket.emit('news',200);
  });

  socket.on('remove_hosts',function(data) {
    hosts=[];
  });

  socket.on('pingLoop',function(data) {
    console.log('pingLoop==>'+data);
    if (data=='start') {
      timerID=setInterval(pingAllAndFeedback,3000);
    }
    else {
      clearInterval(timerID);      
    } 	
  });

  socket.on('add_host',function(data) {
    ping.add_host(data);
    ping.pingAll(function(result){
      socket.emit('news',Date()+'=>'+result);
    });
  });
});

var ping=require('./ping2.js');