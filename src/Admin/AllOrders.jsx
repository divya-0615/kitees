"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "../firebase"
import OrderDetailModal from "./OrderDetailModal"
import "./AllOrders.css"

const AllOrders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [sortBy, setSortBy] = useState("newest")

    useEffect(() => {
        fetchAllOrders()
    }, [])

    const fetchAllOrders = async () => {
        try {
            setLoading(true)
            const ordersRef = collection(db, "all-orders")
            const q = query(ordersRef, orderBy("createdAt", "desc"))
            const querySnapshot = await getDocs(q)

            const fetchedOrders = []
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                let createdAt = data.createdAt
                if (createdAt && typeof createdAt.toDate === "function") {
                    createdAt = createdAt.toDate()
                }

                fetchedOrders.push({
                    id: doc.id,
                    ...data,
                    createdAt,
                })
            })

            setOrders(fetchedOrders)
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
                order.customerDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customerDetails?.email?.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus =
                statusFilter === "all" || (order.status && order.status.toLowerCase() === statusFilter.toLowerCase())

            return matchesSearch && matchesStatus
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.createdAt) - new Date(a.createdAt)
                case "oldest":
                    return new Date(a.createdAt) - new Date(b.createdAt)
                case "amount-high":
                    return (b.totalAmount || 0) - (a.totalAmount || 0)
                case "amount-low":
                    return (a.totalAmount || 0) - (b.totalAmount || 0)
                default:
                    return 0
            }
        })

    if (loading) {
        return (
            <div className="admin-page-loading">
                <div className="admin-page-loading-spinner"></div>
                <p>Loading orders...</p>
            </div>
        )
    }

    return (
        <div className="admin-page-all-orders">
            <div className="admin-page-orders-header">
                <div className="admin-page-header-info">
                    <h2 className="admin-page-orders-title">All Orders Management</h2>
                    <p className="admin-page-orders-subtitle">Monitor and manage all customer orders from one place</p>
                </div>
                <div className="admin-page-orders-stats">
                    <div className="admin-page-stat-item">
                        <span className="admin-page-stat-number">{orders.length}</span>
                        <span className="admin-page-stat-label">Total Orders</span>
                    </div>
                    <div className="admin-page-stat-item">
                        <span className="admin-page-stat-number">
                            ₹{orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0).toLocaleString()}
                        </span>
                        <span className="admin-page-stat-label">Total Revenue</span>
                    </div>
                </div>
            </div>

            <div className="admin-page-orders-controls">
                <div className="admin-page-search-section">
                    <div className="admin-page-search-box">
                        <span className="admin-page-search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by Order ID, Customer Name, or Email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="admin-page-search-input"
                        />
                    </div>
                </div>

                <div className="admin-page-filters-section">
                    <div className="admin-page-filter-group">
                        <label>Status:</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="admin-page-filter-select"
                        >
                            <option value="all">All Status</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="admin-page-filter-group">
                        <label>Sort by:</label>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="admin-page-filter-select">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="amount-high">Amount: High to Low</option>
                            <option value="amount-low">Amount: Low to High</option>
                        </select>
                    </div>

                    <button className="admin-page-refresh-btn" onClick={fetchAllOrders}>
                        🔄 Refresh
                    </button>
                </div>
            </div>

            <div className="admin-page-users-table-container">
                <div className="admin-page-table-wrapper">
                    <table className="admin-page-users-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date &amp; Time</th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order, idx) => (
                                    <tr
                                        key={order.id}
                                        className="admin-page-user-row"
                                        style={{ "--delay": `${idx * 0.05}s` }}
                                    >
                                        {/* Order ID as “user” cell */}
                                        <td className="admin-page-user-info">
                                            <div className="admin-page-user-avatar">📦</div>
                                            <div className="admin-page-user-details">
                                                <div className="admin-page-user-name">#{order.orderId}</div>
                                            </div>
                                        </td>

                                        {/* Customer as “contact” cell */}
                                        <td>
                                            <div>
                                                <div className="admin-page-email">
                                                    {order.customerDetails?.name || "N/A"}
                                                </div>
                                                <div className="admin-page-phone">
                                                    {order.customerDetails?.email || "N/A"}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Date & Time as “joined” cell */}
                                        <td className="admin-page-join-date">
                                            <div>{order.orderDate}</div>
                                            <div>{order.orderTime}</div>
                                        </td>

                                        {/* Items */}
                                        <td>
                                            <div className="admin-page-email">
                                                {order.totalQuantity || order.items?.length || 0} items
                                            </div>
                                        </td>

                                        {/* Amount */}
                                        <td>
                                            <div className="admin-page-email">
                                                ₹{order.totalAmount?.toFixed(2) || "0.00"}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td>
                                            <div
                                                className="admin-page-status-badge"
                                                style={{
                                                    backgroundColor: `${getStatusColor(order.status)}20`,
                                                    color: getStatusColor(order.status),
                                                    borderColor: getStatusColor(order.status),
                                                }}
                                            >
                                                <span className="admin-page-status-icon">
                                                    {getStatusIcon(order.status)}
                                                </span>
                                                <span className="admin-page-status-text">
                                                    {order.status || "Pending"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="admin-page-user-actions" style={{ justifyContent: "left" }}>
                                            <button
                                                className="admin-page-action-btn view"
                                                onClick={() => setSelectedOrder(order)}
                                                title="View details"
                                            >
                                                👁️
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="admin-page-no-users">
                                        <div className="admin-page-empty-state">
                                            <div className="admin-page-user-avatar">📦</div>
                                            <h3>No Orders Found</h3>
                                            <p>
                                                {orders.length === 0
                                                    ? "No orders have been placed yet."
                                                    : "No orders match your current search criteria."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>



            {selectedOrder && (
                <OrderDetailModal order={selectedOrder} isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}
        </div>
    )
}

export default AllOrders
