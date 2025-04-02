import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/login.css';
import {Form, FormGroup, Button } from 'reactstrap';
import userIcon from '../assets/images/user.png';
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await fetch("http://127.0.0.1:8000/front-login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include", 
      });
  
      const data = await response.json();
      
      // Debug: Log API response
      console.log("API Response:", data);
      
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
      
      if (data.user.is_admin) {
        setError("Admins cannot log in from the frontend.");
        return;
      }
      // Check if token is actually present in the response
      if (data.access) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        
        // Debug: Check if token is stored
        console.log("Stored Access Token:", localStorage.getItem("access_token"));
      } else {
        console.error("Access token missing in response");
      }
      
      localStorage.setItem("user", JSON.stringify(data.user));
      
      navigate("/");
      window.location.reload();
      
    } catch (error) {
      setError(error.message);
    }

    const notifySuccess = () => {
      toast.success('Success message!');
    };
    
    const notifyError = () => {
      toast.error('Error message!');
    };
  };
  

  return (
    <div className="login__container mt-[-50px] mb-[-50px]">
    <div className="login__form max-h-[550px]">
        <div className="user flex align-items-center mb-3">
            <img src={userIcon} alt="User Icon" className="max-h-[100px]"/>
            <h2>Login</h2>
        </div>

        <Form onSubmit={handleLogin} className="space-y-4">
            <FormGroup>
                <label className="block text-sm font-medium">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </FormGroup>

            <FormGroup>
                <label className="block text-sm font-medium">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </FormGroup>

            <Button className="auth__btn" type="submit">Login</Button>
        </Form>
    </div>
</div>

  );
};

export default Login;
