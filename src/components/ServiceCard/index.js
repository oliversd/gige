import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const ServiceCard = ({
  title, image, description, price
}) => (
  <React.Fragment>
    <Card>
      <CardMedia image={image} title={title} className="media" />
      <CardContent>
        <Typography gutterBottom variant="headline" component="h2">
          {title}
        </Typography>
        <Typography component="p">{description}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="raised" color="primary">
          More info
        </Button>
        <div style={{ width: '72%', textAlign: 'right' }}>
          <Typography variant="display1" component="p">
            {`${price} ETH`}
          </Typography>
        </div>
      </CardActions>
    </Card>
  </React.Fragment>
);

ServiceCard.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired
};

export default ServiceCard;
