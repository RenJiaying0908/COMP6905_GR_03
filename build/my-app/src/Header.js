import React from 'react';
import './Header.css';
import postData from './messenger';

function Header() {

  const handleClick = (e) => {
    // Prevent default navigation behavior
    e.preventDefault();

    // Execute any logic here
    console.log("Link clicked!");
    const data = {
      username: 'user',
      password: '123'
    };

    postData(data, (error, data)=>{
      if(error)
      {
        alert(error);
      }else
      {
        alert(data.key);
      }

    });

  };

  return (
    <header className="site-header">
      <nav className="site-nav">
        <div className="nav-links">
          <a href="/ski-resort">Ski Resort</a >
          <a href="/info" onClick={handleClick}>Information</a >
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