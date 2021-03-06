const express = require('express');
const Blockchain = require('../blockchain');
const bodyParser = require('body-parser');
const P2pServer = require('./p2pServer');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc);

//bc.addBlock("heyo");

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
    res.json(bc.chain);
});

app.post('/mine', (req, res) => {
    console.log(req.body);
    const block = bc.addBlock(req.body.data);

    console.log(`New block added: ${block.toString()}`);
    p2pServer.syncChain();
    res.redirect('/blocks');
});

app.get('/transactions', (req, res) => {
    res.json(tp.transactions);
})
app.listen(HTTP_PORT, ()=>{
    console.log(`I am listening on port ${HTTP_PORT} or am I`);
})

p2pServer.listen();