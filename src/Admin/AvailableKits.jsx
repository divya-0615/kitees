"use client"

import { useState, useEffect } from "react"
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "../firebase"
import "./AvailableKits.css"

const AvailableKitsAdmin = () => {
    const [showForm, setShowForm] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [kits, setKits] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const [formData, setFormData] = useState({
        title: "",
        price: "",
        originalPrice: "",
        image: "",
        description: "",
        category: "",
        difficulty: "",
        estimatedTime: "",
        rating: 4.5,
        reviews: 0,
        components: [],
        fullDescription: "",
        features: [],
        images: [],
    })

    const [componentForm, setComponentForm] = useState({
        name: "",
        price: "",
        quantity: 1,
    })

    const [featureInput, setFeatureInput] = useState("")

    useEffect(() => {
        if (showPreview) {
            fetchKits()
        }
    }, [showPreview])

    const fetchKits = async () => {
        try {
            setLoading(true)
            const kitsRef = collection(db, "available-kits")
            const q = query(kitsRef, orderBy("createdAt", "desc"))
            const querySnapshot = await getDocs(q)

            const fetchedKits = []
            querySnapshot.forEach((doc) => {
                fetchedKits.push({
                    id: doc.id,
                    ...doc.data(),
                })
            })

            setKits(fetchedKits)
        } catch (error) {
            console.error("Error fetching kits:", error)
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)

            const kitData = {
                ...formData,
                price: Number.parseFloat(formData.price),
                originalPrice: formData.originalPrice ? Number.parseFloat(formData.originalPrice) : null,
                rating: Number.parseFloat(formData.rating),
                reviews: Number.parseInt(formData.reviews),
                components: formData.components.map((comp) => ({
                    ...comp,
                    price: Number.parseFloat(comp.price),
                    quantity: Number.parseInt(comp.quantity),
                })),
                images: formData.image ? [formData.image] : [],
                createdAt: new Date(),
            }

            await addDoc(collection(db, "available-kits"), kitData)

            alert("Kit added successfully!")
            setFormData({
                title: "",
                price: "",
                originalPrice: "",
                image: "",
                description: "",
                category: "",
                difficulty: "",
                estimatedTime: "",
                rating: 4.5,
                reviews: 0,
                components: [],
                fullDescription: "",
                features: [],
                images: [],
            })
            setShowForm(false)
        } catch (error) {
            console.error("Error adding kit:", error)
            alert("Failed to add kit")
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

    const filteredKits = kits.filter(
        (kit) =>
            kit.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            kit.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            kit.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="admin-page-available-kits">
            <div className="admin-page-kits-header">
                <div className="admin-page-header-info">
                    <h2 className="admin-page-kits-title">Available Kits Management</h2>
                    <p className="admin-page-kits-subtitle">Add and manage electronics kits available for purchase</p>
                </div>
                <div className="admin-page-header-actions">
                    <button className="admin-page-add-kit-btn" onClick={() => setShowForm(!showForm)}>
                        {showForm ? "📋 Hide Form" : "➕ Add New Kit"}
                    </button>
                    <button className="admin-page-preview-btn" onClick={() => setShowPreview(!showPreview)}>
                        {showPreview ? "📝 Hide Preview" : "👁️ Preview Kits"}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="admin-page-kit-form-container">
                    <div className="admin-page-form-header">
                        <h3 className="admin-page-form-title">
                            <span className="admin-page-form-icon">🔧</span>
                            Add New Electronics Kit
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="admin-page-kit-form">
                        <div className="admin-page-form-grid">
                            <div className="admin-page-form-group">
                                <label>Kit Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                    required
                                    placeholder="Arduino Starter Kit Pro"
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
                                    <option value="Microcontroller">Microcontroller</option>
                                    <option value="IoT">IoT</option>
                                    <option value="Robotics">Robotics</option>
                                    <option value="Professional">Professional</option>
                                    <option value="Sensors">Sensors</option>
                                    <option value="Display">Display</option>
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
                                    placeholder="89.99"
                                    className="admin-page-form-input"
                                />
                            </div>

                            <div className="admin-page-form-group">
                                <label>Original Price (₹)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.originalPrice}
                                    onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                                    placeholder="129.99"
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
                                <label>Estimated Time *</label>
                                <input
                                    type="text"
                                    value={formData.estimatedTime}
                                    onChange={(e) => handleInputChange("estimatedTime", e.target.value)}
                                    required
                                    placeholder="2-4 hours"
                                    className="admin-page-form-input"
                                />
                            </div>
                        </div>

                        <div className="admin-page-form-group">
                            <label>Image URL *</label>
                            <input
                                type="url"
                                value={formData.image}
                                onChange={(e) => handleInputChange("image", e.target.value)}
                                required
                                placeholder="https://example.com/image.jpg"
                                className="admin-page-form-input"
                            />
                        </div>

                        <div className="admin-page-form-group">
                            <label>Short Description *</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                required
                                placeholder="Complete Arduino kit with sensors, LEDs, and components for 15+ projects"
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
                                placeholder="Detailed description of the kit, what's included, learning outcomes..."
                                className="admin-page-form-textarea"
                                rows="5"
                            />
                        </div>

                        {/* Components Section */}
                        <div className="admin-page-components-section">
                            <h4 className="admin-page-section-title">
                                <span className="admin-page-section-icon">📦</span>
                                Kit Components
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
                                Kit Features
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

                        <div className="admin-page-form-actions">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="admin-page-btn admin-page-btn-secondary"
                            >
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="admin-page-btn admin-page-btn-primary">
                                {loading ? "Adding Kit..." : "Add Kit"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {showPreview && (
                <div className="admin-page-kits-preview">
                    <div className="admin-page-preview-header">
                        <h3 className="admin-page-preview-title">
                            <span className="admin-page-preview-icon">👁️</span>
                            Available Kits Preview ({filteredKits.length})
                        </h3>
                        <div className="admin-page-preview-search">
                            <span className="admin-page-search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search kits..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="admin-page-search-input"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="admin-page-loading">
                            <div className="admin-page-loading-spinner"></div>
                            <p>Loading kits...</p>
                        </div>
                    ) : filteredKits.length === 0 ? (
                        <div className="admin-page-no-kits">
                            <div className="admin-page-no-kits-icon">📦</div>
                            <h4>No Kits Found</h4>
                            <p>{kits.length === 0 ? "No kits have been added yet." : "No kits match your search criteria."}</p>
                        </div>
                    ) : (
                        <div className="admin-page-kits-grid">
                            {filteredKits.map((kit, index) => (
                                <div key={kit.id} className="admin-page-kit-card" style={{ "--delay": `${index * 0.1}s` }}>
                                    <div className="admin-page-kit-image-container">
                                        <img
                                            src={kit.image || "/placeholder.svg?height=200&width=300"}
                                            alt={kit.title}
                                            className="admin-page-kit-image"
                                        />
                                        <div className="admin-page-kit-category-badge">{kit.category}</div>
                                        <div
                                            className="admin-page-kit-difficulty-badge"
                                            style={{ backgroundColor: getDifficultyColor(kit.difficulty) }}
                                        >
                                            {kit.difficulty}
                                        </div>
                                        {kit.originalPrice && (
                                            <div className="admin-page-kit-discount-badge">
                                                {Math.round(((kit.originalPrice - kit.price) / kit.originalPrice) * 100)}% OFF
                                            </div>
                                        )}
                                    </div>

                                    <div className="admin-page-kit-content">
                                        <h4 className="admin-page-kit-title">{kit.title}</h4>
                                        <p className="admin-page-kit-description">{kit.description}</p>

                                        <div className="admin-page-kit-stats">
                                            <div className="admin-page-kit-rating">
                                                <span className="admin-page-star">⭐</span>
                                                <span>{kit.rating}</span>
                                                <span className="admin-page-reviews">({kit.reviews})</span>
                                            </div>
                                            <div className="admin-page-kit-time">
                                                <span className="admin-page-clock">🕐</span>
                                                <span>{kit.estimatedTime}</span>
                                            </div>
                                        </div>

                                        <div className="admin-page-kit-pricing">
                                            <div className="admin-page-kit-price">₹{kit.price}</div>
                                            {kit.originalPrice && <div className="admin-page-kit-original-price">₹{kit.originalPrice}</div>}
                                        </div>

                                        <div className="admin-page-kit-components-count">📦 {kit.components?.length || 0} components</div>
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

export default AvailableKitsAdmin
