import { orderActions } from '../config/actions';

function orderIsLoading() {
  return {
    type: orderActions.ORDER_IS_LOADING,
    isLoading: true
  };
}

function orderError(error) {
  return {
    type: orderActions.ORDER_ERROR,
    error
  };
}

function orderSet(order) {
  return {
    type: orderActions.ORDER,
    order
  };
}

function orderReady() {
  return {
    type: orderActions.ORDER_SET_READY,
    ready: true
  };
}

export function orderSetReady() {
  return (dispatch) => {
    dispatch(orderReady());
  };
}
export default function createOrder(serviceId, price, buyer) {
  return async (dispatch, getState) => {
    dispatch(orderIsLoading());
    const { contract } = getState();

    if (contract.web3 !== null && contract.instance !== null) {
      try {
        const { web3, instance } = contract;
        const accounts = await web3.eth.getAccounts();
        let from = accounts[0];
        const currentAccount = localStorage.getItem('GigE-account');

        // Check if the user has selected an account more for testing purposes
        if (currentAccount && typeof accounts[currentAccount] !== 'undefined') {
          from = accounts[currentAccount];
        }

        // BN not working with decimals i.e: 0.5
        // const priceBN = new web3.utils.BN(price.toString());

        await instance.methods
          .createOrder(serviceId, web3.utils.toWei(price.toString()), buyer)
          .send({ from, gas: 2100000 })
          .on('transactionHash', (transactionHash) => {
            dispatch(orderSet({ transactionHash }));
          });
      } catch (error) {
        dispatch(orderError(error.message));
      }
    } else {
      dispatch(orderError('There is no Web3 instance'));
    }
  };
}

/**
 * order List actions
 */

function orderListIsLoading() {
  return {
    type: orderActions.ORDER_LIST_IS_LOADING,
    isLoading: true
  };
}

function orderListError(error) {
  return {
    type: orderActions.ORDER_LIST_ERROR,
    error
  };
}

function orderListSet(sellerOrders, buyerOrders) {
  return {
    type: orderActions.ORDER_LIST,
    sellerOrders,
    buyerOrders
  };
}

const getAllOrders = async (orders, instance, from, serviceList) => {
  const pArray = orders.map(async (index) => {
    try {
      const response = await instance.methods.orders(index).call({ from });
      const {
        id, serviceId, price, seller, buyer, state
      } = response;

      const service = serviceList.filter(item => item.id === serviceId);

      return {
        id,
        serviceId,
        price,
        seller,
        buyer,
        state,
        service: service[0]
      };
    } catch (e) {
      throw Error('Error fetching order', e);
    }
  });
  const result = await Promise.all(pArray);
  return result;
};

export function getOrderList(force = false) {
  return async (dispatch, getState) => {
    const { contract, orderList, serviceList } = getState();

    if (contract.web3 !== null && contract.instance !== null) {
      try {
        const { web3, instance } = contract;
        const accounts = await web3.eth.getAccounts();
        let from = accounts[0];
        const currentAccount = localStorage.getItem('GigE-account');

        // Check if the user has selected an account more for testing purposes
        if (currentAccount && typeof accounts[currentAccount] !== 'undefined') {
          from = accounts[currentAccount];
        }
        const sellerOrders = await instance.methods
          .getOrdersFromSeller(from)
          .call({ from });
        const buyerOrders = await instance.methods
          .getOrdersFromBuyer(from)
          .call({ from });
        if (
          force
          || (serviceList.data.length > 0
            && (sellerOrders.length > 0 || buyerOrders.length > 0)
            && (orderList.sellerOrders.length !== sellerOrders.length
              || orderList.buyerOrders.length !== buyerOrders.length))
        ) {
          dispatch(orderListIsLoading());
          const listSeller = await getAllOrders(
            sellerOrders,
            instance,
            from,
            serviceList.data
          );
          const listBuyer = await getAllOrders(
            buyerOrders,
            instance,
            from,
            serviceList.data
          );
          dispatch(orderListSet(listSeller, listBuyer));
        }
      } catch (e) {
        console.log(e);
        dispatch(orderListError(e.message));
      }
    } else {
      dispatch(orderError('There is no Web3 instance'));
    }
  };
}

/**
 * Order Accept
 */
