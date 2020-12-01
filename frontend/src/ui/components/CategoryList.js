import React from 'react';

function CategoryList(props){
    const listItems = [];
    const entries = Object.entries(props.items).sort((item1, item2) => parseInt(item1[0]) > parseInt(item2[0]) ? 1 : -1);

    for (const [itemNum, item] of entries) {
      listItems.push(
        <div key={itemNum}>
          {item.category.getPlainText()}
        </div>
      );
    }
  
    return (
      <div style={{
        height: "100%",
      }}>
        {listItems}
      </div>
    );
  }