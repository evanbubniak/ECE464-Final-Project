import React, { useState, useEffect } from 'react';
import NewsItemContainerList from './components/NewsItemContainerList'

const DEFAULT_LANGUAGES = ["en"];
const DEFAULT_ITEMS_TO_SHOw = 50;

function UI() {

  const [items, setItems] = useState([]);
  const [languages, setLanguages] = useState(DEFAULT_LANGUAGES);
  const [numItemsToShow, setNumItemsToShow] = useState(DEFAULT_ITEMS_TO_SHOw);
  

  useEffect(() => {
    fetchNewsItems().then((response) => response.json()).then((response) => setItems(response));;
  }, []);
  
  const handleNumItems = (event) => {
    setNumItemsToShow(event.target.value);
  }

  const handleLanguages = (event) => {
    setLanguages(event.target.value.split(","))
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
              <input type="number" value={numItemsToShow} onChange={handleNumItems} />
              <br />
              Comma-separated language codes to use:
              <input type="text" value={languages} onChange={handleLanguages} />
            </label>
          </form>
        </div>

        <div id="CategoriesAndSubItems" style={{
          gridRow: "1 / 3",
          gridColumn: "3 / 4",
        }}>
          <NewsItemContainerList items={items} numItemsToShow={numItemsToShow} languages={languages} />
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