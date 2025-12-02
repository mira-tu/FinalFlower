import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../styles/Shop.css';

import allSouls1 from '../assets/pictures/occasions/ALLSOULSDAY1.png';
import grad1 from '../assets/pictures/occasions/GRADUATION1.png';
import mothers1 from '../assets/pictures/occasions/MOTHERSDAY1.png';
import val1 from '../assets/pictures/occasions/VALENTINES1.png';
import sympathy1 from '../assets/pictures/occasions/SYMPATHY1.png';

const products = {
    'as1': { id: 'as1', name: 'Peaceful Tribute', price: 1200, originalPrice: 1500, category: 'All Souls Day', image: allSouls1, rating: 4.8, sold: 156, stock: 25 },
    'gr1': { id: 'gr1', name: 'Victory Bloom', price: 1500, originalPrice: 1800, category: 'Graduation', image: grad1, rating: 4.9, sold: 243, stock: 18 },
    'md1': { id: 'md1', name: "Mom's Delight", price: 2000, originalPrice: 2400, category: 'Mothers Day', image: mothers1, rating: 5.0, sold: 512, stock: 30 },
    'v1': { id: 'v1', name: "Valentine's Passion", price: 2500, originalPrice: 3000, category: 'Valentines', image: val1, rating: 4.7, sold: 389, stock: 15 },
    'sy1': { id: 'sy1', name: 'Deepest Sympathy', price: 1400, originalPrice: 1700, category: 'Sympathy', image: sympathy1, rating: 4.6, sold: 98, stock: 20 },
};

const reviews = [
    { id: 1, user: 'Maria Santos', avatar: 'https://i.pravatar.cc/100?img=1', rating: 5, date: '2024-01-15', text: 'Absolutely stunning arrangement! The flowers were fresh and beautifully arranged. Perfect for my mothers birthday.' },
    { id: 2, user: 'Juan dela Cruz', avatar: 'https://i.pravatar.cc/100?img=3', rating: 4, date: '2024-01-10', text: 'Great quality flowers. Delivery was on time. Would definitely order again.' },
    { id: 3, user: 'Ana Reyes', avatar: 'https://i.pravatar.cc/100?img=5', rating: 5, date: '2024-01-05', text: 'The bouquet exceeded my expectations! My wife loved it. Thank you Jocerys!' },
];

const ProductDetail = ({ addToCart }) => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    
    const product = products[productId] || products['md1'];

    const handleQuantityChange = (change) => {
        const newQty = quantity + change;
        if (newQty >= 1 && newQty <= product.stock) {
            setQuantity(newQty);
        }
    };

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product.name, product.price, product.image);
        }
        navigate('/cart');
    };

    const handleBuyNow = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product.name, product.price, product.image);
        }
        navigate('/checkout');
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <i key={i} className={`fas fa-star ${i < Math.floor(rating) ? '' : 'text-muted'}`}></i>
        ));
    };

    return (
        <div className="product-detail-container">
            <div className="container">
                <nav aria-label="breadcrumb" className="mb-3">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/">{product.category}</Link></li>
                        <li className="breadcrumb-item active">{product.name}</li>
                    </ol>
                </nav>

                <div className="row">
                    <div className="col-lg-5">
                        <div className="product-detail-card">
                            <div className="product-gallery">
                                <img src={product.image} alt={product.name} className="main-product-image" />
                                <div className="thumbnail-gallery">
                                    <img src={product.image} alt="" className="thumbnail-item active" />
                                    <img src={product.image} alt="" className="thumbnail-item" />
                                    <img src={product.image} alt="" className="thumbnail-item" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-7">
                        <div className="product-detail-card">
                            <div className="product-info">
                                <h1>{product.name}</h1>
                                
                                <div className="product-rating">
                                    <span className="rating-stars">{renderStars(product.rating)}</span>
                                    <span className="rating-count">{product.rating} ({reviews.length} reviews)</span>
                                    <span className="sold-count">{product.sold} sold</span>
                                </div>

                                <div className="product-price-box">
                                    <span className="current-price">₱{product.price.toLocaleString()}</span>
                                </div>

                                <div className="quantity-selector">
                                    <span className="option-label mb-0">Quantity</span>
                                    <div className="qty-controls">
                                        <button className="qty-btn" onClick={() => handleQuantityChange(-1)}>-</button>
                                        <input type="text" className="qty-input" value={quantity} readOnly />
                                        <button className="qty-btn" onClick={() => handleQuantityChange(1)}>+</button>
                                    </div>
                                    <span className="stock-info">{product.stock} pieces available</span>
                                </div>

                                <div className="action-buttons">
                                    <button className="btn-add-to-cart" onClick={handleAddToCart}>
                                        <i className="fas fa-cart-plus me-2"></i>Add to Cart
                                    </button>
                                    <button className="btn-buy-now" onClick={handleBuyNow}>
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="product-details-section">
                    <div className="details-tabs">
                        <button 
                            className={`detail-tab ${activeTab === 'description' ? 'active' : ''}`}
                            onClick={() => setActiveTab('description')}
                        >
                            Description
                        </button>
                        <button 
                            className={`detail-tab ${activeTab === 'reviews' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Reviews ({reviews.length})
                        </button>
                    </div>

                    {activeTab === 'description' && (
                        <div className="description-content">
                            <p>A beautiful hand-crafted floral arrangement perfect for {product.category.toLowerCase()} celebrations. Our expert florists carefully select the freshest blooms to create this stunning masterpiece.</p>
                            <h5 className="mt-4">What's Included:</h5>
                            <ul>
                                <li>Premium fresh flowers</li>
                                <li>Elegant wrapper of your choice</li>
                                <li>Beautiful ribbon finishing</li>
                                <li>Complimentary message card</li>
                                <li>Care instructions</li>
                            </ul>
                            <h5 className="mt-4">Care Tips:</h5>
                            <ul>
                                <li>Keep flowers in a cool area away from direct sunlight</li>
                                <li>Change water every 2-3 days</li>
                                <li>Trim stems at an angle for better water absorption</li>
                            </ul>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="reviews-content">
                            {reviews.map(review => (
                                <div key={review.id} className="review-item">
                                    <div className="review-header">
                                        <img src={review.avatar} alt={review.user} className="review-avatar" />
                                        <div>
                                            <div className="review-username">{review.user}</div>
                                            <div className="review-date">{review.date}</div>
                                        </div>
                                    </div>
                                    <div className="review-stars">{renderStars(review.rating)}</div>
                                    <p className="review-text">{review.text}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
