"use client"

import { useCart } from "../contexts/CartContext"
import "./KitDetailModel.css"
import toast from "react-hot-toast"
const KitDetailModal = ({ kit, isOpen, onClose }) => {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      id: `kit-${kit.id}`,
      name: kit.title,
      price: kit.price,
      quantity: 1,
      image: kit.image,
      type: "kit",
    })
    toast.success(`${kit.title} is Added to cart sucessfully...!`, {
      duration: 2500,
      position: "top-center",
      style: {
        background: "#4caf50",
        color: "#fff",
        fontSize: "16px",
        padding: "10px 20px",
        borderRadius: "8px",
        marginTop: "20px",
      },
      reveserOrder: false,
    });
    onClose()
  }

  const totalComponentsPrice = kit.components.reduce((sum, comp) => sum + comp.price * comp.quantity, 0)

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{kit.title}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-grid">
            {/* Image Section */}
            <div className="modal-image-section">
              <div className="modal-image-container">
                <img src={kit.image || "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg"} alt={kit.title} className="modal-image" />
                <div className="modal-category-badge">{kit.category}</div>
              </div>
            </div>

            {/* Details Section */}
            <div className="modal-details-section">
              <div className="modal-price-section">
                <div className="modal-price">₹{kit.price}</div>
                <p className="modal-description">{kit.description}</p>
              </div>

              <div className="modal-components-section">
                <h3 className="components-title">What's Included</h3>
                <div className="components-table-container">
                  <table className="components-table">
                    <thead>
                      <tr>
                        <th>Component</th>
                        <th>Qty</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kit.components.map((component, index) => (
                        <tr key={index}>
                          <td>{component.name}</td>
                          <td>{component.quantity}</td>
                          <td>${component.price.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="total-row">
                        <td>Total Components Value</td>
                        <td></td>
                        <td>${totalComponentsPrice.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <button onClick={handleAddToCart} className="modal-add-btn">
                <span className="btn-icon">🛒</span>
                Add Kit to Cart
              </button>
            </div>
          </div>

          {/* Full Description */}
          <div className="modal-full-description">
            <h3 className="description-title">Detailed Description</h3>
            <p className="description-text">{kit.fullDescription}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KitDetailModal
