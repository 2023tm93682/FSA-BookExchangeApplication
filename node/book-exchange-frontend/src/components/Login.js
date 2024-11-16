import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import api from './Api'; // Make sure this points to your API file

const Login = () => {
  const [identifier, setIdentifier] = useState(''); // State for email or username
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to control password visibility
  const [error, setError] = useState(''); // State to hold error messages
  const [loading, setLoading] = useState(false); // State to manage loading
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await api.post('login/', {
        username: identifier,
        password,
      });

      if (response.status === 200) {
        const accessToken = response.data.access;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('userName', identifier);

        navigate('/my-books'); // Redirect to the home page after logging in
      }
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      setError('Invalid username/email or password');
    } finally {
      setLoading(false); // End loading
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <h2 style={{ textAlign: 'center' }}>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        
        {/* Username/Email input */}
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
          <span role="img" aria-label="user" style={{ marginRight: '10px' }}>👤</span>
          <input
            type="text"
            placeholder="Username or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            style={{ border: 'none', outline: 'none', width: '100%' }}
          />
        </div>

        {/* Password input */}
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
          <span role="img" aria-label="lock" style={{ marginRight: '10px' }}>🔑</span>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ border: 'none', outline: 'none', width: '100%' }}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {/* Remember me checkbox */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" id="remember" style={{ marginRight: '8px' }} />
          <label htmlFor="remember">Remember me</label>
        </div>

        {/* Login button */}
        <button type="submit" disabled={loading} style={{
          backgroundColor: '#007BFF', color: '#fff', padding: '10px', border: 'none',
          borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
        }}>
          {loading ? 'Logging in...' : 'LOGIN'}
        </button>
        
        {/* Links for registration and forgot password */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <a href="/register" style={{ color: '#007BFF', textDecoration: 'none' }}>Register now</a>
          <a href="/send-password-reset-code" style={{ color: '#007BFF', textDecoration: 'none' }}>Forgot password?</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
