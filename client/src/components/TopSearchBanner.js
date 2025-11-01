import React from 'react';

// Simple component to display the top 5 searches
const TopSearchBanner = ({ searches }) => {
  if (searches.length === 0) {
    return null; // Don't show anything if no top searches
  }

  return (
    <div
      style={{
        backgroundColor: '#eee',
        padding: '10px 20px',
        borderRadius: '5px',
      }}
    >
      <strong>Top Searches:</strong> {searches.join(', ')}
    </div>
  );
};

export default TopSearchBanner;