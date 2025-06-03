"use client"

import { useState, useEffect } from "react"
import "./Dashboard.css"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts"
import { ArrowUp, ArrowDown, Package, Users, DollarSign, Clock, TrendingUp } from "lucide-react"

const DashboardOverview = ({ data, loading }) => {
    const [animatedStats, setAnimatedStats] = useState({
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        pendingOrders: 0,
    })

    useEffect(() => {
        // Animate numbers on load
        if (!loading && data) {
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

            animateNumber("totalOrders", data.totalOrders)
            animateNumber("totalUsers", data.totalUsers)
            animateNumber("totalRevenue", data.totalRevenue)
            animateNumber("pendingOrders", data.pendingOrders)
        }
    }, [data, loading])

    const statsCards = [
        {
            title: "Total Orders",
            value: animatedStats.totalOrders,
            icon: <Package size={24} />,
            color: "#3b82f6",
            trend: "+12%",
            trendUp: true,
        },
        {
            title: "Total Users",
            value: animatedStats.totalUsers,
            icon: <Users size={24} />,
            color: "#10b981",
            trend: "+8%",
            trendUp: true,
        },
        {
            title: "Total Revenue",
            value: `₹${animatedStats.totalRevenue.toLocaleString()}`,
            icon: <DollarSign size={24} />,
            color: "#f59e0b",
            trend: "+15%",
            trendUp: true,
        },
        {
            title: "Pending Orders",
            value: animatedStats.pendingOrders,
            icon: <Clock size={24} />,
            color: "#ef4444",
            trend: "-5%",
            trendUp: false,
        },
    ]

    // Colors for pie chart
    const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

    // Sample data for product categories distribution
    const categoryData = [
        { name: "Microcontroller", value: 35 },
        { name: "IoT", value: 25 },
        { name: "Robotics", value: 20 },
        { name: "Display", value: 15 },
        { name: "Sensors", value: 5 },
    ]

    if (loading) {
        return (
            <div className="admin-page-dashboard-loading">
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
                <div className="admin-page-welcome-icon">
                    <TrendingUp size={48} />
                </div>
            </div>

            <div className="admin-page-stats-grid">
                {statsCards.map((stat, index) => (
                    <div key={stat.title} className="admin-page-stat-card" style={{ "--delay": `${index * 0.1}s` }}>
                        <div className="admin-page-stat-header">
                            <div className="admin-page-stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                                {stat.icon}
                            </div>
                            <div className={`admin-page-stat-trend ${stat.trendUp ? "up" : "down"}`}>
                                <span className="admin-page-trend-icon">
                                    {stat.trendUp ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                                </span>
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

            <div className="admin-page-charts-grid">
                {/* Monthly Sales Chart */}
                <div className="admin-page-chart-card">
                    <div className="admin-page-chart-header">
                        <h3 className="admin-page-chart-title">Monthly Sales</h3>
                        <div className="admin-page-chart-actions">
                            <select className="admin-page-chart-select">
                                <option value="6months">Last 6 Months</option>
                                <option value="3months">Last 3 Months</option>
                                <option value="1year">Last Year</option>
                            </select>
                        </div>
                    </div>
                    <div className="admin-page-chart-content">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.monthlySales || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "none",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                    }}
                                />
                                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Product Categories Chart */}
                <div className="admin-page-chart-card">
                    <div className="admin-page-chart-header">
                        <h3 className="admin-page-chart-title">Product Categories</h3>
                    </div>
                    <div className="admin-page-chart-content">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend layout="vertical" verticalAlign="middle" align="right" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "none",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="admin-page-dashboard-grid">
                <div className="admin-page-recent-orders">
                    <div className="admin-page-section-header">
                        <h3 className="admin-page-section-title">Recent Orders</h3>
                        <button className="admin-page-view-all-btn">View All</button>
                    </div>
                    <div className="admin-page-orders-list">
                        {data.recentOrders && data.recentOrders.length > 0 ? (
                            data.recentOrders.map((order) => (
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
                                <span className="admin-page-empty-icon">
                                    <Package size={32} />
                                </span>
                                <p>No recent orders</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="admin-page-dashboard-side">
                    <div className="admin-page-top-products">
                        <div className="admin-page-section-header">
                            <h3 className="admin-page-section-title">Top Products</h3>
                        </div>
                        <div className="admin-page-products-list">
                            {data.topProducts && data.topProducts.length > 0 ? (
                                data.topProducts.map((product, index) => (
                                    <div key={index} className="admin-page-product-item">
                                        <div className="admin-page-product-rank">{index + 1}</div>
                                        <div className="admin-page-product-info">
                                            <div className="admin-page-product-name">{product.name}</div>
                                            <div className="admin-page-product-count">{product.count} units sold</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="admin-page-empty-state">
                                    <span className="admin-page-empty-icon">
                                        <Package size={32} />
                                    </span>
                                    <p>No product data available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="admin-page-performance-metrics">
                        <div className="admin-page-section-header">
                            <h3 className="admin-page-section-title">Performance Metrics</h3>
                        </div>
                        <div className="admin-page-metrics-grid">
                            <div className="admin-page-metric-card">
                                <div className="admin-page-metric-header">
                                    <h4>Order Completion Rate</h4>
                                    <span className="admin-page-metric-percentage">94%</span>
                                </div>
                                <div className="admin-page-progress-bar">
                                    <div className="admin-page-progress-fill" style={{ width: "94%" }}></div>
                                </div>
                            </div>
                            <div className="admin-page-metric-card">
                                <div className="admin-page-metric-header">
                                    <h4>Customer Satisfaction</h4>
                                    <span className="admin-page-metric-percentage">98%</span>
                                </div>
                                <div className="admin-page-progress-bar">
                                    <div className="admin-page-progress-fill" style={{ width: "98%" }}></div>
                                </div>
                            </div>
                            <div className="admin-page-metric-card">
                                <div className="admin-page-metric-header">
                                    <h4>Inventory Turnover</h4>
                                    <span className="admin-page-metric-percentage">87%</span>
                                </div>
                                <div className="admin-page-progress-bar">
                                    <div className="admin-page-progress-fill" style={{ width: "87%" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardOverview
