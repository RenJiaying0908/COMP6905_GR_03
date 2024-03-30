import React, { useState } from 'react';
import './LiveInfo.css';

function InfoCard({ title, description, imageUrl, onClick }) {
  return (
    <div className="info-card" onClick={() => onClick({ title, description, imageUrl })}>
      <div className="info-image" style={{ backgroundImage: `url(${imageUrl})` }}></div>
      <div className="info-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function LiveInfo() {
  const cards = [
    {
      title: "Ski routes",
      description: "Looking for the nearest ski route? Click here",
      imageUrl: '/SkiRoutesPicture.jpg',
    },
    {
      title: "Current weather conditions",
      description: "Check the current weather and forecast for the coming days at Snow Space Salzburg now!",
      imageUrl: "/WeatherPicture.jpg"
    },
    {
      title: "Status Slopes & Lifts",
      description: "Which lifts and slopes are currently open? Find out here!",
      imageUrl: "/SlopesPicture.jpg"
    },
    {
      title: "Food Places & Public Restrooms",
      description: "Looking for food places and public restrooms? Click here！",
      imageUrl: "/FoodPlacePicture.jpg"
    },
  ];

  return (
    <section className="live-info-section">
      <h2>Live Infos from Snow Space Salzburg</h2>
      <div className="cards-container">
        {cards.map((card, index) => (
          <InfoCard
            key={index}
            title={card.title}
            description={card.description}
            imageUrl={card.imageUrl}
          />
        ))}
      </div>
    </section>
  );
}

export default LiveInfo;
