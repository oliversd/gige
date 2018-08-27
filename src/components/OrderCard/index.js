import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

const OrderCard = ({
  id,
  title,
  price,
  state,
  buyer,
  seller,
  buttonLabel,
  handleClick,
  stateCode,
  secondButtonLabel,
  secondButtonHandleClick
}) => (
  <React.Fragment>
    <Card>
      <CardContent>
        <Typography color="textSecondary">{`Order ID: ${id}`}</Typography>
        <Typography variant="headline" component="h2">
          {`${price} ETH`}
        </Typography>
        <Chip
          label={`State: ${state}`}
          color="secondary"
          style={{ marginTop: 10, marginBottom: 10 }}
        />
        <br />
        <Typography color="textSecondary">{title}</Typography>
        <Typography component="p">{`buyer: ${buyer}`}</Typography>
        <Typography component="p">{`seller: ${seller}`}</Typography>
      </CardContent>
      {buttonLabel && (
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleClick(id, stateCode, price)}
          >
            {buttonLabel}
          </Button>
          {secondButtonLabel && (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => secondButtonHandleClick(id, stateCode, price)}
            >
              {secondButtonLabel}
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  </React.Fragment>
);

OrderCard.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  buyer: PropTypes.string.isRequired,
  seller: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  stateCode: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  secondButtonLabel: PropTypes.string.isRequired,
  secondButtonHandleClick: PropTypes.func.isRequired
};

export default OrderCard;
