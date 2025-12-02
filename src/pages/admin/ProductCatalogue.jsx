import React from 'react';

const ProductCatalogue = () => {
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Product Catalogue</h2>
                <button className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i> Add New Product
                </button>
            </div>

            <div className="row g-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="col-md-3 col-sm-6">
                        <div className="card h-100 border-0 shadow-sm">
                            <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                                <img
                                    src={`/Pictures/HOME${(item % 4) + 1}.jpg`}
                                    className="card-img-top w-100 h-100"
                                    style={{ objectFit: 'cover' }}
                                    alt="Product"
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/200'}
                                />
                                <div className="position-absolute top-0 end-0 p-2">
                                    <span className="badge bg-white text-dark shadow-sm">In Stock</span>
                                </div>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title fw-bold">Elegant Bouquet {item}</h5>
                                <p className="text-muted small mb-2">Category: Wedding</p>
                                <h6 className="text-primary fw-bold mb-3">₱1,200.00</h6>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-outline-primary flex-grow-1">Edit</button>
                                    <button className="btn btn-sm btn-outline-danger"><i className="fas fa-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductCatalogue;
