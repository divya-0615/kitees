"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "../firebase"
import "./Dashboard.css"

const DashboardOverview = () => {
    const [dashboardData, setDashboardData] = useState({
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        recentOrders: [],
        ordersByStatus: {},
        monthlyRevenue: [],
        topProducts: [],
    })
    const [loading, setLoading] = useState(true)
    const [animatedStats, setAnimatedStats] = useState({
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        pendingOrders: 0,
    })

    useEffect(() => {
        fetchDashboardData()
    }, [])

    useEffect(() => {
        // Animate numbers when data loads
        if (dashboardData.totalOrders > 0) {
            animateNumbers()
        }
    }, [dashboardData])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)

            // Fetch orders
            const ordersRef = collection(db, "all-orders")
            const ordersQuery = query(ordersRef, orderBy("createdAt", "desc"))
            const ordersSnapshot = await getDocs(ordersQuery)

            let totalRevenue = 0
            let ordersByStatus = {}
            const orders = []

            ordersSnapshot.forEach((doc) => {
                const orderData = doc.data()
                orders.push({ id: doc.id, ...orderData })

                if (orderData.totalAmount) {
                    totalRevenue += orderData.totalAmount
                }

                const status = orderData.status || 'pending'
                ordersByStatus[status] = (ordersByStatus[status] || 0) + 1
            })

            // Fetch users
            const usersRef = collection(db, "users")
            const usersSnapshot = await getDocs(usersRef)
            const totalUsers = usersSnapshot.size

            // Fetch recent orders (last 5)
            const recentOrdersQuery = query(ordersRef, orderBy("createdAt", "desc"), limit(5))
            const recentOrdersSnapshot = await getDocs(recentOrdersQuery)
            const recentOrders = []

            recentOrdersSnapshot.forEach((doc) => {
                const data = doc.data()
                let createdAt = data.createdAt
                if (createdAt && typeof createdAt.toDate === "function") {
                    createdAt = createdAt.toDate()
                }
                recentOrders.push({ id: doc.id, ...data, createdAt })
            })

            // Calculate monthly revenue (last 6 months)
            const monthlyRevenue = calculateMonthlyRevenue(orders)

            // Get top products
            const topProducts = getTopProducts(orders)

            setDashboardData({
                totalOrders: orders.length,
                totalUsers,
                totalRevenue,
                pendingOrders: ordersByStatus.pending || 0,
                recentOrders,
                ordersByStatus,
                monthlyRevenue,
                topProducts,
            })
        } catch (error) {
            console.error("Error fetching dashboard data:", error)
        } finally {
            setLoading(false)
        }
    }

    const calculateMonthlyRevenue = (orders) => {
        const months = {}
        const now = new Date()

        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            months[monthKey] = 0
        }

        orders.forEach(order => {
            if (order.createdAt && order.totalAmount) {
                const orderDate = order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt)
                const monthKey = orderDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                if (months.hasOwnProperty(monthKey)) {
                    months[monthKey] += order.totalAmount
                }
            }
        })

        return Object.entries(months).map(([month, revenue]) => ({ month, revenue }))
    }

    const getTopProducts = (orders) => {
        const productCount = {}

        orders.forEach(order => {
            if (order.items) {
                order.items.forEach(item => {
                    const productName = item.name || 'Unknown Product'
                    productCount[productName] = (productCount[productName] || 0) + (item.quantity || 1)
                })
            }
        })

        return Object.entries(productCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }))
    }

    const animateNumbers = () => {
        const animateNumber = (key, target) => {
            let current = 0
            const increment = target / 50
            const timer = setInterval(() => {
                current += increment
                if (current >= target) {
                    current = target
                    clearInterval(timer)
                }
                setAnimatedStats((prev) => ({ ...prev, [key]: Math.floor(current) }))
            }, 30)
        }

        animateNumber("totalOrders", dashboardData.totalOrders)
        animateNumber("totalUsers", dashboardData.totalUsers)
        animateNumber("totalRevenue", dashboardData.totalRevenue)
        animateNumber("pendingOrders", dashboardData.pendingOrders)
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed": return "#10b981"
            case "processing": return "#f59e0b"
            case "shipped": return "#3b82f6"
            case "delivered": return "#059669"
            case "cancelled": return "#ef4444"
            default: return "#6b7280"
        }
    }

    const statsCards = [
        {
            title: "Total Orders",
            value: animatedStats.totalOrders,
            icon: "📦",
            color: "#3b82f6",
            trend: "+12%",
            trendUp: true,
        },
        {
            title: "Total Users",
            value: animatedStats.totalUsers,
            icon: "👥",
            color: "#10b981",
            trend: "+8%",
            trendUp: true,
        },
        {
            title: "Total Revenue",
            value: `₹${animatedStats.totalRevenue.toLocaleString()}`,
            icon: "💰",
            color: "#f59e0b",
            trend: "+15%",
            trendUp: true,
        },
        {
            title: "Pending Orders",
            value: animatedStats.pendingOrders,
            icon: "⏳",
            color: "#ef4444",
            trend: "-5%",
            trendUp: false,
        },
    ]

    if (loading) {
        return (
            <div className="admin-page-loading">
                <div className="admin-page-loading-spinner"></div>
                <p>Loading dashboard data...</p>
            </div>
        )
    }

    return (
        <div className="admin-page-dashboard-overview">
            <div className="admin-page-welcome-section">
                <div className="admin-page-welcome-content">
                    <h2 className="admin-page-welcome-title">Welcome to Kitees Admin Dashboard</h2>
                    <p className="admin-page-welcome-subtitle">
                        Monitor your e-commerce performance and manage your electronics business efficiently
                    </p>
                </div>
                <div className="admin-page-welcome-icon">⚡</div>
            </div>

            <div className="admin-page-stats-grid">
                {statsCards.map((stat, index) => (
                    <div key={stat.title} className="admin-page-stat-card" style={{ "--delay": `${index * 0.1}s` }}>
                        <div className="admin-page-stat-header">
                            <div className="admin-page-stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                                {stat.icon}
                            </div>
                            <div className={`admin-page-stat-trend ${stat.trendUp ? "up" : "down"}`}>
                                <span className="admin-page-trend-icon">{stat.trendUp ? "↗️" : "↘️"}</span>
                                <span className="admin-page-trend-value">{stat.trend}</span>
                            </div>
                        </div>
                        <div className="admin-page-stat-content">
                            <h3 className="admin-page-stat-value">{stat.value}</h3>
                            <p className="admin-page-stat-title">{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="admin-page-dashboard-grid">
                {/* Recent Orders */}
                <div className="admin-page-recent-orders">
                    <div className="admin-page-section-header">
                        <h3 className="admin-page-section-title">Recent Orders</h3>
                        <button className="admin-page-view-all-btn">View All</button>
                    </div>
                    <div className="admin-page-orders-list">
                        {dashboardData.recentOrders.length > 0 ? (
                            dashboardData.recentOrders.map((order) => (
                                <div key={order.id} className="admin-page-order-item">
                                    <div className="admin-page-order-info">
                                        <div className="admin-page-order-id">#{order.orderId}</div>
                                        <div className="admin-page-order-customer">{order.customerDetails?.name}</div>
                                    </div>
                                    <div className="admin-page-order-details">
                                        <div className="admin-page-order-amount">₹{order.totalAmount?.toFixed(2)}</div>
                                        <div className={`admin-page-order-status status-${order.status?.toLowerCase()}`}>
                                            {order.status}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="admin-page-empty-state">
                                <span className="admin-page-empty-icon">📦</span>
                                <p>No recent orders</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="admin-page-revenue-chart">
                    <div className="admin-page-section-header">
                        <h3 className="admin-page-section-title">Monthly Revenue</h3>
                    </div>
                    <div className="admin-page-chart-container">
                        {dashboardData.monthlyRevenue.map((data, index) => {
                            const maxRevenue = Math.max(...dashboardData.monthlyRevenue.map(d => d.revenue))
                            const height = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0

                            return (
                                <div key={data.month} className="admin-page-chart-bar-container">
                                    <div
                                        className="admin-page-chart-bar"
                                        style={{
                                            height: `${height}%`,
                                            animationDelay: `${index * 0.1}s`
                                        }}
                                    >
                                        <div className="admin-page-chart-value">₹{data.revenue.toLocaleString()}</div>
                                    </div>
                                    <div className="admin-page-chart-label">{data.month}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="admin-page-analytics-grid">
                {/* Order Status Distribution */}
                <div className="admin-page-status-distribution">
                    <div className="admin-page-section-header">
                        <h3 className="admin-page-section-title">Order Status Distribution</h3>
                    </div>
                    <div className="admin-page-status-chart">
                        {Object.entries(dashboardData.ordersByStatus).map(([status, count]) => {
                            const percentage = dashboardData.totalOrders > 0 ? (count / dashboardData.totalOrders) * 100 : 0

                            return (
                                <div key={status} className="admin-page-status-item">
                                    <div className="admin-page-status-info">
                                        <span className="admin-page-status-name">{status}</span>
                                        <span className="admin-page-status-count">{count}</span>
                                    </div>
                                    <div className="admin-page-status-bar">
                                        <div
                                            className="admin-page-status-fill"
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: getStatusColor(status)
                                            }}
                                        ></div>
                                    </div>
                                    <span className="admin-page-status-percentage">{percentage.toFixed(1)}%</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Top Products */}
                <div className="admin-page-top-products">
                    <div className="admin-page-section-header">
                        <h3 className="admin-page-section-title">Top Products</h3>
                    </div>
                    <div className="admin-page-products-list">
                        {dashboardData.topProducts.map((product, index) => (
                            <div key={product.name} className="admin-page-product-item">
                                <div className="admin-page-product-rank">#{index + 1}</div>
                                <div className="admin-page-product-info">
                                    <div className="admin-page-product-name">{product.name}</div>
                                    <div className="admin-page-product-sales">{product.count} sold</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="admin-page-quick-actions">
                <div className="admin-page-section-header">
                    <h3 className="admin-page-section-title">Quick Actions</h3>
                </div>
                <div className="admin-page-actions-grid">
                    <button className="admin-page-action-btn">
                        <span className="admin-page-action-icon">➕</span>
                        <span>Add New Kit</span>
                    </button>
                    <button className="admin-page-action-btn">
                        <span className="admin-page-action-icon">🚀</span>
                        <span>Add Project</span>
                    </button>
                    <button className="admin-page-action-btn">
                        <span className="admin-page-action-icon">📊</span>
                        <span>View Analytics</span>
                    </button>
                    <button className="admin-page-action-btn">
                        <span className="admin-page-action-icon">👥</span>
                        <span>Manage Users</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DashboardOverview
