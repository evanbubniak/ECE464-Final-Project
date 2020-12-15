import React, { useState, useEffect } from 'react';
import NewsItemContainerList from './components/NewsItemContainerList'

const DEFAULT_LANGUAGES = ["en"];
const DEFAULT_ITEMS_TO_SHOW = 50;

const DEFAULT_PREFS = {
  languages: DEFAULT_LANGUAGES,
  favoriteSources: [],
  excludedSources: [],
  favoriteCategories: []
};

function UI() {

  const [items, setItems] = useState([]);
  const [preferences, setPreferences] = useState(DEFAULT_PREFS)
  const [username, setUsername] = useState("");
  const [dateFilters, setDateFilters] = useState({
    useStartDate: true,
    startDate: '',
    useEndDate: true,
    endDate: ''
  })
  const [numItems, setNumItems] = useState(DEFAULT_ITEMS_TO_SHOW);

  const updateDateFilters = (event) => {
    event.preventDefault();
    let filter = event.target.name;
    let newValue = event.target.type === 'checkbox' ? !(dateFilters[filter]) : event.target.value;
    let newDateFilters = Object.assign({}, dateFilters);
    newDateFilters[filter] = newValue;
    setPreferences(newDateFilters);
  }

  const startDateCheckBox = ( <input type='checkbox' name='useStartDate' checked={dateFilters.useStartDate} onChange={updateDateFilters}/> );
  const endDateCheckBox = ( <input type='checkbox' name='useEndDate' checked={dateFilters.useEndDate} onChange={updateDateFilters}/> );
  const startDateInput = (<input type="text"  name='startDate' value={dateFilters.startDate} onChange={updateDateFilters} disabled={!dateFilters.useStartDate}/>)
  const endDateInput = (<input type="text"  name='endDate' value={dateFilters.endDate} onChange={updateDateFilters} disabled={!dateFilters.useEndDate}/>)


  const voteOnPost = (post, vote_type) => {
    // analytic = Analytic(userId=content['_id'], articleId=content['articleId'], sourceName=content['sourceName'],
    // topic=content['topic'], vote=content['vote'], voteDate=content['voteDate'])
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _id : username,
        articleId : post._id,
        sourceName : post.sourceName,
        topic : post.topic,
        vote : vote_type,
        voteDate: new Date().toDateString(),
                      })
    };
    fetch('/api/analytics', requestOptions);
  }

  const updateItems = () => {
    fetchNewsItemsWithPrefs(preferences).then((response) => response.json()).then((response) => setItems(response));
  }

  useEffect(updateItems, []);

  const handleSearchWithPreferences = (event) => {
    event.preventDefault();
    updateItems();
  }
  
  const handleNumItems = (event) => {
    setNumItems(event.target.value);
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

  const handlePrefCategories = (event) => {
    event.preventDefault();
    let newPreferences = Object.assign({}, preferences);
    newPreferences.favoriteCategories = event.target.value.split(",");
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
    fetchPreferences(username).then(preferences => {setPreferences(preferences)})
    
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
              <div>
                Number of items to show:
                <input type="number" value={numItems} onChange={handleNumItems} />
              </div>
              <div>
                Comma-separated language codes to use:
                <input type="text" value={preferences.languages} onChange={handleLanguages} />
              </div>
              <div>
                Favorite sources:
                <input type="text" value={preferences.favoriteSources} onChange={handleSources} />
              </div>
              <div>
                Sources to exclude:
                <input type="text" value={preferences.excludedSources} onChange={handleExcludedSources} />
              </div>
              <div>
                Preferred categories:
                <input type="text" value={preferences.favoriteCategories} onChange={handlePrefCategories} />                
              </div>
              <div>
                {startDateCheckBox} Start date: {startDateInput}
                <br />
                {endDateCheckBox} End date: {endDateInput}
                
              </div>
              <div>
                Username:
                <input type="text" value={username} onChange={handleUsername} />
                <button onClick={handleSave}>Save Preferences</button>
                <button onClick={importPreferences}>Load Preferences</button>
                <button onClick={handleSearchWithPreferences}>Search with Preferences</button>
              </div>
            </label>
          </form>
        </div>

        <div id="CategoriesAndSubItems" style={{
          gridRow: "1 / 3",
          gridColumn: "3 / 4",
        }}>
          {/* <NewsItemContainerList items={items} numItemsToShow={preferences.numItems} languages={preferences.languages} /> */}
          <NewsItemContainerList items={items} numItemsToShow={numItems} voteOnPost={voteOnPost} />
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

function fetchNewsItemsWithPrefs(prefs){
  
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prefs)
  };  
  return fetch("/api/articles", requestOptions);
}

function fetchPreferences(username){
  return fetch("/api/users").then(resp => resp.json()).then(resp => resp.find(userpref => userpref._id === username).preferences)
}

function savePreferences(username, preferences){
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ _id :username, preferences:preferences })
  };
  fetch('/api/users', requestOptions);
}

export default UI;