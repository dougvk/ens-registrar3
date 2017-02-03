/* global artifacts:true */
const Web3 = require('web3')

// This is to handle when this file is run via truffle command, which injects
// the `artifacts` dependency VS run via the commandline, which doesn't.
let AuctionRegistrar, Deed
if (typeof artifacts !== 'undefined') {
  AuctionRegistrar = artifacts.require('./Registrar.sol')
  Deed = artifacts.require('./Deed.sol')
} else {
  let contract = require('truffle-contract')
  let AuctionRegistrarJSON = require('../build/contracts/Registrar.json')
  let DeedJSON = require('../build/contracts/Deed.json')
  AuctionRegistrar = contract(AuctionRegistrarJSON)
  Deed = contract(DeedJSON)
}

export default class {
  constructor (provider, registrarAddress, fromAddress) {
    AuctionRegistrar.defaults({
      from: fromAddress,
      gas: 400000
    })
    AuctionRegistrar.setProvider(provider)
    Deed.setProvider(provider)

    this.web3 = new Web3(provider)
    this.registrar = AuctionRegistrar.at(registrarAddress)
  }
  available (name) {
    return this.registrar.entries(this.web3.sha3(name))
      .then((entry) => {
        let mode = entry[0]
        return Promise.resolve(mode.toNumber() === 0 || mode.toNumber() === 1)
      })
  }
  upForAuction (name) {
    return this.registrar.entries(this.web3.sha3(name))
      .then((entry) => {
        let mode = entry[0]
        return Promise.resolve(mode.toNumber() === 1)
      })
  }
  startAuction (name, options) {
    return this.registrar.startAuction(this.web3.sha3(name), options)
      .then(() => Promise.resolve(true))
  }
  currentWinner (name) {
    return this.registrar.entries(this.web3.sha3(name))
      .then((entry) => Deed.at(entry[1]))
      .then((deed) => deed.owner())
  }
  createBid (name, account, max, secret) {
    return this.available(name)
      .then((available) => {
        if (available) {
          return this.upForAuction(name)
        }
        return Promise.reject('Not available')
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
        return this.registrar.newBid(bid, { value: this.web3.toWei(max, 'ether') })
      })
      .then(() => {
        return Promise.resolve(true)
      })
      .catch(console.log.bind(console))
  }
  revealBid (name, account, max, secret) {
    return this.registrar.unsealBid(this.web3.sha3(name), account,
                            this.web3.toWei(max, 'ether'), secret)
  }
}
