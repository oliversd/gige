import Web3 from "web3";

const getWeb3 = new Promise(resolve => {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener("load", () => {
    const web3 = new Web3("ws://localhost:8545");
    web3.eth.net
      .getNetworkType()
      .then(network => console.log(network))
      .catch(error => console.log(error));
    resolve(web3);
  });
});

export default getWeb3;
