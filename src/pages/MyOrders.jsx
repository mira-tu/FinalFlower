import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Shop.css';

const orderTabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'processing', label: 'Processing' },
    { id: 'ready_for_pickup', label: 'Ready for Pickup' },
    { id: 'to_receive', label: 'Out for Delivery' },
    { id: 'claimed', label: 'Claimed' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
];

const MyOrders = () => {
    const navigate = useNavigate();
    const [activeOrderTab, setActiveOrderTab] = useState('all');
    const [orders, setOrders] = useState([]);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [showWaitingModal, setShowWaitingModal] = useState(false);
    const [showChatModal, setShowChatModal] = useState(false);
    const [selectedOrderForChat, setSelectedOrderForChat] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [newChatMessage, setNewChatMessage] = useState('');
    const chatMessagesEndRef = useRef(null);
    const [receiptFile, setReceiptFile] = useState(null);
    const [receiptPreview, setReceiptPreview] = useState(null);
    const [uploadingReceiptFor, setUploadingReceiptFor] = useState(null);
    const [orderMessages, setOrderMessages] = useState({}); // Store message info for each order
    const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);

    useEffect(() => {
        // Load all orders including regular orders, event bookings, special orders, and customized requests
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const savedRequests = JSON.parse(localStorage.getItem('requests') || '[]');
        
        // Combine regular orders with requests (bookings, special orders, customized)
        const allOrders = [...savedOrders, ...savedRequests];
        
        // Enrich orders with status and paymentStatus if not present
        const enrichedOrders = allOrders.map((order) => {
            let enrichedOrder = { ...order };
            
            // Add paymentStatus if not present
            if (!enrichedOrder.paymentStatus) {
                // If payment method exists and is GCash, mark as waiting for confirmation; otherwise to_pay
                if (enrichedOrder.payment && enrichedOrder.payment.id === 'gcash') {
                    enrichedOrder.paymentStatus = 'waiting_for_confirmation';
                } else {
                    enrichedOrder.paymentStatus = 'to_pay';
                }
            }
            
            // Add status if not present or update COD orders to processing
            if (!enrichedOrder.status) {
                // Determine status based on order type and date
                if (enrichedOrder.type === 'booking' || enrichedOrder.type === 'special_order' || enrichedOrder.type === 'customized') {
                    // New requests start as pending
                    enrichedOrder.status = 'pending';
                } else {
                    // Regular orders use existing logic
                    const orderDate = new Date(enrichedOrder.date || enrichedOrder.requestDate);
                    const now = new Date();
                    const hours = (now - orderDate) / (1000 * 60 * 60);
                    
                    if (hours < 2) {
                        enrichedOrder.status = 'to_pay';
                    } else if (hours < 8) {
                        enrichedOrder.status = 'processing';
                    } else {
                        if (enrichedOrder.deliveryMethod === 'pickup') {
                            if (hours < 12) {
                                enrichedOrder.status = 'ready_for_pickup';
                            } else if (hours < 24) {
                                enrichedOrder.status = 'claimed';
                            } else {
                                enrichedOrder.status = 'completed';
                            }
                        } else {
                            if (hours < 24) {
                                enrichedOrder.status = 'to_receive';
                            } else {
                                enrichedOrder.status = 'completed';
                            }
                        }
                    }
                }
            } else if (enrichedOrder.status === 'pending' && enrichedOrder.payment && enrichedOrder.payment.id === 'cod') {
                // Move existing COD orders from pending to processing
                enrichedOrder.status = 'processing';
            }
            
            return enrichedOrder;
        });
        
        // Sort by date (newest first)
        enrichedOrders.sort((a, b) => {
            const dateA = new Date(a.date || a.requestDate || 0);
            const dateB = new Date(b.date || b.requestDate || 0);
            return dateB - dateA;
        });
        
        setOrders(enrichedOrders);
        loadOrderMessages(enrichedOrders);
    }, []);

    const loadOrderMessages = (ordersList) => {
        const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
        const messagesByOrder = {};
        let totalUnread = 0;

        ordersList.forEach(order => {
            if (order.id) {
                const orderMsgs = allMessages.filter(msg => 
                    msg.orderId && msg.orderId.toString() === order.id.toString()
                );
                
                const unreadCount = orderMsgs.filter(msg => 
                    msg.sender === 'admin' && !msg.readByUser
                ).length;
                
                const lastMessage = orderMsgs.length > 0 
                    ? orderMsgs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
                    : null;

                messagesByOrder[order.id] = {
                    count: orderMsgs.length,
                    unreadCount: unreadCount,
                    lastMessage: lastMessage
                };

                totalUnread += unreadCount;
            }
        });

        setOrderMessages(messagesByOrder);
        setTotalUnreadMessages(totalUnread);
    };

    useEffect(() => {
        // Refresh message counts periodically
        const interval = setInterval(() => {
            loadOrderMessages(orders);
        }, 2000);

        // Listen for message updates
        const handleMessageUpdate = () => {
            loadOrderMessages(orders);
        };
        
        window.addEventListener('messageUpdated', handleMessageUpdate);
        window.addEventListener('storage', (e) => {
            if (e.key === 'messages') {
                loadOrderMessages(orders);
            }
        });

        return () => {
            clearInterval(interval);
            window.removeEventListener('messageUpdated', handleMessageUpdate);
        };
    }, [orders]);

    const filteredOrders = activeOrderTab === 'all' 
        ? orders 
        : orders.filter(o => o.status === activeOrderTab);

    const getStatusBadgeClass = (status) => {
        const classes = {
            pending: 'pending',
            processing: 'processing',
            to_pay: 'pending',
            ready_for_pickup: 'processing',
            to_receive: 'shipped',
            claimed: 'shipped',
            completed: 'delivered',
            cancelled: 'cancelled'
        };
        return classes[status] || 'pending';
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: 'Pending',
            processing: 'Processing',
            to_pay: 'To Pay',
            ready_for_pickup: 'Ready for Pickup',
            to_receive: 'Out for Delivery',
            claimed: 'Claimed',
            completed: 'Completed',
            cancelled: 'Cancelled'
        };
        return labels[status] || status;
    };

    const handleTrackOrder = (orderId) => {
        navigate(`/order-tracking/${orderId}`);
    };

    const handleTrackStatus = (order) => {
        // Show waiting for approval modal for pending requests
        if (order.status === 'pending' && order.type) {
            setShowWaitingModal(true);
        } else {
            handleTrackOrder(order.id);
        }
    };

    const handleCancelClick = (order) => {
        setOrderToCancel(order);
        setShowCancelModal(true);
    };

    const handleConfirmCancel = () => {
        if (!orderToCancel) return;

        // Create cancellation notification
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const orderTypeLabel = orderToCancel.type 
            ? (orderToCancel.type === 'booking' ? 'Event Booking' 
                : orderToCancel.type === 'special_order' ? 'Special Order' 
                : orderToCancel.type === 'customized' ? 'Customized Bouquet' 
                : 'Request')
            : 'Order';
        const orderId = orderToCancel.id ? `#${orderToCancel.id}` : '';
        
        const newNotification = {
            id: `notif-${Date.now()}`,
            type: 'cancellation',
            title: `${orderTypeLabel} Cancelled`,
            message: `Your ${orderTypeLabel.toLowerCase()} ${orderId} has been cancelled successfully.`,
            icon: 'fa-times-circle',
            timestamp: new Date().toISOString(),
            read: false,
            link: '/my-orders'
        };
        localStorage.setItem('notifications', JSON.stringify([newNotification, ...notifications]));

        // Remove from appropriate storage
        if (orderToCancel.type) {
            // It's a request (booking, special_order, customized)
            const requests = JSON.parse(localStorage.getItem('requests') || '[]');
            const updatedRequests = requests.filter(req => req.id !== orderToCancel.id);
            localStorage.setItem('requests', JSON.stringify(updatedRequests));
        } else {
            // It's a regular order
            const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            const updatedOrders = savedOrders.filter(ord => ord.id !== orderToCancel.id);
            localStorage.setItem('orders', JSON.stringify(updatedOrders));
        }

        // Reload orders from localStorage
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const savedRequests = JSON.parse(localStorage.getItem('requests') || '[]');
        const allOrders = [...savedOrders, ...savedRequests];
        
        // Apply enrichment logic
        const enrichedOrders = allOrders.map((order) => {
            let enrichedOrder = { ...order };
            
            if (!enrichedOrder.paymentStatus) {
                if (enrichedOrder.payment && enrichedOrder.payment.id === 'gcash') {
                    enrichedOrder.paymentStatus = 'waiting_for_confirmation';
                } else {
                    enrichedOrder.paymentStatus = 'to_pay';
                }
            }
            
            if (!enrichedOrder.status) {
                if (enrichedOrder.type === 'booking' || enrichedOrder.type === 'special_order' || enrichedOrder.type === 'customized') {
                    enrichedOrder.status = 'pending';
                } else {
                    const orderDate = new Date(enrichedOrder.date || enrichedOrder.requestDate);
                    const now = new Date();
                    const hours = (now - orderDate) / (1000 * 60 * 60);
                    
                    if (hours < 2) {
                        enrichedOrder.status = 'to_pay';
                    } else if (hours < 8) {
                        enrichedOrder.status = 'processing';
                    } else {
                        if (enrichedOrder.deliveryMethod === 'pickup') {
                            if (hours < 12) {
                                enrichedOrder.status = 'ready_for_pickup';
                            } else if (hours < 24) {
                                enrichedOrder.status = 'claimed';
                            } else {
                                enrichedOrder.status = 'completed';
                            }
                        } else {
                            if (hours < 24) {
                                enrichedOrder.status = 'to_receive';
                            } else {
                                enrichedOrder.status = 'completed';
                            }
                        }
                    }
                }
            } else if (enrichedOrder.status === 'pending' && enrichedOrder.payment && enrichedOrder.payment.id === 'cod') {
                enrichedOrder.status = 'processing';
            }
            
            return enrichedOrder;
        });
        
        enrichedOrders.sort((a, b) => {
            const dateA = new Date(a.date || a.requestDate || 0);
            const dateB = new Date(b.date || b.requestDate || 0);
            return dateB - dateA;
        });
        
        setOrders(enrichedOrders);
        setShowCancelModal(false);
        setOrderToCancel(null);
    };

    const getOrderTypeLabel = (type) => {
        const labels = {
            booking: 'Event Booking',
            special_order: 'Special Order',
            customized: 'Customized Bouquet',
            regular: 'Regular Order'
        };
        return labels[type] || 'Order';
    };

    const formatMessageTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        
        if (isToday) {
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    };

    const groupMessagesByDate = (messages) => {
        const grouped = [];
        let currentDate = null;

        messages.forEach((msg, index) => {
            const msgDate = new Date(msg.timestamp).toDateString();
            const prevMsgDate = index > 0 ? new Date(messages[index - 1].timestamp).toDateString() : null;

            if (msgDate !== prevMsgDate) {
                const date = new Date(msg.timestamp);
                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);

                let dateLabel;
                if (date.toDateString() === today.toDateString()) {
                    dateLabel = 'Today';
                } else if (date.toDateString() === yesterday.toDateString()) {
                    dateLabel = 'Yesterday';
                } else {
                    dateLabel = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
                }

                grouped.push({ type: 'date', label: dateLabel });
                currentDate = msgDate;
            }

            grouped.push({ type: 'message', ...msg });
        });

        return grouped;
    };

    const loadChatMessages = (orderId) => {
        if (!orderId) {
            setChatMessages([]);
            return;
        }
        
        const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
        const orderMessages = allMessages
            .filter(msg => msg.orderId && msg.orderId.toString() === orderId.toString())
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setChatMessages(orderMessages);

        // Mark admin messages as read by user
        let hasUnread = false;
        const updatedMessages = allMessages.map(msg => {
            if (msg.orderId && msg.orderId.toString() === orderId.toString() && msg.sender === 'admin' && !msg.readByUser) {
                hasUnread = true;
                return { ...msg, readByUser: true };
            }
            return msg;
        });
        
        if (hasUnread) {
            localStorage.setItem('messages', JSON.stringify(updatedMessages));
        }
        
        // Scroll to bottom
        setTimeout(() => {
            chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSendChatMessage = (e) => {
        e.preventDefault();
        if (!newChatMessage.trim() || !selectedOrderForChat) return;

        const orderId = selectedOrderForChat.id;
        if (!orderId) {
            console.error('Order ID is missing');
            return;
        }

        const message = {
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            orderId: orderId,
            sender: 'user',
            senderName: 'You',
            message: newChatMessage.trim(),
            timestamp: new Date().toISOString(),
            readByAdmin: false
        };

        const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
        const updatedMessages = [...allMessages, message];
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('messageUpdated'));
        
        // Create notification for admin
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const orderType = selectedOrderForChat.type 
            ? (selectedOrderForChat.type === 'booking' ? 'Event Booking' 
                : selectedOrderForChat.type === 'special_order' ? 'Special Order' 
                : selectedOrderForChat.type === 'customized' ? 'Customized Bouquet' 
                : 'Request')
            : 'Order';
        
        const notification = {
            id: `notif-${Date.now()}`,
            type: 'message',
            title: 'New Message from Customer',
            message: `You have a new message about ${orderType.toLowerCase()} ${orderId}.`,
            icon: 'fa-comments',
            timestamp: new Date().toISOString(),
            read: false,
            link: '/admin/dashboard'
        };
        localStorage.setItem('notifications', JSON.stringify([notification, ...notifications]));
        
        setNewChatMessage('');
        // Reload messages immediately and force update
        loadChatMessages(orderId);
        loadOrderMessages(orders);
        
        // Also reload after a short delay to ensure sync
        setTimeout(() => {
            loadChatMessages(orderId);
            loadOrderMessages(orders);
        }, 200);
    };

    const handleReceiptUpload = (e, paymentRequestId) => {
        const file = e.target.files[0];
        if (file) {
            setReceiptFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setReceiptPreview(reader.result);
                handleSubmitReceipt(paymentRequestId, reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitReceipt = (paymentRequestId, receiptBase64) => {
        const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
        const updatedMessages = allMessages.map(msg => 
            msg.id === paymentRequestId 
                ? { ...msg, receipt: receiptBase64, status: 'pending', receiptUploadedAt: new Date().toISOString() }
                : msg
        );
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        
        // Dispatch custom event
        window.dispatchEvent(new Event('messageUpdated'));
        
        // Create notification for admin
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const notification = {
            id: `notif-${Date.now()}`,
            type: 'payment',
            title: 'Receipt Uploaded',
            message: 'A customer has uploaded a payment receipt. Please review and confirm.',
            icon: 'fa-receipt',
            timestamp: new Date().toISOString(),
            read: false,
            link: '/admin/dashboard'
        };
        localStorage.setItem('notifications', JSON.stringify([notification, ...notifications]));

        setReceiptFile(null);
        setReceiptPreview(null);
        setUploadingReceiptFor(null);
        loadChatMessages(selectedOrderForChat.id);
    };

    useEffect(() => {
        if (showChatModal && selectedOrderForChat) {
            loadChatMessages(selectedOrderForChat.id);
            
            // Listen for storage changes (when messages are added from another tab/window)
            const handleStorageChange = (e) => {
                if (e.key === 'messages' && selectedOrderForChat && selectedOrderForChat.id) {
                    loadChatMessages(selectedOrderForChat.id);
                }
            };
            
            window.addEventListener('storage', handleStorageChange);
            
            // Also listen for custom events (same tab updates)
            const handleMessageUpdate = () => {
                if (selectedOrderForChat && selectedOrderForChat.id) {
                    loadChatMessages(selectedOrderForChat.id);
                }
            };
            
            window.addEventListener('messageUpdated', handleMessageUpdate);
            
            // Auto-refresh messages every 1 second for real-time feel
            const interval = setInterval(() => {
                if (selectedOrderForChat && selectedOrderForChat.id) {
                    loadChatMessages(selectedOrderForChat.id);
                }
            }, 1000);
            
            return () => {
                clearInterval(interval);
                window.removeEventListener('storage', handleStorageChange);
                window.removeEventListener('messageUpdated', handleMessageUpdate);
            };
        }
    }, [showChatModal, selectedOrderForChat]);

    return (
        <div className="profile-container">
            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-0">My Orders</h2>
                        {totalUnreadMessages > 0 && (
                            <small className="text-muted">
                                <i className="fas fa-comments me-1" style={{ color: 'var(--shop-pink)' }}></i>
                                {totalUnreadMessages} unread message{totalUnreadMessages !== 1 ? 's' : ''}
                            </small>
                        )}
                    </div>
                    <Link to="/profile" className="btn btn-outline-secondary">
                        <i className="fas fa-user me-2"></i>Back to Profile
                    </Link>
                </div>

                <div className="order-tabs" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {orderTabs.map(tab => {
                        const orderCount = tab.id !== 'all' 
                            ? orders.filter(o => o.status === tab.id).length 
                            : orders.length;
                        
                        return (
                            <button
                                key={tab.id}
                                className={`order-tab ${activeOrderTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveOrderTab(tab.id)}
                                style={{ flexShrink: 0 }}
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
                    <div className="orders-list">
                        {filteredOrders.map((order, index) => (
                            <div key={order.id || `order-${index}`} className="order-card">
                                <div className="order-card-header">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="order-id">
                                            {order.type === 'booking' && 'Event Booking'}
                                            {order.type === 'special_order' && 'Special Order'}
                                            {order.type === 'customized' && 'Customized Bouquet'}
                                            {!order.type && `Order #${order.id || index + 1}`}
                                        </div>
                                        {order.type && (
                                            <span className="badge bg-info text-white">
                                                {getOrderTypeLabel(order.type)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="d-flex align-items-center gap-3 flex-wrap">
                                        <small className="text-muted">
                                            {new Date(order.date || order.requestDate).toLocaleDateString('en-PH', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </small>
                                        <span className={`order-status ${getStatusBadgeClass(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                        {order.paymentStatus && (
                                            <span className={`badge ${
                                                order.paymentStatus === 'paid' 
                                                    ? 'bg-success' 
                                                    : order.paymentStatus === 'waiting_for_confirmation' 
                                                        ? 'bg-info' 
                                                        : 'bg-warning'
                                            }`}>
                                                <i className={`fas ${
                                                    order.paymentStatus === 'paid' 
                                                        ? 'fa-check-circle' 
                                                        : order.paymentStatus === 'waiting_for_confirmation'
                                                            ? 'fa-hourglass-half'
                                                            : 'fa-clock'
                                                } me-1`}></i>
                                                {order.paymentStatus === 'paid' 
                                                    ? 'Paid' 
                                                    : order.paymentStatus === 'waiting_for_confirmation'
                                                        ? 'Waiting for Confirmation'
                                                        : 'To Pay'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="order-card-body">
                                    {/* Display order items or request details */}
                                    {order.items && order.items.length > 0 ? (
                                        <>
                                            {order.items.slice(0, 2).map((item, idx) => (
                                                <div key={idx} className="order-item">
                                                    <img 
                                                        src={item.image || item.photo} 
                                                        alt={item.name || 'Item'}
                                                        className="order-item-img"
                                                        onError={(e) => e.target.src = 'https://via.placeholder.com/70'}
                                                    />
                                                    <div>
                                                        <div className="order-item-name">{item.name || 'Custom Item'}</div>
                                                        {item.variant && (
                                                            <div className="order-item-variant">{item.variant}</div>
                                                        )}
                                                        <div className="order-item-qty">x{item.qty || 1}</div>
                                                    </div>
                                                    <div className="order-item-price">
                                                        ₱{((item.price || order.price || 0) * (item.qty || 1)).toLocaleString()}
                                                    </div>
                                                </div>
                                            ))}
                                            {order.items.length > 2 && (
                                                <div className="text-muted small mt-2">
                                                    + {order.items.length - 2} more item(s)
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        // Display request details for bookings, special orders, and customized
                                        <div className="order-item">
                                            {order.photo && (
                                                <img 
                                                    src={order.photo} 
                                                    alt="Request preview"
                                                    className="order-item-img"
                                                    style={{ objectFit: 'cover' }}
                                                    onError={(e) => e.target.src = 'https://via.placeholder.com/70'}
                                                />
                                            )}
                                            <div className="flex-grow-1">
                                                <div className="order-item-name">
                                                    {order.type === 'booking' && order.eventType && (
                                                        <>{order.eventType} Event</>
                                                    )}
                                                    {order.type === 'special_order' && (
                                                        <>Special Order Request</>
                                                    )}
                                                    {order.type === 'customized' && (
                                                        <>Customized Bouquet Request</>
                                                    )}
                                                    {!order.type && 'Order Item'}
                                                </div>
                                                {order.type === 'booking' && order.venue && (
                                                    <div className="order-item-variant">
                                                        <i className="fas fa-map-marker-alt me-1"></i>
                                                        {order.venue}
                                                    </div>
                                                )}
                                                {order.type === 'special_order' && order.recipientName && (
                                                    <div className="order-item-variant">
                                                        <i className="fas fa-user me-1"></i>
                                                        For: {order.recipientName}
                                                    </div>
                                                )}
                                                {order.type === 'customized' && order.flower && (
                                                    <div className="order-item-variant">
                                                        <i className="fas fa-seedling me-1"></i>
                                                        {order.flower.name} - {order.bundleSize} stems
                                                    </div>
                                                )}
                                            </div>
                                            <div className="order-item-price">
                                                ₱{(order.price || order.total || 0).toLocaleString()}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Payment Method Information */}
                                    {order.payment && (
                                        <div className="mt-3 pt-3 border-top">
                                            <div className="d-flex align-items-start gap-2">
                                                <i className={`fas ${order.payment.icon || 'fa-credit-card'} mt-1`} style={{ color: 'var(--shop-pink)', fontSize: '0.9rem' }}></i>
                                                <div className="flex-grow-1">
                                                    <div className="small fw-bold mb-1">Payment Method</div>
                                                    <div className="small text-muted">
                                                        {order.payment.name || 'Cash on Delivery'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Delivery/Pickup Information */}
                                    {(order.deliveryMethod || order.address) && (
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
                                                                {typeof order.address === 'string' 
                                                                    ? order.address 
                                                                    : `${order.address.street}, ${order.address.city}, ${order.address.province} ${order.address.zip}`
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Message Preview */}
                                    {orderMessages[order.id] && orderMessages[order.id].lastMessage && (
                                        <div className="mt-3 pt-3 border-top">
                                            <div className="d-flex align-items-start gap-2">
                                                <i className="fas fa-comments mt-1" style={{ color: 'var(--shop-pink)', fontSize: '0.9rem' }}></i>
                                                <div className="flex-grow-1">
                                                    <div className="small fw-bold mb-1 d-flex align-items-center gap-2">
                                                        Messages
                                                        {orderMessages[order.id].unreadCount > 0 && (
                                                            <span className="badge" style={{ 
                                                                background: 'var(--shop-pink)', 
                                                                color: 'white',
                                                                fontSize: '0.7rem',
                                                                padding: '2px 6px'
                                                            }}>
                                                                {orderMessages[order.id].unreadCount} new
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="small text-muted" style={{ 
                                                        overflow: 'hidden', 
                                                        textOverflow: 'ellipsis', 
                                                        whiteSpace: 'nowrap',
                                                        fontStyle: orderMessages[order.id].unreadCount > 0 ? 'normal' : 'normal'
                                                    }}>
                                                        {orderMessages[order.id].lastMessage.sender === 'admin' ? 'Admin: ' : 'You: '}
                                                        {orderMessages[order.id].lastMessage.message}
                                                    </div>
                                                    <div className="small text-muted" style={{ fontSize: '0.7rem', marginTop: '2px' }}>
                                                        {new Date(orderMessages[order.id].lastMessage.timestamp).toLocaleString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: 'numeric',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="order-card-footer">
                                    <div className="order-total">
                                        {order.type ? 'Request Total' : 'Order Total'}: <span>₱{(order.total || order.price || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="order-actions">
                                        {order.status === 'completed' && order.items && (
                                            <button 
                                                className="btn-order-action secondary"
                                                onClick={() => {
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
                                                }}
                                            >
                                                Buy Again
                                            </button>
                                        )}
                                        {order.status === 'pending' && order.type && (
                                            <button 
                                                className="btn-order-action primary"
                                                onClick={() => handleTrackStatus(order)}
                                            >
                                                Track Status
                                            </button>
                                        )}
                                        {order.status !== 'cancelled' && order.status !== 'completed' && !(order.status === 'pending' && order.type) && (
                                            <button 
                                                className="btn-order-action primary"
                                                onClick={() => handleTrackOrder(order.id || `order-${index}`)}
                                            >
                                                Track Order
                                            </button>
                                        )}
                                        <button 
                                            className="btn-order-action primary"
                                            onClick={() => {
                                                setSelectedOrderForChat(order);
                                                setShowChatModal(true);
                                                loadChatMessages(order.id);
                                            }}
                                            style={{ 
                                                background: 'var(--shop-pink)', 
                                                color: 'white',
                                                border: 'none',
                                                position: 'relative'
                                            }}
                                        >
                                            <i className="fas fa-comments me-2"></i>Message
                                            {orderMessages[order.id] && orderMessages[order.id].unreadCount > 0 && (
                                                <span style={{
                                                    position: 'absolute',
                                                    top: '-5px',
                                                    right: '-5px',
                                                    background: '#dc3545',
                                                    color: 'white',
                                                    borderRadius: '50%',
                                                    width: '20px',
                                                    height: '20px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 'bold',
                                                    border: '2px solid white'
                                                }}>
                                                    {orderMessages[order.id].unreadCount > 9 ? '9+' : orderMessages[order.id].unreadCount}
                                                </span>
                                            )}
                                        </button>
                                        {order.status !== 'cancelled' && order.status !== 'completed' && (
                                            <button 
                                                className="btn-order-action danger"
                                                onClick={() => handleCancelClick(order)}
                                                style={{ 
                                                    background: '#dc3545', 
                                                    color: 'white',
                                                    border: 'none'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cancellation Confirmation Modal */}
            {showCancelModal && (
                <div 
                    className="modal-overlay" 
                    onClick={() => {
                        setShowCancelModal(false);
                        setOrderToCancel(null);
                    }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}
                >
                    <div 
                        className="modal-content-custom" 
                        onClick={e => e.stopPropagation()}
                        style={{
                            backgroundColor: 'white',
                            padding: '2rem',
                            borderRadius: '1rem',
                            textAlign: 'center',
                            maxWidth: '400px',
                            width: '90%',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <div style={{ fontSize: '3rem', color: '#dc3545', marginBottom: '1rem' }}>
                            <i className="fas fa-exclamation-triangle"></i>
                        </div>
                        <h3 style={{ marginBottom: '1rem', color: '#333' }}>Cancel {orderToCancel?.type ? 'Request' : 'Order'}?</h3>
                        <p style={{ marginBottom: '1.5rem', color: '#4b5563' }}>
                            Are you sure you want to cancel this {orderToCancel?.type ? 'request' : 'order'}? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setOrderToCancel(null);
                                }}
                                style={{
                                    backgroundColor: 'transparent',
                                    color: '#4b5563',
                                    border: '1px solid #d1d5db',
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '9999px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                Keep {orderToCancel?.type ? 'Request' : 'Order'}
                            </button>
                            <button
                                onClick={handleConfirmCancel}
                                style={{
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '9999px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Waiting for Approval Modal */}
            {showWaitingModal && (
                <div 
                    className="modal-overlay" 
                    onClick={() => setShowWaitingModal(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}
                >
                    <div 
                        className="modal-content-custom" 
                        onClick={e => e.stopPropagation()}
                        style={{
                            backgroundColor: 'white',
                            padding: '2rem',
                            borderRadius: '1rem',
                            textAlign: 'center',
                            maxWidth: '400px',
                            width: '90%',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <div style={{ fontSize: '3rem', color: '#ff9800', marginBottom: '1rem' }}>
                            <i className="fas fa-hourglass-half"></i>
                        </div>
                        <h3 style={{ marginBottom: '1rem', color: '#333' }}>Waiting for Approval</h3>
                        <p style={{ marginBottom: '1.5rem', color: '#4b5563' }}>
                            Your request is currently pending approval from our team. We will review it and get back to you soon.
                        </p>
                        <p style={{ marginBottom: '1.5rem', color: '#4b5563', fontSize: '0.9rem' }}>
                            You will be notified once your request has been processed.
                        </p>
                        <button
                            onClick={() => setShowWaitingModal(false)}
                            style={{
                                backgroundColor: 'var(--shop-pink)',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '9999px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Chat Modal */}
            {showChatModal && selectedOrderForChat && (
                <div 
                    className="modal-overlay" 
                    onClick={() => {
                        setShowChatModal(false);
                        setSelectedOrderForChat(null);
                        setChatMessages([]);
                        setNewChatMessage('');
                        setReceiptFile(null);
                        setReceiptPreview(null);
                        setUploadingReceiptFor(null);
                        loadOrderMessages(orders); // Refresh message counts when closing
                    }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}
                >
                    <div 
                        className="modal-content-custom" 
                        onClick={e => e.stopPropagation()}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '1rem',
                            maxWidth: '600px',
                            width: '90%',
                            maxHeight: '80vh',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <div style={{ 
                            padding: '1.5rem', 
                            borderBottom: '1px solid #e3e6f0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h5 className="mb-0">Chat about your order</h5>
                                <small className="text-muted">
                                    {selectedOrderForChat.type === 'booking' && 'Event Booking'}
                                    {selectedOrderForChat.type === 'special_order' && 'Special Order'}
                                    {selectedOrderForChat.type === 'customized' && 'Customized Bouquet'}
                                    {!selectedOrderForChat.type && `Order #${selectedOrderForChat.id}`}
                                </small>
                            </div>
                            <button
                                onClick={() => {
                                    setShowChatModal(false);
                                    setSelectedOrderForChat(null);
                                    setChatMessages([]);
                                    setNewChatMessage('');
                                    setReceiptFile(null);
                                    setReceiptPreview(null);
                                    setUploadingReceiptFor(null);
                                    loadOrderMessages(orders); // Refresh message counts when closing
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    color: '#6c757d'
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <div style={{ 
                            flex: 1, 
                            overflowY: 'auto', 
                            padding: '20px',
                            background: '#f0f2f5',
                            minHeight: '300px',
                            maxHeight: '400px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}>
                            {chatMessages.length === 0 ? (
                                <div className="chat-empty-state" style={{ height: '100%' }}>
                                    <i className="fas fa-comments"></i>
                                    <p>No messages yet. Start the conversation!</p>
                                </div>
                            ) : (
                                <>
                                    {groupMessagesByDate(chatMessages).map((item, index) => {
                                        if (item.type === 'date') {
                                            return (
                                                <div key={`date-${index}`} className="date-divider">
                                                    <span>{item.label}</span>
                                                </div>
                                            );
                                        }
                                        
                                        // Payment Request Message
                                        if (item.type === 'payment_request') {
                                            return (
                                                <div
                                                    key={item.id}
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'flex-start',
                                                        marginBottom: '8px',
                                                        animation: 'messageSlideIn 0.3s ease-out',
                                                        width: '100%'
                                                    }}
                                                >
                                                    <div style={{
                                                        width: '100%',
                                                        padding: '16px',
                                                        borderRadius: '12px',
                                                        background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                                                        border: '2px solid var(--shop-pink)',
                                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                                    }}>
                                                        <div className="d-flex align-items-center gap-2 mb-3">
                                                            <i className="fas fa-money-bill-wave" style={{ color: 'var(--shop-pink)', fontSize: '1.2rem' }}></i>
                                                            <strong style={{ fontSize: '1rem' }}>Payment Request</strong>
                                                        </div>
                                                        
                                                        <div style={{ 
                                                            fontSize: '1.5rem', 
                                                            fontWeight: 'bold',
                                                            color: 'var(--shop-pink)',
                                                            marginBottom: '16px'
                                                        }}>
                                                            ₱{item.amount.toLocaleString()}
                                                        </div>

                                                        {/* GCash QR Code */}
                                                        <div style={{
                                                            background: 'white',
                                                            padding: '16px',
                                                            borderRadius: '8px',
                                                            textAlign: 'center',
                                                            marginBottom: '16px',
                                                            border: '1px solid #ddd'
                                                        }}>
                                                            <h6 className="mb-3">
                                                                <i className="fas fa-qrcode me-2" style={{ color: 'var(--shop-pink)' }}></i>
                                                                Scan to Pay via GCash
                                                            </h6>
                                                            <div style={{
                                                                width: '200px',
                                                                height: '200px',
                                                                margin: '0 auto',
                                                                background: '#f8f9fa',
                                                                border: '2px dashed #ddd',
                                                                borderRadius: '8px',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: '#6c757d'
                                                            }}>
                                                                <i className="fas fa-qrcode" style={{ fontSize: '80px', opacity: 0.3, marginBottom: '10px' }}></i>
                                                                <small>GCash QR Code</small>
                                                            </div>
                                                            <div className="mt-3">
                                                                <small className="text-muted">
                                                                    <i className="fas fa-info-circle me-1"></i>
                                                                    Scan this QR code with your GCash app
                                                                </small>
                                                            </div>
                                                        </div>

                                                        {/* Receipt Upload */}
                                                        {item.status === 'pending' && !item.receipt && (
                                                            <div>
                                                                <label className="form-label fw-bold small">
                                                                    <i className="fas fa-receipt me-2" style={{ color: 'var(--shop-pink)' }}></i>
                                                                    Upload Payment Receipt
                                                                </label>
                                                                <input
                                                                    type="file"
                                                                    className="form-control form-control-sm"
                                                                    accept="image/*"
                                                                    onChange={(e) => handleReceiptUpload(e, item.id)}
                                                                />
                                                                <small className="text-muted d-block mt-2">
                                                                    <i className="fas fa-info-circle me-1"></i>
                                                                    Please upload a screenshot of your GCash payment confirmation
                                                                </small>
                                                            </div>
                                                        )}

                                                        {item.receipt && (
                                                            <div className="mt-3">
                                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                                    <i className="fas fa-check-circle text-success"></i>
                                                                    <strong>Receipt Uploaded</strong>
                                                                </div>
                                                                <img 
                                                                    src={item.receipt} 
                                                                    alt="Receipt" 
                                                                    style={{ 
                                                                        maxWidth: '100%', 
                                                                        maxHeight: '200px', 
                                                                        borderRadius: '8px',
                                                                        border: '1px solid #ddd'
                                                                    }}
                                                                />
                                                                {item.status === 'pending' && (
                                                                    <div className="mt-2">
                                                                        <small className="text-muted">
                                                                            <i className="fas fa-clock me-1"></i>
                                                                            Waiting for admin confirmation
                                                                        </small>
                                                                    </div>
                                                                )}
                                                                {item.status === 'confirmed' && (
                                                                    <div className="mt-2">
                                                                        <small className="text-success">
                                                                            <i className="fas fa-check-circle me-1"></i>
                                                                            Payment Confirmed
                                                                        </small>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        <div style={{ 
                                                            fontSize: '0.7rem', 
                                                            opacity: 0.7,
                                                            marginTop: '12px',
                                                            textAlign: 'right'
                                                        }}>
                                                            {formatMessageTime(item.timestamp)}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        
                                        // Regular Message
                                        return (
                                            <div
                                                key={item.id}
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: item.sender === 'user' ? 'flex-end' : 'flex-start',
                                                    marginBottom: '8px',
                                                    animation: 'messageSlideIn 0.3s ease-out'
                                                }}
                                            >
                                                <div style={{
                                                    maxWidth: '65%',
                                                    padding: '10px 14px',
                                                    borderRadius: '18px',
                                                    background: item.sender === 'user' 
                                                        ? 'linear-gradient(135deg, var(--shop-pink), #d65d7a)' 
                                                        : 'white',
                                                    color: item.sender === 'user' ? 'white' : '#1a1a1a',
                                                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                                                    borderBottomLeftRadius: item.sender === 'user' ? '18px' : '4px',
                                                    borderBottomRightRadius: item.sender === 'user' ? '4px' : '18px'
                                                }}>
                                                    <div style={{ 
                                                        margin: 0, 
                                                        lineHeight: '1.4', 
                                                        fontSize: '0.95rem',
                                                        marginBottom: '4px'
                                                    }}>
                                                        {item.message}
                                                    </div>
                                                    <div style={{ 
                                                        fontSize: '0.7rem', 
                                                        opacity: 0.7,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}>
                                                        {formatMessageTime(item.timestamp)}
                                                        {item.sender === 'user' && (
                                                            <span>
                                                                {item.readByAdmin ? '✓✓' : '✓'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={chatMessagesEndRef} />
                                </>
                            )}
                        </div>
                        <div style={{ 
                            padding: '12px 20px', 
                            borderTop: '1px solid #e3e6f0',
                            background: 'white'
                        }}>
                            <form onSubmit={handleSendChatMessage} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    style={{
                                        flex: 1,
                                        border: '1px solid #e3e6f0',
                                        borderRadius: '24px',
                                        padding: '10px 18px',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        transition: 'all 0.2s'
                                    }}
                                    placeholder="Type a message..."
                                    value={newChatMessage}
                                    onChange={(e) => setNewChatMessage(e.target.value)}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--shop-pink)'}
                                    onBlur={(e) => e.target.style.borderColor = '#e3e6f0'}
                                />
                                <button 
                                    type="submit" 
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, var(--shop-pink), #d65d7a)',
                                        border: 'none',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        flexShrink: 0
                                    }}
                                    disabled={!newChatMessage.trim()}
                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                >
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;

