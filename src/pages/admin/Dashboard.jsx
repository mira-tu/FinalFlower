import React from 'react';

const Dashboard = () => {
    return (
        <div>
            <h2 className="mb-4 fw-bold">Dashboard Overview</h2>

            {/* Stats Row */}
            <div className="row">
                <div className="col-md-3">
                    <div className="stat-card">
                        <div>
                            <h6 className="text-muted mb-1">Total Sales</h6>
                            <h3 className="fw-bold mb-0">₱124,500</h3>
                        </div>
                        <div className="stat-icon bg-pink">
                            <i className="fas fa-dollar-sign"></i>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div>
                            <h6 className="text-muted mb-1">New Orders</h6>
                            <h3 className="fw-bold mb-0">45</h3>
                        </div>
                        <div className="stat-icon bg-blue">
                            <i className="fas fa-shopping-cart"></i>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div>
                            <h6 className="text-muted mb-1">Inventory</h6>
                            <h3 className="fw-bold mb-0">1,203</h3>
                        </div>
                        <div className="stat-icon bg-green">
                            <i className="fas fa-box"></i>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card">
                        <div>
                            <h6 className="text-muted mb-1">Pending Requests</h6>
                            <h3 className="fw-bold mb-0">12</h3>
                        </div>
                        <div className="stat-icon bg-orange">
                            <i className="fas fa-clock"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity & Inventory */}
            <div className="row mt-4">
                <div className="col-md-8">
                    <div className="table-card h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0">Recent Orders</h5>
                            <button className="btn btn-sm btn-outline-primary">View All</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Product</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>#ORD-001</td>
                                        <td>Maria Santos</td>
                                        <td>Elegant Bouquet</td>
                                        <td>₱1,200</td>
                                        <td><span className="status-badge status-shipped">Shipped</span></td>
                                    </tr>
                                    <tr>
                                        <td>#ORD-002</td>
                                        <td>Juan Dela Cruz</td>
                                        <td>Rose Arrangement</td>
                                        <td>₱1,500</td>
                                        <td><span className="status-badge status-pending">Pending</span></td>
                                    </tr>
                                    <tr>
                                        <td>#ORD-003</td>
                                        <td>Ana Reyes</td>
                                        <td>Sunflower Set</td>
                                        <td>₱1,400</td>
                                        <td><span className="status-badge status-cancelled">Cancelled</span></td>
                                    </tr>
                                    <tr>
                                        <td>#ORD-004</td>
                                        <td>Pedro Penduko</td>
                                        <td>Custom Bouquet</td>
                                        <td>₱2,000</td>
                                        <td><span className="status-badge status-shipped">Shipped</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="table-card h-100">
                        <h5 className="fw-bold mb-4">Low Stock Alert</h5>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="mb-0">Red Roses</h6>
                                    <small className="text-danger">5 stems left</small>
                                </div>
                                <button className="btn btn-sm btn-light"><i className="fas fa-plus"></i></button>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="mb-0">White Lilies</h6>
                                    <small className="text-warning">12 stems left</small>
                                </div>
                                <button className="btn btn-sm btn-light"><i className="fas fa-plus"></i></button>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="mb-0">Pink Ribbons</h6>
                                    <small className="text-danger">2 rolls left</small>
                                </div>
                                <button className="btn btn-sm btn-light"><i className="fas fa-plus"></i></button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
