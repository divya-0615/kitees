"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./AdminPanel.css"

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [stats, setStats] = useState({
    totalUsers: 1247,
    totalOrders: 856,
    totalRevenue: 45670,
    totalProducts: 324,
  })
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is admin (in real app, this would be more secure)
    const isAdmin = localStorage.getItem("isAdmin")
    if (!isAdmin) {
      navigate("/login")
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("isAdmin")
    navigate("/")
  }

  const renderDashboard = () => (
    <div className="dashboard-content">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers.toLocaleString()}</p>
            <span className="stat-change positive">+12% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>Total Orders</h3>
            <p className="stat-number">{stats.totalOrders.toLocaleString()}</p>
            <span className="stat-change positive">+8% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Revenue</h3>
            <p className="stat-number">${stats.totalRevenue.toLocaleString()}</p>
            <span className="stat-change positive">+15% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛍️</div>
          <div className="stat-info">
            <h3>Products</h3>
            <p className="stat-number">{stats.totalProducts.toLocaleString()}</p>
            <span className="stat-change neutral">No change</span>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>Sales Overview</h3>
          <div className="chart-placeholder">
            <p>📊 Sales chart would be displayed here</p>
          </div>
        </div>

        <div className="chart-card">
          <h3>Recent Orders</h3>
          <div className="orders-list">
            <div className="order-item">
              <span className="order-id">#ORD-001</span>
              <span className="order-customer">John Doe</span>
              <span className="order-amount">₹125.99</span>
              <span className="order-status completed">Completed</span>
            </div>
            <div className="order-item">
              <span className="order-id">#ORD-002</span>
              <span className="order-customer">Jane Smith</span>
              <span className="order-amount">₹89.50</span>
              <span className="order-status pending">Pending</span>
            </div>
            <div className="order-item">
              <span className="order-id">#ORD-003</span>
              <span className="order-customer">Mike Johnson</span>
              <span className="order-amount">₹234.75</span>
              <span className="order-status shipped">Shipped</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderUsers = () => (
    <div className="users-content">
      <div className="section-header">
        <h2>User Management</h2>
        <button className="add-btn">+ Add User</button>
      </div>
      <div className="users-table">
        <div className="table-header">
          <span>Name</span>
          <span>Email</span>
          <span>College</span>
          <span>Join Date</span>
          <span>Actions</span>
        </div>
        <div className="table-row">
          <span>John Doe</span>
          <span>john@example.com</span>
          <span>MIT</span>
          <span>2024-01-15</span>
          <div className="actions">
            <button className="edit-btn">Edit</button>
            <button className="delete-btn">Delete</button>
          </div>
        </div>
        <div className="table-row">
          <span>Jane Smith</span>
          <span>jane@example.com</span>
          <span>Stanford</span>
          <span>2024-01-20</span>
          <div className="actions">
            <button className="edit-btn">Edit</button>
            <button className="delete-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderProducts = () => (
    <div className="products-content">
      <div className="section-header">
        <h2>Product Management</h2>
        <button className="add-btn">+ Add Product</button>
      </div>
      <div className="products-grid">
        <div className="product-card">
          <div className="product-image">📱</div>
          <h4>Arduino Uno R3</h4>
          <p>₹25.99</p>
          <div className="product-actions">
            <button className="edit-btn">Edit</button>
            <button className="delete-btn">Delete</button>
          </div>
        </div>
        <div className="product-card">
          <div className="product-image">🔌</div>
          <h4>Raspberry Pi 4</h4>
          <p>₹75.00</p>
          <div className="product-actions">
            <button className="edit-btn">Edit</button>
            <button className="delete-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderOrders = () => (
    <div className="orders-content">
      <div className="section-header">
        <h2>Order Management</h2>
        <div className="filters">
          <select>
            <option>All Orders</option>
            <option>Pending</option>
            <option>Shipped</option>
            <option>Completed</option>
          </select>
        </div>
      </div>
      <div className="orders-table">
        <div className="table-header">
          <span>Order ID</span>
          <span>Customer</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Date</span>
          <span>Actions</span>
        </div>
        <div className="table-row">
          <span>#ORD-001</span>
          <span>John Doe</span>
          <span>₹125.99</span>
          <span className="status completed">Completed</span>
          <span>2024-01-15</span>
          <div className="actions">
            <button className="view-btn">View</button>
            <button className="edit-btn">Edit</button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="admin-panel">
      <div className="admin-sidebar">
        <div className="admin-header">
          <Link to="/" className="admin-logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">Kitees Admin</span>
          </Link>
        </div>

        <nav className="admin-nav">
          <button
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </button>
          <button className={`nav-item ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
            <span className="nav-icon">👥</span>
            Users
          </button>
          <button
            className={`nav-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <span className="nav-icon">📦</span>
            Products
          </button>
          <button
            className={`nav-item ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <span className="nav-icon">🛒</span>
            Orders
          </button>
        </nav>

        <div className="admin-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </div>

      <div className="admin-main">
        <div className="admin-topbar">
          <h1>
            {activeTab === "dashboard" && "Dashboard"}
            {activeTab === "users" && "User Management"}
            {activeTab === "products" && "Product Management"}
            {activeTab === "orders" && "Order Management"}
          </h1>
          <div className="admin-user">
            <span className="admin-avatar">👑</span>
            <span className="admin-name">Admin</span>
          </div>
        </div>

        <div className="admin-content">
          {activeTab === "dashboard" && renderDashboard()}
          {activeTab === "users" && renderUsers()}
          {activeTab === "products" && renderProducts()}
          {activeTab === "orders" && renderOrders()}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
