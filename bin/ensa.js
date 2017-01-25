#!/usr/bin/env node
import { default as ENSAuctionLib } from '../lib/ens_registrar'

let yargs = require('yargs')
let Web3 = require('web3')

var args = yargs
  .command('winner', 'Current winner of bid', (yargs) => {
    return yargs.option('host', {
      description: 'HTTP host of Ethereum node',
      alias: 'h',
      default: 'testrpc'
    })
    .option('port', {
      description: 'HTTP port',
      alias: 'p',
      default: '8545'
    })
    .option('registrar', {
      description: 'The address of the registrar',
      alias: 'r',
      type: 'string'
    })
    .option('name', {
      description: 'The name you want to register',
      alias: 'n',
      type: 'string'
    })
    .option('account', {
      description: 'The address to register the domain name',
      alias: 'a',
      type: 'string'
    })
    .demand(['account', 'name', 'registrar'])
  })
  .command('bid', 'Place a bid on a domain name', (yargs) => {
    return yargs.option('host', {
      description: 'HTTP host of Ethereum node',
      alias: 'h',
      default: 'testrpc'
    })
    .option('port', {
      description: 'HTTP port',
      alias: 'p',
      default: '8545'
    })
    .option('registrar', {
      description: 'The address of the registrar',
      alias: 'r',
      type: 'string'
    })
    .option('name', {
      description: 'The name you want to register',
      alias: 'n',
      type: 'string'
    })
    .option('account', {
      description: 'The address to register the domain name',
      alias: 'a',
      type: 'string'
    })
    .option('max', {
      description: 'The maximum amount willing to pay for the name, in Ether',
      alias: 'm',
      type: 'string'
    })
    .option('secret', {
      description: 'The secret `salt` for unsealing your bid',
      alias: 's',
      type: 'string'
    })
    .demand(['account', 'max', 'secret', 'name', 'registrar'])
  })
  .command('reveal', 'Reveal your bid on a domain name', (yargs) => {
    return yargs.option('host', {
      description: 'HTTP host of Ethereum node',
      alias: 'h',
      default: 'testrpc'
    })
    .option('port', {
      description: 'HTTP port',
      alias: 'p',
      default: '8545'
    })
    .option('registrar', {
      description: 'The address of the registrar',
      alias: 'r',
      type: 'string'
    })
    .option('name', {
      description: 'The name you want to register',
      alias: 'n',
      type: 'string'
    })
    .option('account', {
      description: 'The address to register the domain name',
      alias: 'a',
      type: 'string'
    })
    .option('max', {
      description: 'The maximum amount willing to pay for the name, in Ether',
      alias: 'm',
      type: 'string'
    })
    .option('secret', {
      description: 'The secret `salt` for unsealing your bid',
      alias: 's',
      type: 'string'
    })
    .demand(['account', 'max', 'secret', 'name'])
  })
  .help()
  .usage('Usage: $0 [command] [options]')

var argv = args.argv

if (argv._.length === 0) {
  args.showHelp()
}

let command = argv._[0]
let provider, registrar

if (command === 'bid') {
  provider = new Web3.providers.HttpProvider('http://' + argv.host + ':' + argv.port)
  registrar = new ENSAuctionLib(provider, argv.registrar, argv.account)
  registrar.createBid(argv.name, argv.account, argv.max, argv.secret)
    .then(() => console.log('Created bid for ' + argv.name))
}

if (command === 'reveal') {
  provider = new Web3.providers.HttpProvider('http://' + argv.host + ':' + argv.port)
  registrar = new ENSAuctionLib(provider, argv.registrar, argv.account)
  registrar.revealBid(argv.name, argv.account, argv.max, argv.secret)
    .then(() => registrar.currentWinner(argv.name))
    .then((owner) => console.log('Revealed your bid. Current winner is account ' + owner))
}

if (command === 'winner') {
  provider = new Web3.providers.HttpProvider('http://' + argv.host + ':' + argv.port)
  registrar = new ENSAuctionLib(provider, argv.registrar, argv.account)
  registrar.currentWinner(argv.name)
    .then((owner) => console.log('Current winner is account ' + owner))
}
