import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaBed, FaBan } from 'react-icons/fa';

const PropertyCard = ({ property }) => {
  // ✏️ EDITED: Compute whether the card can be booked
  const isSuspended = property.landlord_status === 'Suspended';
  const isBlocked   = property.status === 'Blocked';
  const isOccupied  = property.status === 'Occupied';
  const isUnavailable = isSuspended || isBlocked || isOccupied;

  const badgeLabel =
    isSuspended ? 'Landlord Suspended'
    : isBlocked ? 'Blocked'
    : isOccupied ? 'Occupied'
    : null;

  return (
    <div
      className="card"
      style={{
        padding: 0,
        overflow: 'hidden',
        // ✏️ EDITED: dim the card if unavailable
        opacity: isUnavailable ? 0.75 : 1,
        position: 'relative',
      }}
    >
      {/* ✏️ EDITED: Unavailable overlay badge */}
      {badgeLabel && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: '#b42318',
            color: '#fff',
            padding: '4px 10px',
            borderRadius: 999,
            fontSize: '0.75rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            zIndex: 2,
          }}
        >
          <FaBan /> {badgeLabel}
        </div>
      )}

      {/* Image Container with fixed height */}
      <div style={{ height: '200px', width: '100%', backgroundColor: '#e2e8f0' }}>
        <img 
          src={property.image_url} 
          alt={property.title} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            // ✏️ EDITED: greyscale blocked/suspended listings
            filter: isUnavailable ? 'grayscale(60%)' : 'none',
          }} 
        />
      </div>
      
      {/* Card Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', lineHeight: '1.3' }}>{property.title}</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '15px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <FaMapMarkerAlt /> {property.location}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <FaBed /> {property.bedrooms} Beds
          </span>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <p className="price" style={{ marginBottom: '15px' }}>M{property.price} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ month</span></p>
          
          {isUnavailable ? (
            // ✏️ EDITED: disabled button instead of link when unavailable
            <button
              className="btn"
              disabled
              title={
                isSuspended ? 'Landlord account is suspended'
                : isBlocked ? 'Property is blocked'
                : 'Property is occupied'
              }
              style={{
                width: '100%',
                cursor: 'not-allowed',
                opacity: 0.6,
                background: '#e2e8f0',
                color: '#475569',
              }}
            >
              Unavailable
            </button>
          ) : (
            <Link to={`/property/${property.id}`} style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary" style={{ width: '100%' }}>View Details</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;