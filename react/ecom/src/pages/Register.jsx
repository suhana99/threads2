import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/register.css';
import userIcon from '../assets/images/user.png';
import { Form, FormGroup, Button } from 'reactstrap';

const Register = () => {
    const [username, setUsername] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
    
        console.log("Submitting form...");
    
        if (password1 !== password2) {
            setError("Passwords do not match!");
            return;
        }
    
        try {
            const response = await fetch("http://127.0.0.1:8000/front-register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password1,
                    password2,
                }),
            });
    
            console.log("Response received:", response);
            
            const data = await response.json();
            console.log("Response data:", data);
    
            if (!response.ok) {
                throw new Error(data.error || "Registration failed!");
            } 
            setSuccess("Account created successfully!");
            setTimeout(() => navigate("/login"), 1000);
        } catch (error) {
            console.error("Error during fetch:", error);
            setError("Something went wrong. Please try again.");
        }
    };
    

    return (
        <>
        <div className="register__container">
            <div className="register__form">
                <div className="user">
                    <img src={userIcon} alt="User Icon" />
                    <h2 className="mb-5">Register</h2>
                </div>
                <Form onSubmit={handleRegister} className="space-y-4">
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
                                value={password1}
                                onChange={(e) => setPassword1(e.target.value)}
                                required
                            />
                    </FormGroup>

                    <FormGroup>
                        <label className="block text-sm font-medium">Confirm Password</label>
                        <input
                            type="password"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            required
                        />
                    </FormGroup>

                    <Button className="auth__btn" type="submit">Register</Button>
                </Form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account? <a href="/login" className="text-yellow-500 hover:underline">Login</a>
                </p>
            </div>
        </div>
        <div> </div>
        </>
    );
};

export default Register;
