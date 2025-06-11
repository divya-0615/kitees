"use client"

import { useState, useEffect } from "react"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"
import Header from "../components/Header"
import Footer from "../components/Footer"
import KitDetailModal from "../components/KitDetailModel"
import "../components/AvailableKits.css"

const AvailableKitsPage = () => {
    const [kits, setKits] = useState([])
    const [filteredKits, setFilteredKits] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedKit, setSelectedKit] = useState(null)

    // Filter and search states
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [selectedDifficulty, setSelectedDifficulty] = useState("all")
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
    const [sortBy, setSortBy] = useState("newest")

    // Get unique categories and difficulties
    const categories = ["all", ...new Set(kits.map((kit) => kit.category).filter(Boolean))]
    const difficulties = ["all", ...new Set(kits.map((kit) => kit.difficulty).filter(Boolean))]

    useEffect(() => {
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

        return () => unsubscribe()
    }, [])

    // Filter and search logic
    useEffect(() => {
        const filtered = kits.filter((kit) => {
            const matchesSearch =
                kit.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                kit.description?.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = selectedCategory === "all" || kit.category === selectedCategory
            const matchesDifficulty = selectedDifficulty === "all" || kit.difficulty === selectedDifficulty
            const matchesPrice = kit.price >= priceRange.min && kit.price <= priceRange.max

            return matchesSearch && matchesCategory && matchesDifficulty && matchesPrice
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

        setFilteredKits(filtered)
    }, [kits, searchTerm, selectedCategory, selectedDifficulty, priceRange, sortBy])

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

    const clearFilters = () => {
        setSearchTerm("")
        setSelectedCategory("all")
        setSelectedDifficulty("all")
        setPriceRange({ min: 0, max: 1000 })
        setSortBy("newest")
    }

    if (loading) {
        return (
            <>
                <Header />
                <div className="products-page-container">
                    <div className="products-page-loading">
                        <div className="products-page-loading-spinner"></div>
                        <p>Loading available kits...</p>
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
                        <h3>Unable to Load Kits</h3>
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
                                    placeholder="Search electronics kits..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="products-page-search-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>

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
                                <label>Difficulty</label>
                                <select
                                    value={selectedDifficulty}
                                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                                    className="products-page-filter-select"
                                >
                                    {difficulties.map((difficulty) => (
                                        <option key={difficulty} value={difficulty}>
                                            {difficulty === "all" ? "All Levels" : difficulty}
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
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))}
                                        className="products-page-price-input"
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

                            <button onClick={clearFilters} className="products-page-clear-filters-btn">
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {filteredKits.length === 0 ? (
                    <div className="products-page-no-results">
                        <div className="products-page-no-results-icon">🔍</div>
                        <h3>No Kits Found</h3>
                        <p>Try adjusting your search criteria or filters</p>
                        <button onClick={clearFilters} className="products-page-clear-filters-btn">
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <div className="products-page-kits-grid">
                        {filteredKits.map((kit, index) => (
                            <div key={kit.id} className="kit-card-wrapper" style={{ "--delay": `${index * 0.05}s` }}>
                                <div className="kit-card">
                                    <div className="kit-card-header">
                                        <div className="kit-image-container">
                                            <img
                                                src={
                                                    kit.image ||
                                                    "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg" ||
                                                    "/placeholder.svg"
                                                }
                                                alt={kit.title}
                                                className="kit-image"
                                            />
                                            <div className="kit-image-overlay"></div>
                                            <div className="kit-category-badge">{kit.category}</div>
                                            <div
                                                className="kit-difficulty-badge"
                                                style={{ backgroundColor: getDifficultyColor(kit.difficulty) }}
                                            >
                                                {kit.difficulty}
                                            </div>
                                            {kit.originalPrice && (
                                                <div className="kit-discount-badge">
                                                    {Math.round(((kit.originalPrice - kit.price) / kit.originalPrice) * 100)}% OFF
                                                </div>
                                            )}
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
                )}

                {selectedKit && (
                    <KitDetailModal kit={selectedKit} isOpen={!!selectedKit} onClose={() => setSelectedKit(null)} />
                )}
            </div>
            <Footer />
        </>
    )
}

export default AvailableKitsPage
