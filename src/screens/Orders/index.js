import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';

// import t from "../../utils/i18n/lang";
import OrderState from '../../utils/order-utils';
// actions import
// hoc import
// components import
import OrderCard from '../../components/OrderCard';
// import Loading from '../../components/Loading';

import './style.css';

class Orders extends Component {
  handleClick = () => {
    console.log('clicked');
  };

  render() {
    return (
      <div>
        <h1>Orders</h1>
        {this.props.orderList
          && this.props.orderList.sellerOrders.length > 0 && <h2>Buy Orders</h2>}
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
                  state={OrderState(order.state)}
                />
              </Grid>
            ))}
        </Grid>
        {this.props.orderList
          && this.props.orderList.buyerOrders.length > 0 && <h2>Sell Orders</h2>}
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
                  buyer={order.buyer}
                  state={OrderState(order.state)}
                />
              </Grid>
            ))}
        </Grid>
      </div>
    );
  }
}

Orders.propTypes = {
  serviceList: PropTypes.shape({
    data: PropTypes.array
  }).isRequired,
  orderList: PropTypes.shape({
    sellerOrders: PropTypes.array,
    buyerOrders: PropTypes.array
  }).isRequired,
  contract: PropTypes.shape({
    web3: PropTypes.object,
    userAccount: PropTypes.string
  }).isRequired
};

const mapStateToProps = state => ({
  contract: state.contract,
  serviceList: state.serviceList,
  orderList: state.orderList
});

export default connect(mapStateToProps)(Orders);
