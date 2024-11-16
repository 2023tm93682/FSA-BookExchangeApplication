import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your components
import Home from './pages/Home';
import MyBooks from './components/MyBooks';
import ExchangeRequests from './components/ExchangeRequests';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Register from './components/Register';
import Profile from './components/Profile';
import ManageBooks from './components/ManageBooks';
import TransactionHistory from './components/TransactionHistory';
import AboutUs from './components/AboutUs';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-books" element={<MyBooks />} />
        <Route path="/exchange-requests" element={<ExchangeRequests />} />
        <Route path="/login" element={<Login />} />
        <Route path="/send-password-reset-code" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/manage-books" element={<ManageBooks />} />
        <Route path="/transaction-history" element={<TransactionHistory />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} /> {/* Handle 404 */}
      </Routes>
    </Router>
  </React.StrictMode>
);
