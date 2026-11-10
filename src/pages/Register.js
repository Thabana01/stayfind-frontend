import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUserGraduate, FaHome, FaUser, FaEnvelope, FaPhone, FaLock, FaArrowLeft, FaEye, FaEyeSlash, FaIdCard } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({ 
    name: '', email: '', phone: '', password: '', confirmPassword: '', agree: false, student_number: '', property_details: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    axios.post('https://stayfind-backend-etba.onrender.com/api/auth/register', {
      full_name: formData.name,
      email: formData.email,
      password: formData.password,
      role: role,
      student_number: formData.student_number,
      property_details: formData.property_details
    })
    .then(res => {
      alert('✅ Account created! Please wait for an Admin to verify your account before logging in.');
      navigate('/login');
    })
    .catch(err => {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
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
        backgroundImage: 'url("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop")', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.7)' }}></div>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '40px', color: 'white' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: '800' }}>Join StayFind.</h1>
          <p style={{ fontSize: '1.2rem', color: '#e2e8f0', maxWidth: '400px' }}>
            Create an account to start searching for your perfect home or list your property today.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div style={{ 
        flex: '1', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'white', 
        padding: '40px',
        position: 'relative',
        overflowY: 'auto'
      }}>
        
        <Link to="/" style={{ 
          position: 'absolute', top: '30px', left: '30px', 
          display: 'flex', alignItems: 'center', gap: '8px', 
          color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '600' 
        }}>
          <FaArrowLeft /> Back to Home
        </Link>

        <div style={{ width: '100%', maxWidth: '450px', marginTop: '20px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '10px' }}>Create an Account</h2>
          </div>

          {error && (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
            <button type="button" onClick={() => setRole('student')} style={{ flex: 1, padding: '15px', borderRadius: '8px', cursor: 'pointer', border: `2px solid ${role === 'student' ? 'var(--primary)' : 'var(--border)'}`, background: role === 'student' ? '#f0f9ff' : 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <FaUserGraduate size={24} color={role === 'student' ? 'var(--primary)' : '#94a3b8'} />
              <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: role === 'student' ? 'var(--primary)' : '#64748b' }}>Student</span>
            </button>
            <button type="button" onClick={() => setRole('landlord')} style={{ flex: 1, padding: '15px', borderRadius: '8px', cursor: 'pointer', border: `2px solid ${role === 'landlord' ? 'var(--primary)' : 'var(--border)'}`, background: role === 'landlord' ? '#f0f9ff' : 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <FaHome size={24} color={role === 'landlord' ? 'var(--primary)' : '#94a3b8'} />
              <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: role === 'landlord' ? 'var(--primary)' : '#64748b' }}>Landlord</span>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{role === 'student' ? 'Full Name' : 'Business Name'}</label>
              <div style={{ position: 'relative' }}>
                <FaUser style={{ position: 'absolute', left: '15px', top: '16px', color: '#94a3b8' }} />
                <input type="text" name="name" required placeholder="Thabo Nkosi" onChange={handleChange} style={{ paddingLeft: '45px' }} />
              </div>
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{ position: 'absolute', left: '15px', top: '16px', color: '#94a3b8' }} />
                <input type="email" name="email" required placeholder="thabo@example.com" onChange={handleChange} style={{ paddingLeft: '45px' }} />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <FaPhone style={{ position: 'absolute', left: '15px', top: '16px', color: '#94a3b8' }} />
                <input type="tel" name="phone" required placeholder="+266 5000 0000" onChange={handleChange} style={{ paddingLeft: '45px' }} />
              </div>
            </div>

            {role === 'student' && (
              <div className="form-group">
                <label>Student Number</label>
                <div style={{ position: 'relative' }}>
                  <FaIdCard style={{ position: 'absolute', left: '15px', top: '16px', color: '#94a3b8' }} />
                  <input type="text" name="student_number" required placeholder="e.g. 90100234" onChange={handleChange} style={{ paddingLeft: '45px' }} />
                </div>
              </div>
            )}

            {role === 'landlord' && (
              <div className="form-group">
                <label>Property Details</label>
                <textarea name="property_details" required placeholder="e.g. I have 2 student rooms in Roma." onChange={handleChange} rows="3" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}></textarea>
              </div>
            )}

            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <FaLock style={{ position: 'absolute', left: '15px', top: '16px', color: '#94a3b8' }} />
                <input type={showPassword ? "text" : "password"} name="password" required onChange={handleChange} style={{ paddingLeft: '45px', paddingRight: '45px' }} />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  style={{ position: 'absolute', right: '15px', top: '14px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <FaLock style={{ position: 'absolute', left: '15px', top: '16px', color: '#94a3b8' }} />
                <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" required onChange={handleChange} style={{ paddingLeft: '45px', paddingRight: '45px' }} />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  style={{ position: 'absolute', right: '15px', top: '14px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <input type="checkbox" name="agree" required style={{ width: 'auto', marginTop: '5px' }} onChange={handleChange} />
              <label style={{ fontWeight: 'normal', fontSize: '0.85rem', color: '#64748b' }}>
                I agree to the <Link to="/gdpr" style={{ color: 'var(--primary)' }}>Privacy Notice</Link> and Terms of Service.
              </label>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '14px', marginTop: '10px' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#64748b' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;