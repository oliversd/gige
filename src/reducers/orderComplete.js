import { orderActions } from '../config/actions';

const defaultState = {
  isLoading: false,
  hash: {},
  ready: false,
  error: null
};

const orderCompleteReducer = (state = defaultState, action) => {
  switch (action.type) {
    case orderActions.ORDER_COMPLETE_IS_LOADING:
      return {
        ...state,
        isLoading: true,
        hash: state.hash || {},
        ready: state.ready || null,
        error: null
      };
    case orderActions.ORDER_COMPLETE_ERROR:
      return {
        ...state,
        isLoading: false,
        hash: {},
        ready: null,
        error: action.error
      };
    case orderActions.ORDER_COMPLETE_SET_READY:
      return {
        ...state,
        isLoading: false,
        hash: state.hash,
        ready: true,
        error: null
      };
    case orderActions.ORDER_COMPLETE:
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

export default orderCompleteReducer;
