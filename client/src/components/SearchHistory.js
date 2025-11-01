// In client/src/components/SearchHistory.js

import React from 'react';

// Accept the new onDeleteItem prop
const SearchHistory = ({ history, onClearHistory, onDeleteItem }) => {
  return (
    <>
      <div className="history-header">
        <h3>Your Search History</h3>
        {history.length > 0 && (
          <button onClick={onClearHistory} className="clear-history-btn">
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p>No searches yet.</p>
      ) : (
        <ul className="history-list">
          {history.map((item) => (
            <li key={item._id}>
              {/* --- UPDATE THIS SECTION --- */}
              <span className="history-term">{item.term}</span>
              <div className="history-actions">
                <span className="history-date">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
                <button
                  onClick={() => onDeleteItem(item._id)}
                  className="delete-item-btn"
                >
                  &times;
                </button>
              </div>
              {/* --- END OF UPDATE --- */}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default SearchHistory;