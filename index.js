import { default as ENSAuctionLib } from './lib/ens_registrar'
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

const AuctionRegistrar = contract(require('./build/contracts/Registrar.json'))
const Deed = contract(require('./build/contracts/Deed.json'))

export default function (host, port, registrarAddress, fromAddress) {
  let provider = new Web3.providers.HttpProvider(`http:\/\/${host}:${port}`)
  return new ENSAuctionLib(
      AuctionRegistrar,
      Deed,
      registrarAddress,
      provider,
      fromAddress
  )
}
