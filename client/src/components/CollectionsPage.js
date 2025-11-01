import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../CollectionsPage.css'; // We will create this CSS file

const CollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch collections when the page loads
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await axios.get('/api/collections');
        setCollections(res.data);
      } catch (err) {
        console.error('Error fetching collections:', err);
      }
      setLoading(false);
    };
    fetchCollections();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        await axios.delete(`/api/collections/${id}`);
        // Remove the deleted collection from state
        setCollections(collections.filter((col) => col._id !== id));
      } catch (err) {
        console.error('Error deleting collection:', err);
      }
    }
  };

  if (loading) {
    return <div>Loading collections...</div>;
  }

  return (
    <div className="collections-page">
      <header className="app-header">
        <h1>My Collections</h1>
        <div className="nav-links">
          <Link to="/" className="nav-link">Back to Search</Link>
          <a href="http://localhost:5000/api/logout" className="nav-link-logout">Logout</a>
        </div>
      </header>

      <main>
        {collections.length === 0 ? (
          <p className="no-collections">You don't have any collections yet.</p>
        ) : (
          <div className="collections-grid">
            {collections.map((collection) => (
              <div key={collection._id} className="collection-card">
                <div className="collection-header">
                  <h3>{collection.name}</h3>
                  <button onClick={() => handleDelete(collection._id)} className="delete-collection-btn">
                    Delete
                  </button>
                </div>
                <div className="collection-images">
                  {collection.images.map((image) => (
                    <img key={image.id} src={image.url_small} alt={image.alt_description} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CollectionsPage;