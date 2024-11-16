import React from 'react';

const About = () => {
  return (
    <div style={styles.container}>
      <section style={styles.section}>
        <h2 style={styles.title}>About Us</h2>
        <p style={styles.description}>
          We’re a team of passionate innovators, developers, and thinkers dedicated to leveraging technology to transform the way people connect, learn, and thrive. At [Your Company Name], we’re on a mission to empower individuals and businesses in today’s digital landscape.
        </p>
      </section>

      <section style={styles.section}>
        <h3 style={styles.subtitle}>Our Vision</h3>
        <p style={styles.description}>
          To create a connected, accessible, and empowering digital world where technology enhances every aspect of life. We leverage the latest advancements to deliver solutions that solve real-world problems, foster connections, and inspire positive change.
        </p>
      </section>

      <section style={styles.section}>
        <h3 style={styles.subtitle}>What We Do</h3>
        <ul style={styles.list}>
          <li>AI-Driven Applications: Intelligent automation and personalized experiences.</li>
          <li>Blockchain Solutions: Secure, transparent, and decentralized platforms.</li>
          <li>Mobile and Web Applications: Scalable and seamless user experiences.</li>
          <li>Cloud Computing & SaaS: Access data and collaborate from anywhere.</li>
        </ul>
      </section>

      <section style={styles.section}>
        <h3 style={styles.subtitle}>Our Core Values</h3>
        <ul style={styles.list}>
          <li>Innovation: Embracing forward-thinking ideas and solutions.</li>
          <li>User-Centricity: Prioritizing usability, accessibility, and inclusivity.</li>
          <li>Transparency: Building trust through security and ethical practices.</li>
          <li>Sustainability: Working toward eco-friendly technology solutions.</li>
        </ul>
      </section>

      <section style={styles.section}>
        <h3 style={styles.subtitle}>Meet Our Team</h3>
        <p style={styles.description}>
          Our team is our greatest asset—a collective of developers, designers, data scientists, and innovators. Together, we bring a wealth of experience and creativity to each project, fostering a collaborative and inclusive culture that drives us to exceed expectations.
        </p>
      </section>

      <section style={styles.section}>
        <h3 style={styles.subtitle}>Let's Connect</h3>
        <p style={styles.description}>
          We love connecting with people who share our passion for technology and innovation. Whether you're looking for a partner to bring your vision to life or just want to stay up-to-date with the latest in tech, reach out to us! We’re excited to create the future together.
        </p>
        <button style={styles.button}>Contact Us</button>
      </section>
    </div>
  );
};

// Basic styling using inline CSS in JavaScript
const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  section: {
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#007bff',
  },
  subtitle: {
    fontSize: '1.75rem',
    marginBottom: '1rem',
    color: '#007bff',
  },
  description: {
    fontSize: '1rem',
    lineHeight: '1.6',
  },
  list: {
    paddingLeft: '1rem',
    listStyleType: 'circle',
    fontSize: '1rem',
    lineHeight: '1.6',
  },
  button: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default About;
