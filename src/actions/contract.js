import Web3 from 'web3';
import { contractActions } from '../config/actions';
import GigEService from '../contracts/GigEService.json';
import { serviceSetReady, getServiceList } from './service';

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

function contractSet(contract, web3, userAccount) {
  return {
    type: contractActions.CONTRACT,
    contract,
    web3,
    userAccount
  };
}

const instantiateContract = async (web3) => {
  try {
    const contractInstance = new web3.eth.Contract(
      GigEService.abi,
      '0x9a386d3cc0036b5c4d4030d61658b83b1f715e16'
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

    const web3 = new Web3('ws://localhost:8545');
    // Check for connection with metamask or localnetwork
    try {
      const network = await web3.eth.net.getNetworkType();
      console.log(network);
    } catch (e) {
      console.log(e);
      dispatch(contractError(e.message));
      return false;
    }

    // currentProvider should return null if there is no provider
    // but right now is not working web3 1.0.0-beta.35
    if (web3.currentProvider) {
      try {
        const ContractInstance = await instantiateContract(web3);
        const accounts = await web3.eth.getAccounts();
        const userAccount = accounts[0];
        console.log(accounts[1]);
        if (
          contract
          && contract.instance
          && contract.instance._address === ContractInstance._address
        ) {
          return true;
        }
        dispatch(contractIsLoading());
        dispatch(setEvents(ContractInstance));
        dispatch(contractSet(ContractInstance, web3, userAccount));
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
