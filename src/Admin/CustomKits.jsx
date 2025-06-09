"use client"

import { useState, useEffect } from "react"
import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    deleteDoc,
    doc,
    updateDoc,
} from "firebase/firestore"
import { db } from "../firebase"
import "./CustomKits.css"
import { IKContext, IKUpload } from "imagekitio-react"
import { Upload, Trash2, Edit } from "lucide-react"
import toast from "react-hot-toast"

const CustomKitsAdmin = () => {
    const [showForm, setShowForm] = useState(false)
    const [showPreview, setShowPreview] = useState(true)
    const [components, setComponents] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [imageUploadedData, setImageUploadedData] = useState(null)
    const [preview, setPreview] = useState(null)
    const [isUploading, setIsUploading] = useState(false)

    // const urlEndpoint = "https://ik.imagekit.io/akhil8605unicore/"
    // const publicKey = "public_I0GmeI/LmzQrV/AIWLepSwXKzk4="

    const urlEndpoint = process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT
    const publicKey = process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY

    const [formData, setFormData] = useState({
        title: "",
        price: "",
        image: "",
        description: "",
        category: "",
        rating: 4.5,
        inStock: true,
        specifications: [],
        fileId: "",
    })
    const [specificationInput, setSpecificationInput] = useState("")

    // Authenticator for ImageKit upload requests
    const authenticator = async () => {
        const res = await fetch("http://localhost:4000/auth")
        if (!res.ok) throw new Error("Auth failed")
        return await res.json()
    }

    useEffect(() => {
        if (showPreview) fetchComponents()
    }, [showPreview])

    const fetchComponents = async () => {
        setLoading(true)
        const ref = collection(db, "custom-kit-components")
        const q = query(ref, orderBy("createdAt", "desc"))
        const snap = await getDocs(q)
        const data = []
        snap.forEach(d => data.push({ id: d.id, ...d.data() }))
        setComponents(data)
        setLoading(false)
    }

    const handleInputChange = (field, value) =>
        setFormData(prev => ({ ...prev, [field]: value }))

    const addSpecification = () => {
        if (!specificationInput.trim()) return
        setFormData(prev => ({
            ...prev,
            specifications: [...prev.specifications, specificationInput.trim()],
        }))
        setSpecificationInput("")
    }

    const removeSpecification = i =>
        setFormData(prev => ({
            ...prev,
            specifications: prev.specifications.filter((_, idx) => idx !== i),
        }))

    const handleImageChange = e => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onloadend = () => setPreview(reader.result)
        reader.readAsDataURL(file)
    }

    const resetForm = () => {
        setFormData({
            title: "",
            price: "",
            image: "",
            description: "",
            category: "",
            rating: 4.5,
            inStock: true,
            specifications: [],
            fileId: "",
        })
        setImageUploadedData(null)
        setPreview(null)
        setIsEditing(false)
        setEditingId(null)
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        setIsUploading(true)

        try {
            const imageUrl = imageUploadedData ? imageUploadedData.url : formData.image
            const fileId = imageUploadedData ? imageUploadedData.fileId : formData.fileId

            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                rating: parseFloat(formData.rating),
                image: imageUrl,
                fileId,
                createdAt: new Date(),
            }

            if (isEditing && editingId) {
                await updateDoc(doc(db, "custom-kit-components", editingId), payload)
                toast.success("Component updated!")
            } else {
                await addDoc(collection(db, "custom-kit-components"), payload)
                toast.success("Component added!")
            }

            resetForm()
            setShowForm(false)
            fetchComponents()
        } catch (err) {
            console.error(err)
            toast.error("Save failed")
        } finally {
            setLoading(false)
            setIsUploading(false)
        }
    }

    const handleEdit = comp => {
        setFormData({
            title: comp.title || "",
            price: comp.price?.toString() || "",
            image: comp.image || "",
            description: comp.description || "",
            category: comp.category || "",
            rating: comp.rating || 4.5,
            inStock: comp.inStock ?? true,
            specifications: comp.specifications || [],
            fileId: comp.fileId || "",
        })
        setPreview(comp.image)
        setIsEditing(true)
        setEditingId(comp.id)
        setShowForm(true)
        setShowPreview(false)
    }

    const handleDelete = async (id, fileId) => {
        if (!window.confirm("Delete this component?")) return
        setLoading(true)
        try {
            await deleteDoc(doc(db, "custom-kit-components", id))
            if (fileId) {
                await fetch("http://localhost:4000/deleteImage", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fileId }),
                })
            }
            setComponents(comps => comps.filter(c => c.id !== id))
            toast.success("Deleted")
        } catch (err) {
            console.error(err)
            toast.error("Delete failed")
        } finally {
            setLoading(false)
        }
    }

    const filtered = components.filter(c =>
        [c.title, c.category, c.description]
            .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))
    )

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
                    <button
                        className="admin-page-add-component-btn"
                        onClick={() => setShowForm(f => !f)}
                    >
                        {showForm ? "📋 Hide Form" : isEditing ? "✏️ Edit Component" : "➕ Add Component"}
                    </button>
                    <button
                        className="admin-page-preview-btn"
                        onClick={() => setShowPreview(p => !p)}
                    >
                        {showPreview ? "📝 Hide Preview" : "👁️ Preview Components"}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="admin-page-kit-form-container">
                    <div className="admin-page-form-header">
                        <h3 className="admin-page-form-title">
                            <span className="admin-page-form-icon">⚙️</span>
                            {isEditing ? "Edit Component" : "Add New Component"}
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="admin-page-kit-form">
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

                        {/* Image Upload */}
                        <div className="admin-page-form-group">
                            <label>Component Image *</label>
                            <div className="admin-image-upload-container">
                                <div className="admin-image-preview-container">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="admin-image-preview"
                                        />
                                    ) : (
                                        <div className="admin-image-upload-placeholder">
                                            <Upload />
                                        </div>
                                    )}
                                </div>
                                <IKContext
                                    publicKey={publicKey}
                                    urlEndpoint={urlEndpoint}
                                    authenticator={authenticator}
                                >
                                    <p>Upload an image</p>
                                    <IKUpload
                                        fileName="component-image.png"
                                        onError={err => {
                                            console.error(err)
                                            toast.error("Upload error")
                                        }}
                                        onSuccess={data => {
                                            setImageUploadedData(data)
                                            setPreview(data.url)
                                        }}
                                        onChange={handleImageChange}
                                    />
                                </IKContext>
                            </div>
                        </div>

                        <div className="admin-page-form-group">
                            <label>Description *</label>
                            <textarea
                                value={formData.description}
                                onChange={e => handleInputChange("description", e.target.value)}
                                required
                                placeholder="The heart of your projects..."
                                className="admin-page-form-textarea"
                                rows="4"
                            />
                        </div>

                        {/* Specifications */}
                        <div className="admin-page-components-section">
                            <h4 className="admin-page-section-title">
                                <span className="admin-page-section-icon">📋</span>
                                Component Specifications
                            </h4>

                            <div className="admin-page-component-form">
                                <div className="admin-page-component-inputs">
                                    <input
                                        type="text"
                                        placeholder="Add a specification"
                                        value={specificationInput}
                                        onChange={e =>
                                            setSpecificationInput(e.target.value)
                                        }
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

                        <div className="admin-page-form-actions">
                            <button
                                type="button"
                                onClick={() => {
                                    resetForm()
                                    setShowForm(false)
                                    setShowPreview(true)
                                }}
                                className="admin-page-btn admin-page-btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="admin-page-btn admin-page-btn-primary"
                            >
                                {loading
                                    ? isEditing
                                        ? "Updating..."
                                        : "Adding..."
                                    : isEditing
                                        ? "Update Component"
                                        : "Add Component"}
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
                            Custom Kit Components Preview ({filtered.length})
                        </h3>
                        <div className="admin-page-preview-search">
                            <span className="admin-page-search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search components..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="admin-page-search-input"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="admin-page-loading">
                            <div className="admin-page-loading-spinner"></div>
                            <p>Loading components...</p>
                        </div>
                    ) : filtered.length === 0 ? (
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
                            {filtered.map((component, idx) => (
                                <div
                                    key={component.id}
                                    className="component-card-wrapper"
                                    style={{ "--delay": `${idx * 0.1}s` }}
                                >
                                    <div className="component-card" data-component-id={component.id}>
                                        <div className="card-header">
                                            <div className="image-container">
                                                <img
                                                    src={
                                                        component.image ||
                                                        "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg"
                                                    }
                                                    alt={component.title}
                                                    className="component-image"
                                                />
                                                <div className="image-overlay"></div>
                                                <div
                                                    className="category-badge"
                                                >
                                                    {component.category}
                                                </div>
                                                <div className="stock-badge">
                                                    {component.inStock ? "In Stock" : "Out of Stock"}
                                                </div>
                                                <div className="rating-badge">
                                                    <span className="star">⭐</span>
                                                    {component.rating}
                                                </div>
                                                <div className="kit-admin-actions">
                                                    <button
                                                        className="kit-edit-btn"
                                                        onClick={e => {
                                                            e.stopPropagation()
                                                            handleEdit(component)
                                                        }}
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        className="kit-delete-btn"
                                                        onClick={e => {
                                                            e.stopPropagation()
                                                            handleDelete(component.id, component.fileId)
                                                        }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card-content">
                                            <div className="content-inner">
                                                <div className="title-section">
                                                    <h3 className="component-title">{component.title}</h3>
                                                    <p className="component-description">
                                                        {component.description}
                                                    </p>
                                                </div>
                                                <div className="specifications">
                                                    <div className="spec-header">
                                                        <span className="info-icon">ℹ️</span> Key Features:
                                                    </div>
                                                    <div className="spec-list">
                                                        {component.specifications.slice(0, 2).map((sp, i) => (
                                                            <div key={i} className="spec-item">
                                                                • {sp}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="price-rating">
                                                    <div className="price">₹{component.price}</div>
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
