import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import api from './Api';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAccessToken = () => localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = getAccessToken();
      if (!token) {
        console.error('No access token found');
        redirectToLogin();
        return;
      }
  
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };
        
        const profileResponse = await api.get('profile/', { headers });
        const profileData = profileResponse.data;
  
        setUserData({
          username: profileData.user.username,
          email: profileData.user.email,
          date_joined: profileData.user.date_joined,
        });
  
      } catch (error) {
        console.error('Error fetching profile data:', error);
  
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized access - clearing token and redirecting to login.");
          localStorage.removeItem('accessToken');
          redirectToLogin();
        }
  
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserProfile();
  }, []);

  const redirectToLogin = () => {
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const handleManageBooks = () => {
    navigate('/manage-books');
  };

  const handleMyBooks = () => {
    navigate('/my-books');
  };

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <div style={styles.profileContainer}>
      
    <header style={styles.profileHeader}>
    <h1 style={{ fontSize: '2rem', marginBottom: '1px' }}>
        Book Exchange Platform
        </h1>
        <div style={styles.userIconContainer}>
          <FaUserCircle
            onClick={toggleDropdown}
            style={styles.userIcon}
          />
          {isDropdownOpen && (
            <div style={styles.dropdown}>
              <button onClick={handleMyBooks} style={styles.dropdownButton}>My Books</button>
              <button onClick={handleManageBooks} style={styles.dropdownButton}>Manage Books</button>
              <button onClick={handleLogout} style={styles.dropdownButton}>Logout</button>
            </div>
          )}
        </div>
      </header>

      {userData && (
        <section style={styles.profileInfo}>
          <h2 style={styles.profileHeading}>Profile Information</h2>
          <p><strong>Name:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Joined:</strong> {new Date(userData.date_joined).toLocaleDateString()}</p>
        </section>
      )}
    </div>
  );
};

// CSS-in-JS styles
const styles = {
  profileContainer: {
    padding: '20px',
    backgroundColor: '#f7f7f7',
    minHeight: '100vh',
  },
  profileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#5f6393',
    color: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  headerTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
  },
  userText: {
    fontSize: '1rem',
    marginLeft: '310px',  // Pushes the element to the right
    marginRight: '0',    // Optional: Reset any default right margin if present
  },
  userIconContainer: {
    position: 'relative',
    cursor: 'pointer',
  },
  userIcon: {
    fontSize: '2rem',
  },
  dropdown: {
    position: 'absolute',
    top: '35px',
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '200px',
    zIndex: 1000,
  },
  dropdownButton: {
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    backgroundColor: 'transparent',
    textAlign: 'left',
    width: '100%',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  dropdownButtonHover: {
    backgroundColor: '#f0f0f0',
  },
  profileInfo: {
    marginTop: '20px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    color: '#333',
  },
  profileHeading: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '15px',
  },
  loader: {
    fontSize: '20px',
    color: '#333',
    textAlign: 'center',
    padding: '20px',
  },
};

export default Profile;
