import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';

// import t from "../../utils/i18n/lang";

// actions import
// hoc import
// components import
import ServiceCard from '../../components/ServiceCard';
// import Loading from '../../components/Loading';

import './style.css';

const Home = ({ serviceList }) => (
  <div>
    <h1>Services</h1>
    <Grid container spacing={24}>
      {serviceList &&
        serviceList.data.map(service => (
          <Grid key={service.id} item xs={12} sm={3}>
            <ServiceCard
              title={service.title}
              image={service.image}
              description={service.description}
            />
          </Grid>
        ))}
    </Grid>
  </div>
);

Home.propTypes = {
  serviceList: PropTypes.shape({
    data: PropTypes.array
  }).isRequired
};

const mapStateToProps = state => ({
  contract: state.contract,
  serviceList: state.serviceList
});

export default connect(mapStateToProps)(Home);
