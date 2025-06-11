"use client"

import { useState, useEffect } from "react"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"
import KitDetailModal from "./KitDetailModel"
import "./AvailableKits.css"

const AvailableKits = () => {
  const [kits, setKits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedKit, setSelectedKit] = useState(null)

  useEffect(() => {
    // Set up real-time listener for available kits
    const kitsRef = collection(db, "available-kits")
    const q = query(kitsRef, orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const fetchedKits = []
        querySnapshot.forEach((doc) => {
          fetchedKits.push({
            id: doc.id,
            ...doc.data(),
          })
        })
        setKits(fetchedKits)
        setLoading(false)
        setError(null)
      },
      (error) => {
        console.error("Error fetching kits:", error)
        setError("Failed to load kits. Please try again later.")
        setLoading(false)
      },
    )

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

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

  if (loading) {
    return (
      <div className="available-kits-loading">
        <div className="loading-spinner"></div>
        <p>Loading available kits...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="available-kits-error">
        <div className="error-icon">⚠️</div>
        <h3>Unable to Load Kits</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Try Again
        </button>
      </div>
    )
  }

  if (kits.length === 0) {
    return (
      <div className="available-kits-empty">
        <div className="empty-icon">📦</div>
        <h3>No Kits Available</h3>
        <p>Check back later for new electronics kits!</p>
      </div>
    )
  }

  return (
    <>
      <div className="available-kits">
        {kits.slice(0, 3).map((kit, index) => (
          <div key={kit.id} className="kit-card-wrapper" style={{ "--delay": `${index * 0.1}s` }}>
            <div className="kit-card">
              <div className="kit-card-header">
                <div className="kit-image-container">
                  <img
                    src={
                      kit.image ||
                      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg"
                      || "/placeholder.svg"}
                    alt={kit.title}
                    className="kit-image"
                  />

                  {/* Overlays */}
                  <div className="kit-image-overlay"></div>

                  {/* Badges */}
                  <div className="kit-category-badge">{kit.category}</div>

                  <div className="kit-difficulty-badge" style={{ backgroundColor: getDifficultyColor(kit.difficulty) }}>
                    {kit.difficulty}
                  </div>

                  {/* Discount Badge */}
                  {kit.originalPrice && (
                    <div className="kit-discount-badge">
                      {Math.round(((kit.originalPrice - kit.price) / kit.originalPrice) * 100)}% OFF
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="kit-quick-stats">
                    <div className="kit-rating-badge">
                      <span className="star">⭐</span>
                      {kit.rating}
                    </div>
                    <div className="kit-reviews-badge">
                      <span className="users-icon">👥</span>
                      {kit.reviews}
                    </div>
                  </div>
                </div>
              </div>

              <div className="kit-card-content">
                <div className="kit-content-inner">
                  <div className="kit-title-section">
                    <h3 className="kit-title">{kit.title}</h3>
                    <p className="kit-description">{kit.description}</p>
                  </div>

                  <div className="kit-stats">
                    <div className="kit-rating">
                      <span className="star">⭐</span>
                      <span className="rating-value">{kit.rating}</span>
                      <span className="rating-count">({kit.reviews})</span>
                    </div>
                    <div className="kit-time">
                      <span className="clock-icon">🕐</span>
                      {kit.estimatedTime}
                    </div>
                  </div>

                  <div className="kit-pricing">
                    <div className="kit-price-section">
                      <div className="kit-price">₹{kit.price}</div>
                      {kit.originalPrice && <div className="kit-original-price">₹{kit.originalPrice}</div>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="kit-card-footer">
                <button className="kit-view-btn" onClick={() => setSelectedKit(kit)}>
                  <span className="btn-icon">👁️</span>
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {kits.length > 3 && (
        <div className="see-more-section">
          <button
            className="see-more-btn"
            onClick={() => (window.location.href = "/available-kits")}
          >
            <span>See All Kits ({kits.length})</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      )}

      {selectedKit && <KitDetailModal kit={selectedKit} isOpen={!!selectedKit} onClose={() => setSelectedKit(null)} />}
    </>
  )
}

export default AvailableKits
