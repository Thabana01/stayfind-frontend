import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaLock, FaShieldAlt, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{ background: '#0f172a', color: 'white', padding: '50px 20px 20px 20px', marginTop: '60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
        
        <div>
          <h3 style={{ color: 'var(--primary)', marginBottom: '15px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            StayFind
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
            The leading accommodation management system in Lesotho. We connect students with verified landlords in Maseru, Roma, and beyond.
          </p>
          <div style={{ display: 'flex', gap: '15px', fontSize: '1.2rem' }}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ color: '#94a3b8' }}><FaFacebook /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ color: '#94a3b8' }}><FaTwitter /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: '#94a3b8' }}><FaLinkedin /></a>
          </div>
        </div>

        <div>
          <h4 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: '2.5' }}>
            <li><Link to="/search" style={{ color: '#94a3b8', textDecoration: 'none' }}>Find Accommodation</Link></li>
            <li><Link to="/register" style={{ color: '#94a3b8', textDecoration: 'none' }}>List Your Property</Link></li>
            <li><Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>Login</Link></li>
            <li><Link to="/gdpr" style={{ color: '#94a3b8', textDecoration: 'none' }}>Privacy & GDPR</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Contact Us</h4>
          <ul style={{ listStyle: 'none', padding: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: '2.5' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaMapMarkerAlt color="var(--primary)" /> Maseru, Lesotho
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaPhoneAlt color="var(--primary)" /> +266 5000 0000
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaEnvelope color="var(--primary)" /> support@stayfind.co.ls
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Security & Trust</h4>
          <ul style={{ listStyle: 'none', padding: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: '2.5' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaShieldAlt color="var(--primary)" /> Verified Landlords
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaLock color="var(--primary)" /> Secure Payments
            </li>
            <li><Link to="/security-admin" style={{ color: '#94a3b8', textDecoration: 'none' }}>Security Portal</Link></li>
          </ul>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #334155', color: '#64748b', fontSize: '0.8rem' }}>
        © {new Date().getFullYear()} StayFind Accommodation Management System. All rights reserved. | BSc Business Information Technology Project.
      </div>
    </footer>
  );
};

export default Footer;