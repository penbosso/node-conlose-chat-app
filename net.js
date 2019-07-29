process.stdout.write('\u001B[2J\u001B[0;0f');

const server = require('net').createServer();
let counter = 1;
let sockets = {};

const timestamp = () => {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes()}`
}

server.on('connection', socket => {
  socket.id = counter++;

  console.log(`Client: ${socket.id} connected`);
  socket.write('Please enter your name: ');


  socket.on('data', data => {
    if (!socket.backlog) socket.backlog = '';
    socket.backlog += data;
    
    if(socket.backlog.indexOf('\n') === -1) return;
    
    data = socket.backlog;
    socket.backlog = ''

    if (!sockets[socket.id]) {
      socket.name = data.toString().trim();
      socket.write(`Welcome ${socket.name}! \n\r`);
      sockets[socket.id] = socket;
      return;
    }
    Object.entries(sockets).forEach(([key, cs]) => {
      if (socket.id == key) return;
      cs.write(`\n\r${socket.name}-${timestamp()}: `);
      cs.write(data);
    });
  });
  
  socket.on('end', () => {
    delete sockets[socket.id];
    console.log(`Client: ${socket.id} -> ${socket.name} disconnected`);
  });
});

server.listen(8000, () => console.log('Server bound'));