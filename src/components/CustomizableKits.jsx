"use client"

import { useState, useRef, useEffect } from "react"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"
import { useCart } from "../contexts/CartContext"
import ComponentCard from "./ComponentCard"
import FloatingBasket from "./FloatingBasket"
import "./CustomizableKits.css"
import toast from "react-hot-toast"

const CustomizableKits = () => {
    const { addToCart } = useCart()
    const [components, setComponents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [animatingComponent, setAnimatingComponent] = useState(null)
    const [basketItems, setBasketItems] = useState([])
    const [showNotification, setShowNotification] = useState(false)
    const basketRef = useRef(null)

    useEffect(() => {
        // Set up real-time listener for custom kit components
        const componentsRef = collection(db, "custom-kit-components")
        const q = query(componentsRef, orderBy("createdAt", "desc"))

        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const fetchedComponents = []
                querySnapshot.forEach((doc) => {
                    fetchedComponents.push({
                        id: doc.id,
                        ...doc.data(),
                    })
                })
                setComponents(fetchedComponents)
                setLoading(false)
                setError(null)
            },
            (error) => {
                console.error("Error fetching components:", error)
                setError("Failed to load components. Please try again later.")
                setLoading(false)
            },
        )

        // Cleanup subscription on unmount
        return () => unsubscribe()
    }, [])

    const handleAddToKit = (component) => {
        setAnimatingComponent(component.id)
        setBasketItems((prev) => [...prev, component.id])

        // Add to cart as custom kit component
        addToCart({
            id: `custom-component-${component.id}-${Date.now()}`,
            name: component.title,
            price: component.price,
            quantity: 1,
            image: component.image,
            type: "custom-component",
            category: component.category,
        })

        toast.success(`${component.title} added to your custom kit!`, {
            duration: 3500,
            position: "bottom-right",
            style: {
                background: "linear-gradient(135deg, #34d399 0%, #10b981 50%,rgb(17, 175, 125) 100%)",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: "600",
                padding: "20px 26px",
                borderRadius: "16px",
                marginBottom: "16px",
                boxShadow: "0 12px 30px rgba(52, 211, 153, 0.5), 0 6px 16px rgba(0, 0, 0, 0.2)",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(12px)",
                maxWidth: "420px",
            },
            icon: "🌟",
            iconTheme: {
                primary: "#ffffff",
                secondary: "transparent",
            },
        })

        setShowNotification(true)

        // Reset animation after delay
        setTimeout(() => {
            setAnimatingComponent(null)
            setShowNotification(false)
        }, 1500)
    }

    if (loading) {
        return (
            <div className="customizable-kits-loading">
                <div className="loading-spinner"></div>
                <p>Loading components...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="customizable-kits-error">
                <div className="error-icon">⚠️</div>
                <h3>Unable to Load Components</h3>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="retry-btn">
                    Try Again
                </button>
            </div>
        )
    }

    if (components.length === 0) {
        return (
            <div className="customizable-kits-empty">
                <div className="empty-icon">⚙️</div>
                <h3>No Components Available</h3>
                <p>Check back later for new components to build your custom kit!</p>
            </div>
        )
    }

    return (
        <div className="customizable-kits">
            {/* Kit Builder Header */}
            <div className="customizable-kits-kit-builder-header">
                <div className="customizable-kits-header-content">
                    <div className="customizable-kits-header-text">
                        <div className="customizable-kits-header-icon-wrapper">
                            <div className="customizable-kits-header-icon bounce">🛠️</div>
                            <div className="customizable-kits-header-title-wrapper">
                                <h3 className="customizable-kits-header-title">Custom Kit Builder</h3>
                                <p className="customizable-kits-header-subtitle">
                                    Build your perfect electronics kit by selecting individual components
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Basket */}
            <FloatingBasket ref={basketRef} basketItems={basketItems} animatingComponent={animatingComponent} />

            {/* Components Grid */}
            <div className="customizable-kits-components-grid">
                {components.slice(0, 3).map((component, index) => (
                    <ComponentCard
                        key={component.id}
                        component={component}
                        index={index}
                        animatingComponent={animatingComponent}
                        onAddToKit={handleAddToKit}
                        basketRef={basketRef}
                    />
                ))}
            </div>
            {components.length > 3 && (
                <div className="see-more-section">
                    <button
                        className="see-more-btn"
                        onClick={() => (window.location.href = "/customizable-kits")}
                    >
                        <span>See All Components ({components.length})</span>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    )
}

export default CustomizableKits
