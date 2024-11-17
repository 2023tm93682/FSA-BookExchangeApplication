import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBell } from 'react-icons/fa';
import api from './Api';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAccessToken = () => localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = getAccessToken();
      if (!token) {
        redirectToLogin();
        return;
      }

      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch user profile
        const profileResponse = await api.get('profile/', { headers });
        const profileData = profileResponse.data;
        setUserData({
          username: profileData.user.username,
          email: profileData.user.email,
          date_joined: profileData.user.date_joined,
        });

        // Fetch notifications
        const notificationsResponse = await api.get('exchange-requests/', { headers });
        setNotifications(notificationsResponse.data);

        // Fetch transactions
        const transactionsResponse = await api.get('transactions/', { headers });
        setTransactions(transactionsResponse.data);

      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('accessToken');
          redirectToLogin();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const redirectToLogin = () => navigate('/login');

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const handleCancelTransaction = async (transactionId) => {
    const token = getAccessToken();
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await api.patch(`transactions/${transactionId}/cancel/`, {}, { headers });
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === transactionId ? { ...tx, status: 'canceled' } : tx
        )
      );
    } catch (error) {
      console.error('Error canceling transaction:', error);
    }
  };

  const handleManageBooks = () => navigate('/manage-books');
  const handleMyBooks = () => navigate('/my-books');
  const handleNotifications = () => navigate('/notifications');

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div style={styles.profileContainer}>
      <header style={styles.profileHeader}>
        <h1 style={{ fontSize: '2rem' }}>Book Exchange Platform</h1>
        <div style={styles.notificationIconContainer}>
          <div style={styles.notificationIconContainer} onClick={handleNotifications}>
            <FaBell style={styles.notificationIcon} />
            {notifications.length > 0 && <span style={styles.notificationBadge}>{notifications.length}</span>}
          </div>
          <div style={styles.userIconContainer}>
            <FaUserCircle onClick={toggleDropdown} style={styles.userIcon} />
            {isDropdownOpen && (
              <div style={styles.dropdown}>
                <button onClick={handleMyBooks} style={styles.dropdownButton}>My Books</button>
                <button onClick={handleManageBooks} style={styles.dropdownButton}>Manage Books</button>
                <button onClick={handleLogout} style={styles.dropdownButton}>Logout</button>
              </div>
            )}
          </div>
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

      <section style={styles.transactionsSection}>
        <h2 style={styles.profileHeading}>Transaction History</h2>
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <ul style={styles.transactionList}>
            {transactions.map((transaction) => (
              <li key={transaction.id} style={styles.transactionItem}>
                <p><strong>Book:</strong> {transaction.book.title}</p>
                <p><strong>Status:</strong> {transaction.status}</p>
                <p><strong>Date:</strong> {new Date(transaction.created_at).toLocaleDateString()}</p>
                {transaction.status === 'pending' && (
                  <button
                    onClick={() => handleCancelTransaction(transaction.id)}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

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
  notificationIconContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  notificationIcon: {
    fontSize: '1.5rem',
    color: 'white',
  },
  notificationBadge: {
    position: 'absolute',
    top: '-5px',
    right: '-10px',
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '50%',
    padding: '5px 7px',
    fontSize: '12px',
    fontWeight: 'bold',
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
  transactionsSection: {
    marginTop: '20px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    color: '#333',
  },
  transactionList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  transactionItem: {
    marginBottom: '15px',
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    padding: '8px 12px',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  cancelButtonHover: {
    backgroundColor: '#cc0000',
  },
  loader: {
    fontSize: '20px',
    color: '#333',
    textAlign: 'center',
    padding: '20px',
  },
};

export default Profile;
