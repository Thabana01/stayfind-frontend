import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const PropertyModeration = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProperty, setEditingProperty] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const fetchProperties = () => {
    axios.get('https://stayfind-backend-etba.onrender.com/api/admin/properties')
      .then(res => {
        setProperties(res.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Delete this property? This action cannot be undone.")) {
      axios.delete(`https://stayfind-backend-etba.onrender.com/api/admin/properties/${id}`)
        .then(() => {
          alert("Property removed by Admin.");
          fetchProperties();
        });
    }
  };

  const handleEditClick = (prop) => {
    setEditingProperty(prop.id);
    setEditFormData(prop);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`https://stayfind-backend-etba.onrender.com/api/admin/properties/${editingProperty}`, editFormData)
      .then(() => {
        alert("Property updated.");
        setEditingProperty(null);
        fetchProperties();
      });
  };

  if (loading) return <h2>Loading Moderation Panel...</h2>;

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: 0 }}>Property Moderation</h1>
        <p style={{ color: 'var(--text-muted)' }}>Review, edit, or remove listings that violate platform policies.</p>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Landlord ID</th>
              <th>Location</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map(prop => (
              <tr key={prop.id}>
                <td>#{prop.id}</td>
                <td>{prop.title}</td>
                <td>User #{prop.landlord_id}</td>
                <td>{prop.location}</td>
                <td>M{prop.price}</td>
                <td>
                  <span className={`badge ${prop.status === 'Available' ? 'badge-green' : 'badge-red'}`}>
                    {prop.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEditClick(prop)} className="btn btn-primary" style={{ padding: '5px 10px', marginRight: '5px' }}><FaEdit /></button>
                  <button onClick={() => handleDelete(prop.id)} className="btn btn-danger" style={{ padding: '5px 10px' }}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editingProperty && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '500px', position: 'relative' }}>
            <button onClick={() => setEditingProperty(null)} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'transparent', fontSize: '1.2rem', cursor: 'pointer' }}><FaTimes /></button>
            <h2>Edit Property #{editingProperty}</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-group"><label>Title</label><input type="text" value={editFormData.title} onChange={e => setEditFormData({...editFormData, title: e.target.value})} required /></div>
              <div className="form-group"><label>Location</label><input type="text" value={editFormData.location} onChange={e => setEditFormData({...editFormData, location: e.target.value})} required /></div>
              <div className="form-group"><label>Price (M)</label><input type="number" value={editFormData.price} onChange={e => setEditFormData({...editFormData, price: e.target.value})} required /></div>
              <div className="form-group">
                <label>Status</label>
                <select value={editFormData.status} onChange={e => setEditFormData({...editFormData, status: e.target.value})}>
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyModeration;