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
import FormHelperText from '@material-ui/core/FormHelperText';
import red from '@material-ui/core/colors/red';
import sanitizeHtml from 'sanitize-html';

import createService, { clearServiceTransaction } from '../../actions/service';
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
    },
    marginBottom: theme.spacing.unit * 20
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

class CreateService extends Component {
  state = {
    title: '',
    description: '',
    image: null,
    category: '',
    subcategory: '',
    price: 0,
    descriptionLength: null,
    max: 2000,
    ipfsLoading: false,
    error: {
      title: null,
      description: null,
      image: null,
      category: null,
      subcategory: null,
      price: null
    }
  };

  componentDidMount() {
    this.props.clearServiceTransaction();
  }

  handleChange = (e) => {
    if (e.target.id === 'description') {
      const { max } = this.state;
      const text = e.target.value.substr(0, max);
      const descriptionLength = max - text.length;
      this.setState(prevState => ({
        description: text,
        descriptionLength,
        error: { ...prevState.error, description: null }
      }));
    } else {
      const text = e.target.value.substr(0, 50);
      const { id } = e.target;
      this.setState(prevState => ({
        [id]: text,
        error: { ...prevState.error, [id]: null }
      }));
    }
  };

  captureFile = (event) => {
    event.stopPropagation();
    event.preventDefault();

    const { type } = event.target.files[0];
    if (type !== 'image/jpg' && type !== 'image/png' && type !== 'image/jpeg') {
      this.setState(prevState => ({
        error: {
          ...prevState.error,
          image: 'File format not allowed. Please upload a png or jpg file.'
        }
      }));
      return;
    }
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.convertToBuffer(reader);
  };

  convertToBuffer = async (reader) => {
    // file is converted to a buffer for upload to IPFS
    const image = await Buffer.from(reader.result);
    // set this buffer -using es6 syntax
    this.setState(prevState => ({
      image,
      error: { ...prevState.error, image: null }
    }));
  };

