import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// import t from "../../services/i18n/lang";

// actions import
// hoc import
// components import
// import Loading from '../../components/Loading';

import './style.css';

const Home = ({ serviceList }) => (
  <div>
    <h1>
Services
    </h1>
    {serviceList
      && serviceList.data.map(service => (
        <div key={service.id}>
          <p>
            {service.title}
          </p>
          {service.description}
          <p />
          <p>
            {service.price}
          </p>
        </div>
      ))}
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
