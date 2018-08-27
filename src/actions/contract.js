import Web3 from 'web3';
import { contractActions } from '../config/actions';
import GigEService from '../contracts/GigEService.json';
import { serviceSetReady, getServiceList } from './service';
import { orderSetReady, getOrderList, orderAcceptSetReady } from './order';
import contractConfig from '../config/contract';

function contractIsLoading() {
  return {
    type: contractActions.CONTRACT_IS_LOADING,
    isLoading: true
  };
}

function contractError(error) {
  return {
    type: contractActions.CONTRACT_ERROR,
    error
  };
}

function contractSet(contract, web3, userAccount, network, accounts) {
  return {
    type: contractActions.CONTRACT,
    contract,
    web3,
    userAccount,
    network,
    accounts
  };
}

const instantiateContract = async (web3, network) => {
  try {
    let address = contractConfig.development.address; // eslint-disable-line
    if (network === 'rinkeby') {
      address = contractConfig.rinkeby.address; // eslint-disable-line
    }

    const contractInstance = new web3.eth.Contract(GigEService.abi, address);
    return contractInstance;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export function setError(error) {
  return (dispatch) => {
    dispatch(contractError(error));
  };
}

const setEvents = network => (dispatch) => {
  // We need ws to listen to events
  let web3Events = new Web3('ws://localhost:8545');
  let instance = new web3Events.eth.Contract(
    GigEService.abi,
    contractConfig.development.address
  );

  if (network === 'rinkeby') {
    web3Events = new Web3('wss://rinkeby.infura.io/_ws');
    instance = new web3Events.eth.Contract(
      GigEService.abi,
      contractConfig.rinkeby.address
    );
  }

  /* const subscription = web3Events.eth
    .subscribe('pendingTransactions', (error, result) => {})
    .on('data', (transactionHash) => {
      web3Events.eth.getTransaction(transactionHash).then((transaction) => {
        console.log(transaction);
      });
    }); */
  instance.events
    .ServiceCreated()
    .on('data', (event) => {
      console.log('Created data', event);
      dispatch(serviceSetReady());
      dispatch(getServiceList());
    })
    .on('changed', (event) => {
      // remove event from local database
      console.log(event);
    })
    .on('error', error => console.error(error));

  instance.events
    .OrderProposal()
    .on('data', (event) => {
      dispatch(orderSetReady());
      dispatch(getOrderList());
      console.log(event);
    })
    .on('changed', (event) => {
      // remove event from local database
      console.log(event);
    })
    .on('error', console.error);

  instance.events
    .OrderAccepted()
    .on('data', (event) => {
      dispatch(orderAcceptSetReady());
      dispatch(getOrderList());
      console.log(event);
    })
    .on('changed', (event) => {
      // remove event from local database
      console.log(event);
    })
    .on('error', console.error);
};

export default function getContract() {
  // prettier disable-line
  return async (dispatch, getState) => {
    const { contract } = getState();

    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');

    // currentProvider should return null if there is no provider
    // but right now is not working web3 1.0.0-beta.35
    if (web3.currentProvider) {
      try {
        const network = await web3.eth.net.getNetworkType();

        const ContractInstance = await instantiateContract(web3, network);

        const accounts = await web3.eth.getAccounts();
        const currentAccount = localStorage.getItem('GigE-account');
        let userAccount = accounts[0];

        if (!userAccount) {
          userAccount = 'Check that you logged in to metamask';
        }

        // Check if the user has selected an account more for testing purposes
        if (currentAccount && typeof accounts[currentAccount] !== 'undefined') {
          userAccount = accounts[currentAccount];
        }

        if (
          contract
          && contract.instance
          && contract.instance._address === ContractInstance._address
          && contract.userAccount === userAccount
        ) {
          return true;
        }

        dispatch(contractIsLoading());
        dispatch(setEvents(network));
        dispatch(
          contractSet(ContractInstance, web3, userAccount, network, accounts)
        );
        return true;
      } catch (error) {
        console.log(error);
        dispatch(contractError(error.message));
        return false;
      }
    }
    console.log('Error with web3');
    dispatch(contractError('Error with web3'));
    return false;
  };
}