  validateForm = () => {
    let errorSet = false;
    let errors = { ...this.state.error };
    const {
      title, description, category, subcategory, price
    } = this.state;

    if (!title.trim()) {
      errors = { ...errors, title: 'This field is required' };
      errorSet = true;
    }

    if (!description.trim()) {
      errors = { ...errors, description: 'This field is required' };
      errorSet = true;
    }

    if (!category.trim()) {
      errors = { ...errors, category: 'This field is required' };
      errorSet = true;
    }

    if (!subcategory.trim()) {
      errors = { ...errors, subcategory: 'This field is required' };
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
    this.setState({ ipfsLoading: true });
    if (!this.validateForm()) {
      return;
    }

    const {
      title,
      description,
      image,
      category,
      subcategory,
      price
    } = this.state;

    try {
      let imageHash = null;
      if (image) {
        imageHash = await ipfs.add(image);
      }

      const doc = Buffer.from(
        JSON.stringify({
          title: sanitizeHtml(title, {
            allowedTags: [],
            allowedAttributes: []
          }).trim(),
          description: sanitizeHtml(description, {
            allowedTags: [],
            allowedAttributes: []
          }).trim(),
          image: imageHash ? imageHash[0].hash : null,
          category: sanitizeHtml(category, {
            allowedTags: [],
            allowedAttributes: []
          }).trim(),
          subcategory: sanitizeHtml(subcategory, {
            allowedTags: [],
            allowedAttributes: []
          }).trim()
        })
      );
      const ipfsHash = await ipfs.add(doc);
      this.setState({ ipfsLoading: false });
      if (ipfsHash) {
        const data = ipfsUtils.ipfsHashto32Bytes(ipfsHash[0].hash);
        this.props.createService(price, data);
        this.setState({
          title: '',
          description: '',
          image: '',
          category: '',
          subcategory: '',
          price: ''
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { classes } = this.props;
    const {
      title, description, category, subcategory, price
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
            <form
              className={classes.form}
              onSubmit={this.createNewService}
              encType="multipart/form-data"
            >
              <FormControl
                margin="normal"
                fullWidth
                error={!!this.state.error.title}
              >
                <InputLabel htmlFor="title">Title</InputLabel>
                <Input
                  id="title"
                  name="title"
                  value={title}
                  onChange={this.handleChange}
                  autoFocus
                  maxLength="30"
                />
                <FormHelperText>
                  {this.state.error.title ? this.state.error.title : ''}
                </FormHelperText>
              </FormControl>
              <FormControl
                margin="normal"
                fullWidth
                error={!!this.state.error.description}
              >
                <InputLabel htmlFor="description">Description</InputLabel>
                <Input
                  id="description"
                  name="description"
                  multiline
                  rows={6}
                  value={description}
                  onChange={this.handleChange}
                  maxLength={2000}
                />
                <FormHelperText>
                  Characters left{' '}
                  {!this.state.descriptionLength
                  && this.state.descriptionLength !== 0
                    ? this.state.max
                    : this.state.descriptionLength}
                </FormHelperText>
              </FormControl>
              <FormControl
                margin="normal"
                fullWidth
                error={!!this.state.error.image}
              >
                <label htmlFor="files">
                  <input
                    accept="image/jpeg,image/png"
                    id="files"
                    name="files"
                    multiple
                    type="file"
                    onChange={this.captureFile}
                    style={{ display: 'none' }}
                  />
                  <Button
                    fullWidth
                    variant="raised"
                    color={this.state.image ? 'secondary' : 'primary'}
                    component="span"
                    className={
                      this.state.error.image ? classes.errorButton : ''
                    }
                  >
                    {this.state.image ? 'Uploaded' : 'Upload Image'}
                  </Button>
                  <FormHelperText>
                    {this.state.error.image
                      ? this.state.error.image
                      : 'Accepted formats jpg and png.'}
                  </FormHelperText>
                </label>
              </FormControl>
              <FormControl
                margin="normal"
                fullWidth
                error={!!this.state.error.category}
              >
                <InputLabel htmlFor="category">Category</InputLabel>
                <Input
                  id="category"
                  name="category"
                  value={category}
                  onChange={this.handleChange}
                />
                <FormHelperText>
                  {this.state.error.category ? this.state.error.category : ''}
                </FormHelperText>
              </FormControl>
              <FormControl
                margin="normal"
                fullWidth
                error={!!this.state.error.subcategory}
              >
                <InputLabel htmlFor="subcategory">Subcategory</InputLabel>
                <Input
                  id="subcategory"
                  name="subcategory"
                  value={subcategory}
                  onChange={this.handleChange}
                />
                <FormHelperText>
                  {this.state.error.subcategory
                    ? this.state.error.subcategory
                    : ''}
                </FormHelperText>
              </FormControl>
              <FormControl
                margin="normal"
                fullWidth
                error={!!this.state.error.price}
              >
                <InputLabel htmlFor="price">Starting Price</InputLabel>
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
                  {this.state.error.price ? this.state.error.price : ''}
                </FormHelperText>
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="raised"
                color="primary"
                disabled={
                  (this.props.service.service.transactionHash
                    && !this.props.service.ready)
                  || this.state.ipfsLoading
                }
                className={classes.submit}
              >
                {(this.props.service.service.transactionHash
                  && !this.props.service.ready)
                || this.state.ipfsLoading
                  ? 'Creating'
                  : 'Create'}
              </Button>
            </form>
            {this.state.ipfsLoading && (
              <p className={classes.transactionWait}>
                Uploading data and image to IPFS please wait...
              </p>
            )}
            {this.props.service
              && this.props.service.service.transactionHash
              && !this.props.service.ready && (
              <p className={classes.transactionWait}>
                  We are creating your service please wait. Transaction:
                {this.props.service.service.transactionHash}
              </p>
            )}

            {this.props.service
              && this.props.service.service.transactionHash
              && this.props.service.ready && (
              <p className={classes.transactionReady}>
                  Your service is ready!. Transaction:
                {this.props.service.service.transactionHash}
              </p>
            )}
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

CreateService.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  createService: PropTypes.func.isRequired,
  service: PropTypes.shape({
    service: PropTypes.object,
    ready: PropTypes.bool
  }).isRequired,
  clearServiceTransaction: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  contract: state.contract,
  service: state.service
});

const mapDispatchToProps = dispatch => ({
  createService: (title, description, image, category, subcategory, price) => dispatch(
    createService(title, description, image, category, subcategory, price)
  ),
  clearServiceTransaction: () => dispatch(clearServiceTransaction())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CreateService));
