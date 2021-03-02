/* global artifacts */
require('dotenv').config({ path: '../.env' })
const BNBBermuda = artifacts.require('BNBBermuda')
const Verifier = artifacts.require('Verifier')
const hasherContract = artifacts.require('Hasher')
const Web3 = require('web3');

const AMOUNTS = [1, 5, 10, 15, 20, 50];
const MERKLE_TREE_HEIGHT = 20;



module.exports = function (deployer, network, accounts) {
  const json = {}
  json[deployer.networks[network].network_id] = { BNB : {} }
  AMOUNTS.map(amount => {
    return deployer.then(async () => {
      const verifier = await Verifier.deployed()
      const hasherInstance = await hasherContract.deployed()
      const AMOUNT = Web3.utils.toWei(amount.toString(), 'ether')
      await BNBBermuda.link(hasherContract, hasherInstance.address)
      const bermuda = await deployer.deploy(BNBBermuda, verifier.address, AMOUNT, MERKLE_TREE_HEIGHT, accounts[0])
      // console.log('BNBBermuda\'s address (%s), [%a] , <%s>', amount, bermuda.address, deployer.networks[network].network_id)
      json[deployer.networks[network].network_id]['BNB'][amount] = bermuda.address;
    }).then( () => {console.log(json)})
  })
}
