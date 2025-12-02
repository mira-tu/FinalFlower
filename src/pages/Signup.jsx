import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const Signup = () => {
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        // Mock signup logic
        navigate('/login');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-image">
                    <div className="auth-overlay"></div>
                    <div className="auth-text">
                        <h2>Join Us!</h2>
                        <p>Create an account to start your floral journey.</p>
                    </div>
                </div>
                <div className="auth-form-container">
                    <h2 className="auth-title">Sign Up</h2>
                    <p className="auth-subtitle">Fill in your details to create an account.</p>

                    <form onSubmit={handleSignup}>
                        <div className="row g-2 mb-3">
                            <div className="col-md">
                                <div className="form-floating">
                                    <input type="text" className="form-control" id="floatingFirstName" placeholder="First Name" required />
                                    <label htmlFor="floatingFirstName">First Name</label>
                                </div>
                            </div>
                            <div className="col-md">
                                <div className="form-floating">
                                    <input type="text" className="form-control" id="floatingLastName" placeholder="Last Name" required />
                                    <label htmlFor="floatingLastName">Last Name</label>
                                </div>
                            </div>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" required />
                            <label htmlFor="floatingInput">Email address</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="password" className="form-control" id="floatingPassword" placeholder="Password" required />
                            <label htmlFor="floatingPassword">Password</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="password" className="form-control" id="floatingConfirmPassword" placeholder="Confirm Password" required />
                            <label htmlFor="floatingConfirmPassword">Confirm Password</label>
                        </div>

                        <div className="form-check mb-4">
                            <input className="form-check-input" type="checkbox" id="terms" required />
                            <label className="form-check-label text-muted small" htmlFor="terms">
                                I agree to the <a href="#" className="auth-link">Terms of Service</a> and <a href="#" className="auth-link">Privacy Policy</a>
                            </label>
                        </div>

                        <button type="submit" className="btn btn-auth">Create Account</button>
                    </form>

                    <div className="auth-footer">
                        Already have an account? <Link to="/login" className="auth-link">Log In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
