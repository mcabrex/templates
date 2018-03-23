var http = require('http');
//http is a library 
var server = http.createServer();
//this will be the server itself

server.listen(8000);
//telling the server to listen to a specific port

server.on('request', (req,res)=>{
    console.log('Hello!')
})
//when the server recieves a request it will emit an event and the function will recieve a req and res
