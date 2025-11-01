import React from 'react';

const ImageCard = ({ image, onSelect, isSelected }) => {
  const cardClassName = `image-card ${isSelected ? 'selected' : ''}`;

  const handleDownload = (e) => {
    e.stopPropagation();
  };

  // --- THIS IS THE FIX ---
  // We MUST use the full, absolute URL to hit the server directly
  const downloadUrl = `http://localhost:5000/api/download?url=${encodeURIComponent(
    image.links.download_location
  )}`;

  return (
    <div className={cardClassName} onClick={() => onSelect(image)}>
      <img
        src={image.urls.small}
        alt={image.alt_description}
        style={{ width: '100%', display: 'block' }}
      />
      <div
        className="image-overlay"
        style={{
          background: isSelected
            ? 'rgba(0, 80, 200, 0.4)' // Blue tint when selected
            : 'rgba(0, 0, 0, 0.4)', // Dark tint on hover
        }}
      >
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          readOnly
          style={{ margin: '10px', transform: 'scale(1.5)' }}
        />

        {/* --- THIS LINK IS NOW FIXED --- */}
        <a
          href={downloadUrl}
          className="download-btn"
          onClick={handleDownload}
          download
        >
          {/* A simple download icon */}
          &#x2B07;
        </a>
      </div>
    </div>
  );
};

export default ImageCard;