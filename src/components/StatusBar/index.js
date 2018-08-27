import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import './style.css';

import getAvailablePayments, {
  withdrawPayments,
  clearWithdraw
} from '../../actions/payments';

class StatusBar extends Component {
  state = {
    show: false,
    account: 0
  };

  componentDidMount() {
    const currentAccount = localStorage.getItem('GigE-account');
    if (currentAccount) {
      this.setState({ account: Number(currentAccount) });
    }
  }

  getEvents = () => {
    if (this.props.contract && this.props.contract.instance) {
      this.props.contract.instance
        .getPastEvents('allEvents', {
          fromBlock: 0,
          toBlock: 'latest'
        })
        .then((events) => {
          console.log(events); // same results as the optional callback above
        });
    }
  };

  getPayments = () => {
    this.props.getAvailablePayments();
    this.props.clearWithdraw();
  };

  withdraw = () => {
    this.props.withdrawPayments();
  };

  handleChange = (event) => {
    this.setState({ account: event.target.value });
    localStorage.setItem('GigE-account', event.target.value);
  };

  toggleView = () => {
    this.setState((prevState) => {
      localStorage.setItem('GigE-statusbar', !prevState.show);
      return { show: !prevState.show };
    });
  };

  render() {
    const { show } = this.state;
    return (
      <div className={show ? 'status-bar' : 'status-bar collapsed'}>
        {show && (
          <div>
            <p>This is for testing purpose only</p>
            <Chip
              label="Hide this"
              onDelete={this.toggleView}
              onClick={this.toggleView}
              color="primary"
            />
            <p>{`Current Network: ${this.props.contract
              && this.props.contract.network}`}
            </p>
            <p className="current-account">
              {`Current Account: ${this.props.contract
                && this.props.contract.userAccount}`}
            </p>
            <p className="current-account">
              {`Current Network: ${this.props.contract
                && this.props.contract.network}`}
            </p>
            <form autoComplete="off">
              <FormControl>
                <InputLabel htmlFor="account">Select account</InputLabel>
                <Select
                  value={this.state.account}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'account',
                    id: 'account'
                  }}
                >
                  {this.props.contract
                    && this.props.contract.accounts
                    && this.props.contract.accounts.map((acc, index) => (
                      <MenuItem key={acc} value={index}>
                        {acc}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </form>

            <Chip
              color="primary"
              label="Get events (to console.log, be patient can take a couple of minutes)"
              onClick={this.getEvents}
              style={{ marginTop: 20 }}
            />
          </div>
        )}
        {!show && (
          <div>
            <Chip
              color="primary"
              label="Show debug"
              onClick={this.toggleView}
            />
            <p className="current-account">
              {`Current Account: ${this.props.contract
                && this.props.contract.userAccount}`}
            </p>
            <p className="current-account">
              {`Current Network: ${this.props.contract
                && this.props.contract.network}`}
            </p>
            <Chip
              color="secondary"
              label={`You have ${this.props.amount} ETH for withdraw`}
              onClick={this.getPayments}
            />
            <div>
              {this.props.amount
                && Number(this.props.amount) > 0 && (
                <Chip
                  color="primary"
                  label="Click to withdraw to your account"
                  onClick={this.withdraw}
                />
              )}
              {this.props.withdraw
                && this.props.withdraw.hash
                && this.props.withdraw.hash.transactionHash
                && !this.props.withdraw.ready && (
                <p className="transaction-wait">
                    We are creating your order please wait. Transaction:
                  {this.props.withdraw.hash.transactionHash}
                </p>
              )}

              {this.props.withdraw
                && this.props.withdraw.hash
                && this.props.withdraw.hash.transactionHash
                && this.props.withdraw.ready && (
                <p className="transaction-ready">
                    Your order is ready!. Transaction:
                  {this.props.withdraw.hash.transactionHash}
                </p>
              )}

              {this.props.withdraw
                && this.props.withdraw.error && (
                <p className="transaction-error">
                    Error:
                  {this.props.withdraw.error}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

StatusBar.propTypes = {
  contract: PropTypes.shape({
    web3: PropTypes.object,
    instance: PropTypes.object,
    userAccount: PropTypes.string,
    network: PropTypes.string,
    accounts: PropTypes.array
  }).isRequired,
  withdraw: PropTypes.shape({
    hash: PropTypes.object,
    ready: PropTypes.bool,
    error: PropTypes.string
  }).isRequired,
  getAvailablePayments: PropTypes.func.isRequired,
  withdrawPayments: PropTypes.func.isRequired,
  clearWithdraw: PropTypes.func.isRequired,
  amount: PropTypes.string.isRequired
};

const mapStateToProps = (state) => {
  let amount = '';
  if (
    state.contract
    && state.contract
    && state.contract.web3
    && state.contract.web3.utils
    && state.payment
    && state.payment.data
  ) {
    amount = state.contract.web3.utils.fromWei(state.payment.data, 'ether');
  }

  return {
    contract: state.contract,
    payment: state.payment,
    amount,
    withdraw: state.withdraw
  };
};

const mapDispatchToProps = dispatch => ({
  getAvailablePayments: () => dispatch(getAvailablePayments()),
  withdrawPayments: () => dispatch(withdrawPayments()),
  clearWithdraw: () => dispatch(clearWithdraw())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusBar);
