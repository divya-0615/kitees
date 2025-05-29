"use client"

import { useState } from "react"
import { useCart } from "../contexts/CartContext"
import "./ProjectDetailModal.css"

const ProjectDetailModal = ({ project, isOpen, onClose }) => {
  const { addToCart } = useCart()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!isOpen || !project) return null

  const handleAddToCart = () => {
    addToCart({
      id: `project-${project.id}`,
      name: project.title,
      price: project.price,
      quantity: 1,
      image: project.images[0],
      type: "project",
    })
    onClose()
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "#059669"
      case "Intermediate":
        return "#d97706"
      case "Advanced":
        return "#dc2626"
      default:
        return "#6b7280"
    }
  }

  const totalComponentsPrice = project.components.reduce((sum, comp) => sum + comp.price * comp.quantity, 0)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content project-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{project.title}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-grid">
            {/* Image Section */}
            <div className="modal-image-section">
              <div className="image-container">
                <img
                  src={project.images[currentImageIndex] || "/placeholder.svg"}
                  alt={`${project.title} - Image ${currentImageIndex + 1}`}
                  className="modal-image"
                />

                {/* Navigation Buttons */}
                {project.images.length > 1 && (
                  <>
                    <button className="nav-btn prev-btn" onClick={prevImage}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15,18 9,12 15,6"></polyline>
                      </svg>
                    </button>
                    <button className="nav-btn next-btn" onClick={nextImage}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9,18 15,12 9,6"></polyline>
                      </svg>
                    </button>
                  </>
                )}

                {/* Image Indicators */}
                {project.images.length > 1 && (
                  <div className="image-indicators">
                    {project.images.map((_, index) => (
                      <button
                        key={index}
                        className={`indicator ${index === currentImageIndex ? "active" : ""}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}

                {/* Badges */}
                <div
                  className="difficulty-badge-modal"
                  style={{ backgroundColor: getDifficultyColor(project.difficulty) }}
                >
                  {project.difficulty}
                </div>
                <div className="rating-badge-modal">
                  <span className="star">⭐</span>
                  {project.rating}
                </div>
              </div>

              <div className="project-stats-modal">
                <div className="stat-item">
                  <div className="stat-icon">⏱️</div>
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
                <div className="stat-item">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <div className="stat-label">Reviews</div>
                    <div className="stat-value">{project.reviews}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="modal-details-section">
              <div className="modal-price-section">
                <div className="modal-price">
                  <span className="price-currency">$</span>
                  <span className="price-value">{project.price}</span>
                </div>
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
                        <td>
                          <strong>Total Value</strong>
                        </td>
                        <td></td>
                        <td>
                          <strong>${totalComponentsPrice.toFixed(2)}</strong>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <button onClick={handleAddToCart} className="modal-add-btn">
                <span className="btn-icon">🛒</span>
                Add to Cart - ${project.price}
              </button>
            </div>
          </div>

          {/* Full Description */}
          <div className="modal-full-description">
            <h3 className="description-title">Project Overview</h3>
            <p className="description-text">{project.fullDescription}</p>

            <div className="learning-outcomes">
              <h4>What You'll Learn</h4>
              <div className="outcomes-list">
                {project.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="outcome-item">
                    <span className="outcome-icon">🎯</span>
                    {outcome}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailModal
