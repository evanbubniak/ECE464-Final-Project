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

  // const options = ["Add to Favorite Sources", "Add to Excluded Sources", "Add to Favorite Categories"];
  const options = ["Add to Excluded Sources"];
  const optionFuncs = [props.addExcludedSource];

  const optionsButtons = [];
  for (let ii = 0; ii < options.length; ii++) {
    optionsButtons.push( (<button onClick={event => optionFuncs[ii](props.item.sourceName)} >{options[ii]}</button>) )
  }
  const dropDownMenu = (
    <div className="dropdown-content">
      {optionsButtons}
    </div>
  )

  // const ups = (props.item.)

  return (
    <div className="InputTextBox">
      <div className="categoryText dropdown">
        {props.item.sourceName}: {props.item.topic}; {props.item.language}
        {dropDownMenu}
      </div>
      <div className="categoryText">
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
