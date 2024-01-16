import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (location.pathname === "/" && !token) {
      navigate("/login");
    }
  }, [token]);
  return <div>Home</div>;
};

export default Home;
