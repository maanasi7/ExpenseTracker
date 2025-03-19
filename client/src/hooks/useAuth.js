import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const navigate = useNavigate();
  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsTokenValid(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        setIsTokenValid(false);
      }
    } catch (error) {
      setIsTokenValid(false);
    }
  }, []);

  useEffect(() => {
    if (!isTokenValid) {
      alert("Session expired, please log in again.");
      navigate("/");
    }
  }, [isTokenValid, navigate]);

  return isTokenValid;
};

export default useAuth;
