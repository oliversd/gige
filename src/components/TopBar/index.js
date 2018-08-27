import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = {
  root: {
    flexGrow: 1
  },
  flex: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

const MenuAppBar = classes => (
  <div className={classes.root}>
    <AppBar position="static">
      <Toolbar>
        <Link to="/" className={classes.flex}>
          <Typography variant="title" style={{ color: '#fff' }}>
            GigE
          </Typography>
        </Link>
        <Button
          component={Link}
          to="/orders"
          color="inherit"
          style={{ marginLeft: 40 }}
        >
          My orders
        </Button>
      </Toolbar>
    </AppBar>
  </div>
);

MenuAppBar.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    flex: PropTypes.string
  }).isRequired
};

export default withStyles(styles)(MenuAppBar);
