/* global artifacts:true */

const ENS = artifacts.require('./ENS.sol')
const Registrar = artifacts.require('./Registrar.sol')
const Deed = artifacts.require('./Deed.sol')
const PublicResolver = artifacts.require('./PublicResolver.sol')

module.exports = (deployer) => {
  // The hex 0x93c... string reolves to the TLD 'eth' via namehash('eth')
  // So, this makes ENS responsible for the TLD 'eth'
  deployer.deploy(ENS,
                  '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae')
    .then(() => {
      // This transfers ownership of the TLD 'eth' to the Registrar contract
      deployer.deploy(Registrar, ENS.deployed().address,
                      '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae')
    })
  deployer.deploy(Deed)
  deployer.deploy(PublicResolver)
}
