"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { db } from "../firebase"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ProtectedRoute from "../components/ProtectedRoute"
import "./MyOrders.css"

const MyOrders = () => {
    const { userData } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [expandedOrder, setExpandedOrder] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [sortBy, setSortBy] = useState("newest")

    useEffect(() => {
        if (userData?.email) {
            fetchOrders()
        }
    }, [userData?.email])
    console.log("User Data:", userData)
    const fetchOrders = async () => {
        try {
            setLoading(true)
            const ordersRef = collection(db, "all-orders")
            const q = query(ordersRef, where("customerDetails.email", "==", userData.email), orderBy("createdAt", "desc"))

            const querySnapshot = await getDocs(q)
            const ordersData = []

            querySnapshot.forEach((doc) => {
                ordersData.push({
                    id: doc.id,
                    ...doc.data(),
                })
            })

            setOrders(ordersData)
        } catch (error) {
            console.error("Error fetching orders:", error)
        } finally {
            setLoading(false)
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

    const filteredOrders = orders
        .filter((order) => {
            const matchesSearch =
                order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.items?.some((item) => item.name?.toLowerCase().includes(searchTerm.toLowerCase()))
            const matchesStatus = statusFilter === "all" || order.status?.toLowerCase() === statusFilter.toLowerCase()
            return matchesSearch && matchesStatus
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.createdAt?.toDate?.() || b.createdAt) - new Date(a.createdAt?.toDate?.() || a.createdAt)
                case "oldest":
                    return new Date(a.createdAt?.toDate?.() || a.createdAt) - new Date(b.createdAt?.toDate?.() || b.createdAt)
                case "amount-high":
                    return (b.totalAmount || 0) - (a.totalAmount || 0)
                case "amount-low":
                    return (a.totalAmount || 0) - (b.totalAmount || 0)
                default:
                    return 0
            }
        })

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId)
    }

    if (loading) {
        return (
            <ProtectedRoute message="Please login to view your orders">
                <div className="my-orders-container">
                    <Header />
                    <main className="my-orders-main">
                        <div className="my-orders-loading">
                            <div className="loading-spinner"></div>
                            <p>Loading your orders...</p>
                        </div>
                    </main>
                    <Footer />
                </div>
            </ProtectedRoute>
        )
    }

    return (
        <ProtectedRoute message="Please login to view your orders">
            <div className="my-orders-container">
                <Header />

                <main className="my-orders-main">
                    <div className="my-orders-content">
                        <div className="my-orders-header">
                            <div className="header-info">
                                <h1 className="page-title">My Orders</h1>
                                <p className="page-subtitle">Welcome back, {userData?.name}! Here are all your orders.</p>
                                <div className="orders-stats">
                                    <div className="stat-item">
                                        <span className="stat-number">{orders.length}</span>
                                        <span className="stat-label">Total Orders</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">
                                            ₹{orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0).toFixed(2)}
                                        </span>
                                        <span className="stat-label">Total Spent</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="orders-controls">
                            <div className="search-section">
                                <div className="search-box">
                                    <span className="search-icon">🔍</span>
                                    <input
                                        type="text"
                                        placeholder="Search by Order ID or Product Name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="search-input"
                                    />
                                </div>
                            </div>

                            <div className="filters-section">
                                <div className="filter-group">
                                    <label>Status:</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>

                                <div className="filter-group">
                                    <label>Sort by:</label>
                                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                        <option value="amount-high">Amount: High to Low</option>
                                        <option value="amount-low">Amount: Low to High</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {filteredOrders.length === 0 ? (
                            <div className="no-orders">
                                <div className="no-orders-icon">📦</div>
                                <h3>No Orders Found</h3>
                                <p>
                                    {orders.length === 0
                                        ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                                        : "No orders match your current search criteria."}
                                </p>
                                <button className="shop-now-btn" onClick={() => (window.location.href = "/")}>
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="orders-list">
                                {filteredOrders.map((order) => (
                                    <div key={order.id} className="order-card">
                                        <div className="order-header" onClick={() => toggleOrderExpansion(order.id)}>
                                            <div className="order-main-info">
                                                <div className="order-id-section">
                                                    <h3 className="order-id">#{order.orderId}</h3>
                                                    <div className="order-status" style={{ backgroundColor: getStatusColor(order.status) }}>
                                                        <span className="status-icon">{getStatusIcon(order.status)}</span>
                                                        <span className="status-text">{order.status || "Pending"}</span>
                                                    </div>
                                                </div>

                                                <div className="order-meta">
                                                    <div className="meta-item">
                                                        <span className="meta-icon">📅</span>
                                                        <span>{order.orderDate}</span>
                                                    </div>
                                                    <div className="meta-item">
                                                        <span className="meta-icon">🕒</span>
                                                        <span>{order.orderTime}</span>
                                                    </div>
                                                    <div className="meta-item">
                                                        <span className="meta-icon">📦</span>
                                                        <span>{order.itemCount} items</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="order-amount-section">
                                                <div className="order-amount">₹{order.totalAmount?.toFixed(2)}</div>
                                                <div className="expand-icon">{expandedOrder === order.id ? "▲" : "▼"}</div>
                                            </div>
                                        </div>

                                        {expandedOrder === order.id && (
                                            <div className="order-details">
                                                <div className="details-grid">
                                                    <div className="shipping-info">
                                                        <h4>🚚 Shipping Address</h4>
                                                        <div className="address-details">
                                                            <p>{order.shippingAddress?.address}</p>
                                                            <p>
                                                                {order.shippingAddress?.city}, {order.shippingAddress?.state}
                                                            </p>
                                                            <p>PIN: {order.shippingAddress?.pincode}</p>
                                                        </div>
                                                    </div>

                                                    <div className="payment-info">
                                                        <h4>💳 Payment Details</h4>
                                                        <div className="payment-details">
                                                            <p>Method: {order.paymentMethod?.toUpperCase()}</p>
                                                            <p>Amount: ₹{order.totalAmount?.toFixed(2)}</p>
                                                            <p>Items: {order.totalQuantity} pieces</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="order-items">
                                                    <h4>📋 Order Items</h4>
                                                    <div className="items-list">
                                                        {order.items?.map((item, index) => (
                                                            <div key={index} className="order-item">
                                                                <img
                                                                    src={item.image || "/placeholder.svg?height=60&width=60"}
                                                                    alt={item.name}
                                                                    className="item-image"
                                                                />
                                                                <div className="item-details">
                                                                    <h5 className="item-name">{item.name}</h5>
                                                                    <p className="item-type">{item.type || "Product"}</p>
                                                                    {item.components && item.components.length > 0 && (
                                                                        <p className="item-components">{item.components.length} components included</p>
                                                                    )}
                                                                </div>
                                                                <div className="item-quantity">
                                                                    <span>Qty: {item.quantity}</span>
                                                                </div>
                                                                <div className="item-price">
                                                                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="order-actions">
                                                    <button className="action-btn track-btn">📍 Track Order</button>
                                                    <button className="action-btn download-btn">📄 Download Invoice</button>
                                                    <button className="action-btn support-btn">💬 Contact Support</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>

                <Footer />
            </div>
        </ProtectedRoute>
    )
}

export default MyOrders
