import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <div>
      <Navbar />

      <main style={{ padding: "50px" }}>
        <h1>Welcome to UNIX</h1>
        <p>Modern Fashion Store</p>
      </main>

      <Footer />
    </div>
  );
}

export default App;