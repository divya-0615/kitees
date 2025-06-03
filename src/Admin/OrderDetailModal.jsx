"use client"

import { useState } from "react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase"
import "./OrderDetailModal.css"

const OrderDetailModal = ({ order, isOpen, onClose }) => {
    const [updating, setUpdating] = useState(false)
    const [newStatus, setNewStatus] = useState(order?.status || "confirmed")

    if (!isOpen || !order) return null

    const handleStatusUpdate = async () => {
        try {
            setUpdating(true)
            const orderRef = doc(db, "all-orders", order.id)
            await updateDoc(orderRef, {
                status: newStatus,
                updatedAt: new Date(),
            })

            // Update local order object
            order.status = newStatus

            alert("Order status updated successfully!")
        } catch (error) {
            console.error("Error updating order status:", error)
            alert("Failed to update order status")
        } finally {
            setUpdating(false)
        }
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed":
                return "#10b981"
            case "processing":
                return "#f59e0b"
            case "shipped":
                return "#3b82f6"
            case "delivered":
                return "#059669"
            case "cancelled":
                return "#ef4444"
            default:
                return "#6b7280"
        }
    }

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed":
                return "✅"
            case "processing":
                return "⚙️"
            case "shipped":
                return "🚚"
            case "delivered":
                return "📦"
            case "cancelled":
                return "❌"
            default:
                return "📋"
        }
    }

    return (
        <div className="admin-page-modal-overlay" onClick={onClose}>
            <div className="admin-page-modal-content admin-page-order-detail-modal" onClick={(e) => e.stopPropagation()}>
                <div className="admin-page-modal-header">
                    <div className="admin-page-modal-title-section">
                        <h2 className="admin-page-modal-title">Order Details</h2>
                        <div className="admin-page-order-id-badge">#{order.orderId}</div>
                    </div>
                    <button className="admin-page-modal-close" onClick={onClose}>
                        <span>✕</span>
                    </button>
                </div>

                <div className="admin-page-modal-body">
                    <div className="admin-page-order-overview">
                        <div className="admin-page-overview-grid">
                            <div className="admin-page-overview-card">
                                <div className="admin-page-overview-icon">📅</div>
                                <div className="admin-page-overview-content">
                                    <h4>Order Date</h4>
                                    <p>
                                        {order.orderDate} at {order.orderTime}
                                    </p>
                                </div>
                            </div>

                            <div className="admin-page-overview-card">
                                <div className="admin-page-overview-icon">💰</div>
                                <div className="admin-page-overview-content">
                                    <h4>Total Amount</h4>
                                    <p>₹{order.totalAmount?.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="admin-page-overview-card">
                                <div className="admin-page-overview-icon">📦</div>
                                <div className="admin-page-overview-content">
                                    <h4>Total Items</h4>
                                    <p>{order.totalQuantity} items</p>
                                </div>
                            </div>

                            <div className="admin-page-overview-card">
                                <div className="admin-page-overview-icon">💳</div>
                                <div className="admin-page-overview-content">
                                    <h4>Payment Method</h4>
                                    <p>{order.paymentMethod?.toUpperCase()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="admin-page-order-sections">
                        <div className="admin-page-section-grid">
                            {/* Customer Information */}
                            <div className="admin-page-info-section">
                                <h3 className="admin-page-section-title">
                                    <span className="admin-page-section-icon">👤</span>
                                    Customer Information
                                </h3>
                                <div className="admin-page-info-content">
                                    <div className="admin-page-info-row">
                                        <span className="admin-page-info-label">Name:</span>
                                        <span className="admin-page-info-value">{order.customerDetails?.name}</span>
                                    </div>
                                    <div className="admin-page-info-row">
                                        <span className="admin-page-info-label">Email:</span>
                                        <span className="admin-page-info-value">{order.customerDetails?.email}</span>
                                    </div>
                                    <div className="admin-page-info-row">
                                        <span className="admin-page-info-label">Mobile:</span>
                                        <span className="admin-page-info-value">{order.customerDetails?.mobile}</span>
                                    </div>
                                    <div className="admin-page-info-row">
                                        <span className="admin-page-info-label">College:</span>
                                        <span className="admin-page-info-value">{order.customerDetails?.college}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="admin-page-info-section">
                                <h3 className="admin-page-section-title">
                                    <span className="admin-page-section-icon">🚚</span>
                                    Shipping Address
                                </h3>
                                <div className="admin-page-info-content">
                                    <div className="admin-page-address-block">
                                        <p>{order.shippingAddress?.address}</p>
                                        <p>
                                            {order.shippingAddress?.city}, {order.shippingAddress?.state}
                                        </p>
                                        <p>PIN: {order.shippingAddress?.pincode}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Status Management */}
                        <div className="admin-page-status-section">
                            <h3 className="admin-page-section-title">
                                <span className="admin-page-section-icon">📋</span>
                                Order Status Management
                            </h3>
                            <div className="admin-page-status-content">
                                <div className="admin-page-current-status">
                                    <span className="admin-page-status-label">Current Status:</span>
                                    <div
                                        className="admin-page-status-badge"
                                        style={{
                                            backgroundColor: `${getStatusColor(order.status)}20`,
                                            color: getStatusColor(order.status),
                                            borderColor: getStatusColor(order.status),
                                        }}
                                    >
                                        <span className="admin-page-status-icon">{getStatusIcon(order.status)}</span>
                                        <span className="admin-page-status-text">{order.status || "Pending"}</span>
                                    </div>
                                </div>

                                <div className="admin-page-status-update">
                                    <label className="admin-page-status-update-label">Update Status:</label>
                                    <div className="admin-page-status-update-controls">
                                        <select
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            className="admin-page-status-select"
                                        >
                                            <option value="confirmed">Confirmed</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                        <button
                                            onClick={handleStatusUpdate}
                                            disabled={updating || newStatus === order.status}
                                            className="admin-page-update-btn"
                                        >
                                            {updating ? "Updating..." : "Update Status"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="admin-page-items-section">
                            <h3 className="admin-page-section-title">
                                <span className="admin-page-section-icon">📦</span>
                                Order Items ({order.items?.length || 0})
                            </h3>
                            <div className="admin-page-items-list">
                                {order.items?.map((item, index) => (
                                    <div key={index} className="admin-page-order-item">
                                        <div className="admin-page-item-image-container">
                                            <img
                                                src={item.image || "/placeholder.svg?height=80&width=80"}
                                                alt={item.name}
                                                className="admin-page-item-image"
                                            />
                                        </div>

                                        <div className="admin-page-item-details">
                                            <h4 className="admin-page-item-name">{item.name}</h4>
                                            <p className="admin-page-item-type">{item.type || "Product"}</p>

                                            {item.components && item.components.length > 0 && (
                                                <div className="admin-page-item-components">
                                                    <strong>Components:</strong>
                                                    <ul className="admin-page-components-list">
                                                        {item.components.map((comp, idx) => (
                                                            <li key={idx} className="admin-page-component-item">
                                                                {comp.name}
                                                                {comp.quantity ? ` x${comp.quantity}` : ""}
                                                                {comp.price !== undefined ? ` — ₹${Number(comp.price).toFixed(2)}` : ""}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        <div className="admin-page-item-pricing">
                                            <div className="admin-page-item-quantity">Qty: {item.quantity}</div>
                                            <div className="admin-page-item-unit-price">₹{item.price?.toFixed(2)}</div>
                                            <div className="admin-page-item-total-price">₹{(item.price * item.quantity).toFixed(2)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="admin-page-order-total">
                                <div className="admin-page-total-row">
                                    <span className="admin-page-total-label">Total Amount:</span>
                                    <span className="admin-page-total-value">₹{order.totalAmount?.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="admin-page-order-modal-footer">
                    <button className="admin-page-btn admin-page-btn-secondary" onClick={onClose}>
                        Close
                    </button>
                    <button className="admin-page-btn admin-page-btn-primary">📄 Generate Invoice</button>
                </div>
            </div>
        </div>
    )
}

export default OrderDetailModal
