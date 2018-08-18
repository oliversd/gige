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

function contractSet(contract, web3) {
  return {
    type: contractActions.CONTRACT,
    contract,
    web3
  };
}

const instantiateContract = async (web3) => {
  try {
    const contractInstance = new web3.eth.Contract(
      GigEService.abi,
      '0x34fb078f81715a64884d1bdeab066aafb90cd986'
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
    .Created()
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
};

export default function getContract() {
  return async (dispatch) => {
    dispatch(contractIsLoading());
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
        dispatch(setEvents(ContractInstance));
        dispatch(contractSet(ContractInstance, web3));
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
