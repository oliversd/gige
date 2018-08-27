import { paymentActions } from '../config/actions';

/**
 * Release Payment
 */
function paymentIsLoading() {
  return {
    type: paymentActions.PAYMENT_IS_LOADING,
    isLoading: true
  };
}

function paymentError(error) {
  return {
    type: paymentActions.PAYMENT_ERROR,
    error
  };
}

function paymentSet(data) {
  return {
    type: paymentActions.PAYMENT,
    data
  };
}

function paymentReady() {
  return {
    type: paymentActions.PAYMENT_SET_READY,
    ready: true
  };
}

export function paymentSetReady() {
  return (dispatch) => {
    dispatch(paymentReady());
  };
}
export default function getAvailablePayments() {
  return async (dispatch, getState) => {
    const { contract, payment } = getState();

    if (contract.web3 !== null && contract.instance !== null) {
      try {
        const { web3, instance } = contract;
        const accounts = await web3.eth.getAccounts();
        let from = accounts[0];
        const currentAccount = localStorage.getItem('GigE-account');

        // Check if the user has selected an account more for testing purposes
        if (currentAccount && typeof accounts[currentAccount] !== 'undefined') {
          from = accounts[currentAccount];
        }

        const balanceAvailable = await instance.methods
          .balanceAvailable(from)
          .call();
        if (payment && balanceAvailable !== payment.data) {
          dispatch(paymentIsLoading());
          dispatch(paymentSet(balanceAvailable));
        }
      } catch (error) {
        dispatch(paymentError(error.message));
      }
    } else {
      dispatch(paymentError('There is no Web3 instance'));
    }
  };
}

/**
 * Withdraw Payment
 */
function withdrawIsLoading() {
  return {
    type: paymentActions.WITHDRAW_IS_LOADING,
    isLoading: true
  };
}

function withdrawError(error) {
  return {
    type: paymentActions.WITHDRAW_ERROR,
    error
  };
}

function withdrawSet(hash) {
  return {
    type: paymentActions.WITHDRAW,
    hash
  };
}

function withdrawReady() {
  return {
    type: paymentActions.WITHDRAW_SET_READY,
    ready: true
  };
}

function withdrawClear() {
  return {
    type: paymentActions.WITHDRAW_CLEAR,
    ready: true
  };
}

export function withdrawSetReady() {
  return (dispatch) => {
    dispatch(withdrawReady());
  };
}

export function clearWithdraw() {
  return (dispatch) => {
    dispatch(withdrawClear());
  };
}
export function withdrawPayments() {
  return async (dispatch, getState) => {
    const { contract } = getState();
    dispatch(withdrawIsLoading());
    if (contract.web3 !== null && contract.instance !== null) {
      try {
        const { web3, instance } = contract;
        const accounts = await web3.eth.getAccounts();
        let from = accounts[0];
        const currentAccount = localStorage.getItem('GigE-account');

        // Check if the user has selected an account more for testing purposes
        if (currentAccount && typeof accounts[currentAccount] !== 'undefined') {
          from = accounts[currentAccount];
        }

        await instance.methods
          .withdrawPayments()
          .send({ from, gas: 70000 })
          .on('transactionHash', (transactionHash) => {
            dispatch(withdrawSet({ transactionHash }));
          })
          .on('receipt', (receipt) => {
            console.log(receipt);
          })
          .on('confirmation', (confirmationNumber) => {
            if (confirmationNumber === 5) {
              dispatch(getAvailablePayments());
              dispatch(withdrawReady());
            }
          })
          .on('error', error => dispatch(withdrawError(error.message)));
      } catch (error) {
        dispatch(paymentError(error.message));
      }
    } else {
      dispatch(paymentError('There is no Web3 instance'));
    }
  };
}
