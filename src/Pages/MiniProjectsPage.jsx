"use client"

import { useState, useEffect } from "react"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"
import { useCart } from "../contexts/CartContext"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ProjectDetailModal from "../components/ProjectDetailModal"
import CustomProjectModal from "../components/CustomProjectModal"
import "../components/MiniProjects.css"

const MiniProjectsPage = () => {
    const { addToCart } = useCart()
    const [projects, setProjects] = useState([])
    const [filteredProjects, setFilteredProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedProject, setSelectedProject] = useState(null)
    const [showCustomProject, setShowCustomProject] = useState(false)

    // Filter and search states
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [selectedDifficulty, setSelectedDifficulty] = useState("all")
    const [priceRange, setPriceRange] = useState({ min: 0, max: 200 })
    const [sortBy, setSortBy] = useState("newest")

    // Get unique categories and difficulties
    const categories = ["all", ...new Set(projects.map((project) => project.category).filter(Boolean))]
    const difficulties = ["all", ...new Set(projects.map((project) => project.difficulty).filter(Boolean))]

    useEffect(() => {
        const projectsRef = collection(db, "mini-projects")
        const q = query(projectsRef, orderBy("createdAt", "desc"))

        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const fetchedProjects = []
                querySnapshot.forEach((doc) => {
                    fetchedProjects.push({
                        id: doc.id,
                        ...doc.data(),
                    })
                })
                setProjects(fetchedProjects)
                setLoading(false)
                setError(null)
            },
            (error) => {
                console.error("Error fetching projects:", error)
                setError("Failed to load projects. Please try again later.")
                setLoading(false)
            },
        )

        return () => unsubscribe()
    }, [])

    // Filter and search logic
    useEffect(() => {
        const filtered = projects.filter((project) => {
            const matchesSearch =
                project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description?.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = selectedCategory === "all" || project.category === selectedCategory
            const matchesDifficulty = selectedDifficulty === "all" || project.difficulty === selectedDifficulty
            const matchesPrice = project.price >= priceRange.min && project.price <= priceRange.max

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
            case "difficulty":
                const difficultyOrder = { Beginner: 1, Intermediate: 2, Advanced: 3 }
                filtered.sort((a, b) => (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0))
                break
            case "name":
                filtered.sort((a, b) => a.title?.localeCompare(b.title || "") || 0)
                break
            default: // newest
                filtered.sort((a, b) => new Date(b.createdAt?.toDate?.() || 0) - new Date(a.createdAt?.toDate?.() || 0))
        }

        setFilteredProjects(filtered)
    }, [projects, searchTerm, selectedCategory, selectedDifficulty, priceRange, sortBy])

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

    const getCategoryColor = (category) => {
        const colors = {
            IoT: "#2563eb",
            Display: "#7c3aed",
            Robotics: "#4338ca",
            "Smart Home": "#db2777",
            Security: "#dc2626",
        }
        return colors[category] || "#6b7280"
    }

    const clearFilters = () => {
        setSearchTerm("")
        setSelectedCategory("all")
        setSelectedDifficulty("all")
        setPriceRange({ min: 0, max: 200 })
        setSortBy("newest")
    }

    if (loading) {
        return (
            <>
                <Header />
                <div className="products-page-container">
                    <div className="products-page-loading">
                        <div className="products-page-loading-spinner"></div>
                        <p>Loading mini projects...</p>
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
                        <h3>Unable to Load Projects</h3>
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
                                    placeholder="Search mini projects..."
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
                                    <option value="difficulty">Difficulty Level</option>
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
                {filteredProjects.length === 0 ? (
                    <div className="products-page-no-results">
                        <div className="products-page-no-results-icon">🔍</div>
                        <h3>No Projects Found</h3>
                        <p>Try adjusting your search criteria or filters</p>
                        <button onClick={clearFilters} className="products-page-clear-filters-btn">
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <div className="products-page-projects-grid">
                        {filteredProjects.map((project, index) => (
                            <div
                                key={project.id}
                                className="mini-projects-section-project-card"
                                style={{ "--delay": `${index * 0.05}s` }}
                            >
                                <div className="mini-projects-section-project-image-container">
                                    <img
                                        src={project.images?.[0] || "/placeholder.svg"}
                                        alt={project.title}
                                        className="mini-projects-section-project-image"
                                    />
                                    <div
                                        className="mini-projects-section-category-badge"
                                        style={{ backgroundColor: getCategoryColor(project.category) }}
                                    >
                                        {project.category}
                                    </div>
                                    <div className="mini-projects-section-rating-badge">
                                        <span className="mini-projects-section-star">⭐</span>
                                        <span>{project.rating}</span>
                                    </div>
                                </div>

                                <div className="mini-projects-section-project-info">
                                    <div className="mini-projects-section-project-header">
                                        <h3>{project.title}</h3>
                                        <span
                                            className={`mini-projects-section-difficulty-badge mini-projects-section-difficulty-${project.difficulty?.toLowerCase()}`}
                                            style={{
                                                backgroundColor: `${getDifficultyColor(project.difficulty)}15`,
                                                color: getDifficultyColor(project.difficulty),
                                                borderColor: getDifficultyColor(project.difficulty),
                                            }}
                                        >
                                            {project.difficulty}
                                        </span>
                                    </div>

                                    <p className="mini-projects-section-project-description">{project.description}</p>

                                    <div className="mini-projects-section-project-stats">
                                        <div className="mini-projects-section-stat">
                                            <span className="mini-projects-section-stat-icon">⏱️</span>
                                            <span>{project.duration}</span>
                                        </div>
                                        <div className="mini-projects-section-stat">
                                            <span className="mini-projects-section-stat-icon">📦</span>
                                            <span>{project.components?.length || 0} components</span>
                                        </div>
                                    </div>

                                    <div className="mini-projects-section-project-footer">
                                        <div className="mini-projects-section-project-price">
                                            <span className="mini-projects-section-price-currency">₹</span>
                                            <span className="mini-projects-section-price-value">{project.price}</span>
                                        </div>
                                        <button
                                            className="mini-projects-section-view-details-btn"
                                            onClick={() => setSelectedProject(project)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Custom Project Section */}
                <div className="mini-projects-section-custom-project-section">
                    <div className="mini-projects-section-custom-project-content">
                        <div className="mini-projects-section-custom-project-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
                            </svg>
                        </div>
                        <h3>Custom Project Development</h3>
                        <p>
                            Need something specific? Our engineering team specializes in creating custom electronics projects tailored
                            to your exact requirements with professional documentation and support.
                        </p>
                        <button className="mini-projects-section-create-project-btn" onClick={() => setShowCustomProject(true)}>
                            Start Custom Project
                        </button>
                    </div>
                </div>

                {/* Modals */}
                {selectedProject && (
                    <ProjectDetailModal
                        project={selectedProject}
                        isOpen={!!selectedProject}
                        onClose={() => setSelectedProject(null)}
                    />
                )}

                {showCustomProject && (
                    <CustomProjectModal isOpen={showCustomProject} onClose={() => setShowCustomProject(false)} />
                )}
            </div>
            <Footer />
        </>
    )
}

export default MiniProjectsPage
