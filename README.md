# [Tutorial here!](http://truffleframework.com/tutorials/creating-a-cli-with-truffle-3)

## In order to build and run the library *LOCALLY*, run
1. `yarn install` or `npm install` depending on your preference
2. make sure you have testrpc running , and change `truffle.js` to point to that network. e.g. `localhost:8545`.
3. `truffle compile` to create the json contract artifacts
4. `truffle migrate` to deploy the contracts onto the network

## In order to build and run the frontend code *IN DOCKER*, run
1. `docker-compose -f docker/docker-compose.yml up -d`
2. once the container starts, find the hash of the truffle3 container service and run `docker attach <hash>`
3. `yarn install` or `npm install` depending on your preference
4. change `truffle.js` to point to that network. this is `testrpc:8545` from inside the container
5. `truffle compile` to create the json contract artifacts
6. `truffle migrate` to deploy the contracts onto the network

Once the ENS app has been deployed onto the network, you can start using the command line command:
```
root@6021c4be18aa:/app# npm run -s ens
Usage: bin/ensa.js [command] [options]

Commands:
  winner  Current winner of bid
  bid     Place a bid on a domain name
  reveal  Reveal your bid on a domain name

Options:
  --help  Show help                                                    [boolean]

```

and once you choose a command:
```
root@6021c4be18aa:/app# npm run -s ens -- winner -n 'NewDomain'
bin/ensa.js winner

Options:
  --help           Show help                                           [boolean]
  --host, -h       HTTP host of Ethereum node               [default: "testrpc"]
  --port, -p       HTTP port                                   [default: "8545"]
  --registrar, -r  The address of the registrar              [string] [required]
  --name, -n       The name you want to register             [string] [required]
  --account, -a    The address to register the domain name   [string] [required]

Missing required arguments: account, registrar
```

## Linting your app is easy -- just run `npm run -s lint`!
