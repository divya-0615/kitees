"use client"

import { useState, useRef, useEffect } from "react"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"
import { useCart } from "../contexts/CartContext"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ComponentCard from "../components/ComponentCard"
import FloatingBasket from "../components/FloatingBasket"
import "../components/CustomizableKits.css"
import toast from "react-hot-toast"

const CustomizableKitsPage = () => {
    const { addToCart } = useCart()
    const [components, setComponents] = useState([])
    const [filteredComponents, setFilteredComponents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [animatingComponent, setAnimatingComponent] = useState(null)
    const [basketItems, setBasketItems] = useState([])
    const basketRef = useRef(null)

    // Filter and search states
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100 })
    const [sortBy, setSortBy] = useState("newest")
    const [inStockOnly, setInStockOnly] = useState(false)

    // Get unique categories
    const categories = ["all", ...new Set(components.map((comp) => comp.category).filter(Boolean))]

    useEffect(() => {
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

        return () => unsubscribe()
    }, [])

    // Filter and search logic
    useEffect(() => {
        const filtered = components.filter((component) => {
            const matchesSearch =
                component.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                component.description?.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = selectedCategory === "all" || component.category === selectedCategory
            const matchesPrice = component.price >= priceRange.min && component.price <= priceRange.max
            const matchesStock = !inStockOnly || component.inStock

            return matchesSearch && matchesCategory && matchesPrice && matchesStock
        })

        // Sort filtered results
        switch (sortBy) {
            case "price-low":
                filtered.sort((a, b) => a.price - b.price)
                break
            case "price-high":
                filtered.sort((a, b) => b.price - a.price)
                break
            case "rating":
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
                break
            case "name":
                filtered.sort((a, b) => a.title?.localeCompare(b.title || "") || 0)
                break
            default: // newest
                filtered.sort((a, b) => new Date(b.createdAt?.toDate?.() || 0) - new Date(a.createdAt?.toDate?.() || 0))
        }

        setFilteredComponents(filtered)
    }, [components, searchTerm, selectedCategory, priceRange, sortBy, inStockOnly])

    const handleAddToKit = (component) => {
        setAnimatingComponent(component.id)
        setBasketItems((prev) => [...prev, component.id])

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
        })

        setTimeout(() => {
            setAnimatingComponent(null)
        }, 1500)
    }

    const clearFilters = () => {
        setSearchTerm("")
        setSelectedCategory("all")
        setPriceRange({ min: 0, max: 100 })
        setSortBy("newest")
        setInStockOnly(false)
    }

    if (loading) {
        return (
            <>
                <Header />
                <div className="products-page-container">
                    <div className="products-page-loading">
                        <div className="products-page-loading-spinner"></div>
                        <p>Loading components...</p>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="products-page-container">
                    <div className="products-page-error">
                        <div className="products-page-error-icon">⚠️</div>
                        <h3>Unable to Load Components</h3>
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()} className="products-page-retry-btn">
                            Try Again
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />
            <div className="products-page-container">
                {/* Search Section */}
                <div className="products-page-search-section">
                    <div className="products-page-search-container">
                        <div className="products-page-search-wrapper">
                            <div className="products-page-search-input-container">
                                <svg
                                    className="products-page-search-icon"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search components..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="products-page-search-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Basket */}
                <FloatingBasket ref={basketRef} basketItems={basketItems} animatingComponent={animatingComponent} />

                {/* Filters Section */}
                <div className="products-page-filters-section">
                    <div className="products-page-filters-container">
                        <div className="products-page-filter-controls">
                            <div className="products-page-filter-group">
                                <label>Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="products-page-filter-select"
                                >
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category === "all" ? "All Categories" : category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="products-page-filter-group">
                                <label>Price Range</label>
                                <div className="products-page-price-range-container">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange((prev) => ({ ...prev, min: Number(e.target.value) }))}
                                        className="products-page-price-input"
                                        style={{maxWidth: "120px",marginRight: "30px"}}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))}
                                        className="products-page-price-input"
                                        style={{maxWidth: "120px"}}
                                    />
                                </div>
                            </div>

                            <div className="products-page-filter-group">
                                <label>Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="products-page-filter-select"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="name">Name A-Z</option>
                                </select>
                            </div>

                            <div className="products-page-filter-group products-page-checkbox-group">
                                <label className="products-page-checkbox-label">
                                    <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
                                    <span>In Stock Only</span>
                                </label>
                            </div>

                            <button onClick={clearFilters} className="products-page-clear-filters-btn">
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {filteredComponents.length === 0 ? (
                    <div className="products-page-no-results">
                        <div className="products-page-no-results-icon">🔍</div>
                        <h3>No Components Found</h3>
                        <p>Try adjusting your search criteria or filters</p>
                        <button onClick={clearFilters} className="products-page-clear-filters-btn">
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <div className="products-page-components-grid">
                        {filteredComponents.map((component, index) => (
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
                )}
            </div>
            <Footer />
        </>
    )
}

export default CustomizableKitsPage
