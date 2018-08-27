// prettier-ignore
/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import { Link } from 'react-router-dom';

import ServiceCard from '../../components/ServiceCard';

import './style.css';

const SingleService = ({ service, contract }) => (
  <Grid container justify="center" spacing={24} style={{ marginTop: 20 }}>
    {service &&
      service.id && (
        <React.Fragment>
          <Grid key={service.id} item xs={12} sm={3}>
            <ServiceCard
              title={service.title}
              image={service.image}
              description={service.description}
              price={contract.web3.utils.fromWei(service.minimumPrice, 'ether')}
              buttonText={
                contract && contract.userAccount === service.seller
                  ? 'New quote'
                  : ''
              }
              link={`/quote/create/${service.id}`}
            />
            {contract &&
              contract.userAccount === service.seller && (
                <div>
                  <h4>Instructions</h4>
                  <p>
                    As a seller you have to create a Quote with the address of
                    the buyer. Later this will be implemented later off chain so
                    you don&#39;t have to type the buyer address.
                  </p>
                </div>
              )}
            {contract &&
              contract.userAccount !== service.seller && (
                <div>
                  <h4>Instructions</h4>
                  <p>
                    As a buyer you have to wait that the seller create a new
                    Quote and once it&#39;s done you can see it and pay in
                    <Link to="/orders" style={{ textDecoration: 'underline' }}>
                      My Orders page.
                    </Link>
                  </p>
                </div>
              )}
          </Grid>
          <Grid key={service.id} item xs={12} sm={3}>
            <p>
              This is just an example of a chat between buyer and seller this
              will be implemented off chain at a later time.
            </p>
            <div className="chat">
              <Chip
                avatar={
                  <Avatar>
                    <FaceIcon />
                  </Avatar>
                }
                label="Hello"
                color="secondary"
                className="chat-buyer"
                style={{ marginTop: 10 }}
              />
              <br />
              <Chip
                avatar={
                  <Avatar>
                    <FaceIcon />
                  </Avatar>
                }
                label="Hello"
                color="primary"
                className="chat-seller"
                style={{ marginTop: 10 }}
              />
              <br />
              <Chip
                avatar={
                  <Avatar>
                    <FaceIcon />
                  </Avatar>
                }
                label="I need this for my company"
                color="secondary"
                className="chat-buyer"
                style={{ marginTop: 10 }}
              />
              <br />
              <Chip
                avatar={
                  <Avatar>
                    <FaceIcon />
                  </Avatar>
                }
                label="how much time do you take?"
                color="secondary"
                className="chat-buyer"
                style={{ marginTop: 10 }}
              />
              <br />
              <Chip
                avatar={
                  <Avatar>
                    <FaceIcon />
                  </Avatar>
                }
                label="About 3 weeks"
                color="primary"
                className="chat-seller"
                style={{ marginTop: 10 }}
              />
              <br />
              <Chip
                avatar={
                  <Avatar>
                    <FaceIcon />
                  </Avatar>
                }
                label="Perfect! and what is the cost?"
                color="secondary"
                className="chat-buyer"
                style={{ marginTop: 10 }}
              />
              <br />
              <Chip
                avatar={
                  <Avatar>
                    <FaceIcon />
                  </Avatar>
                }
                label="X ETH"
                color="primary"
                className="chat-seller"
                style={{ marginTop: 10 }}
              />
              <br />
              <Chip
                avatar={
                  <Avatar>
                    <FaceIcon />
                  </Avatar>
                }
                label="Alright! let's do this!"
                color="secondary"
                className="chat-buyer"
                style={{ marginTop: 10 }}
              />
              <br />
              <Chip
                avatar={
                  <Avatar>
                    <FaceIcon />
                  </Avatar>
                }
                label="Great! I will create a quote for you"
                color="primary"
                className="chat-seller"
                style={{ marginTop: 10 }}
              />
              <Chip
                avatar={
                  <Avatar>
                    <FaceIcon />
                  </Avatar>
                }
                label="When you pay this quote I will start the job"
                color="primary"
                className="chat-seller"
                style={{ marginTop: 10 }}
              />
              <Chip
                avatar={
                  <Avatar>
                    <FaceIcon />
                  </Avatar>
                }
                label="you can find it on My Orders on the top nav bar"
                color="primary"
                className="chat-seller"
                style={{ marginTop: 10 }}
              />
            </div>
          </Grid>
        </React.Fragment>
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
