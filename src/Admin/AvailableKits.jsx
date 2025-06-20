"use client"

import { useState, useEffect } from "react"
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase"
import "./AvailableKits.css"
import KitDetailModal from "../components/KitDetailModel"
import { IKContext, IKUpload } from "imagekitio-react"
import { Upload, Trash2, Edit } from "lucide-react"
import toast from "react-hot-toast"

const AvailableKitsAdmin = () => {
    const [showForm, setShowForm] = useState(false)
    const [showPreview, setShowPreview] = useState(true)
    const [kits, setKits] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [imageUploadedData, setImageUploadedData] = useState(null)
    const [preview, setPreview] = useState(null)
    const [isUploading, setIsUploading] = useState(false)

    const urlEndpoint = process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT
    const publicKey = process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY
    // const urlEndpoint = "https://ik.imagekit.io/akhil8605unicore/"
    // const publicKey = "public_I0GmeI/LmzQrV/AIWLepSwXKzk4="

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
        fileId: "",
    })

    const [componentForm, setComponentForm] = useState({
        name: "",
        price: "",
        quantity: 1,
    })

    const [featureInput, setFeatureInput] = useState("")

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

    // Handle image change for preview
    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            setIsUploading(true)

            // Use the uploaded image URL or the existing one if not changed
            const imageUrl = imageUploadedData ? imageUploadedData.url : formData.image
            const fileId = imageUploadedData ? imageUploadedData.fileId : formData.fileId

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
                image: imageUrl,
                fileId: fileId,
                images: imageUrl ? [imageUrl] : [],
                createdAt: new Date(),
            }

            if (isEditing && editingId) {
                // Update existing kit
                await updateDoc(doc(db, "available-kits", editingId), kitData)
                alert("Kit updated successfully!")
            } else {
                // Add new kit
                await addDoc(collection(db, "available-kits"), kitData)
                alert("Kit added successfully!")
            }

            resetForm()
            setShowForm(false)
            fetchKits()
        } catch (error) {
            console.error("Error saving kit:", error)
            alert(isEditing ? "Failed to update kit" : "Failed to add kit")
        } finally {
            setLoading(false)
            setIsUploading(false)
        }
    }

    const resetForm = () => {
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
            fileId: "",
        })
        setImageUploadedData(null)
        setPreview(null)
        setIsEditing(false)
        setEditingId(null)
    }

    const handleEdit = (kit) => {
        setFormData({
            title: kit.title || "",
            price: kit.price?.toString() || "",
            originalPrice: kit.originalPrice?.toString() || "",
            image: kit.image || "",
            description: kit.description || "",
            category: kit.category || "",
            difficulty: kit.difficulty || "",
            estimatedTime: kit.estimatedTime || "",
            rating: kit.rating || 4.5,
            reviews: kit.reviews || 0,
            components: kit.components || [],
            fullDescription: kit.fullDescription || "",
            features: kit.features || [],
            images: kit.images || [],
            fileId: kit.fileId || "",
        })
        setPreview(kit.image)
        setIsEditing(true)
        setEditingId(kit.id)
        setShowForm(true)
        setShowPreview(false)
    }

    const handleDelete = async (kitId, fileId) => {
        if (window.confirm("Are you sure you want to delete this kit?")) {
            try {
                setLoading(true)

                // Delete from Firestore
                await deleteDoc(doc(db, "available-kits", kitId))

                // Delete image from ImageKit if fileId exists
                if (fileId) {
                    try {
                        await fetch("http://localhost:4000/deleteImage", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ fileId: fileId }),
                        })
                    } catch (imageError) {
                        console.error("Error deleting image from ImageKit:", imageError)
                        // Continue even if image deletion fails
                    }
                }

                // Update local state
                setKits(kits.filter((kit) => kit.id !== kitId))
                alert("Kit deleted successfully!")
            } catch (error) {
                console.error("Error deleting kit:", error)
                alert("Failed to delete kit")
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

    const [selectedKit, setSelectedKit] = useState(null)

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
                            {isEditing ? "Edit Electronics Kit" : "Add New Electronics Kit"}
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
                            <label>Kit Image *</label>
                            <div className="admin-image-upload-container">
                                <div className="admin-image-preview-container">
                                    {preview ? (
                                        <img src={preview || "/placeholder.svg"} alt="Preview" className="admin-image-preview" />
                                    ) : (
                                        <div className="admin-image-upload-placeholder">
                                            <Upload />
                                        </div>
                                    )}
                                </div>
                                <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
                                    <p>Upload an image</p>
                                    <IKUpload
                                        fileName="kit-image.png"
                                        onError={(error) => {
                                            console.error("Error uploading image: ", error)
                                            toast.error("Please Turn on the server...!")
                                            alert("Error uploading image: Network Error\nPlease kindly turn on the server...!")
                                        }}
                                        onSuccess={(data) => {
                                            setImageUploadedData(data)
                                            setPreview(data.url)
                                            console.log("Image uploaded successfully: ", data)
                                        }}
                                        onChange={handleImageChange}
                                    />
                                </IKContext>
                            </div>
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
                            <button type="button" onClick={cancelForm} className="admin-page-btn admin-page-btn-secondary">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="admin-page-btn admin-page-btn-primary">
                                {loading ? (isEditing ? "Updating Kit..." : "Adding Kit...") : isEditing ? "Update Kit" : "Add Kit"}
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
                                <div key={kit.id} className="kit-card-wrapper" style={{ "--delay": `${index * 0.1}s` }}>
                                    <div className="kit-card">
                                        <div className="kit-card-header">
                                            <div className="kit-image-container">
                                                <img
                                                    src={
                                                        kit.image ||
                                                        "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg"
                                                    }
                                                    alt={kit.title}
                                                    className="kit-image"
                                                />

                                                {/* Overlays */}
                                                <div className="kit-image-overlay"></div>

                                                {/* Badges */}
                                                <div className="kit-category-badge">{kit.category}</div>

                                                <div
                                                    className="kit-difficulty-badge"
                                                    style={{ backgroundColor: getDifficultyColor(kit.difficulty) }}
                                                >
                                                    {kit.difficulty}
                                                </div>

                                                {/* Discount Badge */}
                                                {kit.originalPrice && (
                                                    <div className="kit-discount-badge">
                                                        {Math.round(((kit.originalPrice - kit.price) / kit.originalPrice) * 100)}% OFF
                                                    </div>
                                                )}

                                                {/* Quick Stats */}
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

                                                {/* Admin Actions */}
                                                <div className="kit-admin-actions">
                                                    <button
                                                        className="kit-edit-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleEdit(kit)
                                                        }}
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        className="kit-delete-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleDelete(kit.id, kit.fileId)
                                                        }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
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

                            {selectedKit && (
                                <KitDetailModal kit={selectedKit} isOpen={!!selectedKit} onClose={() => setSelectedKit(null)} />
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default AvailableKitsAdmin