function orderAcceptIsLoading() {
  return {
    type: orderActions.ORDER_ACCEPT_IS_LOADING,
    isLoading: true
  };
}

function orderAcceptError(error) {
  return {
    type: orderActions.ORDER_ACCEPT_ERROR,
    error
  };
}

function orderAcceptSet(hash) {
  return {
    type: orderActions.ORDER_ACCEPT,
    hash
  };
}

function orderAcceptReady() {
  return {
    type: orderActions.ORDER_ACCEPT_SET_READY,
    ready: true
  };
}

export function orderAcceptSetReady() {
  return (dispatch) => {
    dispatch(orderAcceptReady());
  };
}
export function acceptOrder(orderId, price) {
  return async (dispatch, getState) => {
    dispatch(orderAcceptIsLoading());
    const { contract } = getState();

    if (contract.web3 !== null && contract.instance !== null) {
      try {
        const { web3, instance } = contract;
        const accounts = await web3.eth.getAccounts();
        let from = accounts[0];
        const currentAccount = localStorage.getItem('GigE-account');

        // Check if the user has selected an account more for testing purposes
        if (currentAccount && typeof accounts[currentAccount] !== 'undefined') {
          from = accounts[currentAccount];
        }

        // BN not working with decimals i.e: 0.5
        // const priceBN = new web3.utils.BN(price.toString());

        await instance.methods
          .acceptOrder(orderId)
          .send({ from, value: price })
          .on('transactionHash', (transactionHash) => {
            dispatch(orderAcceptSet({ transactionHash }));
          })
          .on('receipt', (receipt) => {
            console.log(receipt);
          })
          .on('confirmation', (confirmationNumber) => {
            if (confirmationNumber === 5) {
              dispatch(getOrderList(true));
              dispatch(orderAcceptSetReady());
            }
          })
          .on('error', error => dispatch(orderAcceptError(error.message))); // If a out of gas error, the second parameter is the receipt.
      } catch (error) {
        dispatch(orderAcceptError(error.message));
      }
    } else {
      dispatch(orderAcceptError('There is no Web3 instance'));
    }
  };
}

/**
 * Order Cancel
 */
function orderCancelIsLoading() {
  return {
    type: orderActions.ORDER_CANCEL_IS_LOADING,
    isLoading: true
  };
}

function orderCancelError(error) {
  return {
    type: orderActions.ORDER_CANCEL_ERROR,
    error
  };
}

function orderCancelSet(hash) {
  return {
    type: orderActions.ORDER_CANCEL,
    hash
  };
}

function orderCancelReady() {
  return {
    type: orderActions.ORDER_CANCEL_SET_READY,
    ready: true
  };
}

export function orderCancelSetReady() {
  return (dispatch) => {
    dispatch(orderCancelReady());
  };
}
export function cancelOrder(orderId, price) {
  return async (dispatch, getState) => {
    dispatch(orderCancelIsLoading());
    const { contract } = getState();

    if (contract.web3 !== null && contract.instance !== null) {
      try {
        const { web3, instance } = contract;
        const accounts = await web3.eth.getAccounts();
        let from = accounts[0];
        const currentAccount = localStorage.getItem('GigE-account');

        // Check if the user has selected an account more for testing purposes
        if (currentAccount && typeof accounts[currentAccount] !== 'undefined') {
          from = accounts[currentAccount];
        }

        // BN not working with decimals i.e: 0.5
        // const priceBN = new web3.utils.BN(price.toString());

        await instance.methods
          .cancelOrder(orderId)
          .send({ from, value: price, gas: 50000 })
          .on('transactionHash', (transactionHash) => {
            dispatch(orderCancelSet({ transactionHash }));
          })
          .on('receipt', (receipt) => {
            console.log(receipt);
          })
          .on('confirmation', (confirmationNumber) => {
            if (confirmationNumber === 5) {
              dispatch(getOrderList(true));
              dispatch(orderCancelSetReady());
            }
          })
          .on('error', error => dispatch(orderCancelError(error.message))); // If a out of gas error, the second parameter is the receipt.
      } catch (error) {
        dispatch(orderCancelError(error.message));
      }
    } else {
      dispatch(orderCancelError('There is no Web3 instance'));
    }
  };
}

/**
 * Order Completed
 */
