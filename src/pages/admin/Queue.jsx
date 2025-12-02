import React from 'react';

const Queue = () => {
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Order Queue</h2>
                <div className="btn-group">
                    <button className="btn btn-outline-primary active">Pending Requests</button>
                    <button className="btn btn-outline-primary">Processing</button>
                    <button className="btn btn-outline-primary">To Deliver</button>
                </div>
            </div>

            {/* Due Soon Alert */}
            <div className="alert alert-warning d-flex align-items-center mb-4" role="alert">
                <i className="fas fa-exclamation-triangle me-2 text-warning"></i>
                <div>
                    <strong>Attention:</strong> 3 orders are due within the next 2 hours.
                </div>
            </div>

            <div className="row g-4">
                {/* Pending Request Card */}
                <div className="col-md-6 col-lg-4">
                    <div className="card border-0 shadow-sm h-100 border-start border-4 border-warning">
                        <div className="card-body">
                            <div className="d-flex justify-content-between mb-3">
                                <span className="badge bg-warning text-dark">Pending Approval</span>
                                <small className="text-muted">Just now</small>
                            </div>
                            <h5 className="fw-bold mb-1">Custom Bouquet Request</h5>
                            <p className="text-muted mb-3">Customer: Maria Santos</p>

                            <div className="bg-light p-3 rounded mb-3">
                                <small className="d-block text-muted mb-1">Request Details:</small>
                                <p className="mb-0 small">"I want a mix of red roses and white lilies with a blue ribbon. Budget is around 2k."</p>
                            </div>

                            <div className="d-flex gap-2">
                                <button className="btn btn-success flex-grow-1">Accept</button>
                                <button className="btn btn-outline-danger flex-grow-1">Decline</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-4">
                    <div className="card border-0 shadow-sm h-100 border-start border-4 border-warning">
                        <div className="card-body">
                            <div className="d-flex justify-content-between mb-3">
                                <span className="badge bg-warning text-dark">Pending Approval</span>
                                <small className="text-muted">15 mins ago</small>
                            </div>
                            <h5 className="fw-bold mb-1">Event Consultation</h5>
                            <p className="text-muted mb-3">Customer: Juan Dela Cruz</p>

                            <div className="bg-light p-3 rounded mb-3">
                                <small className="d-block text-muted mb-1">Event Type: Wedding</small>
                                <p className="mb-0 small">"Looking for floral arrangements for a church wedding on Dec 15."</p>
                            </div>

                            <div className="d-flex gap-2">
                                <button className="btn btn-success flex-grow-1">Accept</button>
                                <button className="btn btn-outline-danger flex-grow-1">Decline</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Processing Order Card */}
                <div className="col-md-6 col-lg-4">
                    <div className="card border-0 shadow-sm h-100 border-start border-4 border-info">
                        <div className="card-body">
                            <div className="d-flex justify-content-between mb-3">
                                <span className="badge bg-info text-white">Processing</span>
                                <small className="text-danger fw-bold">Due in 1h</small>
                            </div>
                            <h5 className="fw-bold mb-1">Order #ORD-005</h5>
                            <p className="text-muted mb-3">Customer: Ana Reyes</p>

                            <ul className="list-unstyled small mb-3">
                                <li className="mb-1"><i className="fas fa-check-circle text-success me-2"></i>Flowers Selected</li>
                                <li className="mb-1"><i className="fas fa-check-circle text-success me-2"></i>Payment Verified</li>
                                <li className="mb-1"><i className="fas fa-spinner fa-spin text-primary me-2"></i>Arrangement in Progress</li>
                            </ul>

                            <button className="btn btn-outline-primary w-100">Mark as Ready</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Queue;
