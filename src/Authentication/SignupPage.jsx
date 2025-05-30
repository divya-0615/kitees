"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "./AuthPages.css"

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobile: "",
        college: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0)

    const { signup, currentUser } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (currentUser) {
            navigate("/")
        }
    }, [currentUser, navigate])

    const calculatePasswordStrength = (password) => {
        let strength = 0
        if (password.length >= 6) strength += 1
        if (password.length >= 8) strength += 1
        if (/[A-Z]/.test(password)) strength += 1
        if (/[0-9]/.test(password)) strength += 1
        if (/[^A-Za-z0-9]/.test(password)) strength += 1
        return strength
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })

        if (name === "password") {
            setPasswordStrength(calculatePasswordStrength(value))
        }

        setError("")
        setSuccess("")
    }

    const getPasswordStrengthText = (strength) => {
        switch (strength) {
            case 0:
            case 1:
                return "Weak"
            case 2:
            case 3:
                return "Medium"
            case 4:
            case 5:
                return "Strong"
            default:
                return "Weak"
        }
    }

    const getPasswordStrengthColor = (strength) => {
        switch (strength) {
            case 0:
            case 1:
                return "#fca5a5"
            case 2:
            case 3:
                return "#fbbf24"
            case 4:
            case 5:
                return "#6ee7b7"
            default:
                return "#fca5a5"
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            setLoading(false)
            return
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long")
            setLoading(false)
            return
        }

        if (!formData.name || !formData.mobile || !formData.college) {
            setError("Please fill in all required fields")
            setLoading(false)
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError("Please enter a valid email address")
            setLoading(false)
            return
        }

        if (!/^[0-9]{10}$/.test(formData.mobile.replace(/\D/g, ""))) {
            setError("Please enter a valid 10-digit mobile number")
            setLoading(false)
            return
        }

        try {
            await signup(formData.email, formData.password, {
                name: formData.name,
                mobile: formData.mobile,
                college: formData.college,
            })
            setSuccess("Account created successfully! Welcome to Kitees.")
            setTimeout(() => {
                navigate("/")
            }, 1500)
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                setError("An account with this email already exists.")
            } else if (error.code === "auth/weak-password") {
                setError("Password is too weak. Please choose a stronger password.")
            } else if (error.code === "auth/invalid-email") {
                setError("Please enter a valid email address.")
            } else {
                setError("Account creation failed. Please try again.")
            }
        }

        setLoading(false)
    }

    return (
        <div className="auth-page">
            <div className="auth-background"></div>

            <div className="auth-container">
                <div className="auth-card slide-in-up">
                    <div className="auth-header">
                        <Link to="/" className="back-to-home">
                            <span className="back-icon">←</span>
                            Back to Kitees
                        </Link>

                        <div className="logo-section">
                            <div className="logo-icon pulse">⚡</div>
                            <h1 className="auth-title">Join Kitees</h1>
                            <p className="auth-subtitle">Create your account and start building amazing projects</p>
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
                            <label htmlFor="name">Full Name</label>
                            <div className="input-wrapper">
                                <span className="input-icon">👤</span>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter your full name"
                                    className="form-input"
                                />
                            </div>
                        </div>

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

                        <div className="form-row">
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
                                        placeholder="Create password"
                                        className="form-input"
                                        minLength="6"
                                    />
                                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                                {formData.password && (
                                    <div
                                        className="password-strength"
                                        style={{
                                            color: getPasswordStrengthColor(passwordStrength),
                                        }}
                                    >
                                        Strength: {getPasswordStrengthText(passwordStrength)}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">🔒</span>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Confirm password"
                                        className="form-input"
                                        minLength="6"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                    <div className="password-match-error">Passwords do not match</div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="mobile">Mobile Number</label>
                            <div className="input-wrapper">
                                <span className="input-icon">📱</span>
                                <input
                                    type="tel"
                                    id="mobile"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter your mobile number"
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="college">College/Institution</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🎓</span>
                                <input
                                    type="text"
                                    id="college"
                                    name="college"
                                    value={formData.college}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter your college or institution"
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="loading-spinner"></span>
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <span className="btn-icon">→</span>
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>or</span>
                    </div>

                    <div className="auth-switch">
                        <p>Already have an account?</p>
                        <Link to="/login" className="switch-link">
                            Sign In
                            <span className="link-arrow">→</span>
                        </Link>
                    </div>
                </div>

                {/* <div className="auth-features slide-in-right">
                    <h2>Start Building</h2>
                    <div className="feature-list">
                        <div className="feature-item">
                            <span className="feature-icon">🛒</span>
                            <div>
                                <h3>Seamless Shopping</h3>
                                <p>Browse and purchase electronics components with our intuitive platform</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🔧</span>
                            <div>
                                <h3>Custom Kits</h3>
                                <p>Build personalized electronics kits tailored to your project requirements</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">📚</span>
                            <div>
                                <h3>Knowledge Base</h3>
                                <p>Access comprehensive tutorials, guides, and educational resources</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🎓</span>
                            <div>
                                <h3>Student Benefits</h3>
                                <p>Exclusive discounts and special pricing for students and educational institutions</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🌟</span>
                            <div>
                                <h3>Community</h3>
                                <p>Join a vibrant community of makers, engineers, and electronics enthusiasts</p>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default SignupPage
