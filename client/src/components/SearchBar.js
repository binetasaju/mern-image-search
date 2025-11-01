import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, history, topSearches }) => {
  const [term, setTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // This effect runs every time the user types
  useEffect(() => {
    if (term.length < 2) {
      setSuggestions([]); // Don't show suggestions for 1 letter
      return;
    }

    // 1. Get unique terms from history
    const historyTerms = [...new Set(history.map((item) => item.term))];
    
    // 2. Combine with top searches, ensuring no duplicates
    const allTerms = [...new Set([...historyTerms, ...topSearches])];

    // 3. Filter the terms
    const filteredSuggestions = allTerms
      .filter((t) => t.toLowerCase().includes(term.toLowerCase()))
      .slice(0, 5); // Show a max of 5 suggestions

    setSuggestions(filteredSuggestions);
  }, [term, history, topSearches]);

  // This function runs the search and clears the state
  const runSearch = (searchTerm) => {
    if (searchTerm) {
      onSearch(searchTerm);
      setTerm('');
      setSuggestions([]);
    }
  };

  // Handles submitting the form
  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch(term);
  };

  // Handles clicking a suggestion
  const handleSuggestionClick = (suggestion) => {
    runSearch(suggestion);
  };

  // Handles typing in the input
  const handleChange = (e) => {
    setTerm(e.target.value);
  };

  return (
    // We wrap this in a container for positioning
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-bar-form">
        <input
          type="text"
          value={term}
          onChange={handleChange}
          placeholder="Search for images..."
          autoComplete="off" // Turn off browser default autocomplete
        />
        <button type="submit">Search</button>
      </form>

      {/* --- This is the new suggestions dropdown --- */}
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((s, index) => (
            <li key={index} onClick={() => handleSuggestionClick(s)}>
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;