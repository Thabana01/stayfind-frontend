import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Eye Toggle State

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    axios.post('https://stayfind-backend-etba.onrender.com/api/auth/login', { email, password })
      .then(res => {
        const user = res.data.user;
        login(user); 
        if (user.role === 'student') navigate('/student-dashboard');
        else if (user.role === 'landlord') navigate('/landlord-dashboard');
        else if (user.role === 'admin') navigate('/admin');
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="full-screen-page">
      
      {/* LEFT SIDE: Image */}
      <div className="full-screen-left" style={{ 
        flex: '1', 
        backgroundImage: 'url("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop")', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)' }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '40px', color: 'white' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: '800' }}>Welcome Back.</h1>
          <p style={{ fontSize: '1.2rem', color: '#e2e8f0', maxWidth: '400px' }}>
            Your trusted platform for finding and managing student accommodation in Lesotho.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div style={{ 
        flex: '1', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'white',
        padding: '40px',
        position: 'relative'
      }}>
        
        <Link to="/" style={{ 
          position: 'absolute', top: '30px', left: '30px', 
          display: 'flex', alignItems: 'center', gap: '8px', 
          color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '600' 
        }}>
          <FaArrowLeft /> Back to Home
        </Link>

        <div style={{ width: '100%', maxWidth: '400px', marginTop: '40px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '10px' }}>Login to StayFind</h2>
            <p style={{ color: 'var(--text-muted)' }}>Please enter your details to access your account.</p>
          </div>

          {error && (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{ position: 'absolute', left: '15px', top: '16px', color: '#94a3b8' }} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  placeholder="student@nul.ls" 
                  style={{ paddingLeft: '45px' }} 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <FaLock style={{ position: 'absolute', left: '15px', top: '16px', color: '#94a3b8' }} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  placeholder="••••••••" 
                  style={{ paddingLeft: '45px', paddingRight: '45px' }} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ 
                    position: 'absolute', right: '15px', top: '14px', 
                    background: 'transparent', border: 'none', cursor: 'pointer', 
                    color: '#94a3b8', fontSize: '1.2rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '10px', padding: '14px' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text-muted)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;