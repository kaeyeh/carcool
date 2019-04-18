var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json()); // for parsing application/json

let ACCOUNTS = {};


app.get('/getBalance/:address', function (req, res) {
    const data = ACCOUNTS;
    if (data === undefined) {
      return res.end(JSON.stringify({'result':"invalid data"}));
    }
    const address = req.params.address
    if (address === undefined) {
      return res.end(JSON.stringify({'result':"invalid address"}))
    }
    var balance = data[address] 
    if (balance === undefined) {
      return res.end(JSON.stringify({'result':"invalid balance"}))
    }
    console.log( balance );
    res.end( JSON.stringify({address, balance}));
})

app.put('/order', function (req, res) {
    const data = ACCOUNTS;
    console.log(req.body);
    const sender = req.body.sender;
    if (sender === undefined) {
      return res.end(JSON.stringify({'result':"invalid sender"}));
    }
    if (data[sender] === undefined) {
      data[sender] = 0;
    }
    const receiver = req.body.receiver;
    if (receiver === undefined) {
      return res.end(JSON.stringify({'result':"invalid receiver"}));
    }
    if (data[receiver] === undefined) {
      data[receiver] = 0;
    }
    const balance = req.body.balance;
    if (balance === undefined) {
      return res.end(JSON.stringify({'result':"invalid balance"}));
    }
    console.log('sender '+sender)

    data[sender] -= balance;
    data[receiver] += balance;

    console.log( balance );
    res.end( JSON.stringify({sender, balance}));
})

var server = app.listen(5000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})