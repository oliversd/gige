import Web3 from 'web3';
import { contractActions } from '../config/actions';
import GigEService from '../contracts/GigEService.json';

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
      '0x0113626b8bea23501fe19e442eac80bcb58324f0'
    );
    console.log(contractInstance);
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
