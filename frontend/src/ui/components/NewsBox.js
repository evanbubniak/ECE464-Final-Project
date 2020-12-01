import React from 'react';

export default function NewsBox(props) {

  console.log(props);

  return (
    <div className="InputTextBox">
      <div className="categoryText">
        {props.item.source}
      </div>
      <div>
        <a href={props.item.url}>{props.item.title}</a>
      </div>
    </div>
  );

};
