/**
 * This is an example of a reducer action with asynchronous fetch
 */

import { dataActions } from '../config/actions';

function dataIsLoading() {
  return {
    type: dataActions.DATA_IS_LOADING,
    isLoading: true
  };
}

function dataError(error) {
  return {
    type: dataActions.DATA_ERROR,
    error
  };
}

function dataSet(data) {
  return {
    type: dataActions.DATA,
    data
  };
}

export default function dataGet() {
  return (dispatch) => {
    dispatch(dataIsLoading());
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };

    const url = 'https://swapi.co/api/people/';

    fetch(url, options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        const error = {
          message: 'Something went wrong',
          status: response.status,
          error: true
        };
        dispatch(dataError(error));
        return error;
      })
      .then((body) => {
        if (!body.error) {
          dispatch(dataSet(body.results));
        }
      })
      .catch((e) => {
        dispatch(dataError(e));
      });
  };
}
