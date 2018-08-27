import { paymentActions } from '../config/actions';

const defaultState = {
  isLoading: false,
  hash: {},
  error: null,
  ready: false
};

const withdrawReducer = (state = defaultState, action) => {
  switch (action.type) {
    case paymentActions.WITHDRAW_IS_LOADING:
      return {
        ...state,
        isLoading: true,
        hash: state.hash || {},
        error: null
      };
    case paymentActions.WITHDRAW_ERROR:
      return {
        ...state,
        isLoading: false,
        hash: {},
        error: action.error
      };
    case paymentActions.WITHDRAW_SET_READY:
      return {
        ...state,
        isLoading: false,
        hash: state.hash,
        ready: true,
        error: null
      };
    case paymentActions.WITHDRAW:
      return {
        ...state,
        isLoading: false,
        hash: action.hash,
        error: null
      };
    case paymentActions.WITHDRAW_CLEAR:
      return {
        ...state,
        isLoading: false,
        hash: {},
        error: null
      };
    default:
      return state;
  }
};

export default withdrawReducer;
