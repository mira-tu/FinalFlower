import React, { useState } from 'react';
import Queue from './Queue';
import Records from './Records';

const OrderManager = () => {
    const [activeTab, setActiveTab] = useState('queue');

    return (
        <div>
            <h2 className="fw-bold mb-4">Order Management</h2>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white p-0">
                    <ul className="nav nav-tabs card-header-tabs m-0">
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 py-3 px-4 ${activeTab === 'queue' ? 'active fw-bold border-bottom border-3 border-primary' : 'text-muted'}`}
                                onClick={() => setActiveTab('queue')}
                            >
                                <i className="fas fa-clipboard-list me-2"></i> Active Queue
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 py-3 px-4 ${activeTab === 'records' ? 'active fw-bold border-bottom border-3 border-primary' : 'text-muted'}`}
                                onClick={() => setActiveTab('records')}
                            >
                                <i className="fas fa-history me-2"></i> Transaction History
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="card-body p-4">
                    {activeTab === 'queue' ? <Queue /> : <Records />}
                </div>
            </div>
        </div>
    );
};

export default OrderManager;
