import React from 'react';
import PropTypes from 'prop-types';

import t from '../../services/i18n/lang';

import PeopleItems from './items';

const People = ({ data }) => (
  <div>
    <h1>
      People - {t('app_name')} - {t('published_on', { date: new Date() })}
    </h1>
    <ul>
      {data &&
        data.length !== 0 &&
        data.map(people => <PeopleItems key={people.url} people={people} />)}
    </ul>
    {data && data.length === 0 && <p>There is no data.</p>}
  </div>
);

People.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default People;
