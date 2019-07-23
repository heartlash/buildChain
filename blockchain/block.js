const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY, MINE_RATE } = require('../config');
class Block{
    constructor(timeStamp, lastHash, hash, data, nonce, difficulty){
        this.timeStamp = timeStamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }

    toString(){
        return `Block - 
            Timestamp: ${this.timeStamp}
            Lasthash: ${this.lastHash.substring(0, 10)}
            Hash: ${this.hash.substring(0, 10)}
            Data: ${this.data}
            Nonce: ${this.nonce}
            Difficulty: ${this.difficulty}`
    }

    static genesis(){
        return new this("Genesis Time", "----", "garg34t34", "genesisLovesYou", 0, DIFFICULTY);
    }

    static mineBlock(lastblock, data){
        let hash, nonce = 0;
        let timeStamp;
        let {difficulty} = lastblock;
        const lastHash = lastblock.hash;
        do{
            nonce++;
            timeStamp = Date.now();
            difficulty = Block.adjustDifficulty(lastblock, timeStamp);
            hash = Block.hash(timeStamp, lastHash, data, nonce, difficulty);
            //console.log("MINING nonce: ", nonce, " hash: ", hash);

        } while(hash.substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this(timeStamp, lastHash, hash, data, nonce, difficulty);
    }

    static hash(timeStamp, lastHash, data, nonce, difficulty){
        return SHA256(`${timeStamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    static blockHash(block){
        const {timeStamp, lastHash, data, nonce, difficulty} = block;
        return Block.hash(timeStamp, lastHash, data, nonce, difficulty);
    }

    static adjustDifficulty(lastblock, currentTime){
        let {difficulty} = lastblock;
        difficulty = lastblock.timeStamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }
}

module.exports = Block;