require('babel-register')

module.exports = {
  networks: {
    development: {
      host: 'testrpc',
      port: 8545,
      network_id: '*' // Match any network id
    },
    ropsten: {
      host: '159.203.82.211',
      network_id: '*',
      port: 7002
    },
    staging: {
      host: '159.203.82.211',
      network_id: '*',
      port: 7003
    }
  }
}
