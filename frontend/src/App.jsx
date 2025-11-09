import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "./context/cartContext";
import { CartProvider } from "./context/cartContext";



// ===== NAVBAR =====
function Navbar() {
  const { state } = useCart();
  const cartCount = state.items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3 px-4 fixed-top shadow-sm">
      <div className="container-fluid">
        <a className="navbar-brand fw-bold text-warning" href="/">Silver Spoon 🍽️</a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/menu">Menu</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/reservations">Reservations</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>

            <li className="nav-item">
              <Link className="nav-link position-relative" to="/cart">
                Cart
                {cartCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}


// ===== FOOTER =====
function Footer() {
  return (
    <footer className="bg-dark text-light text-center py-3 mt-5">
      <p className="mb-0">© {new Date().getFullYear()} Silver Spoon Restaurant. Made with ❤️ in Lagos.</p>
    </footer>
  );
}

// ===== HOME =====
function Home() {
  return (
    <section
      className="text-light text-center d-flex flex-column justify-content-center align-items-center"
      style={{
        background:
          "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat",
        height: "100vh",
      }}
    >
      <h1 className="fw-bold display-3 text-warning mb-3">Welcome to Silver Spoon</h1>
      <p className="lead mb-4 w-75">
        Lagos’ finest dining experience — where flavor, class, and culture meet at your table.
      </p>
      <Link to="/menu" className="btn btn-warning btn-lg shadow-lg">Explore Menu</Link>
    </section>
  );
}

// ===== MENU =====
function Menu() {
  const [dishes, setDishes] = useState([]);
  const { dispatch } = useCart(); 
  
  // inside your App.jsx or Menu component
useEffect(() => {
  async function loadMenu() {
    try {

const res = await fetch(`${import.meta.env.VITE_API_URL}/api/menu`);
const data = await res.json();
setDishes(data);
    } catch (err) {
      console.error("Could not load menu:", err);
    }
  }
  loadMenu();
}, []);


  const addToCart = (dish) => {
    dispatch({ type: "ADD", payload: dish });
  }; 

  return (
    <div className="container my-5 pt-5">
      <h2 className="text-center text-warning fw-bold mb-4">Our Signature Dishes</h2>
      <div className="row">
        {dishes.map((dish) => (
          <div key={dish._id || dish.name} className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm border-0">
              <img src={dish.image} className="card-img-top" alt={dish.name} style={{ height: 250, objectFit: "cover" }} />
              <div className="card-body text-center">
                <h5 className="card-title fw-bold text-danger">{dish.name}</h5>
                <p className="card-text">{dish.description}</p>
                <p className="fw-semibold text-success">₦{dish.price}</p>
                <button onClick={() => addToCart(dish)} className="btn btn-outline-warning btn-sm">Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== RESERVATIONS =====
function Reservations() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    message: "",
  });

  const [response, setResponse] = useState("");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});
      if (res.ok) {
        setResponse("✅ Reservation submitted successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: "",
          time: "",
          guests: "",
          message: "",
        });
        fetchReservations();
      } else {
        const data = await res.json().catch(()=>({}));
        setResponse(data.error || "❌ Failed to submit reservation. Try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("⚠️ Server error. Check backend connection.");
    }
  };

  async function fetchReservations() {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations`);

      const data = await res.json();
      setReservations(Array.isArray(data) ? data.reverse() : []);
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container my-5 pt-5">
      <h2 className="text-center text-danger fw-bold mb-4">Reserve a Table</h2>

      <form onSubmit={handleSubmit} className="w-75 mx-auto shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label className="form-label fw-semibold">Full Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Phone</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Date</label>
          <input
            type="date"
            className="form-control"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Time</label>
          <input
            type="time"
            className="form-control"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Guests</label>
          <input
            type="number"
            className="form-control"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Special Request (Optional)</label>
          <textarea
            className="form-control"
            name="message"
            rows="3"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
        </div>

        <button className="btn btn-danger w-100 fw-semibold" type="submit">
          Submit Reservation
        </button>
      </form>

      {response && <p className="text-center mt-3 fw-bold">{response}</p>}

      <hr className="my-5" />

      <h3 className="text-center fw-bold mb-4">📋 All Reservations</h3>

      {loading ? (
        <p className="text-center">⏳ Loading reservations...</p>
      ) : reservations.length === 0 ? (
        <p className="text-center text-muted">No reservations yet.</p>
      ) : (
        <div className="row">
          {reservations.map((item) => (
            <div className="col-md-6 mb-4" key={item._id}>
              <div className="card shadow-sm p-3">
                <h5 className="fw-bold">{item.name}</h5>
                <p className="mb-1"><strong>Email:</strong> {item.email || "—"}</p>
                <p className="mb-1"><strong>Phone:</strong> {item.phone || "—"}</p>
                <p className="mb-1"><strong>Date:</strong> {item.date}</p>
                <p className="mb-1"><strong>Time:</strong> {item.time}</p>
                <p className="mb-1"><strong>Guests:</strong> {item.guests}</p>
                {item.message && <p><strong>Message:</strong> {item.message}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// ===== ABOUT =====
function About() {
  return (
    <div className="container text-center my-5 pt-5">
      <h2 className="text-danger fw-bold mb-3">About Silver Spoon</h2>
      <p className="lead">Born in Lagos, raised by flavor. Silver Spoon blends Nigerian tradition with modern luxury dining. Each meal is a story, served fresh. From the smoky Jollof that whispers nostalgia to the Asun that bites just right, every dish is crafted to celebrate local taste with world-class finesse.

We believe fine dining doesn’t need to feel foreign — it just needs to feel right. Whether you’re here for a quiet dinner, a celebration, or a late-night craving, Silver Spoon is where Lagos gathers to eat, laugh, and taste memories reborn.</p>
    </div>
  );
}

function CartPage() {
  const { state, dispatch } = useCart();
  const total = state.items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="container my-5 pt-5">
      <h2 className="mb-4">Your Cart</h2>
      {state.items.length === 0 ? <p>Your cart is empty.</p> : (
        <>
          <div className="row">
            {state.items.map(item => (
              <div key={item._id} className="col-md-6 mb-3">
                <div className="card p-3">
                  <div className="d-flex align-items-center">
                    <img src={item.image} alt={item.name} style={{ width: 120, height: 80, objectFit: "cover", marginRight: 16 }} />
                    <div className="flex-grow-1">
                      <h5>{item.name}</h5>
                      <p>₦{item.price} • Qty: {item.qty}</p>
                      <div>
                        <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => dispatch({ type: "DECREASE", payload: item._id })}>-</button>
                        <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => dispatch({ type: "INCREASE", payload: item._id })}>+</button>
                        <button className="btn btn-sm btn-danger" onClick={() => dispatch({ type: "REMOVE", payload: item._id })}>Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h4>Total: ₦{total}</h4>
            <button className="btn btn-warning">Checkout (coming soon)</button>
          </div>
        </>
      )}
    </div>
  );
}


// ===== CONTACT =====
function Contact() {
  return (
    <div className="container text-center my-5 pt-5">
      <h2 className="text-success fw-bold mb-3">Contact Us</h2>
      <p>📞 <strong>+234 810 555 1212</strong></p>
      <p>📧 <strong>info@silverspoon.com</strong></p>
      <p>📍 22 Awolowo Road, Ikeja, Lagos</p>
    </div>
  );
}

// ===== MAIN APP =====
function App() {
  return (
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
  );
}

export default App;
