/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import WarningIcon from '@material-ui/icons/WarningOutlined';

import getContract, { setError } from '../actions/contract';
function WithAsyncWeb3(Component) {
  class Web3Component extends React.Component {
    componentWillMount() {
      window.addEventListener('load', () => {
        this.checkContract();
      });
    }

    componentDidUpdate(prevProps) {
      if (!this.props.web3 && !this.props.error) {
        this.checkContract();
      } else if (!this.props.error) {
        this.props.web3.eth.net
          .getNetworkType()
          .then(network => console.log(network))
          .catch(error => console.log(error));
      }

      return null;
    }

    async checkContract() {
      const contract = await this.props.getContract();
      if (!contract) {
        console.log('There is no contract or web3 instance');
      }
    }

    render() {
      return (
        <div>
          {this.props.error ? (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <h3>
                <WarningIcon style={{ position: 'relative', top: 5 }} /> Please check that you have
                metamask installed and running or another Ethereum provider
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
    web3: state.contract.web3,
    error: state.contract.error
  });

  const mapDispatchToProps = dispatch => ({
    getContract: () => dispatch(getContract()),
    setError: error => dispatch(setError(error))
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Web3Component);
}

export default WithAsyncWeb3;
