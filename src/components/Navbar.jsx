import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ cartCount }) => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if mobile on mount and resize
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Load notifications from localStorage
        const loadNotifications = () => {
            const savedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
            setNotifications(savedNotifications);
            setUnreadCount(savedNotifications.filter(n => !n.read).length);
        };

        loadNotifications();

        // Listen for storage changes (when new notifications are added from other tabs)
        const handleStorageChange = () => {
            loadNotifications();
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Also check periodically for changes (for same-tab updates)
        const interval = setInterval(loadNotifications, 1000);

        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (showNotifications && !event.target.closest('.notification-wrapper')) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);

    const handleNotificationClick = (notification) => {
        // Mark as read
        const updatedNotifications = notifications.map(n => 
            n.id === notification.id ? { ...n, read: true } : n
        );
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        setNotifications(updatedNotifications);
        setUnreadCount(updatedNotifications.filter(n => !n.read).length);

        // Navigate if there's a link
        if (notification.link) {
            navigate(notification.link);
            setShowNotifications(false);
        }
    };

    const markAllAsRead = () => {
        const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        setNotifications(updatedNotifications);
        setUnreadCount(0);
    };

    const clearAllNotifications = () => {
        localStorage.setItem('notifications', JSON.stringify([]));
        setNotifications([]);
        setUnreadCount(0);
    };

    return (
        <>
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
                                    <li><Link className="dropdown-item" to="/special-order">Special Orders</Link></li>
                                </ul>
                            </li>
                        </ul>
                        <div className="nav-icons d-flex align-items-center">
                            <Link to="/wishlist" className="btn-icon">
                                <i className="fa-regular fa-heart"></i>
                            </Link>
                            <div className="notification-wrapper position-relative">
                                <button 
                                    className="btn-icon border-0 bg-transparent p-0"
                                    onClick={() => {
                                        if (isMobile) {
                                            navigate('/notifications');
                                        } else {
                                            setShowNotifications(!showNotifications);
                                        }
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="fa-regular fa-bell"></i>
                                    {unreadCount > 0 && (
                                        <span className="badge-count">{unreadCount}</span>
                                    )}
                                </button>
                                {showNotifications && !isMobile && (
                                    <div className="notification-dropdown">
                                        <div className="notification-header">
                                            <h6 className="mb-0">Notifications</h6>
                                            <div className="notification-actions">
                                                {unreadCount > 0 && (
                                                    <button 
                                                        className="btn-link-small"
                                                        onClick={markAllAsRead}
                                                    >
                                                        Mark all as read
                                                    </button>
                                                )}
                                                {notifications.length > 0 && (
                                                    <button 
                                                        className="btn-link-small text-danger"
                                                        onClick={clearAllNotifications}
                                                    >
                                                        Clear all
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="notification-list">
                                            {notifications.length === 0 ? (
                                                <div className="notification-empty">
                                                    <i className="fa-regular fa-bell-slash"></i>
                                                    <p>No notifications</p>
                                                </div>
                                            ) : (
                                                notifications.slice(0, 10).map(notification => (
                                                    <div 
                                                        key={notification.id}
                                                        className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                                        onClick={() => handleNotificationClick(notification)}
                                                    >
                                                        <div className="notification-icon">
                                                            <i className={`fas ${notification.icon || 'fa-info-circle'}`}></i>
                                                        </div>
                                                        <div className="notification-content">
                                                            <div className="notification-title">{notification.title}</div>
                                                            <div className="notification-message">{notification.message}</div>
                                                            <div className="notification-time">
                                                                {new Date(notification.timestamp).toLocaleString('en-PH', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </div>
                                                        </div>
                                                        {!notification.read && (
                                                            <div className="notification-dot"></div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        {notifications.length > 0 && (
                                            <div className="notification-footer">
                                                <Link to="/notifications" onClick={() => setShowNotifications(false)}>
                                                    View all notifications
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
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
        </>
    );
};

export default Navbar;
