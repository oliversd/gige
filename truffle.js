/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */
const HDWalletProvider = require('truffle-hdwallet-provider');

const mnemonic = 'business clump autumn wear motor amateur logic provide absent flat age taxi';

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*'
    },
    rinkeby: {
      provider: () => new HDWalletProvider(
        mnemonic,
        'https://rinkeby.infura.io/v3/5fb24cc54d4a4e64b48a3a616ebc7b79'
      ),
      network_id: 4,
      gas: 6612388, // Gas limit used for deploys
      gasPrice: 20000000000 // 20 gwei
    }
  }
};
