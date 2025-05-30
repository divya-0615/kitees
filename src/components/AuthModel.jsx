"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import "./AuthModel.css"

const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
    const [mode, setMode] = useState(initialMode)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        mobile: "",
        college: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const { signup, login } = useAuth()

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
        setError("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        try {
            if (mode === "signup") {
                if (!formData.name || !formData.mobile || !formData.college) {
                    throw new Error("Please fill in all fields")
                }

                await signup(formData.email, formData.password, {
                    name: formData.name,
                    mobile: formData.mobile,
                    college: formData.college,
                })

                setSuccess("Account created successfully! You are now logged in.")
                setTimeout(() => {
                    onClose()
                }, 2000)
            } else {
                await login(formData.email, formData.password)
                setSuccess("Login successful!")
                setTimeout(() => {
                    onClose()
                }, 1500)
            }
        } catch (error) {
            if (error.code === "auth/user-not-found") {
                setError("No account found with this email. Please sign up first.")
            } else if (error.code === "auth/wrong-password") {
                setError("Incorrect password. Please try again.")
            } else if (error.code === "auth/email-already-in-use") {
                setError("An account with this email already exists. Please login instead.")
            } else if (error.code === "auth/weak-password") {
                setError("Password should be at least 6 characters long.")
            } else if (error.code === "auth/invalid-email") {
                setError("Please enter a valid email address.")
            } else {
                setError(error.message)
            }
        }

        setLoading(false)
    }

    const switchMode = () => {
        setMode(mode === "login" ? "signup" : "login")
        setError("")
        setSuccess("")
        setFormData({
            name: "",
            email: "",
            password: "",
            mobile: "",
            college: "",
        })
    }

    if (!isOpen) return null

    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal">
                <button className="auth-modal-close" onClick={onClose}>
                    ✕
                </button>

                <div className="auth-modal-content">
                    <div className="auth-modal-header">
                        <h2>{mode === "login" ? "Welcome Back!" : "Create Account"}</h2>
                        <p>
                            {mode === "login"
                                ? "Sign in to your account to continue"
                                : "Join Kitees and start your electronics journey"}
                        </p>
                    </div>

                    {error && <div className="auth-error">{error}</div>}
                    {success && <div className="auth-success">{success}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        {mode === "signup" && (
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter your full name"
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your password"
                                minLength="6"
                            />
                        </div>

                        {mode === "signup" && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="mobile">Mobile Number</label>
                                    <input
                                        type="tel"
                                        id="mobile"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter your mobile number"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="college">College/Institution</label>
                                    <input
                                        type="text"
                                        id="college"
                                        name="college"
                                        value={formData.college}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter your college name"
                                    />
                                </div>
                            </>
                        )}

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
                        </button>
                    </form>

                    <div className="auth-switch">
                        <p>
                            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                            <button type="button" className="auth-switch-btn" onClick={switchMode}>
                                {mode === "login" ? "Sign Up" : "Sign In"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthModal
