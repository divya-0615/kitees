"use client"

import { useState } from "react"
import "./CustomProjectModal.css"

const CustomProjectModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        projectTitle: "",
        description: "",
        requirements: "",
        timeline: "",
        budget: "",
        difficulty: "",
        category: "",
        additionalNotes: "",
    })

    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsSubmitted(true)
        setTimeout(() => {
            onClose()
            setIsSubmitted(false)
            setFormData({
                name: "",
                email: "",
                phone: "",
                projectTitle: "",
                description: "",
                requirements: "",
                timeline: "",
                budget: "",
                difficulty: "",
                category: "",
                additionalNotes: "",
            })
        }, 3000)
    }

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    if (!isOpen) return null

    if (isSubmitted) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content success-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="success-content">
                        <div className="success-icon rotate">📤</div>
                        <h2 className="success-title">Request Submitted Successfully! 🎉</h2>
                        <p className="success-description">
                            Thank you for your custom project request. Our expert team will review your requirements and get back to
                            you within 24 hours.
                        </p>
                        <div className="success-info">
                            <h3 className="info-title">What happens next?</h3>
                            <ul className="info-list">
                                <li>• Our engineers will analyze your requirements</li>
                                <li>• We'll prepare a detailed project proposal</li>
                                <li>• You'll receive a custom quote and timeline</li>
                                <li>• We'll schedule a consultation call if needed</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content custom-project-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        <span className="title-icon">💡</span>
                        Custom Project Request
                    </h2>
                    <button className="modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="modal-body">
                    <p className="modal-subtitle">Tell us about your dream project and we'll make it happen!</p>

                    <form onSubmit={handleSubmit} className="custom-project-form">
                        {/* Personal Information */}
                        <div className="form-section personal-info">
                            <h3 className="section-title">
                                <span className="section-icon">👤</span>
                                Personal Information
                            </h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name *</label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        required
                                        placeholder="John Doe"
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address *</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        required
                                        placeholder="john@example.com"
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                        placeholder="+1 (555) 123-4567"
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Project Details */}
                        <div className="form-section project-details">
                            <h3 className="section-title">
                                <span className="section-icon">💡</span>
                                Project Details
                            </h3>
                            <div className="form-group">
                                <label htmlFor="projectTitle">Project Title *</label>
                                <input
                                    id="projectTitle"
                                    type="text"
                                    value={formData.projectTitle}
                                    onChange={(e) => handleInputChange("projectTitle", e.target.value)}
                                    required
                                    placeholder="Smart Home Automation System"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="category">Project Category *</label>
                                    <select
                                        id="category"
                                        value={formData.category}
                                        onChange={(e) => handleInputChange("category", e.target.value)}
                                        required
                                        className="form-input"
                                    >
                                        <option value="">Select category</option>
                                        <option value="iot">IoT & Smart Devices</option>
                                        <option value="robotics">Robotics & Automation</option>
                                        <option value="audio">Audio & Sound Systems</option>
                                        <option value="display">Display & Visualization</option>
                                        <option value="sensors">Sensors & Monitoring</option>
                                        <option value="power">Power & Energy</option>
                                        <option value="communication">Communication Systems</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="difficulty">Complexity Level *</label>
                                    <select
                                        id="difficulty"
                                        value={formData.difficulty}
                                        onChange={(e) => handleInputChange("difficulty", e.target.value)}
                                        required
                                        className="form-input"
                                    >
                                        <option value="">Select complexity</option>
                                        <option value="beginner">Beginner - Simple circuits</option>
                                        <option value="intermediate">Intermediate - Moderate complexity</option>
                                        <option value="advanced">Advanced - Complex systems</option>
                                        <option value="expert">Expert - Cutting-edge technology</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Project Description *</label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    required
                                    placeholder="Describe your project idea, what you want to build, and how it should work..."
                                    className="form-textarea"
                                    rows="4"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="requirements">Technical Requirements</label>
                                <textarea
                                    id="requirements"
                                    value={formData.requirements}
                                    onChange={(e) => handleInputChange("requirements", e.target.value)}
                                    placeholder="List specific features, components, or technical specifications you need..."
                                    className="form-textarea"
                                    rows="3"
                                />
                            </div>
                        </div>

                        {/* Project Constraints */}
                        <div className="form-section project-constraints">
                            <h3 className="section-title">
                                <span className="section-icon">📅</span>
                                Project Constraints
                            </h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="timeline">Preferred Timeline</label>
                                    <select
                                        id="timeline"
                                        value={formData.timeline}
                                        onChange={(e) => handleInputChange("timeline", e.target.value)}
                                        className="form-input"
                                    >
                                        <option value="">Select timeline</option>
                                        <option value="1-2weeks">1-2 weeks</option>
                                        <option value="3-4weeks">3-4 weeks</option>
                                        <option value="1-2months">1-2 months</option>
                                        <option value="3-6months">3-6 months</option>
                                        <option value="flexible">Flexible</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="budget">Budget Range</label>
                                    <select
                                        id="budget"
                                        value={formData.budget}
                                        onChange={(e) => handleInputChange("budget", e.target.value)}
                                        className="form-input"
                                    >
                                        <option value="">Select budget range</option>
                                        <option value="under-100">Under $100</option>
                                        <option value="100-500">$100 - $500</option>
                                        <option value="500-1000">$500 - $1,000</option>
                                        <option value="1000-5000">$1,000 - $5,000</option>
                                        <option value="over-5000">Over $5,000</option>
                                        <option value="discuss">Let's discuss</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Additional Notes */}
                        <div className="form-section">
                            <div className="form-group">
                                <label htmlFor="additionalNotes">Additional Notes</label>
                                <textarea
                                    id="additionalNotes"
                                    value={formData.additionalNotes}
                                    onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                                    placeholder="Any additional information, special requirements, or questions..."
                                    className="form-textarea"
                                    rows="3"
                                />
                            </div>

                            <div className="expectations-info">
                                <h4 className="expectations-title">💡 What to expect:</h4>
                                <ul className="expectations-list">
                                    <li>• Detailed project analysis and feasibility study</li>
                                    <li>• Custom component list with pricing</li>
                                    <li>• Step-by-step assembly guide and documentation</li>
                                    <li>• Code examples and programming support</li>
                                    <li>• Ongoing technical support during development</li>
                                </ul>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="form-actions">
                            <button type="button" className="btn btn-outline" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                <span className="btn-icon">📤</span>
                                Submit Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CustomProjectModal
