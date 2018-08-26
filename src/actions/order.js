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
export default function createorder(serviceId, price, buyer) {
  return async (dispatch, getState) => {
    dispatch(orderIsLoading());
    const { contract } = getState();

    if (contract.web3 !== null && contract.instance !== null) {
      try {
        const { web3, instance } = contract;
        const accounts = await web3.eth.getAccounts();
        const from = accounts[0];

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

const getAllOrders = async (orders, instance, from) => {
  const pArray = orders.map(async (index) => {
    try {
      const response = await instance.methods.orders(index).call({ from });
      const {
        serviceId, price, seller, buyer, state
      } = response;
      return {
        serviceId,
        price,
        seller,
        buyer,
        state
      };
    } catch (e) {
      throw Error('Error fetching order', e);
    }
  });
  const result = await Promise.all(pArray);
  return result;
};

export function getOrderList() {
  return async (dispatch, getState) => {
    const { contract, orderList } = getState();

    if (contract.web3 !== null && contract.instance !== null) {
      try {
        const { web3, instance } = contract;
        const accounts = await web3.eth.getAccounts();
        const from = accounts[0];
        const sellerOrders = await instance.methods
          .getOrdersFromSeller(from)
          .call({ from });
        const buyerOrders = await instance.methods
          .getOrdersFromBuyer(from)
          .call({ from });
        if (
          (sellerOrders.length > 0 || buyerOrders.length > 0)
          && (orderList.sellerOrders.length !== sellerOrders.length
            || orderList.buyerOrders.length !== buyerOrders.length)
        ) {
          dispatch(orderListIsLoading());
          const listSeller = await getAllOrders(sellerOrders, instance, from);
          const listBuyer = await getAllOrders(buyerOrders, instance, from);
          dispatch(orderListSet(listSeller, listBuyer));
        }
      } catch (e) {
        console.log(e);
        dispatch(orderListError(e));
      }
    } else {
      dispatch(orderError('There is no Web3 instance'));
    }
  };
}
