import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import tinycolor from 'tinycolor2';
import { ThemeContext } from '../context/ThemeContext';
import { getContrastYIQ } from '../utils/colorHelper';
import TopSearchBanner from './TopSearchBanner';
import SearchHistory from './SearchHistory';
import SearchBar from './SearchBar';
import ImageList from './ImageList';

// ✅ FIXED: Corrected saturation logic
const findMostVibrantColor = (images) => {
  const fallback = tinycolor('#007bff'); // fallback color

  if (!images || images.length === 0) return fallback;

  let mostVibrantColor = tinycolor(images[0].color || fallback);
  let maxSaturation = mostVibrantColor.toHsl().s; // 0 to 1

  images.forEach((image) => {
    if (!image?.color) return;
    const color = tinycolor(image.color);
    const saturation = color.toHsl().s; // 0 to 1

    if (saturation > maxSaturation) {
      maxSaturation = saturation;
      mostVibrantColor = color;
    }
  });

  // If color isn't vibrant enough, boost saturation
  if (maxSaturation < 0.2) {
    return mostVibrantColor.saturate(30);
  }

  return mostVibrantColor;
};

function SearchDashboard() {
  const [user, setUser] = useState(null);
  const [topSearches, setTopSearches] = useState([]);
  const [history, setHistory] = useState([]);
  const [images, setImages] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTerm, setCurrentTerm] = useState('');
  const { theme, setTheme } = useContext(ThemeContext);

  const fetchImages = async (term, page) => {
    try {
      const res = await axios.post('/api/search', { term, page });

      // --- THEME LOGIC START ---
      if (page === 1 && res.data.length > 0) {
        const baseColor = findMostVibrantColor(res.data);
        const palette = baseColor.analogous();
        const primaryColor = baseColor.saturate(10);
        const secondaryColor = palette[1].saturate(10);
        const infoColor = palette[2].saturate(10);
        const dangerColor = primaryColor.clone().desaturate(20);

        // ✅ FIXED: use functional update to prevent stale closure
        setTheme((prevTheme) => ({
          ...prevTheme,
          '--background-color': baseColor.clone().lighten(45).desaturate(50).toString(),
          '--widget-background': baseColor.clone().lighten(50).desaturate(30).toString(),
          '--border-color': baseColor.clone().lighten(30).desaturate(50).toString(),
          '--text-color': baseColor.clone().darken(40).desaturate(50).toString(),
          '--text-color-light': baseColor.clone().darken(20).desaturate(30).toString(),
          '--primary-color': primaryColor.toString(),
          '--primary-hover': primaryColor.darken(10).toString(),
          '--primary-text-color': getContrastYIQ(primaryColor.toHexString()),
          '--secondary-color': secondaryColor.toString(),
          '--secondary-hover': secondaryColor.darken(10).toString(),
          '--secondary-text-color': getContrastYIQ(secondaryColor.toHexString()),
          '--info-color': infoColor.toString(),
          '--info-hover': infoColor.darken(10).toString(),
          '--info-text-color': getContrastYIQ(infoColor.toHexString()),
          '--danger-color': dangerColor.toString(),
          '--danger-hover': dangerColor.darken(10).toString(),
          '--danger-text-color': getContrastYIQ(dangerColor.toHexString()),
        }));
      }
      // --- THEME LOGIC END ---

      if (page === 1) {
        setImages(res.data);
        setSearchResults(`You searched for "${term}" — ${res.data.length} results.`);
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

  useEffect(() => {
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