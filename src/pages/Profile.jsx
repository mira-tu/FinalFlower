import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Shop.css';

const orderTabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'To Pay' },
    { id: 'processing', label: 'Processing' },
    { id: 'ready_for_pickup', label: 'Ready for Pickup' },
    { id: 'shipped', label: 'To Receive' },
    { id: 'claimed', label: 'Claimed' },
    { id: 'delivered', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
];

const menuItems = [
    { id: 'orders', label: 'My Orders', icon: 'fa-box' },
    { id: 'messages', label: 'Messages', icon: 'fa-comments' },
    { id: 'addresses', label: 'Addresses', icon: 'fa-map-marker-alt' },
    { id: 'settings', label: 'Account Settings', icon: 'fa-cog' },
];

const mockUserAddresses = [
    { id: 1, label: 'Home', name: 'Maria Santos', phone: '+63 912 345 6789', address: '123 Sampaguita St., Brgy. Maligaya, Quezon City, Metro Manila 1100', isDefault: true },
    { id: 2, label: 'Office', name: 'Maria Santos', phone: '+63 912 345 6789', address: '456 Rizal Avenue, Makati Business District, Makati City, Metro Manila 1200', isDefault: false },
];

const Profile = () => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('orders');
    const [activeOrderTab, setActiveOrderTab] = useState('all');
    const [orders, setOrders] = useState([]);
    const [addresses, setAddresses] = useState(mockUserAddresses);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const user = {
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
        phone: '+63 912 345 6789',
        memberSince: 'January 2024'
    };

    useEffect(() => {
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const enrichedOrders = savedOrders.map((order, index) => ({
            ...order,
            status: getOrderStatus(order.date, order.deliveryMethod || 'delivery')
        }));
        setOrders(enrichedOrders);

        // Load messages
        const savedMessages = JSON.parse(localStorage.getItem('userMessages') || '[]');
        if (savedMessages.length === 0) {
            // Add welcome message from shop
            const welcomeMsg = {
                id: 1,
                sender: 'shop',
                text: 'Welcome to Jocery\'s Flower Shop! How can we help you today? Feel free to ask about our products, orders, or any inquiries.',
                time: new Date().toISOString()
            };
            setMessages([welcomeMsg]);
            localStorage.setItem('userMessages', JSON.stringify([welcomeMsg]));
        } else {
            setMessages(savedMessages);
        }
    }, []);

    const getOrderStatus = (orderDate, deliveryMethod) => {
        const date = new Date(orderDate);
        const now = new Date();
        const hours = (now - date) / (1000 * 60 * 60);
        
        if (hours < 2) return 'pending';
        if (hours < 8) return 'processing';
        
        // Different statuses for pickup vs delivery
        if (deliveryMethod === 'pickup') {
            if (hours < 12) return 'ready_for_pickup';
            if (hours < 24) return 'claimed';
            return 'delivered'; // Completed pickup
        } else {
            // Delivery orders
            if (hours < 24) return 'shipped';
            return 'delivered';
        }
    };

    const filteredOrders = activeOrderTab === 'all' 
        ? orders 
        : orders.filter(o => o.status === activeOrderTab);

    const getStatusBadgeClass = (status) => {
        const classes = {
            pending: 'pending',
            processing: 'processing',
            ready_for_pickup: 'processing', // Use processing style for ready for pickup
            shipped: 'shipped',
            claimed: 'shipped', // Use shipped style for claimed
            delivered: 'delivered',
            cancelled: 'cancelled'
        };
        return classes[status] || 'pending';
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: 'To Pay',
            processing: 'Preparing',
            ready_for_pickup: 'Ready for Pickup',
            shipped: 'Shipping',
            claimed: 'Claimed',
            delivered: 'Completed',
            cancelled: 'Cancelled'
        };
        return labels[status] || status;
    };

    const handleTrackOrder = (orderId) => {
        navigate(`/order-tracking/${orderId}`);
    };

    const handleReorder = (order) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        order.items.forEach(item => {
            const existingItem = cart.find(i => i.name === item.name);
            if (existingItem) {
                existingItem.qty += item.qty || 1;
            } else {
                cart.push({ ...item });
            }
        });
        localStorage.setItem('cart', JSON.stringify(cart));
        navigate('/cart');
    };

    const sendMessage = () => {
        if (!newMessage.trim()) return;
        
        const userMsg = {
            id: messages.length + 1,
            sender: 'user',
            text: newMessage.trim(),
            time: new Date().toISOString()
        };
        
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        localStorage.setItem('userMessages', JSON.stringify(updatedMessages));
        setNewMessage('');

        // Simulate shop auto-reply after 1 second
        setTimeout(() => {
            const replies = [
                "Thank you for your message! Our team will get back to you shortly.",
                "We appreciate your inquiry! Please allow us some time to respond.",
                "Got it! One of our staff will assist you soon.",
                "Thank you for reaching out! We'll respond as soon as possible."
            ];
            const shopReply = {
                id: updatedMessages.length + 1,
                sender: 'shop',
                text: replies[Math.floor(Math.random() * replies.length)],
                time: new Date().toISOString()
            };
            const newMessages = [...updatedMessages, shopReply];
            setMessages(newMessages);
            localStorage.setItem('userMessages', JSON.stringify(newMessages));
        }, 1000);
    };

    const renderOrdersContent = () => (
        <>
            <div className="order-tabs">
                {orderTabs.map(tab => {
                    const orderCount = tab.id !== 'all' 
                        ? orders.filter(o => o.status === tab.id).length 
                        : orders.length;
                    
                    return (
                        <button
                            key={tab.id}
                            className={`order-tab ${activeOrderTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveOrderTab(tab.id)}
                        >
                            {tab.label}
                            {tab.id !== 'all' && orderCount > 0 && (
                                <span className="badge">{orderCount}</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {filteredOrders.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <i className="fas fa-box-open"></i>
                    </div>
                    <h3>No orders yet</h3>
                    <p>Start shopping to see your orders here!</p>
                    <Link to="/" className="btn-shop-now">Shop Now</Link>
                </div>
            ) : (
                filteredOrders.map(order => (
                    <div key={order.id} className="order-card">
                        <div className="order-card-header">
                            <div className="order-id">Order #{order.id}</div>
                            <div className="d-flex align-items-center gap-3">
                                <small className="text-muted">
                                    {new Date(order.date).toLocaleDateString('en-PH', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </small>
                                <span className={`order-status ${getStatusBadgeClass(order.status)}`}>
                                    {getStatusLabel(order.status)}
                                </span>
                            </div>
                        </div>
                        <div className="order-card-body">
                            {order.items?.slice(0, 2).map((item, idx) => (
                                <div key={idx} className="order-item">
                                    <img 
                                        src={item.image} 
                                        alt={item.name}
                                        className="order-item-img"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/70'}
                                    />
                                    <div>
                                        <div className="order-item-name">{item.name}</div>
                                        <div className="order-item-variant">Pink Wrapper, Classic Bow</div>
                                        <div className="order-item-qty">x{item.qty || 1}</div>
                                    </div>
                                    <div className="order-item-price">
                                        ₱{(item.price * (item.qty || 1)).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                            {order.items?.length > 2 && (
                                <div className="text-muted small mt-2">
                                    + {order.items.length - 2} more item(s)
                                </div>
                            )}
                            
                            {/* Delivery/Pickup Information */}
                            <div className="mt-3 pt-3 border-top">
                                {order.deliveryMethod === 'pickup' ? (
                                    <div className="d-flex align-items-start gap-2">
                                        <i className="fas fa-store mt-1" style={{ color: 'var(--shop-pink)', fontSize: '0.9rem' }}></i>
                                        <div className="flex-grow-1">
                                            <div className="small fw-bold mb-1">Pickup Order</div>
                                            {order.pickupTime && (
                                                <div className="small text-muted mb-1">
                                                    <i className="fas fa-clock me-1"></i>
                                                    Pickup Time: {order.pickupTime}
                                                </div>
                                            )}
                                            <div className="small text-muted">
                                                <i className="fas fa-map-marker-alt me-1"></i>
                                                Jocery's Flower Shop, 123 Flower St., Quezon City
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    order.address && (
                                        <div className="d-flex align-items-start gap-2">
                                            <i className="fas fa-truck mt-1" style={{ color: 'var(--shop-pink)', fontSize: '0.9rem' }}></i>
                                            <div className="flex-grow-1">
                                                <div className="small fw-bold mb-1">Delivery Address</div>
                                                <div className="small text-muted">
                                                    {order.address.street}, {order.address.city}, {order.address.province} {order.address.zip}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                        <div className="order-card-footer">
                            <div className="order-total">
                                Order Total: <span>₱{order.total?.toLocaleString()}</span>
                            </div>
                            <div className="order-actions">
                                {order.status === 'delivered' && (
                                    <button 
                                        className="btn-order-action secondary"
                                        onClick={() => handleReorder(order)}
                                    >
                                        Buy Again
                                    </button>
                                )}
                                {order.status !== 'cancelled' && (
                                    <button 
                                        className="btn-order-action primary"
                                        onClick={() => handleTrackOrder(order.id)}
                                    >
                                        {order.status === 'delivered' ? 'View Details' : 'Track Order'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </>
    );

    const renderAddressesContent = () => (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">My Addresses</h5>
                <button 
                    className="btn btn-sm"
                    style={{ background: 'var(--shop-pink)', color: 'white' }}
                    onClick={() => {
                        setEditingAddress(null);
                        setShowAddressModal(true);
                    }}
                >
                    <i className="fas fa-plus me-2"></i>Add Address
                </button>
            </div>

            {addresses.map(addr => (
                <div key={addr.id} className="address-card mb-3" style={{ cursor: 'default' }}>
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            {addr.isDefault && <span className="address-label">Default</span>}
                            <span className="badge bg-secondary ms-2">{addr.label}</span>
                        </div>
                        <div>
                            <button 
                                className="btn btn-link btn-sm text-primary"
                                onClick={() => {
                                    setEditingAddress(addr);
                                    setShowAddressModal(true);
                                }}
                            >
                                Edit
                            </button>
                            {!addr.isDefault && (
                                <button 
                                    className="btn btn-link btn-sm text-danger"
                                    onClick={() => setAddresses(addresses.filter(a => a.id !== addr.id))}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="address-name mt-2">{addr.name}</div>
                    <div className="address-phone">{addr.phone}</div>
                    <div className="address-detail mt-2">{addr.address}</div>
                    {!addr.isDefault && (
                        <button 
                            className="btn btn-outline-secondary btn-sm mt-3"
                            onClick={() => {
                                setAddresses(addresses.map(a => ({
                                    ...a,
                                    isDefault: a.id === addr.id
                                })));
                            }}
                        >
                            Set as Default
                        </button>
                    )}
                </div>
            ))}
        </>
    );

    const renderSettingsContent = () => (
        <>
            <h5 className="fw-bold mb-4">Account Settings</h5>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" defaultValue={user.name} />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-control" defaultValue={user.email} />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" className="form-control" defaultValue={user.phone} />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" className="form-control" />
                </div>
            </div>

            <hr className="my-4" />

            <h6 className="fw-bold mb-3">Change Password</h6>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Current Password</label>
                    <input type="password" className="form-control" />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">New Password</label>
                    <input type="password" className="form-control" />
                </div>
            </div>

            <button className="btn mt-3" style={{ background: 'var(--shop-pink)', color: 'white' }}>
                Save Changes
            </button>
        </>
    );

    const renderMessagesContent = () => (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">
                    <i className="fas fa-comments me-2" style={{ color: 'var(--shop-pink)' }}></i>
                    Chat with Us
                </h5>
                <span className="badge" style={{ background: 'var(--shop-pink-light)', color: 'var(--shop-pink)' }}>
                    <i className="fas fa-circle me-1" style={{ fontSize: '0.5rem' }}></i>
                    Online
                </span>
            </div>

            <div 
                className="messages-container rounded p-3 mb-3"
                style={{ 
                    background: '#f8f9fa', 
                    height: '400px', 
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                }}
            >
                {messages.map((msg, index) => (
                    <div 
                        key={index}
                        className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                    >
                        <div 
                            className="message-bubble p-3 rounded-3"
                            style={{
                                maxWidth: '75%',
                                background: msg.sender === 'user' ? 'var(--shop-pink)' : 'white',
                                color: msg.sender === 'user' ? 'white' : '#333',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}
                        >
                            {msg.sender === 'shop' && (
                                <div className="d-flex align-items-center mb-2">
                                    <div 
                                        className="rounded-circle d-flex align-items-center justify-content-center me-2"
                                        style={{ width: '24px', height: '24px', background: 'var(--shop-pink-light)' }}
                                    >
                                        <i className="fas fa-store" style={{ fontSize: '0.7rem', color: 'var(--shop-pink)' }}></i>
                                    </div>
                                    <small className="fw-bold" style={{ color: 'var(--shop-pink)' }}>Jocery's Flower Shop</small>
                                </div>
                            )}
                            <p className="mb-1" style={{ fontSize: '0.95rem' }}>{msg.text}</p>
                            <small className={msg.sender === 'user' ? 'text-white-50' : 'text-muted'} style={{ fontSize: '0.75rem' }}>
                                {new Date(msg.time).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
                            </small>
                        </div>
                    </div>
                ))}
            </div>

            <div className="input-group">
                <input 
                    type="text" 
                    className="form-control rounded-pill rounded-end"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    style={{ borderRight: 'none' }}
                />
                <button 
                    className="btn rounded-pill rounded-start px-4"
                    style={{ background: 'var(--shop-pink)', color: 'white', borderLeft: 'none' }}
                    onClick={sendMessage}
                >
                    <i className="fas fa-paper-plane"></i>
                </button>
            </div>

            <div className="mt-3 p-3 rounded" style={{ background: 'var(--shop-pink-light)' }}>
                <small className="text-muted">
                    <i className="fas fa-info-circle me-2" style={{ color: 'var(--shop-pink)' }}></i>
                    <strong>Quick Help:</strong> You can ask about product availability, order status, custom arrangements, delivery times, or any other inquiries.
                </small>
            </div>
        </>
    );

    const renderContent = () => {
        switch (activeMenu) {
            case 'orders': return renderOrdersContent();
            case 'messages': return renderMessagesContent();
            case 'addresses': return renderAddressesContent();
            case 'settings': return renderSettingsContent();
            default: return renderOrdersContent();
        }
    };

    return (
        <div className="profile-container">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 mb-4">
                        <div className="profile-sidebar">
                            <div className="text-center pb-3 mb-3" style={{ borderBottom: '1px solid #eee' }}>
                                <h5 className="fw-bold mb-1" style={{ color: '#333' }}>{user.name}</h5>
                                <small className="text-muted">{user.email}</small>
                            </div>

                            <ul className="profile-menu" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {menuItems.map(item => (
                                    <li
                                        key={item.id}
                                        className={`profile-menu-item ${activeMenu === item.id ? 'active' : ''}`}
                                        onClick={() => setActiveMenu(item.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <i className={`fas ${item.icon}`}></i>
                                        <span>{item.label}</span>
                                    </li>
                                ))}
                            </ul>

                            <hr />

                            <div 
                                className="profile-menu-item text-danger"
                                onClick={() => navigate('/login')}
                                style={{ cursor: 'pointer' }}
                            >
                                <i className="fas fa-sign-out-alt"></i>
                                <span>Logout</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-9">
                        <div className="profile-content">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>

            {showAddressModal && (
                <div className="modal-overlay" onClick={() => setShowAddressModal(false)}>
                    <div className="modal-content-custom" onClick={e => e.stopPropagation()}>
                        <div className="modal-header-custom">
                            <h4>{editingAddress ? 'Edit Address' : 'Add New Address'}</h4>
                            <button className="modal-close" onClick={() => setShowAddressModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body-custom">
                            <div className="form-group">
                                <label className="form-label">Label</label>
                                <input 
                                    type="text" 
                                    className="form-control-custom"
                                    defaultValue={editingAddress?.label}
                                    placeholder="e.g., Home, Office"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input 
                                    type="text" 
                                    className="form-control-custom"
                                    defaultValue={editingAddress?.name}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input 
                                    type="tel" 
                                    className="form-control-custom"
                                    defaultValue={editingAddress?.phone}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Complete Address</label>
                                <textarea 
                                    className="form-control-custom"
                                    rows="3"
                                    defaultValue={editingAddress?.address}
                                ></textarea>
                            </div>
                        </div>
                        <div className="modal-footer-custom">
                            <button 
                                className="btn btn-outline-secondary"
                                onClick={() => setShowAddressModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn"
                                style={{ background: 'var(--shop-pink)', color: 'white' }}
                                onClick={() => setShowAddressModal(false)}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
