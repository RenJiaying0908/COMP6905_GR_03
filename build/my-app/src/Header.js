import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="site-header">
      <nav className="site-nav">
        <div className="nav-links">
          <a href="/ski-resort">Ski Resort</a >
          <a href="/info">Information</a >
          <a href="/region">Region</a >
          <a href="/tickets">Tickets</a >
        </div>
        <div className="nav-icons">
        </div>
      </nav>
      <div className="hero">
        <h1>xxx ski facility</h1>

      </div>
    </header>
  );
}

export default Header;