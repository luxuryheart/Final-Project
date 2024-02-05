import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const [role, setRole] = useState("");
  const [userDetail, setUserDetail] = useState({});
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const getUserDetail = async () => {
    try {
      if (!token) {
        throw new Error("Token is missing");
      }

      const res = await axios.get("/api/v1/user-detail", {
        headers: {
          authtoken: token,
        },
      });

      if (res.data.success) {
        setUserDetail(res.data.userDetail);
        setUserId(res.data.userDetail._id);
        setRole(res.data.userDetail.role.name);
      }
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  };

  useEffect(() => {
    getUserDetail();
  }, []);

  if (!token) {
    return null;
  }

  if (role !== "admin") {
    navigate("/");
  }

  return children;
};

export default AdminRoute;
