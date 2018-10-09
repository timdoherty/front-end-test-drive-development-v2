import React from 'react';
import PropTypes from 'prop-types';

import Comment from './Comment';

function CommentsList(props) {
  const { comments } = props;
  return (
    <div>
      {comments.map(comment => (
        <Comment
          key={comment.id}
          comment={comment}
        />
      ))}
    </div>
  );
}

CommentsList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object)
};

CommentsList.defaultProps = { comments: [] };

export default CommentsList;
