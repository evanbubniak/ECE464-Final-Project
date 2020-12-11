import React, { useState, useEffect } from 'react';
import NewsItemContainerList from './components/NewsItemContainerList'

const DEFAULT_LANGUAGES = ["en"];
const DEFAULT_ITEMS_TO_SHOW = 50;

const DEFAULT_PREFS = {
  languages: DEFAULT_LANGUAGES,
  numItems: DEFAULT_ITEMS_TO_SHOW,
  favoriteSources: [],
  excludedSources: []
};

function UI() {

  const [items, setItems] = useState([]);
  const [preferences, setPreferences] = useState(DEFAULT_PREFS)
  const [username, setUsername] = useState("");
  

  useEffect(() => {
    fetchNewsItems().then((response) => response.json()).then((response) => setItems(response));;
  }, []);
  
  const handleNumItems = (event) => {
    let newPreferences = Object.assign({}, preferences);
    newPreferences.numItems = event.target.value;
    setPreferences(newPreferences);
  }

  const handleLanguages = (event) => {
    let newPreferences = Object.assign({}, preferences);
    newPreferences.languages = event.target.value.split(",");
    setPreferences(newPreferences);
  }

  const handleUsername = (event) => {
    setUsername(event.target.value);
  }

  const handleSave = (event) => {
    event.preventDefault();
    savePreferences(username, preferences)
  }
  
  const handleSources = (event) => {
    event.preventDefault();
    let newPreferences = Object.assign({}, preferences);
    newPreferences.favoriteSources = event.target.value.split(",");
    setPreferences(newPreferences);
  }

  const handleExcludedSources = (event) => {
    event.preventDefault();
    let newPreferences = Object.assign({}, preferences);
    newPreferences.excludedSources = event.target.value.split(",");
    setPreferences(newPreferences);
  }

  const importPreferences = (event) => {
    event.preventDefault();
    fetchPreferences(username).then(preferences => setPreferences(preferences))
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
              <input type="number" value={preferences.numItems} onChange={handleNumItems} />
              <br />
              Comma-separated language codes to use:
              <input type="text" value={preferences.languages} onChange={handleLanguages} />
              Favorite sources:
              <input type="text" value={preferences.favoriteSources} onChange={handleSources} />
              Sources to exclude:
              <input type="text" value={preferences.excludedSources} onChange={handleExcludedSources} />
            </label>
          </form>
          <form>
            <label>
              Username:
              <input type="text" value={username} onChange={handleUsername} />
              <button onClick={handleSave}>Save Preferences</button>
              <button onClick={importPreferences}>Load Preferences</button>
            </label>
          </form>
        </div>

        <div id="CategoriesAndSubItems" style={{
          gridRow: "1 / 3",
          gridColumn: "3 / 4",
        }}>
          <NewsItemContainerList items={items} numItemsToShow={preferences.numItems} languages={preferences.languages} />
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

function fetchPreferences(username){
  return fetch("/api/users").then(resp => resp.json()).then(resp => resp.find(userpref => userpref._id === username).preferences)
}

function savePreferences(username, preferences){
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ _id:username, preferences:preferences })
  };
  fetch('/api/users', requestOptions);
}

export default UI;