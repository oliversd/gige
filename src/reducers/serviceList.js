import { serviceActions } from '../config/actions';

const defaultState = {
  isLoading: false,
  data: [],
  error: null
};

const serviceListReducer = (state = defaultState, action) => {
  switch (action.type) {
    case serviceActions.SERVICE_LIST_IS_LOADING:
      return {
        ...state,
        isLoading: true,
        data: state.data || [],
        error: null
      };
    case serviceActions.SERVICE_LIST_ERROR:
      return {
        ...state,
        isLoading: false,
        data: [],
        error: action.error
      };
    case serviceActions.SERVICE_LIST:
      return {
        ...state,
        isLoading: false,
        data: action.services,
        error: null
      };
    default:
      return state;
  }
};

export default serviceListReducer;
