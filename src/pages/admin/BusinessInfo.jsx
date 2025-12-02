import React from 'react';

const BusinessInfo = () => {
    return (
        <div>
            <h2 className="fw-bold mb-4">Business Information</h2>

            <div className="row g-4">
                <div className="col-md-8">
                    {/* General Info */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0 fw-bold">General Information</h5>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Shop Name</label>
                                        <input type="text" className="form-control" defaultValue="Jocery's Flower Shop" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Tagline</label>
                                        <input type="text" className="form-control" defaultValue="Making every moment special" />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">About Us Description</label>
                                    <textarea className="form-control" rows="4" defaultValue="Jocery's Flower Shop was born from a love for flowers..."></textarea>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Shop Address</label>
                                    <input type="text" className="form-control" defaultValue="Zamboanga City, Philippines" />
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Email Address</label>
                                        <input type="email" className="form-control" defaultValue="JoceryFlowerShop@gmail.com" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Phone Number</label>
                                        <input type="text" className="form-control" defaultValue="+63 756 347 901" />
                                    </div>
                                </div>
                                <button className="btn btn-primary">Save Changes</button>
                            </form>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0 fw-bold">Social Media Links</h5>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="input-group mb-3">
                                    <span className="input-group-text"><i className="fab fa-facebook-f"></i></span>
                                    <input type="text" className="form-control" placeholder="Facebook URL" />
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text"><i className="fab fa-instagram"></i></span>
                                    <input type="text" className="form-control" placeholder="Instagram URL" />
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text"><i className="fab fa-twitter"></i></span>
                                    <input type="text" className="form-control" placeholder="Twitter URL" />
                                </div>
                                <button className="btn btn-primary">Update Links</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    {/* Logo & Branding */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0 fw-bold">Logo & Branding</h5>
                        </div>
                        <div className="card-body text-center">
                            <div className="mb-3">
                                <img src="https://via.placeholder.com/150" className="img-thumbnail rounded-circle mb-2" alt="Logo" />
                                <p className="text-muted small">Current Logo</p>
                            </div>
                            <button className="btn btn-outline-primary btn-sm w-100 mb-2">Upload New Logo</button>
                            <button className="btn btn-outline-danger btn-sm w-100">Remove Logo</button>
                        </div>
                    </div>

                    {/* Operating Hours */}
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0 fw-bold">Operating Hours</h5>
                        </div>
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                    <span>Mon - Fri</span>
                                    <input type="text" className="form-control form-control-sm w-50 text-end" defaultValue="8:00 AM - 6:00 PM" />
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                    <span>Saturday</span>
                                    <input type="text" className="form-control form-control-sm w-50 text-end" defaultValue="9:00 AM - 5:00 PM" />
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                    <span>Sunday</span>
                                    <input type="text" className="form-control form-control-sm w-50 text-end" defaultValue="Closed" />
                                </li>
                            </ul>
                            <button className="btn btn-primary w-100 mt-3">Update Hours</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessInfo;
