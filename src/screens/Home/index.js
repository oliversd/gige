import React, { Component } from "react";
import getWeb3 from "../../utils/getWeb3";
import Web3 from "web3";
import GigEService from "../../contracts/GigEService.json";

// import t from "../../services/i18n/lang";

// actions import
// hoc import
// components import
// import Loading from '../../components/Loading';

import "./style.css";

class Home extends Component {
  state = {
    storageValue: 0,
    web3: null,
    from: null,
    value: 18,
    contractInstance: null,
    fromContract: [],
    title: "",
    description: "",
    image: "fake.png",
    category: "",
    subcategory: "",
    price: 0,
    seller: ""
  };
  componentDidMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    getWeb3
      .then(web3 => {
        console.log(web3);
        this.setState({
          web3
        });
        // Instantiate contract once web3 provided.
        this.instantiateContract();
      })
      .catch(e => {
        console.log(e);
        console.log("Error finding web3.");
      });
  }

  instantiateContract = async () => {
    console.log(GigEService);
    const gigEService = new this.state.web3.eth.Contract(
      GigEService.abi,
      "0xfa1e120e8fc8296e2a304131885d98fa1442a2bc"
    );

    // Get accounts.
    const accounts = await this.state.web3.eth.getAccounts();

    this.setState({
      ...this.state,
      from: accounts[0],
      value: 18,
      contractInstance: gigEService
    });
  };

  handleChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  createNewService = async (gigEServiceInstance, from, value) => {
    try {
      const result = await gigEServiceInstance.methods
        .createService(
          this.state.title,
          this.state.description,
          this.state.image,
          this.state.category,
          this.state.subcategory,
          Web3.utils.toWei(this.state.price)
        )
        .send({ from, gas: 2100000 })
        .on("transactionHash", transactionHash => console.log(transactionHash));
      if (result.status) {
        this.setState({ storageValue: this.state.value });
      }
    } catch (e) {
      console.log(e);
    }
  };

  getValue = async (gigEServiceInstance, from) => {
    try {
      const result = await gigEServiceInstance.methods
        .services(0)
        .call({ from });
      console.log(result);
      this.setState({ ...this.state, fromContract: result });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <div>
        <main>
          <div>
            <div>
              <h1>GigE</h1>
              <h2>Create a Service</h2>
              <p>
                <label for="title">
                  Title
                  <br />
                  <input
                    type="text"
                    id="title"
                    value={this.state.title}
                    onChange={this.handleChange}
                  />
                </label>
              </p>
              <p>
                <label for="description">
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
                <label for="image">
                  Image
                  <br />
                  <input
                    type="text"
                    id="image"
                    value={this.state.image}
                    onChange={this.handleChange}
                  />
                </label>
              </p>
              <p>
                <label for="category">
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
                <label for="subcategory">
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
                <label for="price">
                  Price
                  <br />
                  <input
                    type="text"
                    id="price"
                    value={this.state.price}
                    onChange={this.handleChange}
                  />
                </label>
              </p>
              <button
                onClick={() =>
                  this.createNewService(
                    this.state.contractInstance,
                    this.state.from,
                    this.state.value
                  )
                }
              >
                Update
              </button>
              <h1>From Contract:</h1>
              <h1>{this.state.fromContract.title}</h1>
              <button
                onClick={() =>
                  this.getValue(this.state.contractInstance, this.state.from)
                }
              >
                Get Value
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default Home;
