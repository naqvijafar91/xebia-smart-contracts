const web3 = require('web3');
const express = require('express');
const Tx = require('ethereumjs-tx');
//Load environment vars from .env file
require('dotenv').config();
const app = express();
var bodyParser = require('body-parser');
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
//Infura HttpProvider Endpoint
web3js = new web3(new web3.providers.HttpProvider("https://ropsten.infura.io/v3/ad8828d4e4114d3a8e4f62ccee3f38e5"));

function demonstrate(req, res) {
    const updatedVarValue = req.body.value || 678;
    //contract abi is the array that you can get from the ethereum wallet or etherscan
    var contractABI = [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "x",
                    "type": "uint256"
                }
            ],
            "name": "set",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "get",
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
    var myAddress = '0x520b483aC51AF9B34a3DF9dc581C3449a5af31fe';
    var privateKey = Buffer.from(process.env.private_key, 'hex')


    var contractAddress = "0xe32046017dde05d61d0b5a1c72ee5958a3382ea2";
    //creating contract object
    var contract = new web3js.eth.Contract(contractABI, contractAddress);

    var count;
    // get transaction count, later will used as nonce
    web3js.eth.getTransactionCount(myAddress).then(function (v) {
        console.log("Count: " + v);
        count = v;
        //creating raw tranaction
        var rawTransaction = {
            "from": myAddress, "gasPrice": web3js.utils.toHex(20000000000),
            "gasLimit": web3js.utils.toHex(210000), "to": contractAddress,
            "data": contract.methods.set(updatedVarValue).encodeABI(),
            "nonce": web3js.utils.toHex(count), "chainId": 3
        }
        console.log(rawTransaction);
        //creating tranaction via ethereumjs-tx
        var transaction = new Tx(rawTransaction);
        //signing transaction with private key
        transaction.sign(privateKey);
        //sending transacton via web3js module
        web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
            .once('transactionHash', function (hash) { console.log(hash) })
            .once('receipt', function (receipt) { console.log(receipt) })
            .on('confirmation', function (confNumber, receipt) {
                console.log(confNumber)

            })
            .on('error', function (error) {
                console.log('Got error from smart contract')
                console.log(error)
                console.log('error done');
                if (res)
                    res.status(403).send(error);
            })
            .then(function (receipt) {
                // will be fired once the receipt is mined
                console.log('Done called with ' + receipt);
                if (res)
                    res.json(receipt);
            });

        // contract.methods.balanceOf(myAddress).call()
        //     .then(function (balance) { console.log(balance) });

    });
}

app.post('/sendtx', function (req, res) {
    demonstrate(req,res);
});

app.get('/getval',function(req,res){

});

// demonstrate()
app.listen(3000, () => console.log('Example app listening on port 3000!'))