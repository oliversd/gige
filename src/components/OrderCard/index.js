import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const OrderCard = ({
  id, title, price, state
}) => (
  <React.Fragment>
    <Card>
      <CardContent>
        <Typography color="textSecondary">{`Order ID: ${id}`}</Typography>
        <Typography variant="headline" component="h2">
          {`${price} ETH`}
        </Typography>
        <br />
        <Typography color="textSecondary">{title}</Typography>
        <Typography component="p" color="primary">{`${state}`}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Accept & Pay</Button>
      </CardActions>
    </Card>
  </React.Fragment>
);

OrderCard.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired
};

export default OrderCard;
