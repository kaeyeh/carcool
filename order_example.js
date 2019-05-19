// npm install
// node order_example.js

const fs = require('fs')
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
const NodeRSA = require('node-rsa')


var app = express();
app.use(bodyParser.json()); // for parsing application/json

let ACCOUNTS = {'0xabcd': {'balance': 15000}};


function serverDecrypt( base64Str ) {
  const key = NodeRSA(fs.readFileSync('key.pem'));
  key.setOptions({encryptionScheme: 'pkcs1'});
  //key.importKey(PRIVKEY, 'pkcs1');
  console.log(key.exportKey('public'));
  //let a = key.encrypt('This is a test!', 'base64');
  //console.log('after enc:'+a.toString('base64'));
  //console.log(key.decrypt(a.toString('base64')).toString());
  const a = key.decrypt(base64Str, 'utf8');
  console.log(a);
  return a;
}

function serverVerify( buffer, sig, address ) {
  pubkey = ACCOUNTS[address]['pubkey']
  const key = NodeRSA(pubkey);
  key.setOptions({encryptionScheme: 'pkcs1'});
  console.log(key.exportKey('public'));
  const a = key.verify(buffer, sig, 'utf8', 'base64');
  console.log(a);
  return a;  
}

// -------------------- test node-rsa
const a='faixpvKRREQoFzwvjz4tX4PSNsCvBl2a4LfU3Izk31twg+DaxKX7UDIhEpiCzhUdPSVWHNgfde+OmVpgmaoTNgjHcmHDCKhqapP4KU4eXPL4fWL9rNsyHgAKy0R1gaW70xnv47A2VuXLRMGoccrnYXtpwPhAg1Gopv7M3nlIOLk=';
serverDecrypt(a);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/jsencrypt.min.js', function(req, res) {
  res.sendFile(path.join(__dirname + '/jsencrypt.min.js'));
});


// setup wallet binding, user use his purchase password to store his private key
// send public key to server for signature verification


app.get('/getBalance/:address', function (req, res) {
    const data = ACCOUNTS;
    if (data === undefined) {
      return res.end(JSON.stringify({'result':"invalid data"}));
    }
    const address = req.params.address
    if (address === undefined) {
      return res.end(JSON.stringify({'result':"invalid address"}))
    }
    var balance = data[address]['balance'] 
    if (balance === undefined) {
      return res.end(JSON.stringify({'result':"invalid balance"}))
    }
    console.log( balance );
    res.end( JSON.stringify({address, balance}));
})

// critical info should be encrypted with server public key and signed by user private key
// with enough randomness such as adding date timestamp in seconds,
app.put('/bind', function (req, res) {
  const data = ACCOUNTS;
  console.log(req.body);
  const sender = req.body.sender;
  if (sender === undefined) {
    return res.end(JSON.stringify({'result':"invalid address"}));
  }
  if (data[sender] === undefined) {
    data[sender] = {'balance': 0};
  }
  const pubkey = req.body.pubkey;
  if (pubkey === undefined) {
    return res.end(JSON.stringify({'result':"invalid public key"}));
  }
  
  data[sender]['pubkey'] = pubkey;
  console.log('pubkey '+ pubkey)

  res.end( JSON.stringify({'result': 'ok'}));
})


app.put('/order', function (req, res) {
    const data = ACCOUNTS;
    console.log(req.body);
    const sender = req.body.sender;
    if (sender === undefined) {
      return res.end(JSON.stringify({'result':"invalid sender"}));
    }
    if (data[sender] === undefined) {
      data[sender] = {'balance': 0};
    }
    const receiver = req.body.receiver;
    if (receiver === undefined) {
      return res.end(JSON.stringify({'result':"invalid receiver"}));
    }

    const sig = req.body.sign;
    if (sig === undefined) {
      return res.end(JSON.stringify({'result':"invalid signature"}));
    }

    if (data[receiver] === undefined) {
      data[receiver] = {'balance': 0};
    }
    const ebalance = req.body.balance;
    if (ebalance === undefined) {
      return res.end(JSON.stringify({'result':"invalid balance"}));
    }
    console.log('sender '+sender)
    const balance = serverDecrypt(ebalance);
    data[sender]['balance'] -= balance;
    data[receiver]['balance'] += balance;

    console.log( balance );
    serverVerify(balance, sig, sender)
    res.end( JSON.stringify({sender, balance}));
})

var server = app.listen(5000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("http://%s:%s", host, port)

})