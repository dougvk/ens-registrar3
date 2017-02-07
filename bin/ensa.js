#!/usr/bin/env node
import { default as yargs } from 'yargs'
import { default as initializeLib } from '../index'

const RPC_HOST = 'testrpc'
const RPC_PORT = '8545'

var args = yargs
  .command('winner', 'Current winner of bid', (yargs) => {
    return yargs.option('host', {
      description: 'HTTP host of Ethereum node',
      alias: 'h',
      default: RPC_HOST
    })
    .option('port', {
      description: 'HTTP port',
      alias: 'p',
      default: RPC_PORT
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
      default: RPC_HOST
    })
    .option('port', {
      description: 'HTTP port',
      alias: 'p',
      default: RPC_PORT
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
      default: RPC_HOST
    })
    .option('port', {
      description: 'HTTP port',
      alias: 'p',
      default: RPC_PORT
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
    .demand(['account', 'registrar', 'max', 'secret', 'name'])
  })
  .help()
  .usage('Usage: $0 [command] [options]')

let { argv } = args

if (argv._.length === 0) {
  args.showHelp()
}

let command = argv._[0]

if (command === 'bid') {
  let { name, host, max, port, registrar, account, secret } = argv
  let auctionRegistrar = initializeLib(host, port, registrar, account)
  auctionRegistrar.createBid(name, account, max, secret)
    .then(() => console.log('Created bid for ' + name))
}

if (command === 'reveal') {
  let { name, host, max, port, registrar, account, secret } = argv
  let auctionRegistrar = initializeLib(host, port, registrar, account)
  auctionRegistrar.revealBid(name, account, max, secret)
    .then(() => registrar.currentWinner(name))
    .then((owner) => console.log('Revealed your bid. Current winner is account ' + owner))
}

if (command === 'winner') {
  let { name, host, port, registrar, account } = argv
  let auctionRegistrar = initializeLib(host, port, registrar, account)
  auctionRegistrar.currentWinner(name)
    .then((owner) => console.log('Current winner is account ' + owner))
}
