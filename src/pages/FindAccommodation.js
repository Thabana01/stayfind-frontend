import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // Import this hook
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';

const FindAccommodation = () => {
  const [searchParams] = useSearchParams(); // Read URL parameters
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize location state with the URL parameter if it exists
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [maxPrice, setMaxPrice] = useState('');
  const [type, setType] = useState('');

  // Fetch real data from PostgreSQL
  useEffect(() => {
    axios.get('https://stayfind-backend-etba.onrender.com/api/properties')
      .then(response => {
        setProperties(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching properties:", error);
        setLoading(false);
      });
  }, []);

  // Filter logic
  const filteredProperties = properties.filter(prop => {
    // Check if the property location matches the search (case-insensitive)
    const matchLocation = location === '' || prop.location.toLowerCase().includes(location.toLowerCase());
    const matchPrice = maxPrice === '' || prop.price <= parseInt(maxPrice);
    const matchType = type === '' || prop.type === type;
    return matchLocation && matchPrice && matchType;
  });

  return (
    <div>
      <h2>Find Accommodation</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
        Showing {filteredProperties.length} available properties {location ? `in ${location}` : ''} from the live database.
      </p>

      {/* Filter Bar */}
            {/* Filter Bar */}
      <div className="card" style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        gap: '15px', 
        marginBottom: '30px', 
        alignItems: 'flex-end', // Aligns inputs and labels
        padding: '20px'
      }}>
        
        {/* Location Input */}
        <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', color: 'var(--text-muted)' }}>Location</label>
          <input 
            type="text" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            placeholder="e.g. Maseru or Roma" 
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
          />
        </div>
        
        {/* Type Select */}
        <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', color: 'var(--text-muted)' }}>Type</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
          >
            <option value="">Any Type</option>
            <option value="Room">Room</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
          </select>
        </div>
        
        {/* Max Price Input */}
        <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '5px', color: 'var(--text-muted)' }}>Max Price (M)</label>
          <input 
            type="number" 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value)} 
            placeholder="e.g. 3000" 
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
          />
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <h3 style={{ textAlign: 'center', marginTop: '40px' }}>Loading properties...</h3>
      ) : (
        <div className="grid">
          {filteredProperties.length > 0 ? (
            filteredProperties.map(prop => (
              <PropertyCard key={prop.id} property={prop} />
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '40px' }}>
              <h3>No properties found matching your criteria.</h3>
              <p style={{ color: 'var(--text-muted)' }}>Try searching for a different location or increasing your budget.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FindAccommodation;