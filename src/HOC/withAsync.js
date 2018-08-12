/* eslint-disable */
import React from 'react';

function WithAsync(Component) {
  return function WihAsyncComponent({ isLoading, showError, ...props }) {
    if (!isLoading) {
      return (
        <div>
          {showError && (
            <div className="component-error-message">
              Oops! Something went wrong!
            </div>
          )}
          <Component {...props} />
        </div>
      );
    }
    return <p>Be Hold, fetching data may take some time :)</p>;
  };
}

export default WithAsync;
