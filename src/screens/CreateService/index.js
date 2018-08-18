import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import NewIcon from '@material-ui/icons/SendOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import InputAdornment from '@material-ui/core/InputAdornment';

import createService from '../../actions/service';
import ipfs from '../../utils/ipfs';
import ipfsUtils from '../../utils/ipfs-utils';

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
  }
});

class CreateService extends Component {
  state = {
    title: '',
    description: '',
    image: 'fake.png',
    category: '',
    subcategory: '',
    price: 0
  };

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  createNewService = async (e) => {
    e.preventDefault();
    const {
      title,
      description,
      image,
      category,
      subcategory,
      price
    } = this.state;

    const doc = Buffer.from(
      JSON.stringify({
        title,
        description,
        image,
        category,
        subcategory
      })
    );
    try {
      const ipfsHash = await ipfs.add(doc);
      if (ipfsHash) {
        const data = ipfsUtils.ipfsHashto32Bytes(ipfsHash[0].hash);
        this.props.createService(price, data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { classes } = this.props;
    const {
      title,
      description,
      image,
      category,
      subcategory,
      price
    } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <NewIcon />
            </Avatar>
            <Typography variant="headline">Create Service</Typography>
            <form className={classes.form} onSubmit={this.createNewService}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="title">Title</InputLabel>
                <Input
                  id="title"
                  name="title"
                  value={title}
                  onChange={this.handleChange}
                  autoFocus
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="description">Description</InputLabel>
                <Input
                  id="description"
                  name="description"
                  value={description}
                  onChange={this.handleChange}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="image">Image</InputLabel>
                <Input
                  id="image"
                  name="image"
                  value={image}
                  onChange={this.handleChange}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="category">Category</InputLabel>
                <Input
                  id="category"
                  name="category"
                  value={category}
                  onChange={this.handleChange}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="subcategory">Subcategory</InputLabel>
                <Input
                  id="subcategory"
                  name="subcategory"
                  value={subcategory}
                  onChange={this.handleChange}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
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
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="raised"
                color="primary"
                disabled={
                  this.props.service.service.transactionHash
                  && !this.props.service.ready
                }
                className={classes.submit}
              >
                Create
              </Button>
            </form>
            <Button
              fullWidth
              variant="raised"
              color="secondary"
              onClick={this.saveToIPFS}
            >
              IPFS
            </Button>
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

CreateService.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  createService: PropTypes.func.isRequired,
  contract: PropTypes.shape({
    web3: PropTypes.object,
    instance: PropTypes.object
  }).isRequired,
  service: PropTypes.shape({
    service: PropTypes.object,
    ready: PropTypes.bool
  }).isRequired
};

const mapStateToProps = state => ({
  contract: state.contract,
  service: state.service
});

const mapDispatchToProps = dispatch => ({
  createService: (title, description, image, category, subcategory, pice) => dispatch(
    createService(title, description, image, category, subcategory, pice)
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CreateService));
