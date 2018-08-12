/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import getContract from '../actions/contract';
function WithAsyncWeb3(Component) {
  class Web3Component extends React.Component {
    componentWillMount() {
      window.addEventListener('load', () => {
        this.checkContract();
      });
    }

    componentDidUpdate(prevProps) {
      if (!this.props.web3) {
        this.checkContract();
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
          <Component {...this.props} />
        </div>
      );
    }
  }

  /* Web3Component.propTypes = {
    getContract: PropTypes.func.isRequired
  };*/

  const mapStateToProps = state => ({
    web3: state.web3
  });

  const mapDispatchToProps = dispatch => ({
    getContract: () => dispatch(getContract())
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Web3Component);
}

export default WithAsyncWeb3;
