/* global artifacts */
const Migrations = artifacts.require('Migrations')

module.exports = function(deployer, network, accounts) {
  console.log(deployer.networks[network].network_id)
  
  if(deployer.network === 'mainnet') {
    return
  }
  deployer.deploy(Migrations)
}
