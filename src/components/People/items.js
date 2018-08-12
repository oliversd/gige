import React from 'react';
import PropTypes from 'prop-types';

const PeopleItems = ({ people }) => <li>{people.name}</li>;

PeopleItems.propTypes = {
  people: PropTypes.shape({
    name: PropTypes.string
  }).isRequired
};

export default PeopleItems;
