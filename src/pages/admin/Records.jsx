import React from 'react';

const Records = () => {
    return (
        <div>
            <h2 className="fw-bold mb-4">Transaction History</h2>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label small text-muted">Date Range</label>
                            <select className="form-select form-select-sm">
                                <option>Last 30 Days</option>
                                <option>This Month</option>
                                <option>Last Month</option>
                                <option>Custom Range</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small text-muted">Type</label>
                            <select className="form-select form-select-sm">
                                <option>All Transactions</option>
                                <option>Sales</option>
                                <option>Refunds</option>
                                <option>Expenses</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small text-muted">Search</label>
                            <input type="text" className="form-control form-control-sm" placeholder="Search by Order ID or Customer" />
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                            <button className="btn btn-primary btn-sm w-100">Filter</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="table-card">
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Date & Time</th>
                                <th>Transaction ID</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Nov 24, 2024 <small className="text-muted d-block">10:30 AM</small></td>
                                <td>#TRX-9823</td>
                                <td><span className="badge bg-success-subtle text-success">Sale</span></td>
                                <td>Order #ORD-001 Payment</td>
                                <td className="fw-bold text-success">+₱1,200.00</td>
                                <td>Completed</td>
                            </tr>
                            <tr>
                                <td>Nov 23, 2024 <small className="text-muted d-block">02:15 PM</small></td>
                                <td>#TRX-9822</td>
                                <td><span className="badge bg-danger-subtle text-danger">Expense</span></td>
                                <td>Inventory Restock (Roses)</td>
                                <td className="fw-bold text-danger">-₱5,000.00</td>
                                <td>Completed</td>
                            </tr>
                            <tr>
                                <td>Nov 23, 2024 <small className="text-muted d-block">09:00 AM</small></td>
                                <td>#TRX-9821</td>
                                <td><span className="badge bg-success-subtle text-success">Sale</span></td>
                                <td>Order #ORD-002 Payment</td>
                                <td className="fw-bold text-success">+₱1,500.00</td>
                                <td>Completed</td>
                            </tr>
                            <tr>
                                <td>Nov 22, 2024 <small className="text-muted d-block">04:45 PM</small></td>
                                <td>#TRX-9820</td>
                                <td><span className="badge bg-warning-subtle text-warning">Refund</span></td>
                                <td>Order #ORD-003 Refund</td>
                                <td className="fw-bold text-danger">-₱1,400.00</td>
                                <td>Processed</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Records;
