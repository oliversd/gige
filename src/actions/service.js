import { serviceActions } from '../config/actions';
import ipfs from '../utils/ipfs';
import ipfsUtils from '../utils/ipfs-utils';

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
  return dispatch => {
    dispatch(serviceReady());
  };
}

export default function createService(price, data) {
  return async (dispatch, getState) => {
    dispatch(serviceIsLoading());
    const { contract } = getState();

    if (contract.web3 !== null && contract.instance !== null) {
      try {
        const { web3, instance } = contract;
        const accounts = await web3.eth.getAccounts();
        const from = accounts[0];

        // BN not working with decimals i.e: 0.5
        // const priceBN = new web3.utils.BN(price.toString());

        await instance.methods
          .createService(web3.utils.toWei(price.toString()), data)
          .send({ from, gas: 2100000 })
          .on('transactionHash', transactionHash => {
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

const getImageFromIPFS = async imageHash => {
  try {
    const image = await ipfs.get(
      imageHash || 'QmVMvGBPLLTzohipnh5WGUB3aBysa8mwLHfTMdaUxsqQzj'
    );

    const blob = new Blob([image[0].content], { type: 'image/jpeg' });
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(blob);
    return imageUrl;
  } catch (e) {
    console.log(e);
    throw Error('Problem getting image from IPFS', e);
  }
};

/**
 * Get service data from IPFS
 * @param {bytes32} hash
 * @return {object}
 */
const getServiceData = async hash => {
  try {
    console.log(hash);
    const serviceData = await ipfs.cat(ipfsUtils.ipfs32BytestoHash(hash));
    return JSON.parse(serviceData);
  } catch (e) {
    throw Error("Can't get service data from IPFS", e);
  }
};

const getAllServices = async (services, instance, from) => {
  const pArray = services.map(async index => {
    try {
      const response = await instance.methods.services(index).call({ from });
      // FIX: REMOVE Result that affected response
      // check later
      const { id, minimumPrice, data, seller } = response;
      console.log(data);
      const {
        title,
        description,
        image,
        category,
        subcategory
      } = await getServiceData(data);
      const imageFromIPFS = await getImageFromIPFS(image);

      const resultService = {
        id,
        title,
        description,
        image: imageFromIPFS,
        category,
        subcategory,
        minimumPrice,
        seller
      };
      return resultService;
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
