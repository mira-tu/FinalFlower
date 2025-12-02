import React from 'react';

const Inventory = () => {
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Inventory Management</h2>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary">
                        <i className="fas fa-file-export me-2"></i> Export
                    </button>
                    <button className="btn btn-primary">
                        <i className="fas fa-plus me-2"></i> Add Material
                    </button>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm p-3 text-center">
                        <h6 className="text-muted">Total Items</h6>
                        <h3 className="fw-bold mb-0">1,203</h3>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm p-3 text-center">
                        <h6 className="text-muted">Low Stock</h6>
                        <h3 className="fw-bold text-danger mb-0">15</h3>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm p-3 text-center">
                        <h6 className="text-muted">Out of Stock</h6>
                        <h3 className="fw-bold text-secondary mb-0">2</h3>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm p-3 text-center">
                        <h6 className="text-muted">Total Value</h6>
                        <h3 className="fw-bold text-success mb-0">₱45,200</h3>
                    </div>
                </div>
            </div>

            <div className="table-card">
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Item Name</th>
                                <th>Category</th>
                                <th>Stock Level</th>
                                <th>Status</th>
                                <th>Last Updated</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Red Roses (Stem)</td>
                                <td>Flowers</td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <span className="me-2 fw-bold">5</span>
                                        <div className="progress flex-grow-1" style={{ height: '6px', width: '100px' }}>
                                            <div className="progress-bar bg-danger" style={{ width: '10%' }}></div>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="badge bg-danger-subtle text-danger">Low Stock</span></td>
                                <td>Today, 10:00 AM</td>
                                <td><button className="btn btn-sm btn-light">Restock</button></td>
                            </tr>
                            <tr>
                                <td>White Lilies (Stem)</td>
                                <td>Flowers</td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <span className="me-2 fw-bold">12</span>
                                        <div className="progress flex-grow-1" style={{ height: '6px', width: '100px' }}>
                                            <div className="progress-bar bg-warning" style={{ width: '25%' }}></div>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="badge bg-warning-subtle text-warning">Low Stock</span></td>
                                <td>Yesterday</td>
                                <td><button className="btn btn-sm btn-light">Restock</button></td>
                            </tr>
                            <tr>
                                <td>Pink Satin Ribbon (Roll)</td>
                                <td>Accessories</td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <span className="me-2 fw-bold">45</span>
                                        <div className="progress flex-grow-1" style={{ height: '6px', width: '100px' }}>
                                            <div className="progress-bar bg-success" style={{ width: '80%' }}></div>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="badge bg-success-subtle text-success">In Stock</span></td>
                                <td>Nov 20, 2024</td>
                                <td><button className="btn btn-sm btn-light">Restock</button></td>
                            </tr>
                            <tr>
                                <td>Floral Foam (Block)</td>
                                <td>Supplies</td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <span className="me-2 fw-bold">100</span>
                                        <div className="progress flex-grow-1" style={{ height: '6px', width: '100px' }}>
                                            <div className="progress-bar bg-success" style={{ width: '100%' }}></div>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="badge bg-success-subtle text-success">In Stock</span></td>
                                <td>Nov 18, 2024</td>
                                <td><button className="btn btn-sm btn-light">Restock</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
