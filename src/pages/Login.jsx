import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        
        // Check admin login
        if (email === 'admin@gmail.com' && password === 'admin123') {
            const adminUser = {
                email: 'admin@gmail.com',
                role: 'admin',
                name: 'Admin'
            };
            localStorage.setItem('currentUser', JSON.stringify(adminUser));
            navigate('/admin/dashboard');
            return;
        }
        
        // Check employee login
        const employees = JSON.parse(localStorage.getItem('employees') || '[]');
        const employee = employees.find(emp => emp.email === email && emp.password === password);
        
        if (employee) {
            const employeeUser = {
                email: employee.email,
                role: employee.role,
                name: employee.name
            };
            localStorage.setItem('currentUser', JSON.stringify(employeeUser));
            navigate('/admin/dashboard');
            return;
        }
        
        // Regular user login (for now, just navigate to home)
        navigate('/');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-image">
                    <div className="auth-overlay"></div>
                    <div className="auth-text">
                    <h3>Welcome to</h3>
                    <h2>Jocery's Flower Shop!</h2>
                        <p>We're so happy to see you again.</p>
                    </div>
                </div>
                <div className="auth-form-container">
                    <h2 className="auth-title">Login</h2>
                    <p className="auth-subtitle">Enter your details to access your account.</p>

                    <form onSubmit={handleLogin}>
                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className="form-control"
                                id="floatingInput"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="floatingInput">Email address</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                className="form-control"
                                id="floatingPassword"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="floatingPassword">Password</label>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="rememberMe" />
                                <label className="form-check-label text-muted" htmlFor="rememberMe">
                                    Remember me
                                </label>
                            </div>
                            <a href="#" className="auth-link small text-nowrap">Forgot Password?</a>
                        </div>

                        <button type="submit" className="btn btn-auth">Sign In</button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
