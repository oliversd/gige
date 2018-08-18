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

    if (contract.web3 !== null && contract.instance !== null) {
      try {
        const { web3, instance } = contract;
        const accounts = await web3.eth.getAccounts();
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
            dispatch(serviceSet({ transactionHash }));
          });
      } catch (error) {
        dispatch(serviceError(error.message));
      }
    } else {
      dispatch(serviceError('There is no Web3 instance'));
    }
  };
}

/**
 * Service List actions
 */

function serviceListIsLoading() {
  return {
    type: serviceActions.SERVICE_LIST_IS_LOADING,
    isLoading: true
  };
}

function serviceListError(error) {
  return {
    type: serviceActions.SERVICE_LIST_ERROR,
    error
  };
}

function serviceListSet(services) {
  return {
    type: serviceActions.SERVICE_LIST,
    services
  };
}

const getAllServices = async (services, instance, from) => {
  const pArray = services.map(async (index) => {
    try {
      const response = await instance.methods.services(index).call({ from });
      // FIX: REMOVE Result that affected response
      // check later
      const test = { ...response };
      return test;
    } catch (e) {
      throw Error('Error fetching service', e);
    }
  });
  const result = await Promise.all(pArray);
  return result;
};

export function getServiceList() {
  return async (dispatch, getState) => {
    dispatch(serviceListIsLoading());
    const { contract } = getState();

    if (contract.web3 !== null && contract.instance !== null) {
      try {
        const { web3, instance } = contract;
        const accounts = await web3.eth.getAccounts();
        const from = accounts[0];
        const result = await instance.methods.getServices().call({ from });
        if (result.length > 0) {
          const serviceList = await getAllServices(result, instance, from);
          dispatch(serviceListSet(serviceList));
        } else {
          dispatch(serviceListSet([]));
        }
      } catch (e) {
        dispatch(serviceListError(e));
      }
    } else {
      dispatch(serviceError('There is no Web3 instance'));
    }
  };
}
