"use client"

import { useState, useEffect } from "react"
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase"
import "./MiniProjects.css"
import ProjectDetailModal from "../components/ProjectDetailModal"
import { IKContext, IKUpload } from "imagekitio-react"
import { Trash2, Edit, Upload, Star } from "lucide-react"
import toast from "react-hot-toast"

const MiniProjectsAdmin = () => {
    const [showForm, setShowForm] = useState(false)
    const [showPreview, setShowPreview] = useState(true)
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedProject, setSelectedProject] = useState(null)

    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [imageCount, setImageCount] = useState(1)

    // ImageKit configuration
    const urlEndpoint = process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT
    const publicKey = process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY

    const [formData, setFormData] = useState({
        title: "",
        price: "",
        images: [],
        description: "",
        difficulty: "",
        duration: "",
        rating: 4.5,
        category: "",
        components: [],
        fullDescription: "",
        features: [],
        learningOutcomes: [],
        fileIds: [],
    })

    const [componentForm, setComponentForm] = useState({
        name: "",
        quantity: 1,
    })

    const [featureInput, setFeatureInput] = useState("")
    const [learningInput, setLearningInput] = useState("")

    useEffect(() => {
        if (showPreview) {
            fetchProjects()
        }
    }, [showPreview])

    // Authenticator for ImageKit upload requests
    const authenticator = async () => {
        try {
            const response = await fetch("http://localhost:4000/auth")
            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`Request failed with status ${response.status}: ${errorText}`)
            }
            const data = await response.json()
            const { signature, expire, token } = data
            return { signature, expire, token }
        } catch (error) {
            throw new Error(`Authentication request failed: ${error.message}`)
        }
    }

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
        if (componentForm.name) {
            setFormData((prev) => ({
                ...prev,
                components: [...prev.components, { ...componentForm }],
            }))
            setComponentForm({ name: "", quantity: 1 })
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

    const removeImage = (index) => {
        setFormData((prev) => {
            const newImages = [...prev.images]
            const newFileIds = [...prev.fileIds]
            newImages.splice(index, 1)
            newFileIds.splice(index, 1)
            return {
                ...prev,
                images: newImages,
                fileIds: newFileIds,
            }
        })
    }

    const handleImageCountChange = (count) => {
        const newCount = Math.max(1, Math.min(10, count)) // Limit between 1 and 10
        setImageCount(newCount)

        // Initialize empty slots for images if needed
        setFormData((prev) => {
            const newImages = [...prev.images]
            const newFileIds = [...prev.fileIds]

            while (newImages.length < newCount) {
                newImages.push("")
                newFileIds.push("")
            }

            return {
                ...prev,
                images: newImages.slice(0, newCount),
                fileIds: newFileIds.slice(0, newCount),
            }
        })
    }

    const handleImageUploadSuccess = (data, index) => {
        setFormData((prev) => {
            const newImages = [...prev.images]
            const newFileIds = [...prev.fileIds]

            newImages[index] = data.url
            newFileIds[index] = data.fileId

            return {
                ...prev,
                images: newImages,
                fileIds: newFileIds,
            }
        })

        toast.success(`Image ${index + 1} uploaded successfully!`)
    }

    const setAsCardImage = (index) => {
        setFormData((prev) => {
            const newImages = [...prev.images]
            const newFileIds = [...prev.fileIds]

            // Move selected image to first position
            const selectedImage = newImages[index]
            const selectedFileId = newFileIds[index]

            newImages.splice(index, 1)
            newFileIds.splice(index, 1)

            newImages.unshift(selectedImage)
            newFileIds.unshift(selectedFileId)

            return {
                ...prev,
                images: newImages,
                fileIds: newFileIds,
            }
        })

        toast.success("Image set as card display image!")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            setIsUploading(true)

            // Prepare project data
            const projectData = {
                ...formData,
                price: Number.parseFloat(formData.price),
                rating: Number.parseFloat(formData.rating),
                components: formData.components.map((comp) => ({
                    name: comp.name,
                    quantity: Number.parseInt(comp.quantity),
                })),
                images: formData.images.filter((img) => img.trim() !== ""),
                fileIds: formData.fileIds.filter((id, index) => formData.images[index].trim() !== ""),
                createdAt: new Date(),
            }

            if (isEditing && editingId) {
                // Update existing project
                await updateDoc(doc(db, "mini-projects", editingId), projectData)
                alert("Mini project updated successfully!")
            } else {
                // Add new project
                await addDoc(collection(db, "mini-projects"), projectData)
                alert("Mini project added successfully!")
            }

            resetForm()
            setShowForm(false)
            fetchProjects()
        } catch (error) {
            console.error("Error saving project:", error)
            alert(isEditing ? "Failed to update project" : "Failed to add project")
        } finally {
            setLoading(false)
            setIsUploading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            title: "",
            price: "",
            images: [],
            description: "",
            difficulty: "",
            duration: "",
            rating: 4.5,
            category: "",
            components: [],
            fullDescription: "",
            features: [],
            learningOutcomes: [],
            fileIds: [],
        })
        setImageCount(1)
        setIsEditing(false)
        setEditingId(null)
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

    const handleEdit = (project) => {
        setFormData({
            title: project.title || "",
            price: project.price?.toString() || "",
            images: project.images || [],
            description: project.description || "",
            difficulty: project.difficulty || "",
            duration: project.duration || "",
            rating: project.rating || 4.5,
            category: project.category || "",
            components: project.components || [],
            fullDescription: project.fullDescription || "",
            features: project.features || [],
            learningOutcomes: project.learningOutcomes || [],
            fileIds: project.fileIds || Array(project.images?.length || 0).fill(""),
        })
        setImageCount(project.images?.length || 1)
        setIsEditing(true)
        setEditingId(project.id)
        setShowForm(true)
        setShowPreview(false)
    }

    const handleDelete = async (projectId, fileIds = []) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            try {
                setLoading(true)

                // Delete from Firestore
                await deleteDoc(doc(db, "mini-projects", projectId))

                // Delete images from ImageKit if fileIds exist
                if (fileIds && fileIds.length > 0) {
                    for (const fileId of fileIds) {
                        if (fileId) {
                            try {
                                await fetch("http://localhost:4000/deleteImage", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ fileId }),
                                })
                            } catch (imageError) {
                                console.error("Error deleting image from ImageKit:", imageError)
                                // Continue even if image deletion fails
                            }
                        }
                    }
                }

                // Update local state
                setProjects(projects.filter((project) => project.id !== projectId))
                alert("Project deleted successfully!")
            } catch (error) {
                console.error("Error deleting project:", error)
                alert("Failed to delete project")
            } finally {
                setLoading(false)
            }
        }
    }

    const cancelForm = () => {
        resetForm()
        setShowForm(false)
        setShowPreview(true)
    }

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
                            {isEditing ? "Edit Mini Project" : "Add New Mini Project"}
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

                            {/* Image Count Input */}
                            <div className="admin-image-count-container">
                                <label>Number of Images to Upload (1-10):</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={imageCount}
                                    onChange={(e) => handleImageCountChange(Number.parseInt(e.target.value) || 1)}
                                    className="admin-page-form-input admin-image-count-input"
                                />
                            </div>

                            {/* Dynamic File Upload Inputs */}
                            <div className="admin-image-upload-grid">
                                <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
                                    {Array.from({ length: imageCount }, (_, index) => (
                                        <div key={index} className="admin-image-upload-item">
                                            <div className="admin-image-upload-header">
                                                <h5>Image {index + 1}</h5>
                                                {index === 0 && <span className="admin-card-image-badge">Card Display</span>}
                                            </div>

                                            {formData.images[index] ? (
                                                <div className="admin-uploaded-image-container">
                                                    <img
                                                        src={formData.images[index] || "/placeholder.svg"}
                                                        alt={`Project image ${index + 1}`}
                                                        className="admin-uploaded-image-preview"
                                                    />
                                                    <div className="admin-image-actions">
                                                        {index !== 0 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setAsCardImage(index)}
                                                                className="admin-set-card-btn"
                                                                title="Set as card display image"
                                                            >
                                                                <Star size={14} />
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="admin-image-delete-btn"
                                                            title="Delete image"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="admin-image-upload-placeholder">
                                                    <Upload size={24} />
                                                    <p>Upload Image {index + 1}</p>
                                                    <IKUpload
                                                        fileName={`project-image-${index + 1}.png`}
                                                        onError={(error) => {
                                                            console.error("Error uploading image: ", error)
                                                            toast.error("Please Turn on the server...!")
                                                            alert("Error uploading image: Network Error\nPlease kindly turn on the server...!")
                                                        }}
                                                        onSuccess={(data) => handleImageUploadSuccess(data, index)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </IKContext>
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
                                            <span className="admin-page-component-details">Qty: {component.quantity}</span>
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
                            <button type="button" onClick={cancelForm} className="admin-page-btn admin-page-btn-secondary">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="admin-page-btn admin-page-btn-primary">
                                {loading
                                    ? isEditing
                                        ? "Updating Project..."
                                        : "Adding Project..."
                                    : isEditing
                                        ? "Update Project"
                                        : "Add Project"}
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
                                <div
                                    key={project.id}
                                    className="mini-projects-section-project-card"
                                    style={{ "--delay": `${index * 0.1}s` }}
                                >
                                    {/* Project Image */}
                                    <div className="mini-projects-section-project-image-container">
                                        <img
                                            src={project.images[0] || "/placeholder.svg"}
                                            alt={project.title}
                                            className="mini-projects-section-project-image"
                                        />
                                        {/* Admin Actions */}
                                        <div className="kit-admin-actions">
                                            <button
                                                className="kit-edit-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleEdit(project)
                                                }}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="kit-delete-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDelete(project.id, project.fileIds)
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
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
