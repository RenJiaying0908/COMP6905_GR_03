import React from "react";
import Header from "./Header";
import LiveInfo from "./LiveInfo";
import Footer from "./Footer";
import ContentPage from "./ContentPage";
import SkiResortMap from "./Map";

function App() {
  return (
    <div className="app">
      <Header />
      <ContentPage />
      <SkiResortMap />
      <LiveInfo />
      <Footer />
    </div>
  );
}
export default App;
