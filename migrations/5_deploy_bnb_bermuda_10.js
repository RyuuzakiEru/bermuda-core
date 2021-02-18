/* global artifacts */
require('dotenv').config({ path: '../.env' })
const BNBBermuda = artifacts.require('BNBBermuda')
const Verifier = artifacts.require('Verifier')
const hasherContract = artifacts.require('Hasher')


module.exports = function(deployer, network, accounts) {
  return deployer.then(async () => {
    const { MERKLE_TREE_HEIGHT } = process.env
    const verifier = await Verifier.deployed()
    const hasherInstance = await hasherContract.deployed()
    await BNBBermuda.link(hasherContract, hasherInstance.address)
    const bermuda = await deployer.deploy(BNBBermuda, verifier.address, '1000000000000000000' /* 1.0 */, MERKLE_TREE_HEIGHT, accounts[0])
    console.log('BNBBermuda\'s address (1.0)', bermuda.address)
  })
}
