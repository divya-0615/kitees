"use client"

import { useState, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../firebase"
import { signOut } from "firebase/auth"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import DashboardOverview from "../Admin/Dashboard"
import AllOrders from "../Admin/AllOrders"
import AvailableKitsAdmin from "../Admin/AvailableKits"
import CustomKitsAdmin from "../Admin/CustomKits"
import MiniProjectsAdmin from "../Admin/MiniProjects"
import CustomProjectRequests from "../Admin/CustomProjectRequests"
import ContactedUsers from "../Admin/ContactedUsers"
import AllUsers from "../Admin/AllUsers"
import "./AdminPanel.css"

// Import icons from lucide-react
import {
  LayoutDashboard,
  Package,
  Wrench,
  Settings,
  Rocket,
  FileText,
  Mail,
  Users,
  ChevronLeft,
  ChevronRight,
  Menu,
  Home,
  LogOut,
  Crown,
} from "lucide-react"

const AdminDashboard = () => {
  const [user, loading, error] = useAuthState(auth)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    recentOrders: [],
    monthlySales: [],
    topProducts: [],
  })
  const [dataLoading, setDataLoading] = useState(true)

  // Fetch dashboard data from Firestore
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDataLoading(true)

        // Fetch orders
        const ordersRef = collection(db, "all-orders")
        const ordersQuery = query(ordersRef, orderBy("createdAt", "desc"))
        const ordersSnapshot = await getDocs(ordersQuery)

        const orders = []
        let totalRevenue = 0
        let pendingOrders = 0

        ordersSnapshot.forEach((doc) => {
          const orderData = doc.data()
          orders.push({
            id: doc.id,
            ...orderData,
          })

          // Calculate revenue and count pending orders
          if (orderData.totalAmount) {
            totalRevenue += orderData.totalAmount
          }

          if (orderData.status === "pending" || orderData.status === "processing") {
            pendingOrders++
          }
        })

        // Fetch users
        const usersRef = collection(db, "users")
        const usersSnapshot = await getDocs(usersRef)
        const totalUsers = usersSnapshot.size

        // Get recent orders
        const recentOrders = orders.slice(0, 5)

        // Generate monthly sales data (last 6 months)
        const monthlySales = generateMonthlySalesData(orders)

        // Get top products
        const topProducts = getTopProducts(orders)

        setDashboardData({
          totalOrders: orders.length,
          totalUsers,
          totalRevenue,
          pendingOrders,
          recentOrders,
          monthlySales,
          topProducts,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setDataLoading(false)
      }
    }

    if (user && user.email === "kitees@gmail.com") {
      fetchDashboardData()
    }
  }, [user])

  // Generate monthly sales data
  const generateMonthlySalesData = (orders) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentDate = new Date()
    const monthlySales = []

    // Generate data for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthName = months[month.getMonth()]

      // Filter orders for this month
      const monthOrders = orders.filter((order) => {
        const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt)
        return orderDate.getMonth() === month.getMonth() && orderDate.getFullYear() === month.getFullYear()
      })

      // Calculate total revenue for this month
      const revenue = monthOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)

      monthlySales.push({
        name: monthName,
        revenue: revenue,
        orders: monthOrders.length,
      })
    }

    return monthlySales
  }

  // Get top products
  const getTopProducts = (orders) => {
    const productMap = new Map()

    // Count occurrences of each product
    orders.forEach((order) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item) => {
          const productName = item.name
          if (productName) {
            const currentCount = productMap.get(productName) || 0
            productMap.set(productName, currentCount + (item.quantity || 1))
          }
        })
      }
    })

    // Convert to array and sort
    const topProducts = Array.from(productMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return topProducts
  }

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
      icon: <LayoutDashboard size={20} />,
      component: DashboardOverview,
      description: "Overview & Analytics",
    },
    {
      id: "orders",
      label: "All Orders",
      icon: <Package size={20} />,
      component: AllOrders,
      description: "Order Management",
    },
    {
      id: "available-kits",
      label: "Available Kits",
      icon: <Wrench size={20} />,
      component: AvailableKitsAdmin,
      description: "Kit Catalog",
    },
    {
      id: "custom-kits",
      label: "Custom Kits",
      icon: <Settings size={20} />,
      component: CustomKitsAdmin,
      description: "Component Library",
    },
    {
      id: "mini-projects",
      label: "Mini Projects",
      icon: <Rocket size={20} />,
      component: MiniProjectsAdmin,
      description: "Project Gallery",
    },
    {
      id: "project-requests",
      label: "Project Requests",
      icon: <FileText size={20} />,
      component: CustomProjectRequests,
      description: "Custom Requests",
    },
    {
      id: "contacts",
      label: "Contact Messages",
      icon: <Mail size={20} />,
      component: ContactedUsers,
      description: "Customer Inquiries",
    },
    {
      id: "users",
      label: "All Users",
      icon: <Users size={20} />,
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
    if (!activeItem) return <DashboardOverview data={dashboardData} loading={dataLoading} />

    const Component = activeItem.component
    if (activeSection === "dashboard") {
      return <Component data={dashboardData} loading={dataLoading} />
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
          <div className="admin-page-auth-icon">
            <Crown size={48} />
          </div>
          <h2>Admin Access Required</h2>
          <p>Please sign in with your admin account to access the dashboard.</p>
          <button
            className="admin-page-auth-btn"
            onClick={() => {
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
          <div className="admin-page-access-icon">
            <Crown size={48} color="#ef4444" />
          </div>
          <h2>Access Denied</h2>
          <p>You don't have permission to access the admin dashboard.</p>
          <p className="admin-page-user-email">Signed in as: {user.email}</p>
          <button className="admin-page-signout-btn" onClick={handleSignOut}>
            <LogOut size={18} />
            <span>Sign Out</span>
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
      <aside
        className={`admin-page-sidebar ${sidebarCollapsed ? "collapsed" : ""} ${mobileMenuOpen ? "mobile-open" : ""}`}
      >
        <div className="admin-page-sidebar-header">
          <div className="admin-page-logo">
            <span className="admin-page-logo-icon">
              <Crown size={24} />
            </span>
            {!sidebarCollapsed && <span className="admin-page-logo-text">Kitees Admin</span>}
          </div>
          {!isMobile && (
            <button
              className="admin-page-sidebar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
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
          <div className="admin-page-user-info">
            <div className="admin-page-user-avatar">
              <span className="admin-page-avatar-text">
                <Crown size={20} />
              </span>
            </div>
            {!sidebarCollapsed && (
              <div className="admin-page-user-details">
                <div className="admin-page-user-name">Admin</div>
                <div className="admin-page-user-email">{user.email}</div>
              </div>
            )}
          </div>
          <button className="admin-page-signout-btn" onClick={handleSignOut} title={sidebarCollapsed ? "Sign Out" : ""}>
            <span className="admin-page-signout-icon">
              <LogOut size={18} />
            </span>
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`admin-page-main ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        {/* Top Bar */}
        <header className="admin-page-topbar">
          <div className="admin-page-topbar-left">
            {isMobile && (
              <button className="admin-page-mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu size={20} />
              </button>
            )}
            <div className="admin-page-breadcrumb">
              <span className="admin-page-breadcrumb-home">
                <Home size={16} />
              </span>
              <span className="admin-page-breadcrumb-separator">/</span>
              <span className="admin-page-breadcrumb-current">
                {menuItems.find((item) => item.id === activeSection)?.label || "Dashboard"}
              </span>
            </div>
          </div>
          <div className="admin-page-topbar-right">
            <div className="admin-page-admin-badge">
              <span className="admin-page-badge-icon">
                <Crown size={16} />
              </span>
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
