import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Homepage from "./components/Homepage";
import NewArrival from './components/NewArrival';
import Collection from './components/Collection';
import Under10 from './components/Under10';
function App() {
  return (
    <div>
      <Navbar />
    <Homepage />
    <NewArrival />
    <Under10 />
    <Collection />
      <Footer />
    </div>
  );
}

export default App;