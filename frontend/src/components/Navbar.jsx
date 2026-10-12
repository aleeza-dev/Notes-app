
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <h2>𝑁♡𝑡𝑒𝑠</h2>

      {token ? (
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <button
          className="logout-btn"
          onClick={() => navigate("/login")}
        >
          Login / Sign Up
        </button>
      )}
    </nav>
  );
};

export default Navbar;
