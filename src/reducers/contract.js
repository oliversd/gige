import { contractActions } from '../config/actions';

const defaultState = {
  isLoading: null,
  instance: {},
  web3: {},
  userAccount: null,
  error: null,
  network: 'unavailable',
  accounts: []
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
        network: state.network || 'unavailable',
        accounts: state.accounts || [],
        error: null
      };
    case contractActions.CONTRACT_ERROR:
      return {
        ...state,
        isLoading: false,
        instance: [],
        web3: null,
        userAccount: null,
        network: 'unavailable',
        accounts: [],
        error: action.error
      };
    case contractActions.CONTRACT:
      return {
        ...state,
        isLoading: false,
        instance: action.contract,
        web3: action.web3,
        userAccount: action.userAccount,
        network: action.network,
        accounts: action.accounts,
        error: null
      };
    default:
      return state;
  }
};

export default contractReducer;
