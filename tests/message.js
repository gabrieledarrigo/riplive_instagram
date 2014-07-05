var expect  = require('expect.js');
var client  = require('socket.io-client');
var app     = require('express')();
var server  = require('http').Server(app);
var io      = require('socket.io')(server);
var host    = 'http://localhost:3000';

server.listen(3000, function() {
  console.log('Up and running');
});

function Message() {
  var self     = this;
  var uid      = -1;
  this.sockets = [];

  this.setConnectionHandler = function(cb) {
    if (typeof cb !== 'function') {
      throw new Error('Pleas provice a function callback to be used as handler');
    }

    io.on('connection', function(socket) {
      var inc = ++uid;
      uid = inc;
      console.log(inc);
      self.sockets[inc] = socket;
      //console.log(self.sockets);
      cb(socket);
    });  
  }

  this.sendMessage = function(name, data) {
    self.sockets[uid].emit(name, data);
  };

  this.onMessage = function(name, cb) {
    if (typeof cb !== 'function') {
      throw new Error('Pleas provice a function callback to be used as handler');
    }

    io.on(name, cb);
  };
};

var message = new Message();
message.setConnectionHandler(function(socket) {
  console.log('Server: client connected');

  socket.on('message', function(data) {
    console.log(data);
  });

  //socket.emit('message', {data : 'here iam'});
});

message.sendMessage('message', {data : 'data from Server'});

var clientSocket = client(host);
clientSocket.emit('message', {
  data : 'data'
});

clientSocket.on('message', function(data) {
  console.log(data);
});

/*
describe('Message Class', function() {
  var message = new Message();

  it('is used to send and receive message within the application', function() {
    expect(message).to.be.an('object');
    expect(message).to.have.property('setConnectionHandler');
  });

  describe('#', function() {
    it('should set a connection handler', function(done) {
      message.setConnectionHandler(function(socket) {
        console.log('Server: client connected');
        done();
      });

      var clientSocket = client(host);
    });
  });
});
*/