"use client"

import { useState, useEffect } from "react"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"
import { useCart } from "../contexts/CartContext"
import ProjectDetailModal from "./ProjectDetailModal"
import CustomProjectModal from "./CustomProjectModal"
import "./MiniProjects.css"

const MiniProjects = () => {
  const { addToCart } = useCart()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [showCustomProject, setShowCustomProject] = useState(false)

  useEffect(() => {
    // Set up real-time listener for mini projects
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

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

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

  if (loading) {
    return (
      <div className="mini-projects-loading">
        <div className="loading-spinner"></div>
        <p>Loading mini projects...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mini-projects-error">
        <div className="error-icon">⚠️</div>
        <h3>Unable to Load Projects</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Try Again
        </button>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="mini-projects-empty">
        <div className="empty-icon">🚀</div>
        <h3>No Projects Available</h3>
        <p>Check back later for exciting new mini projects!</p>
      </div>
    )
  }

  return (
    <>
      <div className="mini-projects-section-mini-projects">
        <div className="mini-projects-section-mini-projects-container">
          {/* Projects Header */}
          <div className="mini-projects-section-projects-header">
            <div className="mini-projects-section-header-badge">
              <span className="mini-projects-section-badge-icon">🚀</span>
              <span className="mini-projects-section-badge-text">Featured Projects</span>
            </div>
            <h2>Mini Projects Collection</h2>
            <p className="mini-projects-section-mini-projects-subtitle">
              Professional-grade electronics projects with comprehensive guides, quality components, and expert support
            </p>
          </div>

          {/* Projects Grid */}
          <div className="mini-projects-section-projects-grid">
            {projects.slice(0, 2).map((project, index) => (
              <div
                key={project.id}
                className="mini-projects-section-project-card"
                style={{ "--delay": `${index * 0.1}s` }}
              >
                {/* Project Image */}
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

                {/* Project Info */}
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
          {projects.length > 2 && (
            <div className="see-more-section" style={{marginTop: "0",paddingBottom: "20px"}}>
              <button className="see-more-btn" onClick={() => (window.location.href = "/mini-projects")}>
                <span>See All Projects ({projects.length})</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
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
                Need something specific? Our engineering team specializes in creating custom electronics projects
                tailored to your exact requirements with professional documentation and support.
              </p>
              <button className="mini-projects-section-create-project-btn" onClick={() => setShowCustomProject(true)}>
                Start Custom Project
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Custom Project Modal */}
      {showCustomProject && (
        <CustomProjectModal isOpen={showCustomProject} onClose={() => setShowCustomProject(false)} />
      )}
    </>
  )
}

export default MiniProjects
