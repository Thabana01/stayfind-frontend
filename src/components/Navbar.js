import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        StayFind
      </Link>
      <div className="nav-links">
        {/* ONLY SHOW SEARCH TO STUDENTS OR NON-LOGGED IN USERS */}
        {(!user || user.role === 'student') && <Link to="/search">Find Accommodation</Link>}
        
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        
        {user && <Link to="/inbox">Messages</Link>} 
        
        {user && user.role === 'student' && <Link to="/student-dashboard">Dashboard</Link>}
        {user && user.role === 'landlord' && <Link to="/landlord-dashboard">Dashboard</Link>}
        
        {/* ADMIN LINKS: Analytics, Moderation, and AI Info */}
        {user && user.role === 'admin' && (
          <>
            <Link to="/admin">Analytics</Link>
            <Link to="/moderation">Moderation</Link>
            <Link to="/ai-dataset">AI Info</Link>
          </>
        )}
        
        {user && <button onClick={handleLogout} className="btn btn-outline" style={{ marginLeft: '20px', padding: '8px 16px' }}>Logout</button>}
      </div>
    </nav>
  );
};

export default Navbar;