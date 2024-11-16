import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header
      style={{
        backgroundColor: '#343a40', // Dark Gray for a professional look
        color: '#f8f9fa',  // Light color for text
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Light shadow for depth
      }}
    >
      {/* Logo and Title */}
      <div>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Book Exchange Platform</h1>
      </div>

      {/* Navigation */}
      <nav>
        <ul
          style={{
            display: 'flex',
            gap: '20px',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          <li>
            <Link
              to="/"
              style={{
                color: '#f8f9fa', // Light color for links
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              style={{
                color: '#f8f9fa',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              style={{
                color: '#f8f9fa',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              style={{
                color: '#f8f9fa',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              Contact Us
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
