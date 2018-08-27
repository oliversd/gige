import { paymentActions } from '../config/actions';

const defaultState = {
  isLoading: false,
  data: '',
  error: null
};

const paymentReducer = (state = defaultState, action) => {
  switch (action.type) {
    case paymentActions.PAYMENT_IS_LOADING:
      return {
        ...state,
        isLoading: true,
        data: state.data || '',
        error: null
      };
    case paymentActions.PAYMENT_ERROR:
      return {
        ...state,
        isLoading: false,
        data: '',
        error: action.error
      };
    case paymentActions.PAYMENT:
      return {
        ...state,
        isLoading: false,
        data: action.data,
        error: null
      };
    default:
      return state;
  }
};

export default paymentReducer;
