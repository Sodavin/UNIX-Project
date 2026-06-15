import Hero from "./Hero";
import NewArrivals from "./NewArrivals";
import Discounted from "./Discounted";
import Bestsellers from "./Bestsellers";
import Under10 from "./Under10";
import { usePageTitle } from "../../utils/usePageTitle";
import "../css/Home.css";

function Home() {
  usePageTitle("UNIX | Home");

  return (
    <main className="home-page">
      <Hero />
      <Discounted />
      <NewArrivals />
      <Bestsellers />
      <Under10 />
    </main>
  );
}

export default Home;
