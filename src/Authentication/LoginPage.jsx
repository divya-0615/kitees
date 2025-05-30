"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "./AuthPages.css"

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const { login, currentUser } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (currentUser) {
            navigate("/")
        }
    }, [currentUser, navigate])

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
        setError("")
        setSuccess("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        try {
            // Check for admin credentials
            if (formData.email === "kitees@gmail.com" && formData.password === "admin1234") {
                setSuccess("Admin authentication successful! Redirecting to admin panel...")
                setTimeout(() => {
                    navigate("/admin")
                }, 1500)
                setLoading(false)
                return
            }

            await login(formData.email, formData.password)
            setSuccess("Authentication successful! Welcome back.")
            setTimeout(() => {
                navigate("/")
            }, 1000)
        } catch (error) {
            if (error.code === "auth/user-not-found") {
                setError("No account found with this email address.")
            } else if (error.code === "auth/wrong-password") {
                setError("Invalid password. Please check your credentials.")
            } else if (error.code === "auth/invalid-email") {
                setError("Please enter a valid email address.")
            } else if (error.code === "auth/too-many-requests") {
                setError("Too many failed attempts. Please try again later.")
            } else {
                setError("Authentication failed. Please try again.")
            }
        }

        setLoading(false)
    }

    return (
        <div className="auth-page">
            <div className="auth-background"></div>

            <div className="auth-container">
                <div className="auth-card slide-in-up" style={{maxWidth: "450px"}}>
                    <div className="auth-header">
                        <Link to="/" className="back-to-home">
                            <span className="back-icon">←</span>
                            Back to Kitees
                        </Link>

                        <div className="logo-section">
                            {/* <div className="logo-icon pulse">⚡</div> */}
                            <h1 className="auth-title">Welcome Back</h1>
                            <p className="auth-subtitle">Sign in to access your account and continue building</p>
                        </div>
                    </div>

                    {error && (
                        <div className="error-message fade-in">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="success-message fade-in">
                            <span className="error-icon">✅</span>
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <span className="input-icon">✉</span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter your email address"
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔒</span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter your password"
                                    className="form-input"
                                    minLength="6"
                                />
                                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="loading-spinner"></span>
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <span className="btn-icon">→</span>
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>or</span>
                    </div>

                    <div className="auth-switch">
                        <p>Don't have an account yet?</p>
                        <Link to="/signup" className="switch-link">
                            Create Account
                            <span className="link-arrow">→</span>
                        </Link>
                    </div>
                </div>

                {/* <div className="auth-features slide-in-right">
                    <h2>Why Kitees?</h2>
                    <div className="feature-list">
                        <div className="feature-item">
                            <span className="feature-icon">⚡</span>
                            <div>
                                <h3>Premium Components</h3>
                                <p>High-quality electronics components sourced from trusted manufacturers worldwide</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🚀</span>
                            <div>
                                <h3>Express Delivery</h3>
                                <p>Fast and reliable shipping with tracking for all your urgent project needs</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🎯</span>
                            <div>
                                <h3>Expert Support</h3>
                                <p>Professional technical assistance from experienced engineers and makers</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">📚</span>
                            <div>
                                <h3>Learning Hub</h3>
                                <p>Comprehensive tutorials, documentation, and project guides for all skill levels</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🔧</span>
                            <div>
                                <h3>Custom Solutions</h3>
                                <p>Build personalized kits and get custom components for your specific projects</p>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default LoginPage
