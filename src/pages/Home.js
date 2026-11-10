import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaHome, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Handle Search Submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Pass the location as a URL parameter (e.g., /search?location=Mafeteng)
      navigate(`/search?location=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search'); // If empty, go to general search
    }
  };

  return (
    <div className="full-width-home">
      {/* 1. HERO SECTION (Full Screen) */}
      <section style={{ 
        position: 'relative', 
        backgroundImage: 'url("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop")', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        minHeight: 'calc(100vh - 75px)', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, rgba(15,23,42,0.85), rgba(15,23,42,0.6))' 
        }}></div>

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 20px', maxWidth: '900px' }}>
          <h1 style={{ fontSize: '3.5rem', color: 'white', marginBottom: '20px', lineHeight: '1.2', fontWeight: '800' }}>
            Find Your Perfect Student Home in <span style={{ color: 'var(--primary)' }}>Lesotho</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#e2e8f0', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
            The safest, smartest way to find verified accommodation in Maseru, Roma, and beyond. No scams, no stress.
          </p>

          {/* FUNCTIONAL SEARCH BAR */}
          <form onSubmit={handleSearch} style={{ 
            background: 'white', padding: '8px 8px 8px 20px', borderRadius: '50px', 
            display: 'flex', alignItems: 'center', maxWidth: '700px', margin: '0 auto',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, color: '#666' }}>
              <FaMapMarkerAlt style={{ marginRight: '10px', color: 'var(--primary)' }} />
              <input 
                type="text" 
                placeholder="Where do you want to stay? (e.g. Roma, Mafeteng)" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem' }} 
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '40px', padding: '15px 35px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
              <FaSearch /> Search
            </button>
          </form>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)' }}>How StayFind Works</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Finding your next home takes just three simple steps.</p>
        </div>

        <div className="grid">
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ width: '80px', height: '80px', background: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <FaSearch style={{ fontSize: '2rem', color: 'var(--primary)' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>1. Search & Filter</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Browse verified listings in Maseru and Roma. Filter by price, location, and amenities.</p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ width: '80px', height: '80px', background: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <FaCheckCircle style={{ fontSize: '2rem', color: 'var(--primary)' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>2. Request a Booking</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Found a place? Send a secure booking request directly to the verified landlord.</p>
          </div>

          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ width: '80px', height: '80px', background: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <FaHome style={{ fontSize: '2rem', color: 'var(--primary)' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>3. Move In</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Once confirmed, make your secure payment and get ready to move into your new home.</p>
          </div>
        </div>
      </section>

      {/* 3. LANDLORD CTA */}
      <section style={{ background: 'white', padding: '80px 20px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '50px' }}>
          <div style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '20px', lineHeight: '1.2' }}>
              Are you a landlord? <br/>List your property today.
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '30px' }}>
              Join Lesotho's most trusted accommodation platform. Reach thousands of students, manage bookings effortlessly, and secure your rental income.
            </p>
            <Link to="/register">
              <button className="btn btn-primary" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>Create a Landlord Account</button>
            </Link>
          </div>
          
          <div style={{ flex: '1 1 400px' }}>
            <img 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop" 
              alt="Landlord" 
              style={{ width: '100%', borderRadius: '15px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} 
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;