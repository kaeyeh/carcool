'use strict';
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/206e5968e59d4ccead2033aab179868d"));
const _ = web3.utils;
const eth = web3.eth;
const Tx = require('ethereumjs-tx');
const contractABI = [
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
//contract abi is the array that you can get from the ethereum wallet or etherscan
//creating contract object
const contractAddress ="0xccc0e3b869d2105a1960bba94f144910041fe2f4";
const contract = new eth.Contract(contractABI, contractAddress);


module.exports =  {

  test: () => {   
    const fromAddress = '0x1E4B96345Eb7C6392e3923E29095083f5ED863B7';
    const privateKey = Buffer.from('0xabcd', 'hex');
    const toAddress = '0x0d19a0219364D2a07576092CA5180962F49070E3';

    module.exports.transact(1*1000, fromAddress, toAddress, privateKey);
  },

  transact: async (amount, fromAddress, toAddress, privateKey) => {
      let count = await eth.getTransactionCount(fromAddress)
      var rawTx = {       
        from: fromAddress, 
        to: contractAddress,
        data: contract.methods.transfer(toAddress, amount*1000).encodeABI(),
        gasPrice: 3000000,
        gas: 3000000,
        nonce: count
      };

      const tx = new Tx(rawTx);
      tx.sign(Buffer.from(privateKey, 'hex'));
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
  },

  balanceOf: async (addr) => {
    let balance = _.toBN(await contract.methods.balanceOf(addr).call());
    console.log(_.fromWei(balance, 'Kwei'));
  },

  createAccount: () => {
    return web3.eth.accounts.create();
  },
}

