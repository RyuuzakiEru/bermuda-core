require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider')

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.

    sandbox: {
      provider: () => new HDWalletProvider(process.env.SANDBOX_MNEMONIC, 'https://sandbox.truffleteams.com/d2400634-3a6c-413e-a311-f23fb7249bd8'),
      network_id: 1614470840937,
    },

    testnet: {
      provider: () => new HDWalletProvider(process.env.BSC_MNEMONIC, 'https://data-seed-prebsc-1-s1.binance.org:8545'),
      network_id: 97,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    // Useful for private networks
    // private: {
    //   provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
    //   network_id: 2111,   // This network is yours, in the cloud.
    //   production: true    // Treats this network as if it was a public net. (default: false)
    // }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: '0.5.17',    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        },
        // evmVersion: "byzantium"
      }
    },
    external: {
      command: 'node ./compileHasher.js',
      targets: [{
        path: './build/Hasher.json'
      }]
    }
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    bscscan: process.env.BSCSCAN_APIKEY,
  }
}
