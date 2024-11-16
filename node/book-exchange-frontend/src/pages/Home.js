import React from 'react';
import Header from '../components/Header'; // Import Header
import Footer from '../components/Footer'; // Import Footer

const Home = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Full viewport height
      }}
    >
      {/* Header Section */}
      <div style={{ padding: '10px', backgroundColor: '#f8f9fa', textAlign: 'center' }}>
        <Header /> {/* Include Header */}
      </div>

      {/* Hero Section */}
      <section
        style={{
          backgroundImage: "url('https://via.placeholder.com/1500x800?text=Books+Background+With+Technology+Feel')", // Placeholder background
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '80px 20px',
        }}
      >
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
          Welcome to the Book Exchange Platform
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
          Exchange books with others easily and conveniently!
        </p>
        <a
          href="/browse"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '5px',
            textDecoration: 'none',
            fontSize: '1.1rem',
          }}
        >
          Start Trading
        </a>
      </section>

      {/* Featured Books Section */}
      <section
        style={{
          padding: '40px 20px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
        }}
      >
        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Featured Books</h2>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center', // Centering the books container
            gap: '20px',
            overflowX: 'scroll', // Horizontal scrolling enabled
            padding: '10px 0', // Space between books and container
            scrollbarWidth: 'thin', // Modern browsers - make the scrollbar thinner
            WebkitOverflowScrolling: 'touch', // Smooth scrolling for touch devices
            maxWidth: '100%', // Ensure the container doesn't stretch too far
            scrollBehavior: 'smooth', // Smooth scrolling effect
          }}
        >
          {/* Book 1 */}
          <div style={{ width: '200px', textAlign: 'center', flexShrink: 0 }}>
            <img
              src="https://covers.openlibrary.org/b/id/10462577-L.jpg"
              alt="The Great Gatsby"
              style={{ width: '100%', height: '250px', objectFit: 'cover' }}
            />
            <h3 style={{ marginTop: '10px' }}>The Great Gatsby</h3>
            <p style={{ color: '#6c757d' }}>A classic novel of the Roaring Twenties by F. Scott Fitzgerald.</p>
            <a
              href="/exchange"
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                borderRadius: '5px',
                textDecoration: 'none',
                fontSize: '1rem',
              }}
            >
              Exchange Now
            </a>
          </div>

          {/* Book 2 */}
          <div style={{ width: '200px', textAlign: 'center', flexShrink: 0 }}>
            <img
              src="https://covers.openlibrary.org/b/id/7222246-L.jpg"
              alt="1984"
              style={{ width: '100%', height: '250px', objectFit: 'cover' }}
            />
            <h3 style={{ marginTop: '10px' }}>1984</h3>
            <p style={{ color: '#6c757d' }}>A dystopian novel by George Orwell about totalitarianism.</p>
            <a
              href="/exchange"
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                borderRadius: '5px',
                textDecoration: 'none',
                fontSize: '1rem',
              }}
            >
              Exchange Now
            </a>
          </div>

          {/* Book 3 */}
          <div style={{ width: '200px', textAlign: 'center', flexShrink: 0 }}>
            <img
              src="https://covers.openlibrary.org/b/id/7870354-L.jpg"
              alt="To Kill a Mockingbird"
              style={{ width: '100%', height: '250px', objectFit: 'cover' }}
            />
            <h3 style={{ marginTop: '10px' }}>To Kill a Mockingbird</h3>
            <p style={{ color: '#6c757d' }}>Harper Lee's Pulitzer Prize-winning novel about racial injustice.</p>
            <a
              href="/exchange"
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                borderRadius: '5px',
                textDecoration: 'none',
                fontSize: '1rem',
              }}
            >
              Exchange Now
            </a>
          </div>

          {/* Book 4 (Additional Book to Show when Scrolled) */}
          <div style={{ width: '200px', textAlign: 'center', flexShrink: 0 }}>
            <img
              src="https://covers.openlibrary.org/b/id/8611221-L.jpg"
              alt="Moby Dick"
              style={{ width: '100%', height: '250px', objectFit: 'cover' }}
            />
            <h3 style={{ marginTop: '10px' }}>Moby Dick</h3>
            <p style={{ color: '#6c757d' }}>Herman Melville's epic tale of obsession and revenge at sea.</p>
            <a
              href="/exchange"
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                borderRadius: '5px',
                textDecoration: 'none',
                fontSize: '1rem',
              }}
            >
              Exchange Now
            </a>
          </div>

          {/* Book 5 (Additional Book to Show when Scrolled) */}
          <div style={{ width: '200px', textAlign: 'center', flexShrink: 0 }}>
            <img
              src="https://covers.openlibrary.org/b/id/8281434-L.jpg"
              alt="Pride and Prejudice"
              style={{ width: '100%', height: '250px', objectFit: 'cover' }}
            />
            <h3 style={{ marginTop: '10px' }}>Pride and Prejudice</h3>
            <p style={{ color: '#6c757d' }}>Jane Austen's beloved novel about love and social standing.</p>
            <a
              href="/exchange"
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                borderRadius: '5px',
                textDecoration: 'none',
                fontSize: '1rem',
              }}
            >
              Exchange Now
            </a>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        style={{
          padding: '40px 20px',
          textAlign: 'center',
          backgroundColor: '#e9ecef',
        }}
      >
        <h2 style={{ fontSize: '2.5rem', marginBottom: '30px' }}>How It Works</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
          {/* Step 1 */}
          <div style={{ maxWidth: '300px' }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Create an Account</h3>
            <p>Sign up to start browsing and exchanging books.</p>
          </div>
          {/* Step 2 */}
          <div style={{ maxWidth: '300px' }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Browse Available Books</h3>
            <p>Explore books available for exchange and request them.</p>
          </div>
          {/* Step 3 */}
          <div style={{ maxWidth: '300px' }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Exchange Books</h3>
            <p>Connect with users and exchange books easily.</p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <div style={{ padding: '10px', backgroundColor: '#f8f9fa', textAlign: 'center' }}>
        <Footer /> {/* Include Footer */}
      </div>
    </div>
  );
};

export default Home;
