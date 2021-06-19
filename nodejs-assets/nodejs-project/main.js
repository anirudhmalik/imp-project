var rn_bridge = require('rn-bridge');
const test=()=>{
const localtunnel = require('localtunnel');
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const port = 8080;
/*starting server and tunneling */
http.listen(port, (err) => {
    if (err) return console.log(`Something bad happened: ${err}`);
    console.log(`Node.js server listening on ${port}`);
   (async () => {
   const tunnel = await localtunnel({ port: 8080,subdomain:"anirudh" });
   rn_bridge.channel.send("URL:\n" +tunnel.url);
    })();
});
app.use(express.static(__dirname + '/public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
// Socket 
const io = require('socket.io')(http)
io.on('connection', (socket) => {
    rn_bridge.channel.send("londa connected");
    socket.on('typing', (data) => {
      //socket.broadcast.emit('message', msg)
      rn_bridge.channel.send(JSON.stringify(data));
      })
    socket.on('login', (data) => {
        //socket.broadcast.emit('message', msg)
        rn_bridge.channel.send(JSON.stringify(data));
      });



})
}



rn_bridge.channel.on('message', (msg) => {
  try {
    switch(msg) {
      case 'versions':
        rn_bridge.channel.send(
          "Versions: " +
          JSON.stringify(process.versions)
        );
        break;
      case 'run':
        test()
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

// Inform react-native node is initialized.
rn_bridge.channel.send("Node was initialized. Versions: " + JSON.stringify(process.versions));