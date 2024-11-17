import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import api from './Api';

const ITEMS_PER_PAGE = 10;

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [originalTransactions, setOriginalTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const getAccessToken = () => localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = getAccessToken();
      if (!token) {
        console.error('No access token found');
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch transactions data
        const response = await api.get('transactions/', { headers });
        setTransactions(response.data);
        setOriginalTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('accessToken');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [navigate]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setTransactions(originalTransactions);
    } else {
      const filteredTransactions = originalTransactions.filter((transaction) =>
        transaction.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setTransactions(filteredTransactions);
    }
    setCurrentPage(1);
  };

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={styles.profileContainer}>
      {/* Header */}
      <header style={styles.profileHeader}>
        <h1>Transaction Management</h1>
        <div style={styles.userIconContainer}>
          <FaUserCircle onClick={toggleDropdown} style={styles.userIcon} />
          {isDropdownOpen && (
            <div style={styles.dropdown}>
              <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search Transactions"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          style={styles.searchInput}
        />
        <button onClick={handleSearch} style={styles.searchButton}>
          Search
        </button>
      </div>

      {/* Transactions Table */}
      <section style={styles.section}>
        <h3>Your Transactions</h3>
        {paginatedTransactions.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Transaction ID</th>
                <th style={styles.tableHeader}>Book Title</th>
                <th style={styles.tableHeader}>Borrower</th>
                <th style={styles.tableHeader}>Status</th>
                <th style={styles.tableHeader}>Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td style={styles.tableCell}>{transaction.id}</td>
                  <td style={styles.tableCell}>{transaction.bookTitle}</td>
                  <td style={styles.tableCell}>{transaction.borrowerName}</td>
                  <td style={styles.tableCell}>{transaction.status}</td>
                  <td style={styles.tableCell}>{transaction.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={styles.noData}>No transactions available.</p>
        )}
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              style={styles.paginationButton}
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              style={styles.paginationButton}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

const styles = {
  ...{/* Use the same `styles` object from the `MyBooks` component above */},
};

export default TransactionManagement;
