import React, { useState } from 'react';
import NewsItemContainerList from './components/NewsItemContainerList'

function UI() {

  const [items, setItems] = useState([]);
  const [numItemsToShow, setNumItemsToShow] = useState(10);
  fetchNewsItems().then((response) => response.json()).then((response) => setItems(response));
  
  const handleChange = (event) => {
    setNumItemsToShow(event.target.value);
  }
  
  return (
    <div className="UI">
      <div className="layout-container">
        <div id ="CategoryList" style={{
          borderRight: "1px solid red",
          gridRow: "1 / 3",
          gridColumn: "1 / 3"
        }}>
          <form>
            <label>
              Number of items to show:
              <input type="number" value={numItemsToShow} onChange={handleChange} />
            </label>
          </form>
        </div>

        <div id="CategoriesAndSubItems" style={{
          gridRow: "1 / 3",
          gridColumn: "3 / 4",
        }}>
          <NewsItemContainerList items={items} numItemsToShow={numItemsToShow} />
        </div>

        <div id="BottomContainer" style={{
          gridRow: "3 / 4",
          gridColumn: "1 / 4",
          borderTop: "1px solid red",
          textAlign: "center",
          width: "100%",
          height:"100%",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center"
        }}>
          newsdb - Evan and Nick - Patent Not Pending
        </div>
      </div>
    </div>
  );
}

function fetchNewsItems(){
  return fetch("/api/articles");
}

export default UI;