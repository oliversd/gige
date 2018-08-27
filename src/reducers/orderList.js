import { orderActions } from '../config/actions';

const defaultState = {
  isLoading: false,
  sellerOrders: [],
  buyerOrders: [],
  error: null
};

const orderListReducer = (state = defaultState, action) => {
  switch (action.type) {
    case orderActions.ORDER_LIST_IS_LOADING:
      return {
        ...state,
        isLoading: true,
        sellerOrders: state.sellerOrders || [],
        buyerOrders: state.buyerOrders || [],
        error: null
      };
    case orderActions.ORDER_LIST_ERROR:
      return {
        ...state,
        isLoading: false,
        sellerOrders: [],
        buyerOrders: [],
        error: action.error
      };
    case orderActions.ORDER_LIST:
      return {
        ...state,
        isLoading: false,
        sellerOrders: action.sellerOrders,
        buyerOrders: action.buyerOrders,
        error: null
      };
    default:
      return state;
  }
};

export default orderListReducer;
