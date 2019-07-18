const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY } = require('../config');
class Block{
    constructor(timeStamp, lastHash, hash, data, nonce){
        this.timeStamp = timeStamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
    }

    toString(){
        return `Block - 
            Timestamp: ${this.timeStamp}
            Lasthash: ${this.lastHash.substring(0, 10)}
            Hash: ${this.hash.substring(0, 10)}
            Data: ${this.data}
            Nonce: ${this.nonce}`
    }

    static genesis(){
        return new this("Genesis Time", "----", "garg34t34", "genesisLovesYou", 0);
    }

    static mineBlock(lastblock, data){
        let hash, nonce = 0;
        let timeStamp;
        const lastHash = lastblock.hash;
        do{
            nonce++;
            timeStamp = Date.now();
            hash = Block.hash(timeStamp, lastHash, data, nonce);
            console.log("MINING nonce: ", nonce, " hash: ", hash);

        } while(hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY));

        return new this(timeStamp, lastHash, hash, data, nonce);
    }

    static hash(timeStamp, lastHash, data, nonce){
        return SHA256(`${timeStamp}${lastHash}${data}${nonce}`).toString();
    }

    static blockHash(block){
        const {timeStamp, lastHash, data} = block;
        return Block.hash(timeStamp, lastHash, data);
    }
}

module.exports = Block;