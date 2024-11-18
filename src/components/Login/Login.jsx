import React, { useEffect, useState } from "react";
import { RiUserFill, RiLockPasswordFill } from 'react-icons/ri';
import { toast } from "react-toastify";
import UserService from "../../Services/UserServices";
import { useNavigate } from 'react-router-dom';
import { Button, Card, Form, Container, Alert, Spinner } from 'react-bootstrap';
import "./Login.css";

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Clear localStorage on login page render to reset any session data
        localStorage.clear();
    }, []);

    const handleLogin = async () => {
        setError(""); // Clear any previous error messages

        if (email && password) {
            setLoading(true); // Show loading spinner
            try {
                const result = await UserService.authenticate({ email, pass: password });
                
                if (result?.status === 200) {
                    // Successful login
                    const authenticatedUser = result?.data?.user;
                    localStorage.setItem("user", JSON.stringify(authenticatedUser));
                    localStorage.setItem("token", JSON.stringify(result?.data.token));

                    onLogin(); // Update login state
                    navigate("/map"); // Redirect to map page
                } else {
                    // Incorrect email or password
                    setError("Incorrect username or password");
                    reset();
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setError("Incorrect username or password");
                } else {
                    toast.error("An error occurred during login. Please try again.");
                }
            } finally {
                setLoading(false); // Hide loading spinner
            }
        } else {
            setError("Please enter both email and password.");
        }
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const reset = () => {
        setEmail("");
        setPassword("");
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="p-4 shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
                <Card.Body>
                    <h2 className="text-center mb-3">Welcome Back</h2>
                    <p className="text-center text-muted mb-4">Log in to your account</p>

                    {/* Display error message if it exists */}
                    {error && (
                        <Alert variant="danger" className="text-center">
                            {error}
                        </Alert>
                    )}
                    
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <RiUserFill />
                                </span>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">
                                    <RiLockPasswordFill />
                                </span>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button
                                variant="primary"
                                onClick={handleLogin}
                                disabled={loading}
                                className="d-flex align-items-center justify-content-center"
                            >
                                {loading ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                        <span className="ms-2">Logging In...</span>
                                    </>
                                ) : (
                                    "Log In"
                                )}
                            </Button>

                            <Button variant="secondary" onClick={handleRegisterClick}>
                                Register
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;
