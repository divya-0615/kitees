"use client"

import { useState } from "react"
import { useCart } from "../contexts/CartContext"
import "./ProjectDetailModal.css"
import { toast } from "react-hot-toast"

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
    toast.success(`${project.title} is Added to cart successfully!`, {
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
      reverseOrder: false,
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


  return (
    <div className="mini-projects-modal-modal-overlay" onClick={onClose}>
      <div className="mini-projects-modal-modal-content project-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mini-projects-modal-modal-header">
          <h2 className="mini-projects-modal-modal-title">{project.title}</h2>
          <button className="mini-projects-modal-modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="mini-projects-modal-modal-body">
          <div className="mini-projects-modal-modal-grid">
            {/* Image Section */}
            <div className="mini-projects-modal-modal-image-section">
              <div className="mini-projects-modal-image-container">
                <img
                  src={project.images[currentImageIndex] || "/placeholder.svg"}
                  alt={`${project.title} - Image ${currentImageIndex + 1}`}
                  className="mini-projects-modal-modal-image"
                />

                {project.images.length > 1 && (
                  <>
                    <button
                      className="mini-projects-modal-nav-btn mini-projects-modal-prev-btn"
                      onClick={prevImage}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15,18 9,12 15,6" />
                      </svg>
                    </button>
                    <button
                      className="mini-projects-modal-nav-btn mini-projects-modal-next-btn"
                      onClick={nextImage}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9,18 15,12 9,6" />
                      </svg>
                    </button>
                  </>
                )}

                {project.images.length > 1 && (
                  <div className="mini-projects-modal-image-indicators">
                    {project.images.map((_, index) => (
                      <button
                        key={index}
                        className={`indicator ${index === currentImageIndex ? "active" : ""}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}

                <div
                  className="mini-projects-modal-difficulty-badge-modal"
                  style={{ backgroundColor: getDifficultyColor(project.difficulty) }}
                >
                  {project.difficulty}
                </div>
                <div className="mini-projects-modal-rating-badge-modal">
                  <span className="mini-projects-modal-star">⭐</span>
                  {project.rating}
                </div>
              </div>

              <div className="mini-projects-modal-project-stats-modal">
                <div className="mini-projects-modal-stat-item">
                  <div className="mini-projects-modal-stat-icon">⏱️</div>
                  <div className="mini-projects-modal-stat-content">
                    <div className="mini-projects-modal-stat-label">Duration</div>
                    <div className="mini-projects-modal-stat-value">{project.duration}</div>
                  </div>
                </div>
                <div className="mini-projects-modal-stat-item">
                  <div className="mini-projects-modal-stat-icon">⭐</div>
                  <div className="mini-projects-modal-stat-content">
                    <div className="mini-projects-modal-stat-label">Rating</div>
                    <div className="mini-projects-modal-stat-value">{project.rating}/5.0</div>
                  </div>
                </div>
                <div className="mini-projects-modal-stat-item">
                  <div className="mini-projects-modal-stat-icon">👥</div>
                  <div className="mini-projects-modal-stat-content">
                    <div className="mini-projects-modal-stat-label">Reviews</div>
                    <div className="mini-projects-modal-stat-value">{Math.floor(Math.random() * 25) + 1}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="mini-projects-modal-modal-details-section">
              <div className="mini-projects-modal-modal-price-section">
                <div className="mini-projects-modal-modal-price">
                  <span className="mini-projects-modal-price-currency">₹</span>
                  <span className="mini-projects-modal-price-value">{project.price}</span>
                </div>
                <p className="mini-projects-modal-modal-description">{project.description}</p>
              </div>

              <div className="mini-projects-modal-project-features-section">
                <h3 className="mini-projects-modal-features-title">Project Features</h3>
                <div className="mini-projects-modal-features-list">
                  {project.features.map((feature, idx) => (
                    <div key={idx} className="mini-projects-modal-feature-item">
                      <span className="mini-projects-modal-feature-icon">✅</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mini-projects-modal-modal-components-section">
                <h3 className="mini-projects-modal-components-title">Required Components</h3>
                <div className="mini-projects-modal-components-table-container">
                  <table className="mini-projects-modal-components-table">
                    <thead>
                      <tr>
                        <th>Component</th>
                        <th>Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.components.map((component, idx) => (
                        <tr key={idx}>
                          <td>{component.name}</td>
                          <td>{component.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button onClick={handleAddToCart} className="mini-projects-modal-modal-add-btn">
                <span className="mini-projects-modal-btn-icon">🛒</span>
                Add to Cart – ₹{project.price}
              </button>
            </div>
          </div>

          {/* Full Description */}
          <div className="mini-projects-modal-modal-full-description">
            <h3 className="mini-projects-modal-description-title">Project Overview</h3>
            <p className="mini-projects-modal-description-text">{project.fullDescription}</p>

            <div className="mini-projects-modal-learning-outcomes">
              <h4>What You'll Learn</h4>
              <div className="mini-projects-modal-outcomes-list">
                {project.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="mini-projects-modal-outcome-item">
                    <span className="mini-projects-modal-outcome-icon">🎯</span>
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
