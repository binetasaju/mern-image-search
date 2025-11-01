import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import tinycolor from 'tinycolor2'; // We will use this fully now
import { ThemeContext } from '../context/ThemeContext';
import { getContrastYIQ } from '../utils/colorHelper';
import TopSearchBanner from './TopSearchBanner';
import SearchHistory from './SearchHistory';
import SearchBar from './SearchBar';
import ImageList from './ImageList';

function SearchDashboard() {
  const [user, setUser] = useState(null);
  const [topSearches, setTopSearches] = useState([]);
  const [history, setHistory] = useState([]);
  const [images, setImages] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTerm, setCurrentTerm] = useState('');
  const { theme, setTheme } = useContext(ThemeContext); // Get theme AND setTheme

  const fetchImages = async (term, page) => {
    try {
      const res = await axios.post('/api/search', { term, page });

      // --- THIS IS THE NEW, VIBRANT THEME LOGIC ---
      if (page === 1 && res.data.length > 0) {
        const baseColor = tinycolor(res.data[0].color || '#007bff');
        
        // Generate a "tetrad" (four-color) palette for variety
        const palette = baseColor.tetrad(); 
        
        // Assign colors from the palette
        const primaryColor = baseColor.saturate(10); // Make it vibrant
        const secondaryColor = palette[1].saturate(10); // Search button
        const infoColor = palette[2].saturate(10);      // Load More button
        const dangerColor = palette[3].saturate(10);     // Delete buttons

        // Generate the full theme
        const newTheme = {
          ...theme, // Start with default
          
          // Backgrounds (Light & less saturated, but based on the color)
          '--background-color': baseColor.clone().desaturate(30).lighten(38).toString(),
          '--widget-background': baseColor.clone().desaturate(10).lighten(45).toString(),
          '--border-color': baseColor.clone().desaturate(20).lighten(30).toString(),
          
          // Text (Dark & less saturated, based on the color)
          '--text-color': baseColor.clone().desaturate(50).darken(50).toString(),
          '--text-color-light': baseColor.clone().desaturate(30).darken(30).toString(),

          // Primary (Links, Save Button)
          '--primary-color': primaryColor.toString(),
          '--primary-hover': primaryColor.darken(10).toString(),
          '--primary-text-color': getContrastYIQ(primaryColor.toHexString()),
          
          // Secondary (Search Button)
          '--secondary-color': secondaryColor.toString(),
          '--secondary-hover': secondaryColor.darken(10).toString(),
          '--secondary-text-color': getContrastYIQ(secondaryColor.toHexString()),

          // Info (Load More Button)
          '--info-color': infoColor.toString(),
          '--info-hover': infoColor.darken(10).toString(),
          '--info-text-color': getContrastYIQ(infoColor.toHexString()),

          // Danger (Delete buttons) - now also themed!
          '--danger-color': dangerColor.toString(),
          '--danger-hover': dangerColor.darken(10).toString(),
          '--danger-text-color': getContrastYIQ(dangerColor.toHexString()),
        };

        setTheme(newTheme);
      }
      // --- END THEME LOGIC ---

      if (page === 1) {
        setImages(res.data);
        setSearchResults(`You searched for "${term}" -- ${res.data.length} results.`);
      } else {
        setImages((prevImages) => [...prevImages, ...res.data]);
        setSearchResults(null);
      }

      if (page === 1) {
        const historyRes = await axios.get('/api/history');
        setHistory(historyRes.data);
      }
    } catch (err) {
      console.error('Error searching images:', err);
      setSearchResults(`Error searching for "${term}".`);
    }
  };

  // Fetch initial data on load
  useEffect(() => {
    // ... (This is unchanged) ...
    const fetchData = async () => {
      try {
        const userRes = await axios.get('/api/current_user');
        setUser(userRes.data);
        if (userRes.data) {
          const historyRes = await axios.get('/api/history');
          setHistory(historyRes.data);
        }
      } catch (err) {
        console.log('Error fetching user/history');
      }
      try {
        const topSearchRes = await axios.get('/api/top-searches');
        setTopSearches(topSearchRes.data);
      } catch (err) {
        console.error('Error fetching top searches:', err);
      }
    };
    fetchData();
  }, []);
  
  // --- All other functions (handleSearch, handleLoadMore, etc.) are UNCHANGED ---
  
  const handleSearch = (term) => {
    setCurrentTerm(term);
    setCurrentPage(1);
    fetchImages(term, 1);
  };

  const handleLoadMore = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    fetchImages(currentTerm, newPage);
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your entire search history?')) {
      try {
        await axios.delete('/api/history');
        setHistory([]);
      } catch (err) {
        console.error('Error clearing history:', err);
      }
    }
  };

  const handleDeleteHistoryItem = async (id) => {
    try {
      await axios.delete(`/api/history/${id}`);
      setHistory((prevHistory) =>
        prevHistory.filter((item) => item._id !== id)
      );
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  // --- The entire return (...) JSX is UNCHANGED ---
  return (
    <div className="App">
      <header className="app-header">
        <h1>Image Search Website</h1>
        <div className="nav-links">
          <Link to="/collections" className="nav-link">My Collections</Link>
          <a href="http://localhost:5000/api/logout" className="nav-link-logout">Logout</a>
        </div>
      </header>

      <TopSearchBanner searches={topSearches} />

      <main className="main-content">
        <div className="search-area">
          <>
            <h2>Welcome, {user.displayName}!</h2>
            <SearchBar
              onSearch={handleSearch}
              history={history}
              topSearches={topSearches}
            />
            {searchResults && <p>{searchResults}</p>}
            
            <ImageList images={images} />

            {images.length > 0 && (
              <div className="load-more-container">
                <button onClick={handleLoadMore} className="load-more-btn">
                  Load More
                </button>
              </div>
            )}
          </>
        </div>

        {user && (
          <div className="history-area">
            <SearchHistory
              history={history}
              onClearHistory={handleClearHistory}
              onDeleteItem={handleDeleteHistoryItem}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default SearchDashboard;