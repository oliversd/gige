import { dataActions } from '../config/actions';

const defaultState = {
  isLoading: null,
  data: [],
  error: null
};

const blockReducer = (state = defaultState, action) => {
  switch (action.type) {
    case dataActions.DATA_IS_LOADING:
      return {
        ...state,
        isLoading: true,
        data: state.data || [],
        error: null
      };
    case dataActions.DATA_ERROR:
      return {
        ...state,
        isLoading: false,
        data: [],
        error: action.error
      };
    case dataActions.DATA:
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

export default blockReducer;
