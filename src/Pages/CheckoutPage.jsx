"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../contexts/AuthContext"
import { collection, addDoc } from "firebase/firestore"
import { db } from "../firebase"
import jsPDF from "jspdf"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ProtectedRoute from "../components/ProtectedRoute"
import "./CheckoutPage.css"

import { generateReceiptPDF } from "../components/GenerateReceiptPDF"

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
    paymentMethod: "card",
  })

  const totalPrice = getTotalPrice()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const generateOrderId = () => {
    return "KIT" + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase()
  }

  const saveOrderToFirestore = async (orderData) => {
    try {
      // Save main order
      const orderRef = await addDoc(collection(db, "all-orders"), orderData)
      console.log("Order saved with ID: ", orderRef.id)

      // Save individual items for better tracking
      const itemPromises = orderData.items.map(async (item) => {
        const itemData = {
          orderId: orderData.orderId,
          orderDocId: orderRef.id,
          itemId: item.id,
          itemName: item.name,
          itemPrice: item.price,
          quantity: item.quantity,
          totalItemPrice: item.price * item.quantity,
          itemType: item.type,
          components: item.components || [],
          customerEmail: orderData.customerDetails.email,
          customerName: orderData.customerDetails.name,
          orderDate: orderData.orderDate,
          orderTime: orderData.orderTime,
          status: "confirmed",
          createdAt: new Date(),
        }

        return await addDoc(collection(db, "order-items"), itemData)
      })

      await Promise.all(itemPromises)
      console.log("All order items saved successfully")

      return orderRef.id
    } catch (error) {
      console.error("Error saving order: ", error)
      throw error
    }
  }


  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const orderId = generateOrderId()
      const orderDate = new Date().toLocaleDateString("en-IN")
      const orderTime = new Date().toLocaleTimeString("en-IN")

      const orderData = {
        orderId,
        orderDate,
        orderTime,
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
        itemCount: items.length,
        totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
        status: "confirmed",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Save to Firestore (both main order and individual items)
      await saveOrderToFirestore(orderData)

      setOrderDetails(orderData)
      setOrderPlaced(true)
      clearCart()
    } catch (error) {
      console.error("Error placing order:", error)
      alert("Failed to place order. Please try again.")
    }

    setIsProcessing(false)
  }

  const handleDownloadReceipt = () => {
    if (orderDetails) {
      generateReceiptPDF(orderDetails)
    }
  }

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
                <button className="checkout-page-btn" onClick={() => navigate("/")}>
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
                  Thank you for your purchase, {userData?.name}! Your order has been confirmed and will be processed
                  shortly. You will receive a confirmation email with tracking details.
                </p>
                <div className="checkout-page-order-details">
                  <div className="checkout-page-detail-item">
                    <span>Order ID:</span>
                    <span>{orderDetails?.orderId}</span>
                  </div>
                  <div className="checkout-page-detail-item">
                    <span>Order Date:</span>
                    <span>{orderDetails?.orderDate}</span>
                  </div>
                  <div className="checkout-page-detail-item">
                    <span>Order Time:</span>
                    <span>{orderDetails?.orderTime}</span>
                  </div>
                  <div className="checkout-page-detail-item">
                    <span>Items Ordered:</span>
                    <span>
                      {orderDetails?.itemCount} items ({orderDetails?.totalQuantity} pieces)
                    </span>
                  </div>
                  <div className="checkout-page-detail-item">
                    <span>Total Amount:</span>
                    <span>₹{orderDetails?.totalAmount?.toFixed(2)}</span>
                  </div>
                  <div className="checkout-page-detail-item">
                    <span>Estimated Delivery:</span>
                    <span>3-5 business days</span>
                  </div>
                </div>
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
                  <button className="checkout-page-back-btn" onClick={() => navigate("/")}>
                    ← Back to Shopping
                  </button>
                  <h1 className="checkout-page-title">Checkout</h1>
                  <p className="checkout-page-subtitle">Complete your order, {userData?.name}</p>
                </div>

                <div className="checkout-page-grid">
                  <div className="checkout-page-form-section">
                    <div className="checkout-page-section">
                      <h3 className="checkout-page-section-title">📋 Order Summary</h3>
                      <div className="checkout-page-order-items">
                        {items.map((item) => (
                          <div key={item.id} className="checkout-page-order-item">
                            <img
                              src={item.image || "/placeholder.svg?height=60&width=60"}
                              alt={item.name}
                              className="checkout-page-item-image"
                            />
                            <div className="checkout-page-item-details">
                              <h4 className="checkout-page-item-name">{item.name}</h4>
                              <p className="checkout-page-item-quantity">Quantity: {item.quantity}</p>
                              {item.type === "custom-kit" && item.components && (
                                <p className="checkout-page-components-count">
                                  {item.components.length} components included
                                </p>
                              )}
                            </div>
                            <div className="checkout-page-item-price">₹{(item.price * item.quantity).toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="checkout-page-section">
                      <h3 className="checkout-page-section-title">🚚 Shipping Information</h3>
                      <form onSubmit={handlePlaceOrder} className="checkout-page-form">
                        <div className="checkout-page-form-row">
                          <div className="checkout-page-form-group">
                            <label>Full Name</label>
                            <input
                              type="text"
                              value={userData?.name || ""}
                              disabled
                              className="checkout-page-form-input"
                            />
                          </div>
                          <div className="checkout-page-form-group">
                            <label>Email</label>
                            <input
                              type="email"
                              value={userData?.email || ""}
                              disabled
                              className="checkout-page-form-input"
                            />
                          </div>
                          <div className="checkout-page-form-group">
                            <label>Mobile</label>
                            <input
                              type="tel"
                              value={userData?.mobile || ""}
                              disabled
                              className="checkout-page-form-input"
                            />
                          </div>
                        </div>

                        <div className="checkout-page-form-group">
                          <label>Address</label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your full address"
                            className="checkout-page-form-input"
                          />
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
                          <h3 className="checkout-page-section-title">💳 Payment Method</h3>
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
                                <span className="checkout-page-option-icon">💳</span>
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
                                <span className="checkout-page-option-icon">📱</span>
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
                                <span className="checkout-page-option-icon">💰</span>
                                <span>Cash on Delivery</span>
                              </span>
                            </label>
                          </div>
                        </div>

                        <button type="submit" className="checkout-page-place-order-btn" disabled={isProcessing}>
                          {isProcessing ? (
                            <>
                              <span className="checkout-page-loading-spinner"></span>
                              Processing Order...
                            </>
                          ) : (
                            <>
                              <span className="checkout-page-btn-icon">🔒</span>
                              Place Order - ₹{totalPrice.toFixed(2)}
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="checkout-page-summary-card">
                    <h3 className="checkout-page-summary-title">💰 Order Summary</h3>
                    <div className="checkout-page-price-breakdown">
                      <div className="checkout-page-price-row">
                        <span>Subtotal ({items.length} items)</span>
                        <span>₹{totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="checkout-page-price-divider"></div>
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

        <Footer />
      </div>
    </ProtectedRoute>
  )
}

export default CheckoutPage
