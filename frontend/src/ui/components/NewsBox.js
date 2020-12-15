import React from 'react';

export default function NewsBox(props) {

  const upvotePost = (event) => {
    event.preventDefault();
    props.voteOnPost(props.item, "up");
  }

  const downvotePost = (event) => {
    event.preventDefault();
    props.voteOnPost(props.item, "down");
  }

  // const ups = (props.item.)

  return (
    <div className="InputTextBox">
      <div className="categoryText">
        {props.item.sourceName}: {props.item.topic}; {props.item.language} <br/>
        {new Date(props.item.publishDate['$date']).toLocaleString()}
      </div>
      <div>
        <a href={props.item.url}>{props.item.title}</a>
      </div>
      <div>
        <button onClick={upvotePost}>Up</button>
        <button onClick={downvotePost}>Down</button>
      </div>
    </div>
  );

};
