import Web3 from 'web3';
import { contractActions } from '../config/actions';
import GigEService from '../contracts/GigEService.json';
import { serviceSetReady, getServiceList } from './service';
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

const instantiateContract = async (web3) => {
  try {
    const contractInstance = new web3.eth.Contract(
      GigEService.abi,
      contractConfig.address
    );
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

const setEvents = contractInstance => (dispatch) => {
  contractInstance.events
    .ServiceCreated()
    .on('data', (event) => {
      console.log(event);
      dispatch(serviceSetReady());
      dispatch(getServiceList());
    })
    .on('changed', (event) => {
      // remove event from local database
      console.log(event);
    })
    .on('error', console.error);

  contractInstance.events
    .OrderProposal()
    .on('data', (event) => {
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
        const ContractInstance = await instantiateContract(web3);
        const accounts = await web3.eth.getAccounts();
        const currentAccount = localStorage.getItem('GigE-account');
        let userAccount = accounts[0];

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
        const network = await web3.eth.net.getNetworkType();

        dispatch(contractIsLoading());
        dispatch(setEvents(ContractInstance));
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
