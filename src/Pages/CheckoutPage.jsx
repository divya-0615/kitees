"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useCart } from "../contexts/CartContext"
import "./CheckoutPage.css"

const CheckoutPage = () => {
    const { items, getTotalPrice, clearCart } = useCart()
    const navigate = useNavigate()
    const [paymentMethod, setPaymentMethod] = useState("card")
    const [isProcessing, setIsProcessing] = useState(false)
    const [orderComplete, setOrderComplete] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
        cardName: "",
    })

    const subtotal = getTotalPrice()
    const shipping = subtotal > 50 ? 0 : 9.99
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsProcessing(true)

        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 3000))

        setIsProcessing(false)
        setOrderComplete(true)
        clearCart()
    }

    if (orderComplete) {
        return (
            <div className="checkout-page success-page">
                <Header />
                <div className="container">
                    <div className="success-content">
                        <div className="success-icon rotate">🛡️</div>
                        <h1 className="success-title">Order Confirmed! 🎉</h1>
                        <p className="success-description">
                            Thank you for your purchase! Your order has been successfully processed and will be shipped within 24
                            hours.
                        </p>

                        <div className="order-details">
                            <h2 className="details-title">Order Details</h2>
                            <div className="details-content">
                                <div className="detail-row">
                                    <span>Order Number:</span>
                                    <span className="order-number">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                                </div>
                                <div className="detail-row">
                                    <span>Total Amount:</span>
                                    <span className="total-amount">${total.toFixed(2)}</span>
                                </div>
                                <div className="detail-row">
                                    <span>Estimated Delivery:</span>
                                    <span>2-3 business days</span>
                                </div>
                            </div>
                        </div>

                        <div className="success-actions">
                            <button className="btn btn-primary btn-lg" onClick={() => navigate("/")}>
                                Continue Shopping
                            </button>
                            <button className="btn btn-outline btn-lg">Track Your Order</button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="checkout-page empty-page">
                <Header />
                <div className="container">
                    <div className="empty-content">
                        <h1 className="empty-title">Your cart is empty</h1>
                        <p className="empty-description">Add some items to your cart before checking out.</p>
                        <button className="btn btn-primary btn-lg" onClick={() => navigate("/")}>
                            ← Continue Shopping
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="checkout-page">
            <Header />

            <div className="container">
                <div className="checkout-content">
                    <div className="checkout-header">
                        <button className="back-btn" onClick={() => navigate("/")}>
                            ← Back to Shopping
                        </button>
                        <h1 className="page-title">Checkout</h1>
                        <p className="page-subtitle">Complete your order securely</p>
                    </div>

                    <div className="checkout-grid">
                        {/* Checkout Form */}
                        <div className="checkout-form-section">
                            {/* Shipping Information */}
                            <div className="form-card">
                                <div className="card-header">
                                    <h2 className="card-title">🚚 Shipping Information</h2>
                                </div>
                                <div className="card-content">
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="firstName">First Name</label>
                                            <input
                                                id="firstName"
                                                type="text"
                                                placeholder="John"
                                                value={formData.firstName}
                                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="lastName">Last Name</label>
                                            <input
                                                id="lastName"
                                                type="text"
                                                placeholder="Doe"
                                                value={formData.lastName}
                                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                                className="form-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Email Address</label>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="address">Street Address</label>
                                        <input
                                            id="address"
                                            type="text"
                                            placeholder="123 Main Street"
                                            value={formData.address}
                                            onChange={(e) => handleInputChange("address", e.target.value)}
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-grid form-grid-3">
                                        <div className="form-group">
                                            <label htmlFor="city">City</label>
                                            <input
                                                id="city"
                                                type="text"
                                                placeholder="New York"
                                                value={formData.city}
                                                onChange={(e) => handleInputChange("city", e.target.value)}
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="state">State</label>
                                            <select
                                                id="state"
                                                value={formData.state}
                                                onChange={(e) => handleInputChange("state", e.target.value)}
                                                className="form-input"
                                            >
                                                <option value="">Select state</option>
                                                <option value="ny">New York</option>
                                                <option value="ca">California</option>
                                                <option value="tx">Texas</option>
                                                <option value="fl">Florida</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="zip">ZIP Code</label>
                                            <input
                                                id="zip"
                                                type="text"
                                                placeholder="10001"
                                                value={formData.zip}
                                                onChange={(e) => handleInputChange("zip", e.target.value)}
                                                className="form-input"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="form-card">
                                <div className="card-header">
                                    <h2 className="card-title">💳 Payment Information</h2>
                                </div>
                                <div className="card-content">
                                    {/* Payment Method Selection */}
                                    <div className="payment-methods">
                                        <div
                                            className={`payment-method ${paymentMethod === "card" ? "active" : ""}`}
                                            onClick={() => setPaymentMethod("card")}
                                        >
                                            <div className="method-icon">💳</div>
                                            <div className="method-label">Credit Card</div>
                                        </div>

                                        <div
                                            className={`payment-method ${paymentMethod === "paypal" ? "active" : ""}`}
                                            onClick={() => setPaymentMethod("paypal")}
                                        >
                                            <div className="method-icon paypal">PP</div>
                                            <div className="method-label">PayPal</div>
                                        </div>

                                        <div
                                            className={`payment-method ${paymentMethod === "apple" ? "active" : ""}`}
                                            onClick={() => setPaymentMethod("apple")}
                                        >
                                            <div className="method-icon apple">🍎</div>
                                            <div className="method-label">Apple Pay</div>
                                        </div>
                                    </div>

                                    {paymentMethod === "card" && (
                                        <div className="card-form fade-in">
                                            <div className="form-group">
                                                <label htmlFor="cardNumber">Card Number</label>
                                                <input
                                                    id="cardNumber"
                                                    type="text"
                                                    placeholder="1234 5678 9012 3456"
                                                    value={formData.cardNumber}
                                                    onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                                                    className="form-input"
                                                />
                                            </div>

                                            <div className="form-grid">
                                                <div className="form-group">
                                                    <label htmlFor="expiry">Expiry Date</label>
                                                    <input
                                                        id="expiry"
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        value={formData.expiry}
                                                        onChange={(e) => handleInputChange("expiry", e.target.value)}
                                                        className="form-input"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="cvv">CVV</label>
                                                    <input
                                                        id="cvv"
                                                        type="text"
                                                        placeholder="123"
                                                        value={formData.cvv}
                                                        onChange={(e) => handleInputChange("cvv", e.target.value)}
                                                        className="form-input"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="cardName">Name on Card</label>
                                                <input
                                                    id="cardName"
                                                    type="text"
                                                    placeholder="John Doe"
                                                    value={formData.cardName}
                                                    onChange={(e) => handleInputChange("cardName", e.target.value)}
                                                    className="form-input"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="security-notice">
                                        <span className="security-icon">🔒</span>
                                        <span>Your payment information is encrypted and secure</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="order-summary-section">
                            <div className="summary-card">
                                <div className="card-header">
                                    <h2 className="card-title">Order Summary</h2>
                                </div>
                                <div className="card-content">
                                    {/* Items */}
                                    <div className="summary-items">
                                        {items.map((item) => (
                                            <div key={item.id} className="summary-item">
                                                <img src={item.image || "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg"} alt={item.name} className="summary-item-image" />
                                                <div className="summary-item-details">
                                                    <div className="summary-item-name">{item.name}</div>
                                                    <div className="summary-item-qty">Qty: {item.quantity}</div>
                                                    {item.type === "custom-kit" && item.components && (
                                                        <div className="summary-components">{item.components.length} components</div>
                                                    )}
                                                </div>
                                                <div className="summary-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="summary-divider"></div>

                                    {/* Pricing */}
                                    <div className="summary-pricing">
                                        <div className="pricing-row">
                                            <span>Subtotal</span>
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="pricing-row">
                                            <span>Shipping</span>
                                            <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                                        </div>
                                        <div className="pricing-row">
                                            <span>Tax</span>
                                            <span>${tax.toFixed(2)}</span>
                                        </div>
                                        <div className="summary-divider"></div>
                                        <div className="pricing-row total-row">
                                            <span>Total</span>
                                            <span>${total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {shipping === 0 && (
                                        <div className="free-shipping-notice">
                                            <span className="shipping-icon">🚚</span>
                                            <span>Free shipping on orders over $50!</span>
                                        </div>
                                    )}

                                    <button onClick={handleSubmit} disabled={isProcessing} className="complete-order-btn">
                                        {isProcessing ? (
                                            <>
                                                <span className="processing-icon rotate">🔒</span>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <span className="order-icon">🔒</span>
                                                Complete Order - ${total.toFixed(2)}
                                            </>
                                        )}
                                    </button>

                                    <div className="order-terms">
                                        By completing your order, you agree to our Terms of Service and Privacy Policy
                                    </div>
                                </div>
                            </div>

                            {/* Security Features */}
                            <div className="security-card">
                                <div className="card-content">
                                    <h3 className="security-title">Secure Checkout</h3>
                                    <div className="security-features">
                                        <div className="security-feature">
                                            <span className="feature-icon">🛡️</span>
                                            <span>256-bit SSL encryption</span>
                                        </div>
                                        <div className="security-feature">
                                            <span className="feature-icon">🔒</span>
                                            <span>PCI DSS compliant</span>
                                        </div>
                                        <div className="security-feature">
                                            <span className="feature-icon">🚚</span>
                                            <span>Secure shipping & tracking</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default CheckoutPage