function orderCompleteIsLoading() {
  return {
    type: orderActions.ORDER_COMPLETE_IS_LOADING,
    isLoading: true
  };
}

function orderCompleteError(error) {
  return {
    type: orderActions.ORDER_COMPLETE_ERROR,
    error
  };
}

function orderCompleteSet(hash) {
  return {
    type: orderActions.ORDER_COMPLETE,
    hash
  };
}

function orderCompleteReady() {
  return {
    type: orderActions.ORDER_COMPLETE_SET_READY,
    ready: true
  };
}

export function orderCompleteSetReady() {
  return (dispatch) => {
    dispatch(orderCompleteReady());
  };
}
export function finishOrder(orderId, price) {
  return async (dispatch, getState) => {
    dispatch(orderCompleteIsLoading());
    const { contract } = getState();

    if (contract.web3 !== null && contract.instance !== null) {
      try {
        const { web3, instance } = contract;
        const accounts = await web3.eth.getAccounts();
        let from = accounts[0];
        const currentAccount = localStorage.getItem('GigE-account');

        // Check if the user has selected an account more for testing purposes
        if (currentAccount && typeof accounts[currentAccount] !== 'undefined') {
          from = accounts[currentAccount];
        }

        // BN not working with decimals i.e: 0.5
        // const priceBN = new web3.utils.BN(price.toString());

        await instance.methods
          .finishOrder(orderId)
          .send({ from, value: price, gas: 50000 })
          .on('transactionHash', (transactionHash) => {
            dispatch(orderCompleteSet({ transactionHash }));
          })
          .on('receipt', (receipt) => {
            console.log(receipt);
          })
          .on('confirmation', (confirmationNumber) => {
            if (confirmationNumber === 5) {
              dispatch(getOrderList(true));
              dispatch(orderCompleteSetReady());
            }
          })
          .on('error', error => dispatch(orderCompleteError(error.message))); // If a out of gas error, the second parameter is the receipt.
      } catch (error) {
        dispatch(orderCompleteError(error.message));
      }
    } else {
      dispatch(orderCompleteError('There is no Web3 instance'));
    }
  };
}

/**
 * Release Payment
 */
function orderReleaseIsLoading() {
  return {
    type: orderActions.ORDER_RELEASE_IS_LOADING,
    isLoading: true
  };
}

function orderReleaseError(error) {
  return {
    type: orderActions.ORDER_RELEASE_ERROR,
    error
  };
}

function orderReleaseSet(hash) {
  return {
    type: orderActions.ORDER_RELEASE,
    hash
  };
}

function orderReleaseReady() {
  return {
    type: orderActions.ORDER_RELEASE_SET_READY,
    ready: true
  };
}

export function orderReleaseSetReady() {
  return (dispatch) => {
    dispatch(orderReleaseReady());
  };
}
export function releaseOrder(orderId, price) {
  return async (dispatch, getState) => {
    dispatch(orderReleaseIsLoading());
    const { contract } = getState();

    if (contract.web3 !== null && contract.instance !== null) {
      try {
        const { web3, instance } = contract;
        const accounts = await web3.eth.getAccounts();
        let from = accounts[0];
        const currentAccount = localStorage.getItem('GigE-account');

        // Check if the user has selected an account more for testing purposes
        if (currentAccount && typeof accounts[currentAccount] !== 'undefined') {
          from = accounts[currentAccount];
        }

        // BN not working with decimals i.e: 0.5
        // const priceBN = new web3.utils.BN(price.toString());

        await instance.methods
          .releaseOrder(orderId)
          .send({ from, value: price, gas: 70000 })
          .on('transactionHash', (transactionHash) => {
            dispatch(orderReleaseSet({ transactionHash }));
          })
          .on('receipt', (receipt) => {
            console.log(receipt);
          })
          .on('confirmation', (confirmationNumber) => {
            if (confirmationNumber === 30) {
              dispatch(getOrderList(true));
              dispatch(orderReleaseSetReady());
            }
          })
          .on('error', error => dispatch(orderReleaseError(error.message))); // If a out of gas error, the second parameter is the receipt.
      } catch (error) {
        dispatch(orderReleaseError(error.message));
      }
    } else {
      dispatch(orderReleaseError('There is no Web3 instance'));
    }
  };
}
