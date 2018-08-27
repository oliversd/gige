import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

const ServiceCard = ({
  title,
  image,
  description,
  price,
  buttonText,
  link,
  isSeller
}) => (
  <React.Fragment>
    <Card>
      <CardMedia image={image} title={title} className="media" />
      <CardContent>
        <Typography
          gutterBottom
          variant="headline"
          component="h2"
          style={{ fontSize: '1.2rem' }}
        >
          {title}
        </Typography>
        <Typography component="p">
          {description}
        </Typography>
        {isSeller && (
          <Typography gutterBottom component="p" style={{ fontSize: '0.7rem' }}>
            You are the seller of this service
          </Typography>
        )}
      </CardContent>
      {buttonText && (
        <CardActions>
          <Button
            component={Link}
            to={link}
            size="small"
            variant="raised"
            color="primary"
            style={{ width: '30%' }}
          >
            {buttonText}
          </Button>
          <div style={{ width: '70%', textAlign: 'right' }}>
            <Typography component="p">
              {`starting at ${price} ETH`}
            </Typography>
          </div>
        </CardActions>
      )}
    </Card>
  </React.Fragment>
);

ServiceCard.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  isSeller: PropTypes.bool.isRequired,
  buttonText: PropTypes.string,
  link: PropTypes.string
};

ServiceCard.defaultProps = {
  buttonText: 'More info',
  link: '/'
};

export default ServiceCard;
