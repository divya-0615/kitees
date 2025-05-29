"use client"
import { useCart } from "../contexts/CartContext"
import { useNavigate } from "react-router-dom"
import "./CartDrawer.css"

const CartDrawer = ({ isOpen, onClose }) => {
  const { items, removeFromCart, removeComponentFromCustomKit, updateQuantity, clearCart, getTotalPrice } = useCart()
  const navigate = useNavigate()

  const getTypeColor = (type) => {
    switch (type) {
      case "kit":
        return "#3b82f6"
      case "custom-kit":
        return "#10b981"
      case "project":
        return "#8b5cf6"
      default:
        return "#6b7280"
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case "kit":
        return "Kit"
      case "custom-kit":
        return "Custom Kit"
      case "project":
        return "Project"
      default:
        return "Item"
    }
  }

  const handleCheckout = () => {
    onClose()
    navigate("/checkout")
  }

  if (!isOpen) return null

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2 className="cart-title">🛒 Shopping Cart ({items.length} items)</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="cart-content">
          {items.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-icon">🛒</div>
              <p className="empty-title">Your cart is empty</p>
              <p className="empty-subtitle">Add some items to get started!</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-content">
                      <img src={item.image || "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg"} alt={item.name} className="item-image" />

                      <div className="item-details">
                        <div className="item-header">
                          <h3 className="item-name">{item.name}</h3>
                          <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                            🗑️
                          </button>
                        </div>

                        <div className="item-badge" style={{ backgroundColor: getTypeColor(item.type) }}>
                          {getTypeLabel(item.type)}
                        </div>

                        {/* Custom Kit Components */}
                        {item.type === "custom-kit" && item.components && (
                          <div className="custom-kit-components">
                            <div className="components-header">
                              <span className="components-title">Components ({item.components.length}):</span>
                            </div>
                            <div className="components-list">
                              {item.components.map((component, index) => (
                                <div key={`${component.id}-${index}`} className="component-item">
                                  <img
                                    src={component.image || "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg"}
                                    alt={component.name}
                                    className="component-image"
                                  />
                                  <div className="component-info">
                                    <span className="component-name">{component.name}</span>
                                    <span className="component-price">${component.price}</span>
                                  </div>
                                  <button
                                    className="component-remove-btn"
                                    onClick={() => removeComponentFromCustomKit(component.id)}
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="item-controls">
                          <div className="quantity-controls">
                            <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                              −
                            </button>
                            <span className="quantity">{item.quantity}</span>
                            <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                              +
                            </button>
                          </div>

                          <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="total-section">
                  <div className="total-label">Total:</div>
                  <div className="total-price">${getTotalPrice().toFixed(2)}</div>
                </div>

                <div className="footer-buttons">
                  <button className="checkout-btn" onClick={handleCheckout}>
                    Proceed to Checkout
                  </button>
                  <button className="clear-btn" onClick={clearCart}>
                    Clear Cart
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartDrawer
