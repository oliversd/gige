/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import WarningIcon from '@material-ui/icons/WarningOutlined';

import getContract, { setError } from '../actions/contract';
import { getServiceList } from '../actions/service';
import { getOrderList } from '../actions/order';

function WithAsyncWeb3(Component) {
  class Web3Component extends React.Component {
    state = {
      checkInterval: null,
      retry: 0
    };

    componentDidMount() {
      window.addEventListener('load', () => {
        this.checkContract();
      });
      // Check for Ethereum provider every 10 seconds
      const checkInterval = setInterval(this.checkContract.bind(this), 1000);
      this.setState({ checkInterval });
    }

    componentDidUpdate(prevProps) {
      const { retry } = this.state;
      if (!this.props.contract.web3 && !this.props.error && retry < 10) {
        console.log('checking');
        this.checkContract();
        this.setState({ retry: retry + 1 });
      }

      return null;
    }

    componentWillUnmount() {
      const { checkInterval } = this.state;
      clearInterval(checkInterval);
    }

    async checkContract() {
      const contract = await this.props.getContract();
      if (!contract) {
        console.log('There is no contract or web3 instance');
      } else {
        this.props.getServiceList();
        this.props.getOrderList();
      }
    }

    render() {
      return (
        <div>
          {this.props.error ? (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <h3>
                <WarningIcon style={{ position: 'relative', top: 5 }} /> Please
                check that you have metamask installed and running or another
                Ethereum provider
              </h3>
            </div>
          ) : (
            <Component {...this.props} />
          )}
        </div>
      );
    }
  }

  /* Web3Component.propTypes = {
    getContract: PropTypes.func.isRequired
  };*/

  const mapStateToProps = state => ({
    contract: state.contract,
    error: state.contract.error
  });

  const mapDispatchToProps = dispatch => ({
    getContract: () => dispatch(getContract()),
    setError: error => dispatch(setError(error)),
    getServiceList: () => dispatch(getServiceList()),
    getOrderList: () => dispatch(getOrderList())
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Web3Component);
}

export default WithAsyncWeb3;
