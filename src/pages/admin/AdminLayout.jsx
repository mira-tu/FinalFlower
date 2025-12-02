import React, { useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import '../../styles/Admin.css';

const AdminLayout = () => {
    const location = useLocation();

    useEffect(() => {
        // Remove padding-top from body for admin layout
        document.body.style.paddingTop = '0px';
        return () => {
            // Restore default padding-top (defined in CSS)
            document.body.style.paddingTop = '';
        };
    }, []);

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <div className="admin-sidebar">
                <div className="sidebar-header">
                    <h3>Jocery's Admin</h3>
                </div>
                <nav className="admin-nav">
                    <Link to="/admin/dashboard" className={`admin-nav-link ${isActive('/admin/dashboard')}`}>
                        <i className="fas fa-tachometer-alt"></i> Dashboard
                    </Link>
                    <Link to="/admin/shop" className={`admin-nav-link ${isActive('/admin/shop')}`}>
                        <i className="fas fa-store"></i> Shop Manager
                    </Link>
                    <Link to="/admin/orders" className={`admin-nav-link ${isActive('/admin/orders')}`}>
                        <i className="fas fa-clipboard-list"></i> Order Management
                    </Link>
                    <Link to="/admin/messages" className={`admin-nav-link ${isActive('/admin/messages')}`}>
                        <i className="fas fa-comments"></i> Messages
                    </Link>
                    <Link to="/admin/settings" className={`admin-nav-link ${isActive('/admin/settings')}`}>
                        <i className="fas fa-cog"></i> Settings
                    </Link>
                    <Link to="/" className="admin-nav-link mt-4 text-danger">
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="admin-content">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
