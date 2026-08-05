import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { GoogleLogin } from "@react-oauth/google";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================
  // Email & Password Login
  // ==========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);

      alert("Login Successful");

      navigate("/dashboard");

      window.location.reload();

    } catch (err) {
      console.error("Login Error:", err);
      console.error("Response:", err.response);

      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>

        <div style={{ marginTop: "20px" }}>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                console.log("Google Response:", credentialResponse);

                const res = await API.post("/auth/google", {
                  credential: credentialResponse.credential,
                });

                console.log("Backend Response:", res.data);

                localStorage.setItem("token", res.data.token);

                alert("Google Login Successful");

                navigate("/dashboard");


              } catch (error) {
                console.error("Google Login Error:", error);
                console.error("Response:", error.response);

                alert(
                  error.response?.data?.message ||
                  "Google Login Failed"
                );
              }
            }}
            onError={() => {
              console.error("Google Login Failed from Google");

              alert("Google Sign-In Failed");
            }}
          />
        </div>

        <p>
          Don't have an account?
          <Link to="/signup"> Signup</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;