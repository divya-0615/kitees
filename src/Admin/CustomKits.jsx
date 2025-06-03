"use client"

import { useState, useEffect } from "react"
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "../firebase"
import "./CustomKits.css"

const CustomKitsAdmin = () => {
    const [showForm, setShowForm] = useState(false)
    const [showPreview, setShowPreview] = useState(true)
    const [components, setComponents] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const [formData, setFormData] = useState({
        title: "",
        price: "",
        image: "",
        description: "",
        category: "",
        rating: 4.5,
        inStock: true,
        specifications: [],
    })

    const [specificationInput, setSpecificationInput] = useState("")

    useEffect(() => {
        if (showPreview) {
            fetchComponents()
        }
    }, [showPreview])

    const fetchComponents = async () => {
        try {
            setLoading(true)
            const componentsRef = collection(db, "custom-kit-components")
            const q = query(componentsRef, orderBy("createdAt", "desc"))
            const querySnapshot = await getDocs(q)

            const fetchedComponents = []
            querySnapshot.forEach((doc) => {
                fetchedComponents.push({
                    id: doc.id,
                    ...doc.data(),
                })
            })

            setComponents(fetchedComponents)
        } catch (error) {
            console.error("Error fetching components:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const addSpecification = () => {
        if (specificationInput.trim()) {
            setFormData((prev) => ({
                ...prev,
                specifications: [...prev.specifications, specificationInput.trim()],
            }))
            setSpecificationInput("")
        }
    }

    const removeSpecification = (index) => {
        setFormData((prev) => ({
            ...prev,
            specifications: prev.specifications.filter((_, i) => i !== index),
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)

            const componentData = {
                ...formData,
                price: Number.parseFloat(formData.price),
                rating: Number.parseFloat(formData.rating),
                createdAt: new Date(),
            }

            await addDoc(collection(db, "custom-kit-components"), componentData)

            alert("Component added successfully!")
            setFormData({
                title: "",
                price: "",
                image: "",
                description: "",
                category: "",
                rating: 4.5,
                inStock: true,
                specifications: [],
            })
            setShowForm(false)
        } catch (error) {
            console.error("Error adding component:", error)
            alert("Failed to add component")
        } finally {
            setLoading(false)
        }
    }

    const filteredComponents = components.filter(
        (component) =>
            component.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            component.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            component.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

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

    return (
        <div className="admin-page-custom-kits">
            <div className="admin-page-custom-kits-header">
                <div className="admin-page-header-info">
                    <h2 className="admin-page-custom-kits-title">Custom Kit Components Management</h2>
                    <p className="admin-page-custom-kits-subtitle">
                        Add and manage individual components for custom kit building
                    </p>
                </div>
                <div className="admin-page-header-actions">
                    <button className="admin-page-add-component-btn" onClick={() => setShowForm(!showForm)}>
                        {showForm ? "📋 Hide Form" : "➕ Add Component"}
                    </button>
                    <button className="admin-page-preview-btn" onClick={() => setShowPreview(!showPreview)}>
                        {showPreview ? "📝 Hide Preview" : "👁️ Preview Components"}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="admin-page-kit-form-container">
                    <div className="admin-page-form-header">
                        <h3 className="admin-page-form-title">
                            <span className="admin-page-form-icon">⚙️</span>
                            Add New Component
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="admin-page-kit-form">
                        {/* Main fields in a grid */}
                        <div className="admin-page-form-grid">
                            <div className="admin-page-form-group">
                                <label>Component Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => handleInputChange("title", e.target.value)}
                                    required
                                    placeholder="Arduino Uno R3"
                                    className="admin-page-form-input"
                                />
                            </div>

                            <div className="admin-page-form-group">
                                <label>Category *</label>
                                <select
                                    value={formData.category}
                                    onChange={e => handleInputChange("category", e.target.value)}
                                    required
                                    className="admin-page-form-input"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Microcontroller">Microcontroller</option>
                                    <option value="Prototyping">Prototyping</option>
                                    <option value="Display">Display</option>
                                    <option value="Passive">Passive</option>
                                    <option value="Sensor">Sensor</option>
                                    <option value="Motor">Motor</option>
                                    <option value="Connectivity">Connectivity</option>
                                    <option value="Power">Power</option>
                                    <option value="Audio">Audio</option>
                                    <option value="Communication">Communication</option>
                                </select>
                            </div>

                            <div className="admin-page-form-group">
                                <label>Price (₹) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={e => handleInputChange("price", e.target.value)}
                                    required
                                    placeholder="25.00"
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
                                    onChange={e => handleInputChange("rating", e.target.value)}
                                    placeholder="4.5"
                                    className="admin-page-form-input"
                                />
                            </div>

                            <div className="admin-page-form-group">
                                <label>Stock Status</label>
                                <select
                                    value={formData.inStock}
                                    onChange={e =>
                                        handleInputChange("inStock", e.target.value === "true")
                                    }
                                    className="admin-page-form-input"
                                >
                                    <option value="true">In Stock</option>
                                    <option value="false">Out of Stock</option>
                                </select>
                            </div>
                        </div>

                        {/* Image URL */}
                        <div className="admin-page-form-group">
                            <label>Image URL *</label>
                            <input
                                type="url"
                                value={formData.image}
                                onChange={e => handleInputChange("image", e.target.value)}
                                required
                                placeholder="https://example.com/component-image.jpg"
                                className="admin-page-form-input"
                            />
                        </div>

                        {/* Short Description */}
                        <div className="admin-page-form-group">
                            <label>Description *</label>
                            <textarea
                                value={formData.description}
                                onChange={e => handleInputChange("description", e.target.value)}
                                required
                                placeholder="The heart of your projects. A microcontroller board based on the ATmega328P..."
                                className="admin-page-form-textarea"
                                rows="4"
                            />
                        </div>

                        {/* Specifications Section (reuses Kit’s components-section styling) */}
                        <div className="admin-page-components-section">
                            <h4 className="admin-page-section-title">
                                <span className="admin-page-section-icon">📋</span>
                                Component Specifications
                            </h4>

                            <div className="admin-page-component-form">
                                <div className="admin-page-component-inputs">
                                    <input
                                        type="text"
                                        placeholder="Add a specification (e.g., ATmega328P Processor)"
                                        value={specificationInput}
                                        onChange={e => setSpecificationInput(e.target.value)}
                                        className="admin-page-form-input"
                                    />
                                    <button
                                        type="button"
                                        onClick={addSpecification}
                                        className="admin-page-add-component-btn"
                                    >
                                        ➕ Add Spec
                                    </button>
                                </div>
                            </div>

                            <div className="admin-page-components-list">
                                {formData.specifications.map((spec, idx) => (
                                    <div key={idx} className="admin-page-component-item">
                                        <div className="admin-page-component-info">
                                            <span className="admin-page-component-name">{spec}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeSpecification(idx)}
                                            className="admin-page-remove-btn"
                                        >
                                            ❌
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="admin-page-form-actions">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="admin-page-btn admin-page-btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="admin-page-btn admin-page-btn-primary"
                            >
                                {loading ? "Adding Component..." : "Add Component"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {showPreview && (
                <div className="admin-page-components-preview">
                    <div className="admin-page-preview-header">
                        <h3 className="admin-page-preview-title">
                            <span className="admin-page-preview-icon">👁️</span>
                            Custom Kit Components Preview ({filteredComponents.length})
                        </h3>
                        <div className="admin-page-preview-search">
                            <span className="admin-page-search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search components..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="admin-page-search-input"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="admin-page-loading">
                            <div className="admin-page-loading-spinner"></div>
                            <p>Loading components...</p>
                        </div>
                    ) : filteredComponents.length === 0 ? (
                        <div className="admin-page-no-components">
                            <div className="admin-page-no-components-icon">⚙️</div>
                            <h4>No Components Found</h4>
                            <p>
                                {components.length === 0
                                    ? "No components have been added yet."
                                    : "No components match your search criteria."}
                            </p>
                        </div>
                    ) : (
                        <div className="admin-page-components-grid">
                            {filteredComponents.map((component, index) => (
                                <div className="component-card-wrapper" style={{ "--delay": `${index * 0.1}s` }}>
                                    <div
                                        className={`component-card `}
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default CustomKitsAdmin
