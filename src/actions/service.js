import { serviceActions } from '../config/actions';

function serviceIsLoading() {
  return {
    type: serviceActions.SERVICE_IS_LOADING,
    isLoading: true
  };
}

function serviceError(error) {
  return {
    type: serviceActions.SERVICE_ERROR,
    error
  };
}

function serviceSet(service) {
  return {
    type: serviceActions.SERVICE,
    service
  };
}

function serviceReady() {
  return {
    type: serviceActions.SERVICE_SET_READY,
    ready: true
  };
}

export function serviceSetReady() {
  console.log('Hello');
  return (dispatch) => {
    console.log('service ready');
    dispatch(serviceReady());
  };
}

export default function createService(
  title,
  description,
  image,
  category,
  subcategory,
  price
) {
  return async (dispatch, getState) => {
    dispatch(serviceIsLoading());
    const { contract } = getState();

    console.log(contract);

    if (contract.web3 !== null && contract.instance !== null) {
      try {
        const { web3, instance } = contract;
        const accounts = await web3.eth.getAccounts();
        console.log(accounts[0]);
        const from = accounts[0];
        const priceBN = new web3.utils.BN(price);
        await instance.methods
          .createService(
            title,
            description,
            image,
            category,
            subcategory,
            web3.utils.toWei(priceBN)
          )
          .send({ from, gas: 2100000 })
          .on('transactionHash', (transactionHash) => {
            console.log(transactionHash);
            dispatch(serviceSet({ transactionHash }));
          });
      } catch (error) {
        console.log(error);
        dispatch(serviceError(error.message));
      }
    } else {
      dispatch(serviceError('There is no Web3 instance'));
    }
  };
}
