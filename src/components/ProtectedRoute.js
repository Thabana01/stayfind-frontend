import React, { useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  // 1. Check if user is logged in
  if (!user) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // 2. Check if user's role is allowed to access this route
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If logged in but unauthorized, show Access Denied screen
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1 style={{ color: 'var(--danger)', fontSize: '3rem' }}>403</h1>
        <h2>Access Denied</h2>
        <p style={{ margin: '20px 0', color: '#666' }}>
          You do not have the required permissions to view this page.
        </p>
        <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
          Logged in as: <strong>{user.name}</strong> ({user.role})
        </p>
        <Link to="/">
          <button className="btn btn-primary">Return to Home</button>
        </Link>
      </div>
    );
  }

  // 3. If all checks pass, render the child component
  return children;
};

export default ProtectedRoute;