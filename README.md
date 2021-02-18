# Bermuda Triangle Cash

Bermuda Triangle Cash is a initiative based on Tornado Cash, adapted to work on Binance Smart Chain:

The Bermuda Team became inspired and decided to follow their steps!!

Tornado Cash is a non-custodial Ethereum and ERC20 privacy solution based on zkSNARKs. It improves transaction privacy by breaking the on-chain link between the recipient and destination addresses. It uses a smart contract that accepts ETH deposits that can be withdrawn by a different address. Whenever ETH is withdrawn by the new address, there is no way to link the withdrawal to the deposit, ensuring complete privacy.

To make a deposit user generates a secret and sends its hash (called a commitment) along with the deposit amount to the Tornado smart contract. The contract accepts the deposit and adds the commitment to its list of deposits.

Later, the user decides to make a withdrawal. To do that, the user should provide a proof that he or she possesses a secret to an unspent commitment from the smart contract’s list of deposits. zkSnark technology allows that to happen without revealing which exact deposit corresponds to this secret. The smart contract will check the proof, and transfer deposited funds to the address specified for withdrawal. An external observer will be unable to determine which deposit this withdrawal came from.

You can read more about it in [this medium article](https://medium.com/@tornado.cash/introducing-private-transactions-on-ethereum-now-42ee915babe0)

## Requirements

1. `node v12`
2. `npm install -g npx`

## Usage

### Initialization

1. `npm run build`
1. `npm install`

### Ganache

1. make sure you complete steps from Initialization
1. `npm run migrate:dev`
1. edit addresses on client/src/contracts/addresses.json
1. `npm run start:client`

### BSC Testnet

1. Example app is alive at https://app.bermudatriangle.cash

Contract Addresses:
- Bermuda BNB contract (0.1 BNB - 0xAC97f66d4CD24eD1BA55155Ccc0ea2E47434277F)
- Bermuda BNB contract (1 BNB - 0x9046823cDE256309dFEE832013B7ee2382f4CC09)

- Bermuda BNB for Pegged USDT token (0.1 USDT - 0x2fc3d0599a78d43044F9Ce365ac6079CCAd54202)
- Bermuda BNB for Pegged USDT token (1 USDT - 0xe56111D82eB54F61E668cd4139915F6fc95e1ecA)


## Credits

Based on the Great work make by Tornado Cash team!