// This require hook will bind itself to node's require and automatically
// compile files on the fly.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: 'testrpc',
      port: 8545,
      network_id: '*' // Match any network id
    }
  }
}
