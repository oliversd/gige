import { orderActions } from '../config/actions';

const defaultState = {
  isLoading: false,
  order: {},
  ready: false,
  error: null
};

const orderReducer = (state = defaultState, action) => {
  switch (action.type) {
    case orderActions.ORDER_IS_LOADING:
      return {
        ...state,
        isLoading: true,
        order: state.order || [],
        ready: state.ready || null,
        error: null
      };
    case orderActions.ORDER_ERROR:
      return {
        ...state,
        isLoading: false,
        order: [],
        ready: null,
        error: action.error
      };
    case orderActions.ORDER_SET_READY:
      return {
        ...state,
        isLoading: false,
        order: state.order,
        ready: true,
        error: null
      };
    case orderActions.ORDER:
      return {
        ...state,
        isLoading: false,
        order: action.order,
        ready: false,
        error: null
      };
    default:
      return state;
  }
};

export default orderReducer;
