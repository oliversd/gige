import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { lang } from '../../services/i18n/lang';
import { getPath } from '../../services/i18n/utils';

import './style.css';

const LocaleSwitcher = ({ location }) => (
  <ul className="language-switcher">
    {lang.supported.map(code => (
      <li
        key={code}
        className={
          code === lang.active()
            ? 'active language-switcher__locale'
            : 'language-switcher__locale'
        }
      >
        <a href={getPath(lang.active(), location.pathname, code, true)}>
          {lang.nameFor(code)}
        </a>
      </li>
    ))}
  </ul>
);

LocaleSwitcher.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string
  }).isRequired
};

export default withRouter(LocaleSwitcher);
