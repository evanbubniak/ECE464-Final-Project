import React from 'react'
import NewsBox from './NewsBox'

export default function NewsItemContainerList(props){

  const numBoxes = Math.min(props.items.length, props.numItemsToShow);
  const nums = [];
  for (let ii = 0; ii<numBoxes; ii++){
    nums.push(ii);
  }

  const items = (props.languages.length) != 0 ? props.items.filter((item) => props.languages.includes(item.language)) : props.items;
  
  const boxes =[];
  
  for (let ii = 0; ii <numBoxes; ii++) {
    boxes.push(
      <div key={parseInt(ii)}>
        <div style={{
            midWidth: "0",
            padding: "5px",
            flexBasis: "10em",
        }}>
          <NewsBox key={ii} itemNum={ii} item={items[ii]}  />
        </div>
      </div>
    )
  }

  return (
    <div style={{
      height: "100%",
    }}>
      <div style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}>
        <div style={{
          marginLeft: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "start",
          flexWrap: "wrap",
          height: "100%",
          overflowX: "auto"
        }}>
          {boxes}
        </div>     
      </div>
    </div>
  )
}