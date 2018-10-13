import React from 'react';
import PropTypes from 'prop-types';
import { connectModule } from 'redux-modules';

import List from './List';
import nowPlayingModule from '../../module';

function ListContainer(props) {
  const { comments } = props;
  return <List comments={comments} />;
}

ListContainer.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object),
};

ListContainer.defaultProps = { comments: [] };

export default connectModule(nowPlayingModule)(ListContainer);
