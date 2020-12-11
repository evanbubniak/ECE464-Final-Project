import React from 'react';

export default function NewsBox(props) {
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
