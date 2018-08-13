import React, { Component } from 'react';
import { connect } from 'react-redux';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
// import t from "../../services/i18n/lang";

// actions import
// hoc import
// components import
// import Loading from '../../components/Loading';

// import './style.css';

class CreateService extends Component {
  state = {
    from: null,
    fromContract: [],
    title: '',
    description: '',
    image: 'fake.png',
    category: '',
    subcategory: '',
    price: 0
  };

  getValue = async () => {
    try {
      const { web3, instance } = this.props.contract;
      const accounts = await web3.eth.getAccounts();
      const from = accounts[0];
      const result = await instance.methods.services(1).call({ from });
      console.log(result);
      this.setState({ fromContract: result });
    } catch (e) {
      console.log(e);
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  createNewService = async () => {
    try {
      if (this.props.contract && this.props.contract.web3) {
        const { web3, instance } = this.props.contract;
        const accounts = await web3.eth.getAccounts();
        console.log(accounts[0]);
        const from = accounts[0];
        const {
          title, description, image, category, subcategory, price
        } = this.state;
        const priceBN = new web3.utils.BN(price);
        const result = await instance.methods
          .createService(
            title,
            description,
            image,
            category,
            subcategory,
            web3.utils.toWei(priceBN)
          )
          .send({ from, gas: 2100000 })
          .on('transactionHash', transactionHash => console.log(transactionHash));
        console.log(result);
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <div>
        <h1>
Create a Service
        </h1>
        <p>
          <FormControl>
            <InputLabel htmlFor="title">
Name
            </InputLabel>
            <Input id="title" value={this.state.title} onChange={this.handleChange} />
          </FormControl>
        </p>
        <p>
          <label htmlFor="description">
            Description
            <br />
            <input
              type="text"
              id="description"
              value={this.state.description}
              onChange={this.handleChange}
            />
          </label>
        </p>
        <p>
          <label htmlFor="image">
            Image
            <br />
            <input type="text" id="image" value={this.state.image} onChange={this.handleChange} />
          </label>
        </p>
        <p>
          <label htmlFor="category">
            Category
            <br />
            <input
              type="text"
              id="category"
              value={this.state.category}
              onChange={this.handleChange}
            />
          </label>
        </p>
        <p>
          <label htmlFor="subcategory">
            Subcategory
            <br />
            <input
              type="text"
              id="subcategory"
              value={this.state.subcategory}
              onChange={this.handleChange}
            />
          </label>
        </p>
        <p>
          <label htmlFor="price">
            Price
            <br />
            <input type="text" id="price" value={this.state.price} onChange={this.handleChange} />
          </label>
        </p>
        <button
          onClick={() => this.createNewService(this.state.contractInstance, this.state.from, this.state.value)
          }
        >
          Update
        </button>
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
)(CreateService);
