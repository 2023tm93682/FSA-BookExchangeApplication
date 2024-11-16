import React, { useState } from 'react';
import api from './Api'; // Make sure this points to your API file

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password and confirm password
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      // Send registration data to the backend
      const response = await api.post('register/', {
        username,
        email,
        password,
      });

      // Check if the response is successful (e.g., status 201 or success message)
      if (response.status === 201) {
        setMessage('Registration successful!'); // Show success message
      } else {
        setMessage('Registration failed. Please try again.');
      }

      // Clear form fields after successful registration
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage(error.response?.data?.detail || 'An error occurred during registration');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f7fc',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '40px',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Register</h2>

        {/* Display Message */}
        {message && (
          <p
            style={{
              color: message.includes('successful') ? 'green' : 'red',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            {message}
          </p>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                boxSizing: 'border-box',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                boxSizing: 'border-box',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                boxSizing: 'border-box',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                boxSizing: 'border-box',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
