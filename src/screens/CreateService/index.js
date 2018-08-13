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
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
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

class SignIn extends Component {
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
    try {
      const { web3, instance } = this.props.contract;
      if (this.props.contract && web3) {
        const accounts = await web3.eth.getAccounts();
        console.log(accounts[0]);
        const from = accounts[0];
        const {
          title, description, image, category, subcategory, price
        } = this.state;
        const priceBN = new web3.utils.BN(price);
        const result = await instance.methods
          .createService(
            title,
            description,
            image,
            category,
            subcategory,
            web3.utils.toWei(priceBN)
          )
          .send({ from, gas: 2100000 })
          .on('transactionHash', transactionHash => console.log(transactionHash));
        console.log(result);
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { classes } = this.props;
    const {
      title, description, image, category, subcategory, price
    } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <NewIcon />
            </Avatar>
            <Typography variant="headline">
Create Service
            </Typography>
            <form className={classes.form} onSubmit={this.createNewService}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="title">
Title
                </InputLabel>
                <Input
                  id="title"
                  name="title"
                  value={title}
                  onChange={this.handleChange}
                  autoFocus
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="description">
Description
                </InputLabel>
                <Input
                  id="description"
                  name="description"
                  value={description}
                  onChange={this.handleChange}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="image">
Image
                </InputLabel>
                <Input id="image" name="image" value={image} onChange={this.handleChange} />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="category">
Category
                </InputLabel>
                <Input
                  id="category"
                  name="category"
                  value={category}
                  onChange={this.handleChange}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="subcategory">
Subcategory
                </InputLabel>
                <Input
                  id="subcategory"
                  name="subcategory"
                  value={subcategory}
                  onChange={this.handleChange}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="price">
Price
                </InputLabel>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={price}
                  onChange={this.handleChange}
                  endAdornment={(
                    <InputAdornment position="end">
ETH
                    </InputAdornment>
                  )}
                />
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
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

const mapStateToProps = state => ({
  contract: state.contract
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(SignIn));
