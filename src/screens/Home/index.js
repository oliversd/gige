import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

// import t from "../../utils/i18n/lang";

// actions import
// hoc import
// components import
import ServiceCard from '../../components/ServiceCard';
// import Loading from '../../components/Loading';

import './style.css';

const Home = ({ serviceList, contract }) => (
  <div>
    <h1>
      Services
      <Button
        component={Link}
        to="/service/create"
        variant="contained"
        color="secondary"
        style={{ float: 'right' }}
      >
        Create New Service
      </Button>
    </h1>
    <Grid container spacing={24}>
      {serviceList &&
        serviceList.data.map(service => (
          <Grid key={service.id} item xs={12} sm={3}>
            <ServiceCard
              title={service.title}
              image={service.image}
              description={service.description.substr(0, 55)}
              price={
                contract &&
                contract.web3.utils.fromWei(service.minimumPrice, 'ether')
              }
              link={`/service/${service.id}`}
            />
          </Grid>
        ))}
    </Grid>
  </div>
);

Home.propTypes = {
  serviceList: PropTypes.shape({
    data: PropTypes.array
  }).isRequired,
  contract: PropTypes.shape({
    web3: PropTypes.object
  }).isRequired
};

const mapStateToProps = state => ({
  contract: state.contract,
  serviceList: state.serviceList
});

export default connect(mapStateToProps)(Home);
