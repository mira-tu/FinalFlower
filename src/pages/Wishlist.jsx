import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Shop.css';

const Wishlist = ({ cart, setCart }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            try {
                setWishlistItems(JSON.parse(savedWishlist));
            } catch (e) {
                console.error('Error parsing wishlist:', e);
            }
        }
    }, []);

    const saveWishlist = (items) => {
        setWishlistItems(items);
        localStorage.setItem('wishlist', JSON.stringify(items));
    };

    const removeFromWishlist = (itemName) => {
        saveWishlist(wishlistItems.filter(item => item.name !== itemName));
    };

    const addToCart = (item) => {
        const existingItem = cart.find(i => i.name === item.name);
        let newCart;
        if (existingItem) {
            newCart = cart.map(i => 
                i.name === item.name ? { ...i, qty: (i.qty || 1) + 1 } : i
            );
        } else {
            newCart = [...cart, { name: item.name, price: item.price, image: item.image, qty: 1 }];
        }
        setCart(newCart);
        removeFromWishlist(item.name);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
    };

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingTop: '90px', paddingBottom: '40px' }}>
            {/* Popup */}
            {showPopup && (
                <div style={{
                    position: 'fixed',
                    top: '100px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
                    color: 'white',
                    padding: '14px 28px',
                    borderRadius: '50px',
                    boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: '600',
                    animation: 'slideDown 0.4s ease'
                }}>
                    <i className="fas fa-check-circle me-2"></i>
                    Added to Cart
                </div>
            )}

            <div className="container">
                {/* Header */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="d-flex align-items-center">
                        <i className="fas fa-heart me-3" style={{ color: 'var(--shop-pink)', fontSize: '1.5rem' }}></i>
                        <div>
                            <h4 className="fw-bold mb-0">My Wishlist</h4>
                            <small className="text-muted">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}</small>
                        </div>
                    </div>
                    <Link to="/" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
                        <i className="fas fa-arrow-left me-2"></i>Back to Shop
                    </Link>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                        <i className="far fa-heart" style={{ fontSize: '4rem', color: '#ddd' }}></i>
                        <h5 className="mt-4 text-muted">Your wishlist is empty</h5>
                        <p className="text-muted mb-4">Save items you love by tapping the heart icon</p>
                        <Link to="/" className="btn rounded-pill px-4" style={{ background: 'var(--shop-pink)', color: 'white' }}>
                            Explore Products
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-4 shadow-sm overflow-hidden">
                        {wishlistItems.map((item, index) => (
                            <div 
                                key={index} 
                                className="d-flex align-items-center p-3"
                                style={{ borderBottom: index < wishlistItems.length - 1 ? '1px solid #eee' : 'none' }}
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="rounded-3"
                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/80'}
                                />
                                <div className="ms-3 flex-grow-1">
                                    <h6 className="fw-bold mb-1">{item.name}</h6>
                                    <span className="fw-bold" style={{ color: 'var(--shop-pink)', fontSize: '1.1rem' }}>
                                        ₱{item.price?.toLocaleString()}
                                    </span>
                                </div>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-sm rounded-pill px-3"
                                        style={{ background: '#4caf50', color: 'white', border: 'none' }}
                                        onClick={() => addToCart(item)}
                                    >
                                        <i className="fas fa-cart-plus me-1"></i>Add
                                    </button>
                                    <button
                                        className="btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
                                        style={{ width: '36px', height: '36px' }}
                                        onClick={() => removeFromWishlist(item.name)}
                                        title="Remove"
                                    >
                                        <i className="fas fa-trash-alt" style={{ fontSize: '0.8rem' }}></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
