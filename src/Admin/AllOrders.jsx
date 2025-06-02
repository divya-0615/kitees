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

            {filteredOrders.length === 0 ? (
                <div className="admin-page-no-orders">
                    <div className="admin-page-no-orders-icon">📦</div>
                    <h3>No Orders Found</h3>
                    <p>
                        {orders.length === 0 ? "No orders have been placed yet." : "No orders match your current search criteria."}
                    </p>
                </div>
            ) : (
                <div className="admin-page-orders-table-container">
                    <div className="admin-page-orders-table">
                        <div className="admin-page-table-header">
                            <div className="admin-page-table-row admin-page-header-row">
                                <div className="admin-page-table-cell">Order ID</div>
                                <div className="admin-page-table-cell">Customer</div>
                                <div className="admin-page-table-cell">Date & Time</div>
                                <div className="admin-page-table-cell">Items</div>
                                <div className="admin-page-table-cell">Amount</div>
                                <div className="admin-page-table-cell">Status</div>
                                <div className="admin-page-table-cell">Actions</div>
                            </div>
                        </div>

                        <div className="admin-page-table-body">
                            {filteredOrders.map((order, index) => (
                                <div
                                    key={order.id}
                                    className="admin-page-table-row admin-page-order-row"
                                    style={{ "--delay": `${index * 0.05}s` }}
                                >
                                    <div className="admin-page-table-cell">
                                        <div className="admin-page-order-id">#{order.orderId}</div>
                                    </div>

                                    <div className="admin-page-table-cell">
                                        <div className="admin-page-customer-info">
                                            <div className="admin-page-customer-name">{order.customerDetails?.name || "N/A"}</div>
                                            <div className="admin-page-customer-email">{order.customerDetails?.email || "N/A"}</div>
                                        </div>
                                    </div>

                                    <div className="admin-page-table-cell">
                                        <div className="admin-page-order-datetime">
                                            <div className="admin-page-order-date">{order.orderDate}</div>
                                            <div className="admin-page-order-time">{order.orderTime}</div>
                                        </div>
                                    </div>

                                    <div className="admin-page-table-cell">
                                        <div className="admin-page-items-count">
                                            {order.totalQuantity || order.items?.length || 0} items
                                        </div>
                                    </div>

                                    <div className="admin-page-table-cell">
                                        <div className="admin-page-order-amount">₹{order.totalAmount?.toFixed(2) || "0.00"}</div>
                                    </div>

                                    <div className="admin-page-table-cell">
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

                                    <div className="admin-page-table-cell">
                                        <button className="admin-page-view-btn" onClick={() => setSelectedOrder(order)}>
                                            👁️ View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {selectedOrder && (
                <OrderDetailModal order={selectedOrder} isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}
        </div>
    )
}

export default AllOrders
