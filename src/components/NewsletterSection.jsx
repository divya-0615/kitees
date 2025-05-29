"use client"

import { useState } from "react"
import "./NewsletterSection.css"

const NewsletterSection = () => {
    const [email, setEmail] = useState("")
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email) return

        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setIsSubscribed(true)
            setIsLoading(false)
            setEmail("")
        }, 1500)
    }

    return (
        <section className="newsletter-section">
            <div className="newsletter-background">
                <div className="floating-icons">
                    <div className="icon icon-1">⚡</div>
                    <div className="icon icon-2">🔧</div>
                    <div className="icon icon-3">💡</div>
                    <div className="icon icon-4">🚀</div>
                    <div className="icon icon-5">⚙️</div>
                    <div className="icon icon-6">🔋</div>
                </div>
            </div>

            <div className="newsletter-container">
                <div className="newsletter-content">
                    <h2>Stay Updated with Latest Kits & Projects</h2>
                    <p>
                        Get exclusive access to new product launches, project tutorials, special discounts, and electronics tips
                        delivered to your inbox.
                    </p>

                    <div className="newsletter-benefits">
                        <div className="benefit">
                            <span className="benefit-icon">📦</span>
                            <span>Early access to new kits</span>
                        </div>
                        <div className="benefit">
                            <span className="benefit-icon">💰</span>
                            <span>Exclusive subscriber discounts</span>
                        </div>
                        <div className="benefit">
                            <span className="benefit-icon">📚</span>
                            <span>Free project tutorials</span>
                        </div>
                    </div>

                    {!isSubscribed ? (
                        <form className="newsletter-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="email-input"
                                    required
                                />
                                <button type="submit" className={`subscribe-btn ${isLoading ? "loading" : ""}`} disabled={isLoading}>
                                    {isLoading ? (
                                        <div className="loading-spinner"></div>
                                    ) : (
                                        <>
                                            Subscribe
                                            <span className="btn-arrow">→</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <p className="privacy-text">We respect your privacy. Unsubscribe at any time.</p>
                        </form>
                    ) : (
                        <div className="success-message">
                            <div className="success-icon">✓</div>
                            <h3>Welcome to the Kitees Community!</h3>
                            <p>Check your email for a confirmation link and your first exclusive content.</p>
                        </div>
                    )}
                </div>

                <div className="newsletter-visual">
                    <div className="email-preview">
                        <div className="email-header">
                            <div className="email-controls">
                                <div className="control"></div>
                                <div className="control"></div>
                                <div className="control"></div>
                            </div>
                            <div className="email-title">Kitees Weekly</div>
                        </div>
                        <div className="email-content">
                            <div className="email-line long"></div>
                            <div className="email-line medium"></div>
                            <div className="email-line short"></div>
                            <div className="email-image"></div>
                            <div className="email-line medium"></div>
                            <div className="email-line long"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default NewsletterSection
