const Web3 = require('web3')

export default class {
  constructor (AuctionRegistrar, Deed, registrarAddress, provider, fromAddress) {
    this.web3 = new Web3(provider)

    this.Deed = Deed
    this.Deed.setProvider(provider)

    AuctionRegistrar.setProvider(provider)
    AuctionRegistrar.defaults({
      from: fromAddress,
      gas: 400000
    })
    this.registrar = AuctionRegistrar.at(registrarAddress)
  }
  // What an entry contains --
  /* enum Mode { Open, Auction, Owned, Forbidden }
  struct entry {
      Mode status;
      Deed deed;
      uint registrationDate;
      uint value;
      uint highestBid;
  } */
  entries (name) {
    return this.registrar.entries(this.web3.sha3(name))
  }
  available (name) {
    return this.entries(name)
      .then((entry) => {
        let mode = entry[0]
        return Promise.resolve(mode.toNumber() === 0 || mode.toNumber() === 1)
      })
  }
  upForAuction (name) {
    return this.entries(name)
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
    return this.entries(name)
      .then((entry) => this.Deed.at(entry[1]))
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
