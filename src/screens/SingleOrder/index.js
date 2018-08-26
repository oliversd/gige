import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import red from '@material-ui/core/colors/red';
import sanitizeHtml from 'sanitize-html';
import Button from '@material-ui/core/Button';

import ServiceCard from '../../components/ServiceCard';

import createOrder from '../../actions/order';

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.primary.dark
  },
  form: {
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  },
  errorButton: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[700]
    }
  },
  transactionReady: {
    display: 'block',
    width: '100%',
    wordWrap: 'break-word',
    fontSize: '0.9rem',
    background: theme.palette.secondary.light,
    padding: 20,
    color: '#fff'
  },
  transactionWait: {
    display: 'block',
    width: '100%',
    wordWrap: 'break-word',
    fontSize: '0.9rem',
    background: theme.palette.primary.light,
    padding: 20,
    color: '#333'
  }
});

class Quote extends Component {
  state = {
    price: 0,
    buyer: '',
    error: {}
  };

  handleChange = (e) => {
    const text = sanitizeHtml(e.target.value.substr(0, 50), {
      allowedTags: [],
      allowedAttributes: []
    }).trim();
    const { id } = e.target;
    this.setState(prevState => ({
      [id]: text,
      error: { ...prevState.error, [id]: null }
    }));
  };

  validateForm = () => {
    let errorSet = false;
    let errors = { ...this.state.error };
    const { buyer, price } = this.state;

    if (!buyer.trim()) {
      errors = { ...errors, buyer: 'This field is required' };
      errorSet = true;
    }

    if (!price && price !== 0) {
      errors = { ...errors, price: 'This field is required' };
      errorSet = true;
    }

    if (
      price
      && (Number(price) > 1000 || Number(price) < 0.000000000000000001)
    ) {
      errors = {
        ...errors,
        price: 'Price is out of range 0.000000000000000001 to 1000'
      };
      errorSet = true;
    }

    if (errorSet) {
      this.setState({ error: errors });
      return false;
    }
    return true;
  };

  createNewService = async (e) => {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    const { price, buyer } = this.state;

    try {
      this.props.createOrder(this.props.service.id, price, buyer);
      this.setState({
        buyer: '',
        price: ''
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { service, contract, classes } = this.props;
    const { price, buyer, error } = this.state;
    return (
      <div>
        {service
          && service.id && (
          <Grid
            container
            justify="center"
            spacing={24}
            style={{ marginTop: 20 }}
          >
            <Grid item xs={12} sm={3}>
              <ServiceCard
                title={service.title}
                image={service.image}
                description={service.description}
                price={contract.web3.utils.fromWei(
                  service.minimumPrice,
                  'ether'
                )}
                buttonText="Get a quote"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="headline">Create Quote</Typography>
              <form
                className={classes.form}
                onSubmit={this.createNewService}
                encType="multipart/form-data"
              >
                <FormControl margin="normal" fullWidth error={!!error.buyer}>
                  <InputLabel htmlFor="buyer">Buyer Address</InputLabel>
                  <Input
                    id="buyer"
                    name="buyer"
                    value={buyer}
                    onChange={this.handleChange}
                    autoFocus
                    maxLength="30"
                  />
                  <FormHelperText>
                    {error.buyer ? error.buyer : ''}
                  </FormHelperText>
                </FormControl>
                <FormControl margin="normal" fullWidth error={!!error.price}>
                  <InputLabel htmlFor="price">Price</InputLabel>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={price}
                    onChange={this.handleChange}
                    endAdornment={
                      <InputAdornment position="end">ETH</InputAdornment>
                    }
                  />
                  <FormHelperText>
                    {error.price ? error.price : ''}
                  </FormHelperText>
                </FormControl>
                <Button
                  type="submit"
                  fullWidth
                  variant="raised"
                  color="primary"
                  className={classes.submit}
                >
                    Create
                </Button>
              </form>
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}

Quote.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  contract: PropTypes.shape({
    web3: PropTypes.object
  }).isRequired,
  service: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.string
  }),
  createOrder: PropTypes.func.isRequired
};

Quote.defaultProps = {
  service: {}
};

const mapStateToProps = (state, props) => {
  let service = {};
  if (state.serviceList.data.length > 0) {
    service = state.serviceList.data.filter(
      item => item.id === props.match.params.serviceId
    );
  }
  return {
    contract: state.contract,
    serviceList: state.serviceList,
    service: service[0]
  };
};

const mapDispatchToProps = dispatch => ({
  createOrder: (serviceId, price, buyer) => dispatch(createOrder(serviceId, price, buyer))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Quote));
