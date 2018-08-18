import { serviceActions } from '../config/actions';

const defaultState = {
  isLoading: false,
  service: {},
  ready: false,
  error: null
};

const serviceReducer = (state = defaultState, action) => {
  switch (action.type) {
    case serviceActions.SERVICE_IS_LOADING:
      return {
        ...state,
        isLoading: true,
        service: state.service || [],
        ready: state.ready || null,
        error: null
      };
    case serviceActions.SERVICE_ERROR:
      return {
        ...state,
        isLoading: false,
        service: [],
        ready: null,
        error: action.error
      };
    case serviceActions.SERVICE_SET_READY:
      return {
        ...state,
        isLoading: false,
        service: state.service,
        ready: true,
        error: null
      };
    case serviceActions.SERVICE:
      return {
        ...state,
        isLoading: false,
        service: action.service,
        ready: false,
        error: null
      };
    default:
      return state;
  }
};

export default serviceReducer;
