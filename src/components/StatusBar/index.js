import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import './style.css';

class StatusBar extends Component {
  state = {
    show: false,
    account: 0
  };

  componentDidMount() {
    const currentAccount = localStorage.getItem('GigE-account');
    console.log(currentAccount);
    if (currentAccount) {
      this.setState({ account: Number(currentAccount) });
    }
    /* const show = localStorage.getItem('GigE-statusbar');
    console.log(show);
    this.setState({ show }); */
  }

  getEvents = () => {
    if (this.props.contract && this.props.contract.instance) {
      this.props.contract.instance
        .getPastEvents('allEvents', {
          fromBlock: 0,
          toBlock: 'latest'
        })
        .then((events) => {
          console.log(events); // same results as the optional callback above
        });
    }
  };

  handleChange = (event) => {
    this.setState({ account: event.target.value });
    localStorage.setItem('GigE-account', event.target.value);
  };

  toggleView = () => {
    this.setState((prevState) => {
      localStorage.setItem('GigE-statusbar', !prevState.show);
      return { show: !prevState.show };
    });
  };

  render() {
    const { show } = this.state;
    return (
      <div className={show ? 'status-bar' : 'status-bar collapsed'}>
        {show && (
          <div>
            <p>
This is for testing purpose only
            </p>
            <Chip
              label="Hide this"
              onDelete={this.toggleView}
              onClick={this.toggleView}
              color="primary"
            />
            <p>
              {`Current Network: ${this.props.contract
                && this.props.contract.network}`}
            </p>
            <p className="current-account">
              {`Current Account: ${this.props.contract
                && this.props.contract.userAccount}`}
            </p>
            <p className="current-account">
              {`Current Network: ${this.props.contract
                && this.props.contract.network}`}
            </p>
            <form autoComplete="off">
              <FormControl>
                <InputLabel htmlFor="account">
Select account
                </InputLabel>
                <Select
                  value={this.state.account}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'account',
                    id: 'account'
                  }}
                >
                  {this.props.contract
                    && this.props.contract.accounts
                    && this.props.contract.accounts.map((acc, index) => (
                      <MenuItem key={acc} value={index}>
                        {acc}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </form>

            <Chip
              color="primary"
              label="Get events (to console.log, be patient can take a couple of minutes)"
              onClick={this.getEvents}
              style={{ marginTop: 20 }}
            />
          </div>
        )}
        {!show && (
          <div>
            <Chip
              color="primary"
              label="Show debug"
              onClick={this.toggleView}
            />
            <p className="current-account">
              {`Current Account: ${this.props.contract
                && this.props.contract.userAccount}`}
            </p>
            <p className="current-account">
              {`Current Network: ${this.props.contract
                && this.props.contract.network}`}
            </p>
          </div>
        )}
      </div>
    );
  }
}

StatusBar.propTypes = {
  contract: PropTypes.shape({
    web3: PropTypes.object,
    instance: PropTypes.object,
    userAccount: PropTypes.string,
    network: PropTypes.string,
    accounts: PropTypes.array
  }).isRequired
};

const mapStateToProps = state => ({
  contract: state.contract
});

export default connect(mapStateToProps)(StatusBar);
