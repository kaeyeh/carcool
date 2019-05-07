'use strict';
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/206e5968e59d4ccead2033aab179868d"));
const _ = web3.utils;
const eth = web3.eth;
const Tx = require('ethereumjs-tx');


class Order {

  constructor () {
   
    this.myAddress = '0x1E4B96345Eb7C6392e3923E29095083f5ED863B7';
    this.privateKey = Buffer.from('user input private key of myAddress', 'hex');
    this.toAddress = '0x0d19a0219364D2a07576092CA5180962F49070E3';

    //contract abi is the array that you can get from the ethereum wallet or etherscan
    this.contractABI = [
          {
            "constant": false,
            "inputs": [
              {
                "name": "to",
                "type": "address"
              },
              {
                "name": "value",
                "type": "uint256"
              }
            ],
            "name": "transfer",
            "outputs": [
              {
                "name": "",
                "type": "bool"
              }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "constant": true,
            "inputs": [
              {
                "name": "owner",
                "type": "address"
              }
            ],
            "name": "balanceOf",
            "outputs": [
              {
                "name": "",
                "type": "uint256"
              }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
          }
        ];
    this.contractAddress ="0xccc0e3b869d2105a1960bba94f144910041fe2f4";
    //creating contract object
    this.contract = new eth.Contract(this.contractABI, this.contractAddress);

    this.transact();
  }



  async transact( ) {
    this.balanceOf(this.myAddress);
    this.balanceOf(this.toAddress);

      let count = await eth.getTransactionCount(this.myAddress)
      var amount = 1000;
      var rawTx = {       
        from: this.myAddress, 
        to: this.contractAddress,
        data: this.contract.methods.transfer(this.toAddress, amount).encodeABI(),
        gasPrice: 3000000,
        gas: 3000000,
        nonce: count
      };

      const tx = new Tx(rawTx);
      tx.sign( this.privateKey);
      const serializedTx = tx.serialize();

      eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('transactionHash', function(hash){
        console.log("tx hash: " + hash);
      }).once('receipt', function(receipt){
        console.log(receipt);
      }).on('confirmation', function(confNumber, receipt){
        console.log("confirmation: "+confNumber);
      }).on('error', function(error){
        console.log(error);
      }).then(function(receipt){
          // will be fired once the receipt is mined
          console.log(receipt);
      });
  
             
      this.balanceOf(this.myAddress);
      this.balanceOf(this.toAddress);
        
    }
  
  export default function to(promise) {
      return promise.then(data => {
         return [null, data];
      })
      .catch(err => [err]);
  }
  async balanceOf (addr) {
    let balance =  _.toBN(await this.contract.methods.balanceOf(addr).call());
    console.log( _.fromWei(balance, 'Kwei'));
  }
  

  readAll(req, res) {
    //if (err)
    //  res.send(err);
    //res.json(task);
    console.log("readAll");
  }

  create(req, res) {
    console.log( "create");
  }

  read(req, res) {
    console.log( "read")
  };

  update(req, res) {
    console.log( "update")
  }

  delete (req, res) {
    console.log( "delete")
  }
}
module.exports = Order;