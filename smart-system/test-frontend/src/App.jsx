import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";

function Navbar() {
  return <h1>Navbar</h1>;
}

function Home() {
  return <h1>Home</h1>;
}

function Menu() {
  return <h1>Menu</h1>;
}

function Reservations() {
  return <h1>Reservations</h1>;
}

function Footer() {
  return <h1>Footer</h1>;
}

function App() {

  useEffect(() => {
    fetch("http://localhost:5000")
      .then(res => res.text())
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }, []);

  return (

    <Routes>

      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Home />
            <Menu />
            <Reservations />
            <Footer />
          </>
        }
      />

      <Route
        path="/admin"
        element={<Admin />}
      />

    </Routes>

  );
}

export default App;