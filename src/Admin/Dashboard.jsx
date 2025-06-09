"use client"

import { useState, useEffect } from "react"
import "./Dashboard.css"
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
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
    const [timeFilter, setTimeFilter] = useState("6months")
    const [filteredSalesData, setFilteredSalesData] = useState([])

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

            // Filter sales data based on selected time period
            filterSalesData(timeFilter)
        }
    }, [data, loading, timeFilter])

    // Function to filter sales data based on time period
    const filterSalesData = (filter) => {
        if (!data?.monthlySales) return

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth()

        let filteredData = []

        switch (filter) {
            case "3months":
                // Last 3 months
                for (let i = 2; i >= 0; i--) {
                    const monthIndex = (currentMonth - i + 12) % 12
                    const monthData = data.monthlySales.find((item) => item.name === months[monthIndex])
                    if (monthData) {
                        filteredData.push(monthData)
                    } else {
                        filteredData.push({
                            name: months[monthIndex],
                            revenue: 0,
                            orders: 0,
                        })
                    }
                }
                break
            case "1year":
                // Full year (Jan to Dec)
                for (let i = 0; i < 12; i++) {
                    const monthData = data.monthlySales.find((item) => item.name === months[i])
                    if (monthData) {
                        filteredData.push(monthData)
                    } else {
                        filteredData.push({
                            name: months[i],
                            revenue: 0,
                            orders: 0,
                        })
                    }
                }
                break
            case "6months":
            default:
                // Last 6 months (default)
                filteredData = [...data.monthlySales]
                break
        }

        setFilteredSalesData(filteredData)
    }

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

    // Replace the generateCurrentMonthData function with this:
    const generateCurrentMonthData = () => {
        if (!data?.recentOrders) return []

        const currentDate = new Date()
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth()
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
        const currentDay = Math.min(currentDate.getDate(), daysInMonth)

        // Initialize daily data array
        const dailyData = []
        for (let i = 1; i <= currentDay; i++) {
            dailyData.push({
                day: i,
                sales: 0,
                orders: 0,
            })
        }

        // Process all orders to get daily sales for current month
        const allOrders = data.allOrders || data.recentOrders || []

        allOrders.forEach((order) => {
            const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt)

            // Check if order is from current month and year
            if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
                const dayOfMonth = orderDate.getDate()

                // Find the corresponding day in our data array
                const dayIndex = dailyData.findIndex((item) => item.day === dayOfMonth)
                if (dayIndex !== -1) {
                    dailyData[dayIndex].sales += order.totalAmount || 0
                    dailyData[dayIndex].orders += 1
                }
            }
        })

        return dailyData
    }

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
                            <select
                                className="admin-page-chart-select"
                                value={timeFilter}
                                onChange={(e) => setTimeFilter(e.target.value)}
                            >
                                <option value="3months">Last 3 Months</option>
                                <option value="6months">Last 6 Months</option>
                                <option value="1year">Full Year</option>
                            </select>
                        </div>
                    </div>
                    <div className="admin-page-chart-content">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={filteredSalesData || []}>
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
                                    formatter={(value, name) => [
                                        name === "revenue" ? `₹${value.toLocaleString()}` : value,
                                        name = "Revenue",
                                    ]}
                                />
                                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Current Month Sales Line Chart */}
                <div className="admin-page-chart-card">
                    <div className="admin-page-chart-header">
                        <h3 className="admin-page-chart-title">Current Month Daily Sales</h3>
                    </div>
                    <div className="admin-page-chart-content">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={generateCurrentMonthData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "none",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                    }}
                                    formatter={(value, name) => [
                                        name === "sales" ? `₹${value.toLocaleString()}` : value,
                                        name === "sales" ? "Sales Amount" : "Orders Count",
                                    ]}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
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
