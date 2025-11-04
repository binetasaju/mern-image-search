import React from 'react';

const ImageCard = ({ image, onSelect, isSelected }) => {
  const cardClassName = `image-card ${isSelected ? 'selected' : ''}`;

  const handleDownload = (e) => {
    e.stopPropagation();
  };

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
            ? 'rgba(0, 80, 200, 0.4)'
            : 'rgba(0, 0, 0, 0.4)',
        }}
      >
        <input
          type="checkbox"
          checked={isSelected}
          readOnly
          style={{ margin: '10px', transform: 'scale(1.5)' }}
        />
        <a
          href={downloadUrl}
          className="download-btn"
          onClick={handleDownload}
          download
        >
          &#x2B07;
        </a>
      </div>
    </div>
  );
};

export default ImageCard;