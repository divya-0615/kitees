"use client"

import { useState, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../firebase"
import { signOut } from "firebase/auth"
import DashboardOverview from "../Admin/Dashboard"
import AllOrders from "../Admin/AllOrders"
import AvailableKitsAdmin from "../Admin/AvailableKits"
import CustomKitsAdmin from "../Admin/CustomKits"
import MiniProjectsAdmin from "../Admin/MiniProjects"
import CustomProjectRequests from "../Admin/CustomProjectRequests"
import ContactedUsers from "../Admin/ContactedUsers"
import AllUsers from "../Admin/AllUsers"
import "./AdminPanel.css"
import { ChevronLeft, ChevronRight } from "lucide-react"

const AdminDashboard = () => {
  const [user, loading, error] = useAuthState(auth)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Sample data for dashboard overview
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 156,
    totalUsers: 89,
    totalRevenue: 45670,
    pendingOrders: 12,
    recentOrders: [
      {
        id: "1",
        orderId: "ORD-001",
        customerDetails: { name: "John Doe" },
        totalAmount: 299.99,
        status: "confirmed",
      },
      {
        id: "2",
        orderId: "ORD-002",
        customerDetails: { name: "Jane Smith" },
        totalAmount: 149.50,
        status: "shipped",
      },
      {
        id: "3",
        orderId: "ORD-003",
        customerDetails: { name: "Mike Johnson" },
        totalAmount: 89.99,
        status: "pending",
      },
    ],
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "📊",
      component: DashboardOverview,
      description: "Overview & Analytics",
    },
    {
      id: "orders",
      label: "All Orders",
      icon: "📦",
      component: AllOrders,
      description: "Order Management",
    },
    {
      id: "available-kits",
      label: "Available Kits",
      icon: "🔧",
      component: AvailableKitsAdmin,
      description: "Kit Catalog",
    },
    {
      id: "custom-kits",
      label: "Custom Kits",
      icon: "⚙️",
      component: CustomKitsAdmin,
      description: "Component Library",
    },
    {
      id: "mini-projects",
      label: "Mini Projects",
      icon: "🚀",
      component: MiniProjectsAdmin,
      description: "Project Gallery",
    },
    {
      id: "project-requests",
      label: "Project Requests",
      icon: "📝",
      component: CustomProjectRequests,
      description: "Custom Requests",
    },
    {
      id: "contacts",
      label: "Contact Messages",
      icon: "📧",
      component: ContactedUsers,
      description: "Customer Inquiries",
    },
    {
      id: "users",
      label: "All Users",
      icon: "👥",
      component: AllUsers,
      description: "User Management",
    },
  ]

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const renderActiveComponent = () => {
    const activeItem = menuItems.find((item) => item.id === activeSection)
    if (!activeItem) return <DashboardOverview data={dashboardData} />

    const Component = activeItem.component
    if (activeSection === "dashboard") {
      return <Component data={dashboardData} />
    }
    return <Component />
  }

  // Loading state
  if (loading) {
    return (
      <div className="admin-page-auth-loading">
        <div className="admin-page-loading-spinner"></div>
        <p>Checking authentication...</p>
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="admin-page-auth-required">
        <div className="admin-page-auth-card">
          <div className="admin-page-auth-icon">🔐</div>
          <h2>Admin Access Required</h2>
          <p>Please sign in with your admin account to access the dashboard.</p>
          <button
            className="admin-page-auth-btn"
            onClick={() => {
              // Redirect to login or show login modal
              window.location.href = "/login"
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  // Check if user is admin (kitees@gmail.com)
  if (user.email !== "kitees@gmail.com") {
    return (
      <div className="admin-page-access-denied">
        <div className="admin-page-access-card">
          <div className="admin-page-access-icon">🚫</div>
          <h2>Access Denied</h2>
          <p>You don't have permission to access the admin dashboard.</p>
          <p className="admin-page-user-email">Signed in as: {user.email}</p>
          <button className="admin-page-signout-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page-dashboard">
      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div className="admin-page-mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-page-sidebar ${sidebarCollapsed ? "collapsed" : ""} ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="admin-page-sidebar-header">
          <div className="admin-page-logo">
            <span className="admin-page-logo-icon">⚡</span>
            {!sidebarCollapsed && <span className="admin-page-logo-text">Kitees Admin</span>}
          </div>
          {!isMobile && (
            <button
              className="admin-page-sidebar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </button>
          )}
        </div>

        <nav className="admin-page-sidebar-nav">
          <ul className="admin-page-nav-list">
            {menuItems.map((item) => (
              <li key={item.id} className="admin-page-nav-item">
                <button
                  className={`admin-page-nav-link ${activeSection === item.id ? "active" : ""}`}
                  onClick={() => {
                    setActiveSection(item.id)
                    if (isMobile) setMobileMenuOpen(false)
                  }}
                  title={sidebarCollapsed ? item.label : ""}
                >
                  <span className="admin-page-nav-icon">{item.icon}</span>
                  {!sidebarCollapsed && (
                    <div className="admin-page-nav-content">
                      <span className="admin-page-nav-label">{item.label}</span>
                      <span className="admin-page-nav-description">{item.description}</span>
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-page-sidebar-footer">
          {/* <div className="admin-page-user-info">
            <div className="admin-page-user-avatar">
              <span className="admin-page-avatar-text">👑</span>
            </div>
            {!sidebarCollapsed && (
              <div className="admin-page-user-details">
                <div className="admin-page-user-name">Admin</div>
                <div className="admin-page-user-email">{user.email}</div>
              </div>
            )}
          </div> */}
          <button
            className="admin-page-signout-btn"
            onClick={handleSignOut}
            title={sidebarCollapsed ? "Sign Out" : ""}
          >
            <span className="admin-page-signout-icon">🚪</span>
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-page-main">
        {/* Top Bar */}
        <header className="admin-page-topbar">
          <div className="admin-page-topbar-left">
            {isMobile && (
              <button
                className="admin-page-mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="admin-page-hamburger">☰</span>
              </button>
            )}
            <div className="admin-page-breadcrumb">
              <span className="admin-page-breadcrumb-home">🏠</span>
              <span className="admin-page-breadcrumb-separator">/</span>
              <span className="admin-page-breadcrumb-current">
                {menuItems.find((item) => item.id === activeSection)?.label || "Dashboard"}
              </span>
            </div>
          </div>
          <div className="admin-page-topbar-right">
            <div className="admin-page-admin-badge">
              <span className="admin-page-badge-icon">👑</span>
              <span className="admin-page-badge-text">Admin Panel</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="admin-page-content">{renderActiveComponent()}</div>
      </main>
    </div>
  )
}

export default AdminDashboard
