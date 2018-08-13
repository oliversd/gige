import React, { Component } from 'react';
import { connect } from 'react-redux';

// import t from "../../services/i18n/lang";

// actions import
// hoc import
// components import
// import Loading from '../../components/Loading';

import './style.css';

class Home extends Component {
  state = {
    from: null,
    fromContract: []
  };

  getValue = async () => {
    try {
      const { web3, instance } = this.props.contract;
      const accounts = await web3.eth.getAccounts();
      const from = accounts[0];
      const result = await instance.methods.services(3).call({ from });
      console.log(result);
      this.setState({ fromContract: result });
    } catch (e) {
      console.log(e);
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    return (
      <div>
        <h1>
Services
        </h1>
        <h1>
From Contract:
        </h1>
        <h1>
          {this.state.fromContract.title}
        </h1>
        <button onClick={() => this.getValue(this.state.contractInstance, this.state.from)}>
          Get Value
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  contract: state.contract
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
