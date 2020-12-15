import React from 'react';

export default function NewsBox(props) {

  const upvotePost = (event) => {
    event.preventDefault();
    props.voteOnPost(props.item._id, "upvote");
  }

  const downvotePost = (event) => {
    event.preventDefault();
    props.voteOnPost(props.item._id, "downvote");
  }

  return (
    <div className="InputTextBox">
      <div className="categoryText">
        {props.item.sourceName}: {props.item.topic}; {props.item.language}
      </div>
      <div>
        <a href={props.item.url}>{props.item.title}</a>
      </div>
    </div>
  );

};
