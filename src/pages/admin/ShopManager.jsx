import React, { useState } from 'react';
import ProductCatalogue from './ProductCatalogue';
import Inventory from './Inventory';

const ShopManager = () => {
    const [activeTab, setActiveTab] = useState('products');

    return (
        <div>
            <h2 className="fw-bold mb-4">Shop Management</h2>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white p-0">
                    <ul className="nav nav-tabs card-header-tabs m-0">
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 py-3 px-4 ${activeTab === 'products' ? 'active fw-bold border-bottom border-3 border-primary' : 'text-muted'}`}
                                onClick={() => setActiveTab('products')}
                            >
                                <i className="fas fa-box-open me-2"></i> Product Catalogue
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link border-0 py-3 px-4 ${activeTab === 'inventory' ? 'active fw-bold border-bottom border-3 border-primary' : 'text-muted'}`}
                                onClick={() => setActiveTab('inventory')}
                            >
                                <i className="fas fa-warehouse me-2"></i> Inventory
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="card-body p-4">
                    {activeTab === 'products' ? <ProductCatalogue /> : <Inventory />}
                </div>
            </div>
        </div>
    );
};

export default ShopManager;
