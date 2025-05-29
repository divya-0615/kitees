"use client"

import { useState } from "react"
import { useCart } from "../contexts/CartContext"
import CartDrawer from "./CartDrawer"
import "./Header.css"

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isCartOpen, setIsCartOpen] = useState(false)
    const { getTotalItems } = useCart()

    const totalItems = getTotalItems()

    return (
        <>
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        {/* Logo */}
                        <div className="logo">
                            <div className="logo-icon">⚡</div>
                            <span className="logo-text">Kitees</span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="desktop-nav">
                            <a href="#" className="nav-link">
                                Home
                            </a>
                            <a href="#" className="nav-link">
                                About
                            </a>
                            <a href="#" className="nav-link">
                                Support
                            </a>
                            <a href="#" className="nav-link">
                                Contact
                            </a>
                        </nav>

                        {/* Cart and Mobile Menu */}
                        <div className="header-actions">
                            <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
                                🛒{totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                            </button>

                            {/* Mobile Menu Button */}
                            <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? "✕" : "☰"}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="mobile-nav">
                            <nav className="mobile-nav-content">
                                <a href="#" className="mobile-nav-link">
                                    Home
                                </a>
                                <a href="#" className="mobile-nav-link">
                                    About
                                </a>
                                <a href="#" className="mobile-nav-link">
                                    Support
                                </a>
                                <a href="#" className="mobile-nav-link">
                                    Contact
                                </a>
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
