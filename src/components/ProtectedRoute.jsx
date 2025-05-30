"use client"

import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import "./ProtectedRoute.css"

const ProtectedRoute = ({ children, message = "Please login to access this page" }) => {
    const { currentUser, loading } = useAuth()
    const navigate = useNavigate()
    const [showMessage, setShowMessage] = useState(false)

    useEffect(() => {
        if (!loading && !currentUser) {
            setShowMessage(true)
            const timer = setTimeout(() => {
                navigate("/login")
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [currentUser, loading, navigate])

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner rotate"></div>
                <p>Loading...</p>
            </div>
        )
    }

    if (!currentUser) {
        return (
            <div className="protected-route-overlay">
                <div className="protected-message">
                    <div className="message-icon">🔒</div>
                    <h2>Authentication Required</h2>
                    <p>{message}</p>
                    <div className="message-actions">
                        <button className="btn btn-primary" onClick={() => navigate("/login")}>
                            Login Now
                        </button>
                        <button className="btn btn-secondary" onClick={() => navigate("/signup")}>
                            Create Account
                        </button>
                    </div>
                    <p className="redirect-notice">Redirecting to login page in 3 seconds...</p>
                </div>
            </div>
        )
    }

    return children
}

export default ProtectedRoute
