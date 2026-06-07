import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('');

  return (
    <div>
      <Navbar setView={setCurrentView} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      {currentView === 'home' && (
        <main style={{ padding: "50px" }}>
          <h1>Welcome to UNIX</h1>
          <p>Modern Fashion Store</p>
        </main>
      )}

      {currentView === 'login' && <Login setView={setCurrentView} setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} />}
      {currentView === 'signup' && <Signup setView={setCurrentView} setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} setUserEmail={setUserEmail} />}
      {currentView === 'dashboard' && <Dashboard setView={setCurrentView} setIsLoggedIn={setIsLoggedIn} userName={userName} setUserName={setUserName} userEmail={userEmail} setUserEmail={setUserEmail} />}

      <Footer />
    </div>
  );
}

export default App;