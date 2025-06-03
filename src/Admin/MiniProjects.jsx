"use client"

import { useState, useEffect } from "react"
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "../firebase"
import "./MiniProjects.css"
import ProjectDetailModal from "../components/ProjectDetailModal"

const MiniProjectsAdmin = () => {
    const [showForm, setShowForm] = useState(false)
    const [showPreview, setShowPreview] = useState(true)
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedProject, setSelectedProject] = useState(null)

    const [formData, setFormData] = useState({
        title: "",
        price: "",
        images: [""],
        description: "",
        difficulty: "",
        duration: "",
        rating: 4.5,
        reviews: 0,
        category: "",
        components: [],
        fullDescription: "",
        features: [],
        learningOutcomes: [],
    })

    const [componentForm, setComponentForm] = useState({
        name: "",
        price: "",
        quantity: 1,
    })

    const [featureInput, setFeatureInput] = useState("")
    const [learningInput, setLearningInput] = useState("")
    const [imageInput, setImageInput] = useState("")

    useEffect(() => {
        if (showPreview) {
            fetchProjects()
        }
    }, [showPreview])

    const fetchProjects = async () => {
        try {
            setLoading(true)
            const projectsRef = collection(db, "mini-projects")
            const q = query(projectsRef, orderBy("createdAt", "desc"))
            const querySnapshot = await getDocs(q)

            const fetchedProjects = []
            querySnapshot.forEach((doc) => {
                fetchedProjects.push({
                    id: doc.id,
                    ...doc.data(),
                })
            })

            setProjects(fetchedProjects)
        } catch (error) {
            console.error("Error fetching projects:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const addComponent = () => {
        if (componentForm.name && componentForm.price) {
            setFormData((prev) => ({
                ...prev,
                components: [...prev.components, { ...componentForm }],
            }))
            setComponentForm({ name: "", price: "", quantity: 1 })
        }
    }

    const removeComponent = (index) => {
        setFormData((prev) => ({
            ...prev,
            components: prev.components.filter((_, i) => i !== index),
        }))
    }

    const addFeature = () => {
        if (featureInput.trim()) {
            setFormData((prev) => ({
                ...prev,
                features: [...prev.features, featureInput.trim()],
            }))
            setFeatureInput("")
        }
    }

    const removeFeature = (index) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index),
        }))
    }

    const addLearningOutcome = () => {
        if (learningInput.trim()) {
            setFormData((prev) => ({
                ...prev,
                learningOutcomes: [...prev.learningOutcomes, learningInput.trim()],
            }))
            setLearningInput("")
        }
    }

    const removeLearningOutcome = (index) => {
        setFormData((prev) => ({
            ...prev,
            learningOutcomes: prev.learningOutcomes.filter((_, i) => i !== index),
        }))
    }

    const addImage = () => {
        if (imageInput.trim()) {
            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, imageInput.trim()],
            }))
            setImageInput("")
        }
    }

    const removeImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }))
    }

    const updateImage = (index, value) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.map((img, i) => (i === index ? value : img)),
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)

            const projectData = {
                ...formData,
                price: Number.parseFloat(formData.price),
                rating: Number.parseFloat(formData.rating),
                reviews: Number.parseInt(formData.reviews),
                components: formData.components.map((comp) => ({
                    ...comp,
                    price: Number.parseFloat(comp.price),
                    quantity: Number.parseInt(comp.quantity),
                })),
                images: formData.images.filter((img) => img.trim() !== ""),
                createdAt: new Date(),
            }

            await addDoc(collection(db, "mini-projects"), projectData)

            alert("Mini project added successfully!")
            setFormData({
                title: "",
                price: "",
                images: [""],
                description: "",
                difficulty: "",
                duration: "",
                rating: 4.5,
                reviews: 0,
                category: "",
                components: [],
                fullDescription: "",
                features: [],
                learningOutcomes: [],
            })
            setShowForm(false)
        } catch (error) {
            console.error("Error adding project:", error)
            alert("Failed to add project")
        } finally {
            setLoading(false)
        }
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

    const filteredProjects = projects.filter(
        (project) =>
            project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="admin-page-mini-projects">
            <div className="admin-page-projects-header">
                <div className="admin-page-header-info">
                    <h2 className="admin-page-projects-title">Mini Projects Management</h2>
                    <p className="admin-page-projects-subtitle">Add and manage electronics mini projects with detailed guides</p>
                </div>
                <div className="admin-page-header-actions">
                    <button className="admin-page-add-project-btn" onClick={() => setShowForm(!showForm)}>
                        {showForm ? "📋 Hide Form" : "🚀 Add Project"}
                    </button>
                    <button className="admin-page-preview-btn" onClick={() => setShowPreview(!showPreview)}>
                        {showPreview ? "📝 Hide Preview" : "👁️ Preview Projects"}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="admin-page-project-form-container">
                    <div className="admin-page-form-header">
                        <h3 className="admin-page-form-title">
                            <span className="admin-page-form-icon">🚀</span>
                            Add New Mini Project
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="admin-page-project-form">
                        <div className="admin-page-form-grid">
                            <div className="admin-page-form-group">
                                <label>Project Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                    required
                                    placeholder="Smart Home Temperature Monitor"
                                    className="admin-page-form-input"
                                />
                            </div>

                            <div className="admin-page-form-group">
                                <label>Category *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => handleInputChange("category", e.target.value)}
                                    required
                                    className="admin-page-form-input"
                                >
                                    <option value="">Select Category</option>
                                    <option value="IoT">IoT</option>
                                    <option value="Display">Display</option>
                                    <option value="Robotics">Robotics</option>
                                    <option value="Smart Home">Smart Home</option>
                                    <option value="Security">Security</option>
                                    <option value="Audio">Audio</option>
                                    <option value="Sensors">Sensors</option>
                                    <option value="Communication">Communication</option>
                                </select>
                            </div>

                            <div className="admin-page-form-group">
                                <label>Price (₹) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => handleInputChange("price", e.target.value)}
                                    required
                                    placeholder="45.99"
                                    className="admin-page-form-input"
                                />
                            </div>

                            <div className="admin-page-form-group">
                                <label>Difficulty Level *</label>
                                <select
                                    value={formData.difficulty}
                                    onChange={(e) => handleInputChange("difficulty", e.target.value)}
                                    required
                                    className="admin-page-form-input"
                                >
                                    <option value="">Select Difficulty</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>

                            <div className="admin-page-form-group">
                                <label>Duration *</label>
                                <input
                                    type="text"
                                    value={formData.duration}
                                    onChange={(e) => handleInputChange("duration", e.target.value)}
                                    required
                                    placeholder="2-3 hours"
                                    className="admin-page-form-input"
                                />
                            </div>

                            <div className="admin-page-form-group">
                                <label>Rating</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="1"
                                    max="5"
                                    value={formData.rating}
                                    onChange={(e) => handleInputChange("rating", e.target.value)}
                                    placeholder="4.8"
                                    className="admin-page-form-input"
                                />
                            </div>
                        </div>

                        <div className="admin-page-form-group">
                            <label>Short Description *</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                required
                                placeholder="Build a WiFi-enabled temperature monitoring system with real-time alerts..."
                                className="admin-page-form-textarea"
                                rows="3"
                            />
                        </div>

                        <div className="admin-page-form-group">
                            <label>Full Description *</label>
                            <textarea
                                value={formData.fullDescription}
                                onChange={(e) => handleInputChange("fullDescription", e.target.value)}
                                required
                                placeholder="Create a smart temperature monitoring system that connects to your WiFi network..."
                                className="admin-page-form-textarea"
                                rows="5"
                            />
                        </div>

                        {/* Images Section */}
                        <div className="admin-page-images-section">
                            <h4 className="admin-page-section-title">
                                <span className="admin-page-section-icon">🖼️</span>
                                Project Images
                            </h4>

                            <div className="admin-page-images-list">
                                {formData.images.map((image, index) => (
                                    <div key={index} className="admin-page-image-item">
                                        <input
                                            type="url"
                                            placeholder="Image URL"
                                            value={image}
                                            onChange={(e) => updateImage(index, e.target.value)}
                                            className="admin-page-form-input"
                                        />
                                        {formData.images.length > 1 && (
                                            <button type="button" onClick={() => removeImage(index)} className="admin-page-remove-btn">
                                                ❌
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="admin-page-add-image-form">
                                <input
                                    type="url"
                                    placeholder="Add another image URL"
                                    value={imageInput}
                                    onChange={(e) => setImageInput(e.target.value)}
                                    className="admin-page-form-input"
                                />
                                <button type="button" onClick={addImage} className="admin-page-add-image-btn">
                                    ➕ Add Image
                                </button>
                            </div>
                        </div>

                        {/* Components Section */}
                        <div className="admin-page-components-section">
                            <h4 className="admin-page-section-title">
                                <span className="admin-page-section-icon">📦</span>
                                Project Components
                            </h4>

                            <div className="admin-page-component-form">
                                <div className="admin-page-component-inputs">
                                    <input
                                        type="text"
                                        placeholder="Component name"
                                        value={componentForm.name}
                                        onChange={(e) => setComponentForm((prev) => ({ ...prev, name: e.target.value }))}
                                        className="admin-page-form-input"
                                    />
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="Price"
                                        value={componentForm.price}
                                        onChange={(e) => setComponentForm((prev) => ({ ...prev, price: e.target.value }))}
                                        className="admin-page-form-input"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Qty"
                                        value={componentForm.quantity}
                                        onChange={(e) => setComponentForm((prev) => ({ ...prev, quantity: e.target.value }))}
                                        className="admin-page-form-input"
                                    />
                                    <button type="button" onClick={addComponent} className="admin-page-add-component-btn">
                                        ➕ Add
                                    </button>
                                </div>
                            </div>

                            <div className="admin-page-components-list">
                                {formData.components.map((component, index) => (
                                    <div key={index} className="admin-page-component-item">
                                        <div className="admin-page-component-info">
                                            <span className="admin-page-component-name">{component.name}</span>
                                            <span className="admin-page-component-details">
                                                ₹{component.price} × {component.quantity}
                                            </span>
                                        </div>
                                        <button type="button" onClick={() => removeComponent(index)} className="admin-page-remove-btn">
                                            ❌
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Features Section */}
                        <div className="admin-page-features-section">
                            <h4 className="admin-page-section-title">
                                <span className="admin-page-section-icon">⭐</span>
                                Project Features
                            </h4>

                            <div className="admin-page-feature-form">
                                <input
                                    type="text"
                                    placeholder="Add a feature"
                                    value={featureInput}
                                    onChange={(e) => setFeatureInput(e.target.value)}
                                    className="admin-page-form-input"
                                />
                                <button type="button" onClick={addFeature} className="admin-page-add-feature-btn">
                                    ➕ Add Feature
                                </button>
                            </div>

                            <div className="admin-page-features-list">
                                {formData.features.map((feature, index) => (
                                    <div key={index} className="admin-page-feature-item">
                                        <span className="admin-page-feature-text">{feature}</span>
                                        <button type="button" onClick={() => removeFeature(index)} className="admin-page-remove-btn">
                                            ❌
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Learning Outcomes Section */}
                        <div className="admin-page-learning-section">
                            <h4 className="admin-page-section-title">
                                <span className="admin-page-section-icon">🎓</span>
                                Learning Outcomes
                            </h4>

                            <div className="admin-page-learning-form">
                                <input
                                    type="text"
                                    placeholder="Add a learning outcome"
                                    value={learningInput}
                                    onChange={(e) => setLearningInput(e.target.value)}
                                    className="admin-page-form-input"
                                />
                                <button type="button" onClick={addLearningOutcome} className="admin-page-add-learning-btn">
                                    ➕ Add Outcome
                                </button>
                            </div>

                            <div className="admin-page-learning-list">
                                {formData.learningOutcomes.map((outcome, index) => (
                                    <div key={index} className="admin-page-learning-item">
                                        <span className="admin-page-learning-text">{outcome}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeLearningOutcome(index)}
                                            className="admin-page-remove-btn"
                                        >
                                            ❌
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="admin-page-form-actions">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="admin-page-btn admin-page-btn-secondary"
                            >
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="admin-page-btn admin-page-btn-primary">
                                {loading ? "Adding Project..." : "Add Project"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {showPreview && (
                <div className="admin-page-projects-preview">
                    <div className="admin-page-preview-header">
                        <h3 className="admin-page-preview-title">
                            <span className="admin-page-preview-icon">👁️</span>
                            Mini Projects Preview ({filteredProjects.length})
                        </h3>
                        <div className="admin-page-preview-search">
                            <span className="admin-page-search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="admin-page-search-input"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="admin-page-loading">
                            <div className="admin-page-loading-spinner"></div>
                            <p>Loading projects...</p>
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="admin-page-no-projects">
                            <div className="admin-page-no-projects-icon">🚀</div>
                            <h4>No Projects Found</h4>
                            <p>
                                {projects.length === 0 ? "No projects have been added yet." : "No projects match your search criteria."}
                            </p>
                        </div>
                    ) : (
                        <div className="admin-page-projects-grid">
                            {filteredProjects.map((project, index) => (
                                <div key={project.id} className="mini-projects-section-project-card" style={{ "--delay": `${index * 0.1}s` }}>
                                    {/* Project Image */}
                                    <div className="mini-projects-section-project-image-container">
                                        <img src={project.images[0] || "/placeholder.svg"} alt={project.title} className="mini-projects-section-project-image" />
                                        <div className="mini-projects-section-category-badge" style={{ backgroundColor: getCategoryColor(project.category) }}>
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
                                                className={`mini-projects-section-difficulty-badge mini-projects-section-difficulty-${project.difficulty.toLowerCase()}`}
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
                                                <span>{project.components.length} components</span>
                                            </div>
                                        </div>

                                        <div className="mini-projects-section-project-footer">
                                            <div className="mini-projects-section-project-price">
                                                <span className="mini-projects-section-price-currency">₹</span>
                                                <span className="mini-projects-section-price-value">{project.price}</span>
                                            </div>
                                            <button className="mini-projects-section-view-details-btn" onClick={() => setSelectedProject(project)}>
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Project Detail Modal */}
            {selectedProject && (
                <ProjectDetailModal
                    project={selectedProject}
                    isOpen={!!selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </div>
    )
}

export default MiniProjectsAdmin
