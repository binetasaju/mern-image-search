import React, { useState } from 'react';
import axios from 'axios'; // <-- ADD THIS IMPORT
import ImageCard from './ImageCard';

const ImageList = ({ images }) => {
  const [selectedImages, setSelectedImages] = useState([]);

  const handleSelect = (image) => {
    setSelectedImages((prevSelected) => {
      if (prevSelected.find((item) => item.id === image.id)) {
        return prevSelected.filter((item) => item.id !== image.id);
      } else {
        return [...prevSelected, image];
      }
    });
  };

  // --- ADD THIS NEW FUNCTION ---
  const handleSaveSelection = async () => {
    if (selectedImages.length === 0) {
      alert('Please select at least one image to save.');
      return;
    }

    const collectionName = prompt('Enter a name for your collection:');
    
    if (collectionName) {
      try {
        await axios.post('/api/collections', {
          name: collectionName,
          images: selectedImages,
        });
        alert('Collection saved!');
        setSelectedImages([]); // Clear selection after saving
      } catch (err) {
        console.error('Error saving collection:', err);
        alert('Error saving collection. Please try again.');
      }
    }
  };

  return (
    <div>
      {/* --- MODIFY THIS SECTION --- */}
      <div className="selection-header">
        <h3>Selected: {selectedImages.length} images</h3>
        {selectedImages.length > 0 && (
          <button onClick={handleSaveSelection} className="save-selection-btn">
            Save Selection
          </button>
        )}
      </div>
      {/* --- END OF MODIFICATION --- */}

      {images.length === 0 ? (
        <p>No images found. Try a new search!</p>
      ) : (
        <div className="image-grid">
          {images.map((image) => {
            const isSelected = !!selectedImages.find((item) => item.id === image.id);
            return (
              <ImageCard
                key={image.id}
                image={image}
                onSelect={handleSelect}
                isSelected={isSelected}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageList;