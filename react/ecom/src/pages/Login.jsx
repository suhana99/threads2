import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/login.css';
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap';
import userIcon from '../assets/images/user.png';

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
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.user.is_admin) {
        setError("Admins cannot log in from the frontend.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <Container className='border-1px'>
            <Row>
               <Col lg='8' className='m-auto'>
                <div className="login__form my-5">
                            <div className="user d-flex">
                                <img src={userIcon} alt="User Icon" />
                                <h2 className="mt-4">Login</h2>
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
                        <Button className="btn secondary__btn auth__btn" type="submit">
                                Login
                        </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
           </Container> 
      </div>
    </div>
  );
};

export default Login;
