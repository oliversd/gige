import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';

import ServiceCard from '../../components/ServiceCard';

const SingleService = ({ service, contract }) => (
  <Grid container justify="center" spacing={24} style={{ marginTop: 20 }}>
    {service &&
      service.id && (
        <Grid key={service.id} item xs={12} sm={3}>
          <ServiceCard
            title={service.title}
            image={service.image}
            description={service.description}
            price={contract.web3.utils.fromWei(service.minimumPrice, 'ether')}
            buttonText="Get a quote"
          />
        </Grid>
      )}
  </Grid>
);

SingleService.propTypes = {
  contract: PropTypes.shape({
    web3: PropTypes.object
  }).isRequired,
  service: PropTypes.shape({
    title: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.string
  })
};

SingleService.defaultProps = {
  service: {}
};

const mapStateToProps = (state, props) => {
  let service = {};
  if (state.serviceList.data.length > 0) {
    service = state.serviceList.data.filter(
      item => item.id === props.match.params.id
    );
  }
  return {
    contract: state.contract,
    serviceList: state.serviceList,
    service: service[0]
  };
};

export default connect(mapStateToProps)(SingleService);
