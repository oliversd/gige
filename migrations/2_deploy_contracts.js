const GigEService = artifacts.require('./GigEService.sol');

module.exports = function(deployer) {
  deployer.deploy(GigEService);
};
