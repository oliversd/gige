# GigE Dapp

## Description

GigE Dapp distributed gigs types of Services. The idea is that the seller is able to offer it's services and a buyer can agreed on a price and terms.

When a seller and buyer agrees to a price the amount it's stored in a Escrow so when the job it's done this funds are released to the seller. If the seller cancels the funds go back to the buyer.

The images and some data of the Service it's stored in IPFS so we use as little as possible of the contract Storage.

## Getting Started

This project was created with Truffle and Create React App.

The first thing that you have to do is clone this project on your machine.

### Prerequisites

You will need nodejs >= 8.11.4, truffle and ganache-cli.

You can find node [here](https://nodejs.org/), the LTS version is recommended.

Once you have node installed you have to install truffle and ganache-cli globally

```
npm install -g truffle
```

```
npm install -g ganache-cli
```

Optionally you can install IPFS.

### Installing

First run ganache-cli in one terminal window:

```
ganache-cli
```

Once you have the prerequisites you can go to the project folder in another terminal window and execute:

Install dependencies:

```
npm install
```

Compile the contract:

```
truffle compile
```

Migrate the contract:

```
truffle migrate --network development
```

Copy the contract address and put it on the file contract.js in the folder /src/config/contract.js on the development section:

```
export default {
  development: {
    address: '0xc5d37965e2838bf872b8431344ec4b7a117ddaa1'
  },
```

You can run your own IPFS local server or use Infura just change the host in the previous file.

Once that you have the contract address and infura setup you can run the front end executing:

```
npm start
```

Should appear in your browser window if is not you can go to http://localhost:3000

## How to use it PLEASE READ THIS

**IMPORTANT**
For IPFS infura sometimes work sometimes it gives an error of cross domain that is in several issues in github. So if you can use a local IPFS the installation instructions https://docs.ipfs.io/introduction/install/.

Once IPFS is installed you must run this:

```
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
```

And then start the daemon with:

```
ipfs daemon
```

To use this app you need at least two accounts, you can either create two accounts in your metamask wallet or use two browsers with metamask installed (this is my favorite).

As a seller you have to create a Service, once the service is created you can create a Quote for a buyer (Click on the More info button > then new Quote). Right now you have to put the address of the buyer by hand but this in a future will be with a backend offchain service.

As a buyer you can Accept and pay a Order (on My Orders page), and release the funds once is finished.

In My Orders page is where all the action happens ;).

As a seller you can Cancel the Job or mark it as finished.

You can see all the orders and action in My Order page.

Also you have a Status Bar on the top of the application with the current network, current address and how many funds you have to withdraw.

To withdraw available funds you have to click on the button on the Status bar.

There are times when the orders don’t update automatically on the front end you have to refresh the page. I couldn’t fixed in the time constraint.

There are a couple of sample images on the public folder for the services.

I want to do many more things and fix many more when I have more time.

If you have any comment you can reach me in the issues.

## Running in Rinkeby

If you want to test this development in Rinkeby you have to select Rinkeby on your metamask wallet and the app will detect the change.\*\*\*\*

## Running the tests

To run the test of the contract you have to execute:

```
truffle test
```

There are 6 test of the main methods of the contract.

## Deployment

To deploy this to rinkeby you have to configure change the mnemonic of the truffle.js file. The mnemonic use is just for test doesn't represent any real wallet.

## Built With

- React
- Redux
- React Router
- Web3 1.0
- IPFS
- ETHPM

## Authors

- **Olivers De Abreu**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Thanks to all the open source code use here!

- Sample images: By Freepik
  - https://www.freepik.com/free-vector/opening-soon-background-with-typography-memphis-style_2720618.htm
  - https://www.freepik.com/free-vector/modern-logotype-collection_1718068.htm
