import React from 'react';
import Header from './Header';
import LiveInfo from './LiveInfo';
import Footer from './Footer';
import ContentPage from './ContentPage';

function App() {
  return (
    <div className="app">
      <Header />
      <ContentPage />
      <LiveInfo />
      <Footer />
    </div>
  );
}

export default App;