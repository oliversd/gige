import { contractActions } from '../config/actions';

const defaultState = {
  isLoading: null,
  instance: {},
  web3: {},
  userAccount: null,
  error: null
};

const contractReducer = (state = defaultState, action) => {
  switch (action.type) {
    case contractActions.CONTRACT_IS_LOADING:
      return {
        ...state,
        isLoading: true,
        instance: { ...state.instance } || {},
        web3: { ...state.web3 } || null,
        userAccount: state.userAccount || null,
        error: null
      };
    case contractActions.CONTRACT_ERROR:
      return {
        ...state,
        isLoading: false,
        instance: [],
        web3: null,
        userAccount: null,
        error: action.error
      };
    case contractActions.CONTRACT:
      return {
        ...state,
        isLoading: false,
        instance: action.contract,
        web3: action.web3,
        userAccount: action.userAccount,
        error: null
      };
    default:
      return state;
  }
};

export default contractReducer;
