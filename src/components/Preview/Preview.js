import React from 'react';
import PropTypes from 'prop-types';

import Thumbnail from '../Thumbnail';

function Preview(props) {
  const {
    result,
    onClick,
    thumbnailSize,
    hideDescription
  } = props;

  const {
    snippet: {
      title,
      description,
      channelTitle,
      thumbnails
    },
    statistics: {
      viewCount
    },
    id
  } = result;

  const thumbnail = thumbnails[thumbnailSize];

  return (
    <div onClick={() => onClick(result)}>
      <Thumbnail
        imageUrl={thumbnail.url}
        height={thumbnail.height}
        width={thumbnail.width}
      />
      <span>{title}</span>
      <span>{channelTitle}</span>
      <span>{`${viewCount} views`}</span>
      <span>{!hideDescription && description}</span>
    </div>
  );
}

Preview.propTypes = {
  hideDescription: PropTypes.bool,
  thumbnailSize: PropTypes.oneOf([
    'default',
    'medium',
    'high'
  ])
};

Preview.defaultProps = {
  hideDescription: false,
  thumbnailSize: 'default'
};

export default Preview;
