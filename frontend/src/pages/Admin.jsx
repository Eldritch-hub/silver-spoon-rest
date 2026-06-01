import { useEffect, useState } from "react";

function Admin() {

  const [reservations, setReservations] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [filter, setFilter] = useState("all");

  // fetch reservations
  useEffect(() => {

    fetch("http://localhost:5000/api/reservations")
      .then((res) => res.json())
      .then((data) => {
        setReservations(data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  // update reservation status
  const updateStatus = async (id, newStatus) => {

    try {

      await fetch(
        `http://localhost:5000/api/reservations/${id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            status: newStatus
          })
        }
      );

      setReservations((prev) =>
        prev.map((reservation) =>
          reservation._id === id
            ? { ...reservation, status: newStatus }
            : reservation
        )
      );

    }

    catch (error) {

      console.log(error);

    }

  };

  // login handler
  const handleLogin = () => {

    if (adminCode === "silver123") {
      setIsAuthenticated(true);
    }

    else {
      alert("Wrong admin code");
    }

  };

  // login screen
  if (!isAuthenticated) {

    return (

      <div style={{ padding: "20px" }}>

        <h1>Admin Login</h1>

        <input
          type="password"
          placeholder="Enter admin code"
          value={adminCode}
          onChange={(e) =>
            setAdminCode(e.target.value)
          }
        />

        <button onClick={handleLogin}>
          Login
        </button>

      </div>

    );

  }

  // dashboard
  return (

    <div style={{ padding: "20px" }}>

      <h1>Admin Dashboard</h1>

      <div style={{ marginBottom: "20px" }}>

  <button onClick={() => setFilter("all")}>
    All
  </button>

  <button onClick={() => setFilter("pending")}>
    Pending
  </button>

  <button onClick={() => setFilter("approved")}>
    Approved
  </button>

  <button onClick={() => setFilter("rejected")}>
    Rejected
  </button>

</div>

      {reservations.length === 0 && (
        <p>No reservations found.</p>
      )}

      {reservations.filter((reservation) => {

    if (filter === "all") return true;

    return reservation.status === filter;

  })
  .map((reservation) => (

        <div
          key={reservation._id}
          style={{
            border: "1px solid gray",
            marginBottom: "20px",
            padding: "10px"
          }}
        >

          <h2>{reservation.name}</h2>

          <p>Email: {reservation.email}</p>

          <p>Phone: {reservation.phone}</p>

          <p>Date: {reservation.date}</p>

          <p>Time: {reservation.time}</p>

          <p>Guests: {reservation.guests}</p>

          <p>
             Status:{" "}

             <b
                style={{
                  color:
                    reservation.status === "approved"
                     ? "green"
                     : reservation.status === "rejected"
                     ? "red"
                     : "orange"
                }}
              >
               {reservation.status}
             </b>

          </p>

         
          <div
            style={{
              display: "flex",
              gap: "10px"
            }}
          >

            <button
              onClick={() =>
                updateStatus(
                  reservation._id,
                  "approved"
                )
              }
            >
              Approve
            </button>

            <button
              onClick={() =>
                updateStatus(
                  reservation._id,
                  "rejected"
                )
              }
            >
              Reject
            </button>

          </div>

        </div>

      ))}

    </div>

  );

}

export default Admin;