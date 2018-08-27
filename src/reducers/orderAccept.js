import { orderActions } from '../config/actions';

const defaultState = {
  isLoading: false,
  hash: '',
  ready: false,
  error: null
};

const orderAcceptReducer = (state = defaultState, action) => {
  switch (action.type) {
    case orderActions.ORDER_ACCEPT_IS_LOADING:
      return {
        ...state,
        isLoading: true,
        hash: state.hash || '',
        ready: state.ready || null,
        error: null
      };
    case orderActions.ORDER_ACCEPT_ERROR:
      return {
        ...state,
        isLoading: false,
        hash: [],
        ready: null,
        error: action.error
      };
    case orderActions.ORDER_ACCEPT_SET_READY:
      return {
        ...state,
        isLoading: false,
        hash: state.hash,
        ready: true,
        error: null
      };
    case orderActions.ORDER_ACCEPT:
      return {
        ...state,
        isLoading: false,
        hash: action.hash,
        ready: false,
        error: null
      };
    default:
      return state;
  }
};

export default orderAcceptReducer;
