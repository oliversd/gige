import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';

// import t from "../../utils/i18n/lang";
import OrderState from '../../utils/order-utils';
// actions import
import { acceptOrder } from '../../actions/order';
// hoc import
// components import
import OrderCard from '../../components/OrderCard';
// import Loading from '../../components/Loading';

import './style.css';

class Orders extends Component {
  getLabel = (state, type) => {
    console.log(type);
    if (type === 'seller') {
      switch (Number(state)) {
        case 1:
          return 'Cancel service';
        case 2:
          return 'Mark as finished';
        default:
          return '';
      }
    }

    if (type === 'buyer') {
      switch (Number(state)) {
        case 0:
          return 'Pay Service';
        case 4:
          return 'Release payment';
        default:
          return '';
      }
    }
    return '';
  };

  handleClick = (orderId, state, price) => {
    if (Number(state) === 0) {
      this.props.acceptOrder(
        orderId,
        this.props.contract.web3.utils.toWei(price, 'ether')
      );
    }
  };

  render() {
    return (
      <div>
        <h1>
Orders
        </h1>
        {this.props.orderList
          && this.props.orderList.sellerOrders.length > 0 && (
          <h2>
Buy Orders
          </h2>
        )}
        {this.props.orderAccept
          && this.props.orderAccept.hash.transactionHash
          && !this.props.orderAccept.ready && (
          <p className="transaction-wait">
              We are creating your order please wait. Transaction:
            {this.props.orderAccept.hash.transactionHash}
          </p>
        )}

        {this.props.orderAccept
          && this.props.orderAccept.hash.transactionHash
          && this.props.orderAccept.ready && (
          <p className="transaction-ready">
              Your order is ready!. Transaction:
            {this.props.orderAccept.hash.transactionHash}
          </p>
        )}
        <Grid container spacing={24}>
          {this.props.orderList
            && this.props.orderList.sellerOrders.map(order => (
              <Grid key={order.id} item xs={12} sm={3}>
                <OrderCard
                  title={order.service.title}
                  price={
                    this.props.contract
                    && this.props.contract.web3
                    && this.props.contract.web3.utils
                    && this.props.contract.web3.utils.fromWei(order.price, 'ether')
                  }
                  id={order.id}
                  buyer={order.buyer}
                  seller="You"
                  state={OrderState(order.state)}
                  stateCode={order.state}
                  buttonLabel={this.getLabel(order.state, 'seller')}
                  handleClick={this.handleClick}
                />
              </Grid>
            ))}
        </Grid>
        {this.props.orderList
          && this.props.orderList.buyerOrders.length > 0 && (
          <h2>
Sell Orders
          </h2>
        )}
        <Grid container spacing={24}>
          {this.props.orderList
            && this.props.orderList.buyerOrders.map(order => (
              <Grid key={order.id} item xs={12} sm={3}>
                <OrderCard
                  title={order.service.title}
                  price={
                    this.props.contract
                    && this.props.contract.web3
                    && this.props.contract.web3.utils
                    && this.props.contract.web3.utils.fromWei(order.price, 'ether')
                  }
                  id={order.id}
                  buyer="You"
                  seller={order.seller}
                  state={OrderState(order.state)}
                  stateCode={order.state}
                  buttonLabel={this.getLabel(order.state, 'buyer')}
                  handleClick={this.handleClick}
                />
              </Grid>
            ))}
        </Grid>
      </div>
    );
  }
}

Orders.propTypes = {
  orderList: PropTypes.shape({
    sellerOrders: PropTypes.array,
    buyerOrders: PropTypes.array
  }).isRequired,
  orderAccept: PropTypes.shape({
    hash: PropTypes.string,
    ready: PropTypes.bool
  }).isRequired,
  contract: PropTypes.shape({
    web3: PropTypes.object,
    userAccount: PropTypes.string
  }).isRequired,
  acceptOrder: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  contract: state.contract,
  serviceList: state.serviceList,
  orderList: state.orderList,
  orderAccept: state.orderAccept
});

const mapDispatchToProps = dispatch => ({
  acceptOrder: (orderId, price) => dispatch(acceptOrder(orderId, price))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orders);
