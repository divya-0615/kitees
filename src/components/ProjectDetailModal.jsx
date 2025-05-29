"use client"

import { useCart } from "../contexts/CartContext"
import "./ProjectDetailModal.css"

const ProjectDetailModal = ({ project, isOpen, onClose }) => {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      id: `project-${project.id}`,
      name: project.title,
      price: project.price,
      quantity: 1,
      image: project.image,
      type: "project",
    })
    onClose()
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "#10b981"
      case "Intermediate":
        return "#f59e0b"
      case "Advanced":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const totalComponentsPrice = project.components.reduce((sum, comp) => sum + comp.price * comp.quantity, 0)

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content project-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{project.title}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-grid">
            {/* Image and Info Section */}
            <div className="modal-image-section">
              <div className="modal-image-container">
                <img src={project.image || "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg"} alt={project.title} className="modal-image" />
                <div
                  className="modal-difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(project.difficulty) }}
                >
                  {project.difficulty}
                </div>
                <div className="modal-rating-badge">
                  <span className="star">⭐</span>
                  {project.rating}
                </div>
              </div>

              <div className="project-stats">
                <div className="stat-item">
                  <div className="stat-icon">🕐</div>
                  <div className="stat-content">
                    <div className="stat-label">Duration</div>
                    <div className="stat-value">{project.duration}</div>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-content">
                    <div className="stat-label">Rating</div>
                    <div className="stat-value">{project.rating}/5.0</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="modal-details-section">
              <div className="modal-price-section">
                <div className="modal-price">${project.price}</div>
                <p className="modal-description">{project.description}</p>
              </div>

              <div className="project-features-section">
                <h3 className="features-title">Project Features</h3>
                <div className="features-list">
                  {project.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <span className="feature-icon">✅</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-components-section">
                <h3 className="components-title">Required Components</h3>
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
                      {project.components.map((component, index) => (
                        <tr key={index}>
                          <td>{component.name}</td>
                          <td>{component.quantity}</td>
                          <td>${component.price.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="total-row">
                        <td>Total Value</td>
                        <td></td>
                        <td>${totalComponentsPrice.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <button onClick={handleAddToCart} className="modal-add-btn project-btn">
                <span className="btn-icon">🛒</span>
                Buy Project Kit
              </button>
            </div>
          </div>

          {/* Full Description */}
          <div className="modal-full-description">
            <h3 className="description-title">Project Overview</h3>
            <p className="description-text">{project.fullDescription}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailModal
