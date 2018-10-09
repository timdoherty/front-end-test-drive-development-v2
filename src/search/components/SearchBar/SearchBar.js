import React from 'react';
import PropTypes from 'prop-types';

import { Input } from '@procore/core-react';

function SearchBar(props) {
  const { onSearchChanged } = props;
  return (
    <Input onKeyUp={({ key, target: { value } }) => {
      if (key === 'Enter' && !!value) {
        onSearchChanged(value);
      }
    }}/>
  );
}

SearchBar.propTypes = {
  onSearchChanged: PropTypes.func
};

SearchBar.defaultProps = {
  onSearchChanged: Function.prototype
};

export default SearchBar;
