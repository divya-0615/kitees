"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../contexts/AuthContext"
import CartDrawer from "./CartDrawer"
import "./Header.css"
import { ChevronDown } from "lucide-react"

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const { getTotalItems } = useCart()
    const { currentUser, userData, logout } = useAuth()
    const navigate = useNavigate()

    const totalItems = getTotalItems()

    const handleLogout = async () => {
        try {
            await logout()
            setIsUserMenuOpen(false)
            navigate("/")
        } catch (error) {
            console.error("Failed to logout:", error)
        }
    }

    return (
        <>
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        {/* Logo */}
                        <Link to="/" className="logo">
                            <span className="logo-text">Kitees</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="desktop-nav">
                            <a href="/" className="nav-link">
                                {/* <span className="nav-icon">📦</span> */}
                                Home
                            </a>
                            {/* <a href="#kits" className="nav-link">
                                <span className="nav-icon">📦</span>
                                Kits
                            </a>
                            <a href="#projects" className="nav-link">
                                <span className="nav-icon">🔧</span>
                                Projects
                            </a> */}

                            <a href="#about" className="nav-link">
                                {/* <span className="nav-icon">ℹ️</span> */}
                                About
                            </a>
                            
                            <a href="#contact" className="nav-link">
                                {/* <span className="nav-icon">📞</span> */}
                                Contact
                            </a>
                        </nav>

                        {/* Header Actions */}
                        <div className="header-actions">
                            {currentUser ? (
                                <div className="user-menu-container">
                                    <button className="user-menu-btn" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                                        <div className="user-avatar">{userData?.name?.charAt(0)?.toUpperCase() || "U"}</div>
                                        <span className="user-name">{userData?.name || "User"}</span>
                                        <span className="dropdown-arrow"><ChevronDown /></span>
                                    </button>

                                    {isUserMenuOpen && (
                                        <div className="user-dropdown">
                                            <div className="user-info">
                                                <div className="user-avatar-large">{userData?.name?.charAt(0)?.toUpperCase() || "U"}</div>
                                                <div className="user-details">
                                                    <div className="user-name-large">{userData?.name}</div>
                                                    <div className="user-email">{userData?.email}</div>
                                                </div>
                                            </div>
                                            <div className="dropdown-divider"></div>
                                            <button className="dropdown-item" onClick={() => navigate("/MyOrders")}>
                                                <span className="item-icon">📋</span>
                                                Orders
                                            </button>
                                            <div className="dropdown-divider"></div>
                                            <button className="dropdown-item logout-item" onClick={handleLogout}>
                                                <span className="item-icon">🚪</span>
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="auth-buttons">
                                    {/* <Link to="/login" className="login-btn">
                                        <span className="btn-icon">🔑</span>
                                        Login
                                    </Link> */}
                                    <Link to="/login" className="signup-btn">
                                        <span className="btn-icon">🚀</span>
                                        Login
                                    </Link>
                                </div>
                            )}

                            <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
                                <span className="cart-icon">🛒</span>
                                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                                <span className="cart-text">Cart</span>
                            </button>

                            {/* Mobile Menu Button */}
                            <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                <span className={`hamburger ${isMenuOpen ? "active" : ""}`}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="mobile-nav">
                            <nav className="mobile-nav-content">
                                <a href="#kits" className="mobile-nav-link">
                                    <span className="nav-icon">📦</span>
                                    Kits
                                </a>
                                <a href="#projects" className="mobile-nav-link">
                                    <span className="nav-icon">🔧</span>
                                    Projects
                                </a>
                                <a href="#about" className="mobile-nav-link">
                                    <span className="nav-icon">ℹ️</span>
                                    About
                                </a>
                                <a href="#contact" className="mobile-nav-link">
                                    <span className="nav-icon">📞</span>
                                    Contact
                                </a>

                                <div className="mobile-auth-section">
                                    {currentUser ? (
                                        <div className="mobile-user-info">
                                            <div className="mobile-user-details">
                                                <div className="mobile-user-avatar">{userData?.name?.charAt(0)?.toUpperCase() || "U"}</div>
                                                <div>
                                                    <div className="mobile-user-name">{userData?.name}</div>
                                                    <div className="mobile-user-email">{userData?.email}</div>
                                                </div>
                                            </div>
                                            <button className="mobile-logout-btn" onClick={handleLogout}>
                                                <span className="btn-icon">🚪</span>
                                                Logout
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="mobile-auth-buttons">
                                            <Link to="/login" className="mobile-login-btn">
                                                <span className="btn-icon">🔑</span>
                                                Login
                                            </Link>
                                            <Link to="/signup" className="mobile-signup-btn">
                                                <span className="btn-icon">🚀</span>
                                                Sign Up
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    )
}

export default Header
