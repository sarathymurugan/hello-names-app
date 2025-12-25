import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [name, setName] = useState('');
  const [names, setNames] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch names on component mount
  useEffect(() => {
    fetchNames();
  }, []);

  const fetchNames = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/names`);
      const data = await response.json();
      if (data.success) {
        setNames(data.names);
      } else {
        setError('Failed to fetch names');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/names`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await response.json();
      
      if (data.success) {
        setName(''); // Clear input
        await fetchNames(); // Refresh the list
      } else {
        setError(data.message || 'Failed to add name');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <div className="content">
        <h1>🧪 Hello Names</h1>
        <p className="subtitle">AI-Revo Labs Assignment</p>
        
        <form onSubmit={handleSubmit} className="name-form">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name"
            className="name-input"
            disabled={submitting}
          />
          <button 
            type="submit" 
            className="submit-button"
            disabled={submitting || !name.trim()}
          >
            {submitting ? 'Adding...' : 'Submit'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        <div className="names-section">
          <h2>Submitted Names</h2>
          {loading ? (
            <p className="loading">Loading names...</p>
          ) : names.length === 0 ? (
            <p className="empty-state">No names yet. Be the first to add one!</p>
          ) : (
            <ul className="names-list">
              {names.map((n, index) => (
                <li key={index} className="name-item">
                  {n}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;