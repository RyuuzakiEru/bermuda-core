/* global artifacts */
require('dotenv').config({ path: '../.env' })
const BEP20Bermuda = artifacts.require('BEP20Bermuda')
const Verifier = artifacts.require('Verifier')
const hasherContract = artifacts.require('Hasher')


module.exports = function(deployer, network, accounts) {
  return deployer.then(async () => {
    const { MERKLE_TREE_HEIGHT } = process.env
    const verifier = await Verifier.deployed()
    const hasherInstance = await hasherContract.deployed()
    await BEP20Bermuda.link(hasherContract, hasherInstance.address)
    const bermuda = await deployer.deploy(BEP20Bermuda, verifier.address, '1000000000000000000', MERKLE_TREE_HEIGHT, accounts[0], '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd')
    console.log('BEP20Bermuda(USDT) \'s address (1.0)', bermuda.address)
  })
}