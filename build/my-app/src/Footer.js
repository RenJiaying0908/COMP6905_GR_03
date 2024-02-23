import React from 'react'
import './Footer.css';

function Footer() {
  return (
    <footer>
      <div className="footer-section">
        <h5>Social Media</h5>
        <ul>
          <li><a href="https://facebook.com">Facebook</a ></li>
          <li><a href="https://instagram.com">Instagram</a ></li>
          <li><a href="https://youtube.com">YouTube</a ></li>
        </ul>
      </div>
      <div className="footer-section">
        <h5>Contact</h5>
        <p>Snow Space Salzburg</p >
        <p>Markt 59 | 5602 Wagrain</p >
        <p>Phone: +43 59221</p >
        <p><a href="mailto:">Contact Form</a ></p >
      </div>
      <div className="footer-section">
        <h5>Company</h5>
        <ul>
          <li><a href="#">Contact Us</a ></li>
          <li><a href="#">Directions</a ></li>
          <li><a href="#">Newsletter</a ></li>
          <li><a href="#">About Us</a ></li>
        </ul>
      </div>
      <div className="footer-section">
        <h5>Additional Links</h5>
        <ul>
          <li><a href="#">Imprint</a ></li>
          <li><a href="#">Privacy Policy</a ></li>
          <li><a href="#">Reporting System</a ></li>
          <li><a href="#">Press</a ></li>
        </ul>
      </div>
      <div className="footer-logos">
        {/* Place partner logos here */}
      </div>
      <div className="footer-bottom">
        <p>Copyright © | Snow Space Salzburg Bergbahnen AG</p >
        <p>Website by Elements</p >
      </div>
    </footer>
  );
}

export default Footer;