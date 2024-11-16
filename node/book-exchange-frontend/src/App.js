import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Contact from './pages/Contact';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Register from './components/Register';
import Profile from './components/Profile';
import ManageBooks from './components/ManageBooks';
import ExchangeRequests from './components/ExchangeRequests';
import TransactionHistory from './components/TransactionHistory';
import AboutUs from './components/AboutUs';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/manage-books" element={<ManageBooks />} />
        <Route path="/exchange-requests" element={<ExchangeRequests />} />
        <Route path="/transaction-history" element={<TransactionHistory />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
