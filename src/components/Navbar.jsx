import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ cartCount }) => {
    return (
        <nav className="navbar navbar-expand-lg fixed-top">
            <div className="container-fluid px-5">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <span>Jocery's Flower Shop</span>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item"><Link className="nav-link active" to="/">Home</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Services
                            </a>
                            <ul className="dropdown-menu services-menu border-0 shadow-sm">
                                <li><Link className="dropdown-item" to="/book-event">Booking for an Event</Link></li>
                                <li><Link className="dropdown-item" to="/customized">Customized Bouquets</Link></li>
                                <li><Link className="dropdown-item" to="/special-order">Special Add-ons</Link></li>
                            </ul>
                        </li>
                    </ul>
                    <div className="nav-icons d-flex align-items-center">
                        <Link to="/wishlist" className="btn-icon">
                            <i className="fa-regular fa-heart"></i>
                        </Link>
                        <Link to="/cart" className="btn-icon">
                            <i className="fa-solid fa-cart-shopping"></i>
                            <span className="badge-count">{cartCount}</span>
                        </Link>
                        <Link to="/profile" className="btn-icon"><i className="fa-regular fa-user"></i></Link>
                        <Link to="/login" className="btn btn-outline-danger ms-3 rounded-pill px-4 btn-sm">Login</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
