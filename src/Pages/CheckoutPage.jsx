// /src/pages/CheckoutPage.jsx
"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../contexts/AuthContext"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ProtectedRoute from "../components/ProtectedRoute"
import { generateReceiptPDF } from "../components/GenerateReceiptPDF"
import toast from "react-hot-toast"
import "./CheckoutPage.css"
import NewsletterSection from "../components/NewsletterSection"
import TestimonialsSection from "../components/TestimonialsSection"

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { items, getTotalPrice, clearCart } = useCart()
  const { userData } = useAuth()

  const [orderPlaced, setOrderPlaced] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderDetails, setOrderDetails] = useState(null)

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod", // default to Cash on Delivery
  })

  // Compute total price and total quantity of cart items
  const totalPrice = getTotalPrice() || 0
  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const generateOrderId = () => {
    // Example: "KIT12345678ABCD"
    return "KIT" + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase()
  }

  const saveOrderToFirestore = async (orderData) => {
    try {
      const docRef = await addDoc(collection(db, "all-orders"), orderData)
      console.log("Order saved with ID:", docRef.id)
      return docRef.id
    } catch (error) {
      console.error("Error saving order:", error)
      throw error
    }
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    if (!userData) {
      toast.error("You must be logged in to place an order.")
      setIsProcessing(false)
      return
    }

    if (items.length === 0) {
      toast.error("Your cart is empty.")
      setIsProcessing(false)
      return
    }

    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const orderId = generateOrderId()
      const now = new Date()
      const orderDate = now.toLocaleDateString("en-IN")   // e.g. "31/05/2025"
      const orderTime = now.toLocaleTimeString("en-IN")   // e.g. "14:35:20"

      // Build the full order document
      const orderData = {
        orderId,
        orderDate,
        orderTime,
        createdAt: serverTimestamp(), // Firestore timestamp
        customerDetails: {
          name: userData?.name || "",
          email: userData?.email || "",
          mobile: userData?.mobile || "",
          college: userData?.college || "",
        },
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          type: item.type,
          components: item.components || [],
          image: item.image || "",
        })),
        paymentMethod: formData.paymentMethod,
        totalAmount: totalPrice,
        totalQuantity,
        status: "confirmed", // default status on creation
      }

      const firestoreOrderId = await saveOrderToFirestore(orderData)

      // Keep the same object in state for receipt generation
      setOrderDetails({ ...orderData, firestoreOrderId })
      setOrderPlaced(true)
      clearCart()
      toast.success("Order placed successfully!")
    } catch (error) {
      console.error("Error placing order:", error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadReceipt = () => {
    if (orderDetails) {
      generateReceiptPDF(orderDetails)
    }
  }

  // If the cart is empty and no order has just been placed, show an "empty cart" screen
  if (items.length === 0 && !orderPlaced) {
    return (
      <ProtectedRoute message="Please login to place your order and access checkout">
        <div className="checkout-page-container">
          <Header />
          <main className="checkout-page-main">
            <div className="checkout-page-content">
              <div className="checkout-page-empty-cart">
                <div className="checkout-page-empty-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Add some items to your cart before checking out.</p>
                <button
                  className="checkout-page-btn"
                  onClick={() => navigate("/")}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    )
  }

  if (orderPlaced) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" // you can change this to "smooth"
    });
  }

  return (
    <ProtectedRoute message="Please login to place your order and access checkout">
      <div className="checkout-page-container">
        <Header />

        <main className="checkout-page-main">
          <div className="checkout-page-content">
            {orderPlaced ? (
              <div className="checkout-page-order-success">
                <div className="checkout-page-success-animation">
                  <div className="checkout-page-success-icon">✅</div>
                  <div className="checkout-page-success-rings">
                    <div className="checkout-page-ring checkout-page-ring-1"></div>
                    <div className="checkout-page-ring checkout-page-ring-2"></div>
                    <div className="checkout-page-ring checkout-page-ring-3"></div>
                  </div>
                </div>
                <h2>Order Placed Successfully!</h2>
                <p>
                  Your order ID is <strong>#{orderDetails.orderId}</strong>.
                </p>
                <p>
                  Thank you, {orderDetails.customerDetails.name}! A confirmation
                  email has been sent to <strong>{orderDetails.customerDetails.email}</strong>.
                </p>
                <div className="checkout-page-success-actions">
                  <button className="checkout-page-receipt-btn" onClick={handleDownloadReceipt}>
                    📄 Download Receipt
                  </button>
                  <button className="checkout-page-btn" onClick={() => navigate("/")}>
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="checkout-page-header">
                  <button
                    className="checkout-page-back-btn"
                    onClick={() => navigate(-1)}
                  >
                    ← Back
                  </button>
                  <h1 className="checkout-page-title">Checkout</h1>
                  <p className="checkout-page-subtitle">
                    Complete your order, {userData?.name}
                  </p>
                </div>

                <div className="checkout-page-grid">
                  {/* ──────────────────────────── */}
                  {/* Left column: Order Summary + Shipping Form */}
                  {/* ──────────────────────────── */}
                  <div className="checkout-page-form-section">
                    <div className="checkout-page-section">
                      <h3 className="checkout-page-section-title">
                        📋 Order Summary
                      </h3>
                      <div className="checkout-page-order-items">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="checkout-page-order-item"
                          >
                            <img
                              src={
                                item.image ||
                                "/placeholder.svg?height=60&width=60"
                              }
                              alt={item.name}
                              className="checkout-page-item-image"
                            />
                            <div className="checkout-page-item-details">
                              <h4 className="checkout-page-item-name">
                                {item.name}
                              </h4>
                              <p className="checkout-page-item-quantity">
                                Quantity: {item.quantity}
                              </p>
                              {item.components &&
                                item.components.length > 0 && (
                                  <div className="checkout-page-components-list">
                                    <strong>Components:</strong>
                                    <ul>
                                      {item.components.map((comp, idx) => (
                                        <li key={idx}>
                                          {comp.name}
                                          {comp.quantity
                                            ? ` x${comp.quantity}`
                                            : ""}
                                          {comp.price !== undefined
                                            ? ` — ₹${Number(
                                              comp.price
                                            ).toFixed(2)}`
                                            : ""}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                            </div>
                            <div className="checkout-page-item-price">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="checkout-page-section">
                      <h3 className="checkout-page-section-title">
                        🚚 Shipping Information
                      </h3>
                      <form
                        onSubmit={handlePlaceOrder}
                        className="checkout-page-form"
                      >
                        <div className="checkout-page-form-row">
                          <div className="checkout-page-form-group">
                            <label>Full Name</label>
                            <input
                              type="text"
                              value={userData?.name || ""}
                              readOnly
                              className="checkout-page-form-input"
                            />
                          </div>
                          <div className="checkout-page-form-group">
                            <label>Email</label>
                            <input
                              type="email"
                              value={userData?.email || ""}
                              readOnly
                              className="checkout-page-form-input"
                            />
                          </div>
                        </div>

                        <div className="checkout-page-form-row">
                          <div className="checkout-page-form-group">
                            <label>Mobile Number</label>
                            <input
                              type="tel"
                              value={userData?.mobile || ""}
                              readOnly
                              className="checkout-page-form-input"
                            />
                          </div>
                          <div className="checkout-page-form-group">
                            <label>College</label>
                            <input
                              type="text"
                              value={userData?.college || ""}
                              readOnly
                              className="checkout-page-form-input"
                            />
                          </div>
                        </div>

                        <div className="checkout-page-form-row">
                          <div className="checkout-page-form-group">
                            <label>Address</label>
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              required
                              placeholder="Street, Building, etc."
                              className="checkout-page-form-input"
                            />
                          </div>
                        </div>

                        <div className="checkout-page-form-row">
                          <div className="checkout-page-form-group">
                            <label>City</label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                              placeholder="City"
                              className="checkout-page-form-input"
                            />
                          </div>
                          <div className="checkout-page-form-group">
                            <label>State</label>
                            <input
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              required
                              placeholder="State"
                              className="checkout-page-form-input"
                            />
                          </div>
                        </div>

                        <div className="checkout-page-form-row">
                          <div className="checkout-page-form-group">
                            <label>Pincode</label>
                            <input
                              type="text"
                              name="pincode"
                              value={formData.pincode}
                              onChange={handleInputChange}
                              required
                              placeholder="Pincode"
                              className="checkout-page-form-input"
                            />
                          </div>
                        </div>

                        <div className="checkout-page-section">
                          <h3 className="checkout-page-section-title">
                            💳 Payment Method
                          </h3>
                          <div className="checkout-page-payment-options">
                            <label className="checkout-page-payment-option">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value="card"
                                checked={formData.paymentMethod === "card"}
                                onChange={handleInputChange}
                              />
                              <span className="checkout-page-option-content">
                                <span className="checkout-page-option-icon">
                                  💳
                                </span>
                                <span>Credit/Debit Card</span>
                              </span>
                            </label>
                            <label className="checkout-page-payment-option">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value="upi"
                                checked={formData.paymentMethod === "upi"}
                                onChange={handleInputChange}
                              />
                              <span className="checkout-page-option-content">
                                <span className="checkout-page-option-icon">
                                  📱
                                </span>
                                <span>UPI</span>
                              </span>
                            </label>
                            <label className="checkout-page-payment-option">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value="cod"
                                checked={formData.paymentMethod === "cod"}
                                onChange={handleInputChange}
                              />
                              <span className="checkout-page-option-content">
                                <span className="checkout-page-option-icon">
                                  💰
                                </span>
                                <span>Cash on Delivery</span>
                              </span>
                            </label>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="checkout-page-place-order-btn"
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Processing..." : "Place Order"}
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* ──────────────────────────── */}
                  {/* Right column: Price Breakdown */}
                  {/* ──────────────────────────── */}
                  <div className="checkout-page-summary-card">
                    <h3 className="checkout-page-summary-title">💰 Order Summary</h3>
                    <div className="checkout-page-price-breakdown">
                      <div className="checkout-page-price-row">
                        <span>Subtotal ({items.length} items)</span>
                        <span>₹{totalPrice.toFixed(2)}</span>
                      </div>
                      {/* <div className="checkout-page-price-divider"></div> */}
                      <div className="checkout-page-price-row checkout-page-total-row">
                        <span>Total Amount</span>
                        <span>₹{totalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="checkout-page-security-features">
                      <h4 className="checkout-page-security-title">🛡️ Secure Checkout</h4>
                      <div className="checkout-page-security-list">
                        <div className="checkout-page-security-item">
                          <span>🔒</span>
                          <span>SSL Encrypted Payment</span>
                        </div>
                        <div className="checkout-page-security-item">
                          <span>🛡️</span>
                          <span>Secure Data Protection</span>
                        </div>
                        <div className="checkout-page-security-item">
                          <span>📦</span>
                          <span>Safe & Fast Delivery</span>
                        </div>
                        <div className="checkout-page-security-item">
                          <span>↩️</span>
                          <span>Easy Returns & Refunds</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>

        <TestimonialsSection />
        <NewsletterSection />
        <Footer />
      </div>
    </ProtectedRoute>
  )
}

export default CheckoutPage
