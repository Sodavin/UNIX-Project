import { useState } from "react";
import Hero from "./Hero";
import NewArrivals from "./NewArrivals";
import Bestsellers from "./Bestsellers";
import Under10 from "./Under10";
import "./css/Home.css";

function Home() {
  return (
    <main className="home-page">
      <Hero />
      <NewArrivals />
      <Bestsellers />
      <Under10 />
    </main>
  );
}

export default Home;
