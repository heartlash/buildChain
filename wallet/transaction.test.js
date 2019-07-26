const Transaction = require('./transaction');
const Wallet = require('./index');

describe('Transactions', ()=> {
    let transaction, wallet, recipient, amount;
    
    beforeEach(() => {
        wallet = new Wallet();
        amount = 50;
        recipient = 'recipient';
        transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    it('outputs the `amount` subtracted from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
        .toEqual(wallet.balance - amount);
    })

    it('outputs the `amount` added to the recipient', () => {
        expect(transaction.outputs.find(output => output.address === recipient).amount)
        .toEqual(amount);
    })

    it('inputs the balance of the wallet', () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    })

    it('validates a valid transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    })

    it('invalidates a invalid transaction', ()=> {
        transaction.outputs[0].amount = 3232323;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    })

})

describe('transaction with an amount that excceds the balance', () => {
    let transaction, wallet, recipient;
    beforeEach(() => {        
        amount = 50000;
        wallet = new Wallet();
        recipient = 'recipient';
        transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    it('does not create the transaction', () => {
        expect(transaction).toEqual(undefined);
    })

})

describe('and updating a transaction', () => {
    let nextAmount, nextRecipient, transaction, wallet, recipient;
    let amount = 50;
    wallet = new Wallet();
    transaction = Transaction.newTransaction(wallet, recipient, amount);


    beforeEach(() => {
        recipient = 'recipient';
        nextAmount = 20;
        nextRecipient = 'nextRecipient';
        transaction = transaction.update(wallet, nextRecipient, nextAmount);

    });

    it(`subtracts the next amount from the sender's output`, () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
        .toEqual(wallet.balance - amount - nextAmount);
    });

    it(`outputs an amount for the next recipient`, () => {
        expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
        .toEqual(nextAmount);
    });
})