var rn_bridge = require('rn-bridge');
const test=()=>{


/*const port = 8080;
const server = http.createServer((req, res) =>{
    res.end('Hello, World!');
});

server.listen(port, (err) => {
    if (err) return console.log(`Something bad happened: ${err}`);
    console.log(`Node.js server listening on ${port}`);
   (async () => {
   const tunnel = await localtunnel({ port: 8080,subdomain:"anirudh" });
   rn_bridge.channel.send(
    "sha3 output:\n" +
    tunnel.url
  );
})();

});
*/
const localtunnel = require('localtunnel');
const express = require('express')
const app = express()
const http = require('http').createServer(app)

const port = 8080;


http.listen(port, (err) => {
    if (err) return console.log(`Something bad happened: ${err}`);
    console.log(`Node.js server listening on ${port}`);
   (async () => {
   const tunnel = await localtunnel({ port: 8080,subdomain:"anirudh" });
   rn_bridge.channel.send(
    "sha3 output:\n" +
    tunnel.url
  );
})();

});


/**/

app.use(express.static(__dirname + '/public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    rn_bridge.channel.send("londa connected");
    socket.on('message', (msg) => {
        //socket.broadcast.emit('message', msg)
        rn_bridge.channel.send(JSON.stringify(msg));
    })

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
      case 'sha3':
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