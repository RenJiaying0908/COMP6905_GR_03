import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Snow Space Salzburg</h1>
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Weather</a></li>
            <li><a href="#">Social Media</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Company</a></li>
            <li><a href="#">Additional Links</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <section className="weather">
          <h2>Weather</h2>
          {/* Weather information component */}
        </section>
        <section className="social-media">
          <h2>Social Media</h2>
          <div className="social-links">
            <a href="https://www.facebook.com/">Facebook</a>
            <a href="https://www.instagram.com/">Instagram</a>
            <a href="https://www.youtube.com/">Youtube</a>
          </div>
        </section>
        <section className="contact">
          <h2>Contact</h2>
          <address>
            Snow Space Salzburg<br/>
            Markt 59 | 5602 Wagrain<br/>
            +43 59221<br/>
            <a href="#">Contact form</a>
          </address>
        </section>
        <section className="company">
          <h2>Company</h2>
          <ul>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Directions</a></li>
            <li><a href="#">Newsletter</a></li>
            <li><a href="#">About us</a></li>
          </ul>
        </section>
        <section className="additional-links">
          <h2>Additional Links</h2>
          <ul>
            <li><a href="#">Imprint</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Reporting System</a></li>
            <li><a href="#">Press</a></li>
          </ul>
        </section>
        <section className="ski-photos">
          <h2>Ski Photos</h2>
          {/* Ski photos gallery component */}
        </section>
        <section className="ski-routes">
          <h2>Ski Routes</h2>
          <button>Route 1</button>
          <button>Route 2</button>
          <button>Route 3</button>
          {/* Additional ski route buttons */}
        </section>
      </main>
      <footer>
        <p>&copy; 2024 Snow Space Salzburg. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
