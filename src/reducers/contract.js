import { contractActions } from '../config/actions';

const defaultState = {
  isLoading: null,
  instance: {},
  web3: {},
  error: null
};

const contractReducer = (state = defaultState, action) => {
  switch (action.type) {
    case contractActions.CONTRACT_IS_LOADING:
      return {
        ...state,
        isLoading: true,
        instance: state.contract || [],
        web3: state.web3 || null,
        error: null
      };
    case contractActions.CONTRACT_ERROR:
      return {
        ...state,
        isLoading: false,
        instance: [],
        web3: null,
        error: action.error
      };
    case contractActions.CONTRACT:
      return {
        ...state,
        isLoading: false,
        instance: action.contract,
        web3: action.web3,
        error: null
      };
    default:
      return state;
  }
};

export default contractReducer;
