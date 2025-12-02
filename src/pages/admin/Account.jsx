import React from 'react';

const Account = () => {
    return (
        <div>
            <h2 className="mb-4 fw-bold">My Account</h2>

            <div className="card border-0 shadow-sm mb-4">
                <div className="profile-header">
                    <div className="profile-avatar bg-secondary d-flex align-items-center justify-content-center">
                        <i className="fas fa-user fa-3x text-white"></i>
                    </div>
                </div>
                <div className="card-body profile-body text-center">
                    <h4 className="fw-bold">Jocery's Admin</h4>
                    <p className="text-muted">Administrator</p>
                    <div className="d-flex justify-content-center gap-2 mb-3">
                        <button className="btn btn-outline-primary btn-sm">Edit Profile</button>
                        <button className="btn btn-outline-danger btn-sm">Change Password</button>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white py-3">
                            <h6 className="mb-0 fw-bold">Shop Settings</h6>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Shop Name</label>
                                    <input type="text" className="form-control" defaultValue="Jocery's Flower Shop" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Contact Number</label>
                                    <input type="text" className="form-control" defaultValue="+63 756 347 901" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email Address</label>
                                    <input type="email" className="form-control" defaultValue="JoceryFlowerShop@gmail.com" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Shop Address</label>
                                    <textarea className="form-control" rows="2" defaultValue="Zamboanga City, Philippines"></textarea>
                                </div>
                                <button className="btn btn-primary w-100">Save Changes</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white py-3">
                            <h6 className="mb-0 fw-bold">Notifications</h6>
                        </div>
                        <div className="card-body">
                            <div className="list-group list-group-flush">
                                <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-0">New Order Alerts</h6>
                                        <small className="text-muted">Get notified when a new order is placed</small>
                                    </div>
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" defaultChecked />
                                    </div>
                                </div>
                                <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-0">Low Stock Alerts</h6>
                                        <small className="text-muted">Get notified when inventory is low</small>
                                    </div>
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" defaultChecked />
                                    </div>
                                </div>
                                <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-0">Message Notifications</h6>
                                        <small className="text-muted">Get notified when you receive a message</small>
                                    </div>
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" defaultChecked />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
