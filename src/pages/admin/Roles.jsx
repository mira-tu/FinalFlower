import React from 'react';

const Roles = () => {
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Employee Management</h2>
                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addEmployeeModal">
                    <i className="fas fa-plus me-2"></i> Add New Employee
                </button>
            </div>

            <div className="table-card">
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Employee ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>#EMP-001</td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <div className="bg-secondary rounded-circle me-2 d-flex align-items-center justify-content-center text-white" style={{ width: '35px', height: '35px' }}>JD</div>
                                        <span>Jane Doe</span>
                                    </div>
                                </td>
                                <td>jane.doe@jocery.com</td>
                                <td><span className="badge bg-info text-dark">Florist</span></td>
                                <td><span className="badge bg-success">Active</span></td>
                                <td>
                                    <button className="btn btn-sm btn-outline-primary me-1"><i className="fas fa-edit"></i></button>
                                    <button className="btn btn-sm btn-outline-danger"><i className="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>#EMP-002</td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <div className="bg-secondary rounded-circle me-2 d-flex align-items-center justify-content-center text-white" style={{ width: '35px', height: '35px' }}>JS</div>
                                        <span>John Smith</span>
                                    </div>
                                </td>
                                <td>john.smith@jocery.com</td>
                                <td><span className="badge bg-warning text-dark">Delivery</span></td>
                                <td><span className="badge bg-success">Active</span></td>
                                <td>
                                    <button className="btn btn-sm btn-outline-primary me-1"><i className="fas fa-edit"></i></button>
                                    <button className="btn btn-sm btn-outline-danger"><i className="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Employee Modal (Static) */}
            <div className="modal fade" id="addEmployeeModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add New Employee</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Full Name</label>
                                    <input type="text" className="form-control" placeholder="Enter full name" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email Address</label>
                                    <input type="email" className="form-control" placeholder="Enter email" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Role</label>
                                    <select className="form-select">
                                        <option>Select Role</option>
                                        <option value="florist">Florist</option>
                                        <option value="delivery">Delivery Driver</option>
                                        <option value="manager">Manager</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input type="password" className="form-control" placeholder="Create password" />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Create Account</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Roles;
