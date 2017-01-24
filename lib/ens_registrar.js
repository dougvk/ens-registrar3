let AuctionRegistrar = artifacts.require('./Registrar.sol')
let Deed = artifacts.require('./Deed.sol')
let Web3 = require('web3')

export default class {
  constructor(provider, registrarAddress, fromAddress) {
    AuctionRegistrar.defaults({
      from: fromAddress,
      gas: 1000000
    })
    AuctionRegistrar.setProvider(provider)
    Deed.setProvider(provider)

    this.web3 = new Web3(provider)
    this.registrar = AuctionRegistrar.at(registrarAddress)
  }
  available(name) {
    return this.registrar.entries(this.web3.sha3(name))
      .then((entry) => {
        let mode = entry[0]
        return Promise.resolve(mode == 0 || mode == 1)
      })
  }
  upForAuction(name) {
    return this.registrar.entries(this.web3.sha3(name))
      .then((entry) => {
        let mode = entry[0]
        return Promise.resolve(mode == 1)
      })
  }
  startAuction(name, options) {
    return this.registrar.startAuction(this.web3.sha3(name), options)
      .then(() => Promise.resolve(true))
  }
  currentWinner(name) {
    return this.registrar.entries(this.web3.sha3(name))
      .then((entry) => Deed.at(entry[1]))
      .then((deed) => deed.owner())
  }
  createBid(name, account, max, secret) {
    return this.available(name)
      .then((available) => {
        if (available) {
          return this.upForAuction(name)
        }
        return Promise.reject("Not available")
      })
      .then((isUpForAuction) => {
        if (!isUpForAuction) {
          return this.startAuction(name)
        } else {
          return Promise.resolve(true)
        }
      })
      .then((readyToBid) => {
        if (readyToBid) {
          return this.registrar.shaBid(this.web3.sha3(name), account,
                                       this.web3.toWei(max, 'ether'), secret)
        }
        return Promise.reject('Can\'t start bid')
      })
      .then((bid) => {
        return this.registrar.newBid(bid, {value: this.web3.toWei(max, 'ether')})
      })
      .then(() => {
        return Promise.resolve(true)
      })
      .catch(console.log.bind(console))
  }
  revealBid(name, account, max, secret) {
    return this.registrar.unsealBid(this.web3.sha3(name), account,
                            this.web3.toWei(max, 'ether'), secret)
  }
}
