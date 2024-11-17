import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { FaUserCircle, FaBell } from 'react-icons/fa'; // Import user icon from react-icons
import api from './Api'; // Ensure this points to your API service

const ITEMS_PER_PAGE = 10;

const ManageBooks = () => {
  const [userData, setUserData] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [originalBooks, setOriginalBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    condition: '',
    availability: '',
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false); // Control modal visibility
  const [editBook, setEditBook] = useState(null);
  const [notifications, setNotifications] = useState(null);
  
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
        
        // Fetch notifications
        const notificationsResponse = await api.get('exchange-requests/', { headers });
        setNotifications(notificationsResponse.data);

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
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Redirect to login function (could navigate to login page or show a login prompt)
  const redirectToLogin = () => {
    console.log("Redirecting to login...");
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login'); // Redirect to login page after logout
  };

  const handleMyBooks = () => {
    navigate('/my-books');
  };

  const handleProfile = () => {
    navigate('/profile');
  };
  
  const handleNotifications = () => navigate('/notifications');
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const handleAddBook = async () => {
    const token = getAccessToken();
    if (!token) {
      console.error('No access token found');
      return;
    }
    
    const headers = { Authorization: `Bearer ${token}` };
    
    try {
      const bookToAdd = {
        ...newBook,
        pdf_file_url: null,  // Set to null or a default if needed
        owner: userData.id,  // Include owner if required
        availability: newBook.availability === 'true', // Convert to boolean
      };
  
      const response = await api.post('books/', bookToAdd, { headers });
      setUserBooks([...userBooks, response.data]); // Add new book to the list
      setNewBook({
        title: '',
        author: '',
        genre: '',
        condition: '',
        availability: '',
      }); // Clear the input fields
    } catch (error) {
      console.error('Error adding book:', error.response?.data || error.message);
    }
  };
  
  const handleDeleteBook = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      const token = getAccessToken();
      if (!token) {
        console.error('No access token found');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      try {
        await api.delete(`books/${bookId}/`, { headers });
        setUserBooks(userBooks.filter((book) => book.id !== bookId)); // Remove book from the list
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }

  };

  const handleEditBook = async (bookId) => {
    const book = userBooks.find((b) => b.id === bookId);
    if (!book) {
      console.error('Book not found');
      return;
    }

    setNewBook({
      title: book.title,
      author: book.author,
      genre: book.genre,
      condition: book.condition,
      availability: book.availability,
      id: book.id,
    });

    setIsAddFormOpen(true);
  };

  const handleUpdateBook = async (bookId) => {
  const book = userBooks.find((b) => b.id === bookId);
  if (!book) {
    console.error('Book not found');
    return;
  }

  setIsAddFormOpen(true); // Open the form to edit the book

  const token = getAccessToken();
  if (!token) {
    console.error('No access token found');
    return;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    // Ensure you're sending the correct updated book data
    const updatedBookData = {
      title: book.title,
      author: book.author,
      genre: book.genre,
      condition: book.condition,
      availability: book.availability,
    };

    // Ensure the correct bookId is being used in the API URL
    const response = await api.put(`books/${bookId}/`, updatedBookData, { headers });

    console.log('Book updated:', response.data);

    // Update the local state with the updated book information
    setUserBooks(userBooks.map((b) => (b.id === bookId ? response.data : b)));
  } catch (error) {
    console.error('Error updating book:', error);
  }
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
        <div style={styles.userSection}>
    {/* Notification Icon */}
    <div style={styles.notificationIconContainer} onClick={handleNotifications}>
      <FaBell style={styles.notificationIcon} />
      {notifications.length > 0 && <span style={styles.notificationBadge}>{notifications.length}</span>}
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
                {/* Manage Books Option */}
                <button onClick={handleProfile} style={styles.profileButton}>
                  My Profile
                </button>
                {/* Manage Books Option */}
                <button onClick={handleMyBooks} style={styles.myBooksButton}>
                  My Books
                </button>
                <button onClick={handleLogout} style={styles.logoutButton}>
                  Logout
                </button>
              </div>
        )}
      </div>
    </div>
    </header>

      {/* Book Listing Section */}
    <section style={styles.section}>
        <h3>Your Book Listings</h3>
        {/* Book List */}
        <div style={styles.bookGrid}>
          {paginatedBooks.length > 0 ? (
            paginatedBooks.map((book) => (
              <div key={book.id} style={styles.bookCard}>
                <strong>{book.title}</strong> 
                <p>Author: {book.author}</p>
                <p>Genre: {book.genre}</p>
                <p>Condition: {book.condition}</p>
                <p>Availability: {book.availability ? "Available" : "Not Available"}</p>
                <button
                  style={styles.editButton}
                  onClick={() => handleEditBook(book.id)}
                >
                  Edit
                </button>
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDeleteBook(book.id)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p style={styles.noData}>You have no books listed for exchange.</p>
          )}
        </div>

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

         {/* Button to open the add book form (modal) */}
<button onClick={() => {
  setIsAddFormOpen(true);
  setNewBook({
    title: '',
    author: '',
    genre: '',
    condition: '',
    availability: 'true', // Default to available when adding
  }); // Reset form for new book
}} style={styles.addBookButton}>
  Add Book
</button>

{/* Modal for adding or editing book */}
{isAddFormOpen && (
  <div style={styles.modalOverlay}>
    <div style={styles.modalContent}>
      <h2 style={styles.modalTitle}>
        {newBook.id ? 'Edit Book' : 'Add New Book'}
      </h2>

      <form
        onSubmit={newBook.id ? () => handleUpdateBook(newBook.id) : handleAddBook}
      >
        <div style={styles.formGroup}>
          <label style={styles.label}>Title:</label>
          <input
            type="text"
            name="title"
            value={newBook.title}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Author:</label>
          <input
            type="text"
            name="author"
            value={newBook.author}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Genre:</label>
          <input
            type="text"
            name="genre"
            value={newBook.genre}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Condition:</label>
          <input
            type="text"
            name="condition"
            value={newBook.condition}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Availability:</label>
          <div>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="availability"
                value="true"
                checked={newBook.availability === 'true'}
                onChange={handleInputChange}
                style={styles.radioInput}
              />
              Available
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="availability"
                value="false"
                checked={newBook.availability === 'false'}
                onChange={handleInputChange}
                style={styles.radioInput}
              />
              Not Available
            </label>
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.submitButton}>
            {newBook.id ? 'Update Book' : 'Add Book'}
          </button>
          <button type="button" onClick={() => setIsAddFormOpen(false)} style={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
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
  searchContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    marginRight: '20px',
  },
  searchInput: {
    padding: '10px',
    border: '1px solid white',
    borderRadius: '5px',
    width: '200px',
  },
  searchButton: {
    marginLeft: '10px',
    backgroundColor: '#5f6393',
    color: 'white',
    padding: '10px 20px',
    border: '1px solid white',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px', // Ensures proper spacing between elements
  },
  notificationIconContainer: {
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: '1.5rem',
    color: 'white',
  },
  notificationBadge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '50%',
    fontSize: '0.75rem',
    width: '18px',
    height: '18px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userText: {
    fontSize: '1rem',
    color: 'white',
    marginLeft: '10px',
  },
  userIconContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  userIcon: {
    fontSize: '2rem',
    color: 'white',
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
  profileButton: {
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    backgroundColor: 'transparent',
    textAlign: 'left',
    width: '100%',
    cursor: 'pointer',
    transition: 'background-color 0.2s, text-decoration 0.2s', // Add transition for underline
  },
  myBooksButton: {
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    backgroundColor: 'transparent',
    textAlign: 'left',
    width: '100%',
    cursor: 'pointer',
    transition: 'background-color 0.10s, text-decoration 0.2s', // Add transition for underline
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
  bookGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    width: '100%',
    padding: '10px',
  },
  bookCard: {
    backgroundColor: '#ffffff',
    padding: '15px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
  },
  editButton: {
    backgroundColor: '#5f6393',
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
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
  logoutButton: {
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    backgroundColor: 'transparent',
    textAlign: 'left',
    width: '100%',
    cursor: 'pointer',
  },
  addBookButton: {
    marginLeft: '10px',
    backgroundColor: '#5f6393',
    color: 'white',
    padding: '10px 20px',
    border: '1px solid white',  // Added white border
    borderRadius: '5px',
    cursor: 'pointer,',
  },
  // Define styles for modal, buttons, etc.
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    width: '500px',
    maxWidth: '90%',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    animation: 'fadeIn 0.3s ease-out',
  },
  modalTitle: {
    fontSize: '1.75rem',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#333',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#555',
    marginBottom: '8px',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease',
  },
  inputFocus: {
    borderColor: '#007bff',
  },
  radioLabel: {
    fontSize: '1rem',
    color: '#555',
    marginRight: '15px',
  },
  radioInput: {
    marginRight: '5px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  submitButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
    marginRight: '10px',
  },
  submitButtonHover: {
    backgroundColor: '#218838',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
  },
  cancelButtonHover: {
    backgroundColor: '#c82333',
  },
};


export default ManageBooks;
