import React, { useState } from 'react';

const Messages = () => {
    const [activeChat, setActiveChat] = useState(1);

    const contacts = [
        { id: 1, name: 'Maria Santos', lastMsg: 'Is my order ready?', time: '10:30 AM', unread: 2 },
        { id: 2, name: 'Juan Dela Cruz', lastMsg: 'Thank you so much!', time: 'Yesterday', unread: 0 },
        { id: 3, name: 'Ana Reyes', lastMsg: 'Can I change the ribbon color?', time: 'Yesterday', unread: 0 },
        { id: 4, name: 'Pedro Penduko', lastMsg: 'How much for delivery?', time: 'Nov 24', unread: 0 },
    ];

    return (
        <div className="h-100">
            <h2 className="mb-4 fw-bold">Messages</h2>
            <div className="chat-container">
                {/* Chat List */}
                <div className="chat-list">
                    <div className="p-3 border-bottom">
                        <input type="text" className="form-control rounded-pill" placeholder="Search contacts..." />
                    </div>
                    {contacts.map(contact => (
                        <div
                            key={contact.id}
                            className={`chat-user ${activeChat === contact.id ? 'active' : ''}`}
                            onClick={() => setActiveChat(contact.id)}
                        >
                            <div className="d-flex justify-content-between mb-1">
                                <h6 className="mb-0 fw-bold">{contact.name}</h6>
                                <small className="text-muted">{contact.time}</small>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted text-truncate" style={{ maxWidth: '200px' }}>{contact.lastMsg}</small>
                                {contact.unread > 0 && (
                                    <span className="badge bg-danger rounded-pill">{contact.unread}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chat Area */}
                <div className="chat-area">
                    <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-white">
                        <div className="d-flex align-items-center">
                            <div className="bg-secondary rounded-circle me-3" style={{ width: '40px', height: '40px' }}></div>
                            <h6 className="mb-0 fw-bold">Maria Santos</h6>
                        </div>
                        <div>
                            <button className="btn btn-light btn-sm me-2"><i className="fas fa-phone"></i></button>
                            <button className="btn btn-light btn-sm"><i className="fas fa-video"></i></button>
                        </div>
                    </div>

                    <div className="chat-messages">
                        <div className="text-center mb-4">
                            <small className="text-muted">Today, 10:00 AM</small>
                        </div>
                        <div className="message received">
                            <p className="mb-0">Hi! I just placed an order for the Elegant Bouquet.</p>
                        </div>
                        <div className="message received">
                            <p className="mb-0">Is it possible to deliver it by 3 PM today?</p>
                        </div>
                        <div className="message sent">
                            <p className="mb-0">Hello Maria! Thank you for your order.</p>
                        </div>
                        <div className="message sent">
                            <p className="mb-0">Yes, we can definitely accommodate that request. We'll prioritize your arrangement.</p>
                        </div>
                        <div className="message received">
                            <p className="mb-0">That's great! Is my order ready?</p>
                        </div>
                    </div>

                    <div className="chat-input">
                        <div className="input-group">
                            <button className="btn btn-light"><i className="fas fa-paperclip"></i></button>
                            <button className="btn btn-light"><i className="fas fa-image"></i></button>
                            <input type="text" className="form-control" placeholder="Type a message..." />
                            <button className="btn btn-primary"><i className="fas fa-paper-plane"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
