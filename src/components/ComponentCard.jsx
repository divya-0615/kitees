"use client"

import { useState } from "react"
import "./ComponentCard.css"

const ComponentCard = ({ component, index, animatingComponent, onAddToKit, basketRef }) => {
    const [showFloatingImage, setShowFloatingImage] = useState(false)

    const getCategoryColor = (category) => {
        const colors = {
            Microcontroller: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            Prototyping: "linear-gradient(135deg, #10b981, #059669)",
            Display: "linear-gradient(135deg, #f59e0b, #d97706)",
            Passive: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
            Sensor: "linear-gradient(135deg, #ef4444, #dc2626)",
            Motor: "linear-gradient(135deg, #6366f1, #4f46e5)",
            Connectivity: "linear-gradient(135deg, #ec4899, #db2777)",
        }
        return colors[category] || "linear-gradient(135deg, #6b7280, #4b5563)"
    }

    const handleAddToKit = () => {
        if (!basketRef.current) return

        setShowFloatingImage(true)
        onAddToKit(component)

        // Calculate basket position for animation
        const basketRect = basketRef.current.getBoundingClientRect()
        const cardRect = document.querySelector(`[data-component-id="${component.id}"]`).getBoundingClientRect()

        // Set CSS custom properties for animation
        document.documentElement.style.setProperty("--basket-x", `${basketRect.left + basketRect.width / 2}px`)
        document.documentElement.style.setProperty("--basket-y", `${basketRect.top + basketRect.height / 2}px`)
        document.documentElement.style.setProperty("--card-x", `${cardRect.left + cardRect.width / 2}px`)
        document.documentElement.style.setProperty("--card-y", `${cardRect.top + cardRect.height / 2}px`)

        setTimeout(() => {
            setShowFloatingImage(false)
        }, 1500)
    }

    return (
        <div className="component-card-wrapper" style={{ "--delay": `${index * 0.1}s` }}>
            <div
                className={`component-card ${animatingComponent === component.id ? "animating" : ""}`}
                data-component-id={component.id}
            >
                <div className="card-header">
                    <div className="image-container">
                        <img src={component.image || "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg"} alt={component.title} className="component-image" />

                        {/* Gradient overlay */}
                        <div className="image-overlay"></div>

                        {/* Category badge */}
                        <div className="category-badge" style={{ background: getCategoryColor(component.category) }}>
                            {component.category}
                        </div>

                        {/* Stock status */}
                        <div className="stock-badge">In Stock</div>

                        {/* Rating */}
                        <div className="rating-badge">
                            <span className="star">⭐</span>
                            {component.rating}
                        </div>
                    </div>
                </div>

                <div className="card-content">
                    <div className="content-inner">
                        <div className="title-section">
                            <h3 className="component-title">{component.title}</h3>
                            <p className="component-description">{component.description}</p>
                        </div>

                        {/* Specifications */}
                        <div className="specifications">
                            <div className="spec-header">
                                <span className="info-icon">ℹ️</span>
                                Key Features:
                            </div>
                            <div className="spec-list">
                                {component.specifications.slice(0, 2).map((spec, i) => (
                                    <div key={i} className="spec-item">
                                        • {spec}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="price-rating">
                            <div className="price">₹{component.price}</div>
                            <div className="rating">
                                <span className="star">⭐</span>
                                {component.rating}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-footer">
                    <button className="add-to-kit-btn" onClick={handleAddToKit} disabled={animatingComponent === component.id}>
                        <span className="btn-icon">➕</span>
                        {animatingComponent === component.id ? "Adding..." : "Add to Kit"}

                        {/* Button animation overlay */}
                        {animatingComponent === component.id && <div className="btn-overlay"></div>}
                    </button>
                </div>

                {/* Floating component animation */}
                {showFloatingImage && (
                    <div className="floating-image">
                        <img src={component.image || "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg"} alt={component.title} className="floating-img" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ComponentCard
