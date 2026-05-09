import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://127.0.0.1:5000';

function ExpertList() {
  const [experts, setExperts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchExperts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API}/experts`, {
        params: { search, category, page, limit: 6 }
      });
      setExperts(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError('Failed to load experts. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExperts();
  }, [search, category, page]);

  return (
    <div>
      <h1 className="page-title">Find an Expert</h1>

      {/* Search and Filter */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          <option value="Technology">Technology</option>
          <option value="Finance">Finance</option>
          <option value="Health">Health</option>
          <option value="Legal">Legal</option>
        </select>
      </div>

      {/* Loading and Error */}
      {loading && <div className="loading">Loading experts...</div>}
      {error && <div className="error">{error}</div>}

      {/* Expert Cards */}
      {!loading && !error && (
        <div className="cards-grid">
          {experts.length === 0 ? (
            <p>No experts found.</p>
          ) : (
            experts.map(expert => (
              <div className="card" key={expert.id} onClick={() => navigate(`/expert/${expert.id}`)}>
                <span className="badge">{expert.category}</span>
                <h3>{expert.name}</h3>
                <p>⭐ <span className="rating">{expert.rating}</span> rating</p>
                <p>💼 {expert.experience} years experience</p>
                <p style={{marginTop: '10px', fontSize: '13px'}}>{expert.bio}</p>
                <button className="btn btn-primary" style={{marginTop: '15px'}}>
                  View Profile
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-primary"
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span style={{padding: '10px'}}>Page {page} of {totalPages}</span>
          <button
            className="btn btn-primary"
            onClick={() => setPage(p => p + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ExpertList;