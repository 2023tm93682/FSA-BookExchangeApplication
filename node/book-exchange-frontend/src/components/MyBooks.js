import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { FaUserCircle } from 'react-icons/fa'; // Import user icon from react-icons
import api from './Api'; // Ensure this points to your API service

const ITEMS_PER_PAGE = 10;

const MyBooks = () => {
  const [userData, setUserData] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [originalBooks, setOriginalBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  // Helper function to get access token
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
        
        // Fetch user profile
        const profileResponse = await api.get('profile/', { headers });
        const profileData = profileResponse.data;
  
        setUserData({
          username: profileData.user.username,
          email: profileData.user.email,
          date_joined: profileData.user.date_joined,
        });
  
        const books = profileData.books;
        setUserBooks(books); // Set the books for initial rendering
        setOriginalBooks(books); // Save original books for search filtering
  
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
  
  // Redirect to login function (could navigate to login page or show a login prompt)
  const redirectToLogin = () => {
    navigate('/login');
    console.log("Redirecting to login...");
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

  const handleProfile = () => {
    navigate('/profile');
  };

  // Pagination logic
const totalPages = Math.ceil(userBooks.length / ITEMS_PER_PAGE);
const paginatedBooks = userBooks.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);

// Handle pagination with filtered books
const handleNextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};

const handlePreviousPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

const handleSearch = () => {
  if (searchQuery.trim() === '') {
    setUserBooks(originalBooks); // If the search is empty, show all books
  } else {
    const filteredBooks = originalBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setUserBooks(filteredBooks);
  }
  setCurrentPage(1); // Reset to the first page after search
};

const handleSearchQueryChange = (e) => {
  setSearchQuery(e.target.value);
};

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={styles.profileContainer}>
      
    <header style={styles.profileHeader}>
    <h1 style={{ fontSize: '2rem', marginBottom: '1px' }}>
        Book Exchange Platform
        </h1>
      {/* Search Form */}
      <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search Books"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            style={styles.searchInput}
          />
          <button onClick={handleSearch} style={styles.searchButton}>
            Search
          </button>
        </div>
        <h1 style={styles.userText} >
        Welcome {userData.username},</h1>
        <div style={styles.userIconContainer}>
        <FaUserCircle
          onClick={toggleDropdown}
          style={styles.userIcon}
        />
        {isDropdownOpen && (
          <div style={styles.dropdown}>
              <div style={styles.userInfo}>
                {/* Manage Books Option */}
                <button onClick={handleProfile} style={styles.myProfileButton}>
                  My Profile
                </button>
                {/* Manage Books Option */}
                <button onClick={handleManageBooks} style={styles.manageBooksButton}>
                  Manage Books
                </button>
                <button onClick={handleLogout} style={styles.logoutButton}>
                  Logout
                </button>
              </div>
          </div>
        )}
      </div>
    </header>

<section style={styles.section}>
  <h3>Your Book Listings</h3>
  {paginatedBooks.length > 0 ? (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.tableHeader}>Title</th>
          <th style={styles.tableHeader}>Author</th>
          <th style={styles.tableHeader}>Genre</th>
          <th style={styles.tableHeader}>Condition</th>
          <th style={styles.tableHeader}>Availability</th>
        </tr>
      </thead>
      <tbody>
        {paginatedBooks.map((book) => (
          <tr key={book.id}>
            <td style={styles.tableCell}>{book.title}</td>
            <td style={styles.tableCell}>{book.author}</td>
            <td style={styles.tableCell}>{book.genre}</td>
            <td style={styles.tableCell}>{book.condition}</td>
            <td style={styles.tableCell}>
              {book.availability ? "Available" : "Not Available"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p style={styles.noData}>You have no books listed for exchange.</p>
  )}

        {/* Pagination Controls */}
{totalPages > 1 && (
  <div style={styles.pagination}>
    <button
      style={styles.paginationButton}
      onClick={() => setCurrentPage(1)}
      disabled={currentPage === 1}
    >
      « First
    </button>
    <button
      style={styles.paginationButton}
      onClick={handlePreviousPage}
      disabled={currentPage === 1}
    >
      ‹ Prev
    </button>

    {/* Display page numbers with current page highlighted */}
    {[...Array(totalPages)].map((_, index) => {
      const page = index + 1;
      return (
        <button
          key={page}
          style={{
            ...styles.paginationButton,
            ...(page === currentPage ? styles.activePage : {}),
          }}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      );
    })}

    <button
      style={styles.paginationButton}
      onClick={handleNextPage}
      disabled={currentPage === totalPages}
    >
      Next ›
    </button>
    <button
      style={styles.paginationButton}
      onClick={() => setCurrentPage(totalPages)}
      disabled={currentPage === totalPages}
    >
      Last »
    </button>
  </div>
)}
      </section>
    </div>
  );
};

// CSS in JS Styles
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
  userIconContainer: {
    position: 'relative',
    cursor: 'pointer',
  },
  userIcon: {
    fontSize: '2rem',
    cursor: 'pointer',
    marginRight: '15px',    // Optional: Reset any default right margin if present
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '10px 0',
    width: '200px',
  },
  manageBooksButton: {
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    backgroundColor: 'transparent',
    textAlign: 'left',
    width: '100%',
    cursor: 'pointer',
    transition: 'background-color 0.2s, text-decoration 0.2s', // Add transition for underline
  },
  myProfileButton: {
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    backgroundColor: 'transparent',
    textAlign: 'left',
    width: '100%',
    cursor: 'pointer',
    transition: 'background-color 0.10s, text-decoration 0.2s', // Add transition for underline
  },
  logoutButton: {
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    backgroundColor: 'transparent',
    textAlign: 'left',
    width: '100%',
    cursor: 'pointer',
    transition: 'background-color 0.2s, text-decoration 0.2s', // Add transition for underline
  },
  userText: {
    fontSize: '1rem',
    marginLeft: '310px',  // Pushes the element to the right
    marginRight: '0',    // Optional: Reset any default right margin if present
  },
  profileInfo: {
    marginBottom: '20px',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#ffffff',
    width: '100%',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  section: {
    marginBottom: '20px',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#ffffff',
    width: '100%',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  formContainer: {
    marginBottom: '20px',
    padding: '15px',
    borderRadius: '5px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  inputField: {
    display: 'block',
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '10px 0',
  },
  tableHeader: {
    backgroundColor: '#f4f4f4',
    padding: '10px',
    border: '2px solid #ddd',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: '10px',
    border: '1px solid #ddd',
    textAlign: 'left',
  },
  noData: {
    textAlign: 'center',
    color: '#888',
  }, 
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    margin: '16px 0',
  },
    paginationButton: {
      padding: '8px 12px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      backgroundColor: '#f9f9f9',
      color: '#333',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    activePage: {
      backgroundColor: '#5f6393',
      color: '#fff',
      fontWeight: 'bold',
    },
    searchContainer: {
      display: 'flex',
      justifyContent: 'center', // Align to the right
      marginBottom: '5px',
    },
    searchInput: {
      padding: '10px',
      marginLeft: '280px',
      border: '1px solid white',
      borderRadius: '5px',
      width: '200px', // Adjust as per your design
    },
    searchButton: {
      marginLeft: '10px',
      backgroundColor: '#5f6393',
      color: 'white',
      padding: '10px 20px',
      border: '1px solid white',  // Added white border
      borderRadius: '5px',
      cursor: 'pointer',
    }
};

export default MyBooks;
