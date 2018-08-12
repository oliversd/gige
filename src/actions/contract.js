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
      '0xfa1e120e8fc8296e2a304131885d98fa1442a2bc'
    );
    return contractInstance;
  } catch (error) {
    console.log(error);
    return false;
  }
};
export default function getContract() {
  return async (dispatch) => {
    dispatch(contractIsLoading());
    const web3 = new Web3('ws://localhost:8545');
    if (web3.currentProvider) {
      try {
        const ContractInstance = await instantiateContract(web3);
        dispatch(contractSet(ContractInstance, web3));
        return true;
      } catch (error) {
        dispatch(contractError(error));
        return false;
      }
    }
    dispatch(contractError('Error with web3'));
    return false;
  };
}
