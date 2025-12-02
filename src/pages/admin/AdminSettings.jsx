import React, { useState } from 'react';
import Account from './Account';
import BusinessInfo from './BusinessInfo';
import Roles from './Roles';

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('account');

    return (
        <div>
            <h2 className="fw-bold mb-4">Settings</h2>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white p-0">
                    <ul className="nav nav-tabs card-header-tabs m-0">
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 py-3 px-4 ${activeTab === 'account' ? 'active fw-bold border-bottom border-3 border-primary' : 'text-muted'}`}
                                onClick={() => setActiveTab('account')}
                            >
                                <i className="fas fa-user-circle me-2"></i> My Account
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 py-3 px-4 ${activeTab === 'business' ? 'active fw-bold border-bottom border-3 border-primary' : 'text-muted'}`}
                                onClick={() => setActiveTab('business')}
                            >
                                <i className="fas fa-info-circle me-2"></i> Business Info
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 py-3 px-4 ${activeTab === 'roles' ? 'active fw-bold border-bottom border-3 border-primary' : 'text-muted'}`}
                                onClick={() => setActiveTab('roles')}
                            >
                                <i className="fas fa-users-cog me-2"></i> Employees & Roles
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="card-body p-4">
                    {activeTab === 'account' && <Account />}
                    {activeTab === 'business' && <BusinessInfo />}
                    {activeTab === 'roles' && <Roles />}
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
