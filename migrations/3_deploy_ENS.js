/* global artifacts:true */

let ENS = artifacts.require('./ENS.sol')
let Registrar = artifacts.require('./Registrar.sol')
let Deed = artifacts.require('./Deed.sol')
let PublicResolver = artifacts.require('./PublicResolver.sol')

module.exports = (deployer) => {
  // The hex string reolves to the TLD 'eth'
  deployer.deploy(ENS,
                  '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae')
    .then(() => {
      deployer.deploy(Registrar, ENS.deployed().address,
                      '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae')
    })
  deployer.deploy(Deed)
  deployer.deploy(PublicResolver)
}
