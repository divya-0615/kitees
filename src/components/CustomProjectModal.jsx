// CustomProjectModal.jsx
"use client"

import { useState } from "react"
import { collection, addDoc, Timestamp } from "firebase/firestore"
import { db } from "../firebase"
import { useAuth } from "../contexts/AuthContext"
import "./CustomProjectModal.css"
import { useNavigate } from "react-router-dom"

const CustomProjectModal = ({ isOpen, onClose }) => {
    const { currentUser, userData } = useAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        projectTitle: "",
        description: "",
        requirements: "",
        timeline: "",
        budget: "",
        difficulty: "",
        category: "",
        additionalNotes: "",
        attachments: [],
    })

    const [isSubmitted, setIsSubmitted] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [isSaving, setIsSaving] = useState(false)

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const nextStep = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1)
    }

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // If user is not logged in, redirect to login
        if (!currentUser) {
            navigate("/login")
            return
        }

        setIsSaving(true)
        try {
            // Prepare payload
            const payload = {
                customerUid: currentUser.uid,
                customerName: formData.name,
                customerEmail: formData.email,
                customerPhone: formData.phone || "",
                company: formData.company || "",
                projectTitle: formData.projectTitle,
                description: formData.description,
                technicalRequirements: formData.requirements || "",
                timeline: formData.timeline || "",
                budget: formData.budget || "",
                difficulty: formData.difficulty || "",
                category: formData.category || "",
                additionalInfo: formData.additionalNotes || "",
                status: "pending",
                createdAt: Timestamp.now(),
            }

            // Write to Firestore collection "custom-project-requests"
            await addDoc(collection(db, "custom-project-requests"), payload)

            setIsSubmitted(true)
            setTimeout(() => {
                onClose()
                setIsSubmitted(false)
                setCurrentStep(1)
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    company: "",
                    projectTitle: "",
                    description: "",
                    requirements: "",
                    timeline: "",
                    budget: "",
                    difficulty: "",
                    category: "",
                    additionalNotes: "",
                    attachments: [],
                })
            }, 3000)
        } catch (error) {
            console.error("Error submitting custom project request:", error)
            alert("Failed to submit request. Please try again.")
        } finally {
            setIsSaving(false)
        }
    }

    if (!isOpen) return null

    // If user not logged in, show prompt
    if (!currentUser) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content custom-project-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2 className="modal-title">Please Log In</h2>
                        <button className="modal-close" onClick={onClose}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>You must be logged in to submit a custom project request.</p>
                        <button className="btn btn-primary" onClick={() => navigate("/login")}>
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // After successful submission, show success screen
    if (isSubmitted) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content success-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="success-content">
                        <div className="success-icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22,4 12,14.01 9,11.01"></polyline>
                            </svg>
                        </div>
                        <h2 className="success-title">Request Submitted Successfully!</h2>
                        <p className="success-description">
                            Thank you for your custom project request. Our expert engineering team will review your requirements and
                            get back to you within 24 hours with a detailed proposal.
                        </p>
                        <div className="success-info">
                            <h3 className="info-title">What happens next?</h3>
                            <div className="info-steps">
                                <div className="info-step">
                                    <div className="step-number">1</div>
                                    <div className="step-content">
                                        <h4>Technical Review</h4>
                                        <p>Our engineers analyze your requirements and feasibility</p>
                                    </div>
                                </div>
                                <div className="info-step">
                                    <div className="step-number">2</div>
                                    <div className="step-content">
                                        <h4>Custom Proposal</h4>
                                        <p>We prepare a detailed project plan with timeline and pricing</p>
                                    </div>
                                </div>
                                <div className="info-step">
                                    <div className="step-number">3</div>
                                    <div className="step-content">
                                        <h4>Consultation Call</h4>
                                        <p>We schedule a call to discuss details and answer questions</p>
                                    </div>
                                </div>
                            </div>
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
                    <div className="header-content">
                        <h2 className="modal-title">
                            <span className="title-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
                                </svg>
                            </span>
                            Custom Project Request
                        </h2>
                        <div className="step-indicator">
                            <span className="step-text">Step {currentStep} of 3</span>
                            <div className="step-progress">
                                <div className="progress-bar" style={{ width: `${(currentStep / 3) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    <form onSubmit={handleSubmit} className="custom-project-form">
                        {/* Step 1: Personal Information */}
                        {currentStep === 1 && (
                            <div className="form-step">
                                <div className="step-header">
                                    <h3 className="step-title">
                                        <span className="step-icon">👤</span>
                                        Personal Information
                                    </h3>
                                    <p className="step-description">Tell us about yourself and your organization</p>
                                </div>

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
                                    <div className="form-group">
                                        <label htmlFor="company">Company/Organization</label>
                                        <input
                                            id="company"
                                            type="text"
                                            value={formData.company}
                                            onChange={(e) => handleInputChange("company", e.target.value)}
                                            placeholder="Acme Corporation"
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Project Details */}
                        {currentStep === 2 && (
                            <div className="form-step">
                                <div className="step-header">
                                    <h3 className="step-title">
                                        <span className="step-icon">💡</span>
                                        Project Details
                                    </h3>
                                    <p className="step-description">Describe your project vision and requirements</p>
                                </div>

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
                                            <option value="security">Security Systems</option>
                                            <option value="automotive">Automotive Electronics</option>
                                            <option value="medical">Medical Devices</option>
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
                                            <option value="beginner">Beginner - Simple circuits and basic programming</option>
                                            <option value="intermediate">Intermediate - Moderate complexity with multiple components</option>
                                            <option value="advanced">Advanced - Complex systems with advanced features</option>
                                            <option value="expert">Expert - Cutting-edge technology and research-level</option>
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
                                        placeholder="Describe your project idea, what you want to build, and how it should work. Include the main purpose and key functionalities..."
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
                                        placeholder="List specific features, components, performance requirements, or technical specifications you need..."
                                        className="form-textarea"
                                        rows="3"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Project Constraints & Additional Info */}
                        {currentStep === 3 && (
                            <div className="form-step">
                                <div className="step-header">
                                    <h3 className="step-title">
                                        <span className="step-icon">📅</span>
                                        Project Constraints & Additional Information
                                    </h3>
                                    <p className="step-description">
                                        Help us understand your timeline, budget, and any special requirements
                                    </p>
                                </div>

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
                                            <option value="1-2weeks">1-2 weeks (Rush project)</option>
                                            <option value="3-4weeks">3-4 weeks (Standard)</option>
                                            <option value="1-2months">1-2 months (Complex project)</option>
                                            <option value="3-6months">3-6 months (Research & development)</option>
                                            <option value="6months+">6+ months (Long-term project)</option>
                                            <option value="flexible">Flexible timeline</option>
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
                                            <option value="under-500">Under $500</option>
                                            <option value="500-1000">$500 - $1,000</option>
                                            <option value="1000-2500">$1,000 - $2,500</option>
                                            <option value="2500-5000">$2,500 - $5,000</option>
                                            <option value="5000-10000">$5,000 - $10,000</option>
                                            <option value="10000-25000">$10,000 - $25,000</option>
                                            <option value="over-25000">Over $25,000</option>
                                            <option value="discuss">Let's discuss</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="additionalNotes">Additional Notes & Special Requirements</label>
                                    <textarea
                                        id="additionalNotes"
                                        value={formData.additionalNotes}
                                        onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                                        placeholder="Any additional information, special requirements, regulatory compliance needs, environmental considerations, or questions you have..."
                                        className="form-textarea"
                                        rows="4"
                                    />
                                </div>

                                <div className="expectations-info">
                                    <h4 className="expectations-title">💡 What to expect from our custom project service:</h4>
                                    <div className="expectations-grid">
                                        <div className="expectation-item">
                                            <div className="expectation-icon">🔍</div>
                                            <div className="expectation-content">
                                                <h5>Detailed Analysis</h5>
                                                <p>Comprehensive feasibility study and technical analysis</p>
                                            </div>
                                        </div>
                                        <div className="expectation-item">
                                            <div className="expectation-icon">📋</div>
                                            <div className="expectation-content">
                                                <h5>Custom BOM</h5>
                                                <p>Detailed component list with specifications and pricing</p>
                                            </div>
                                        </div>
                                        <div className="expectation-item">
                                            <div className="expectation-icon">📖</div>
                                            <div className="expectation-content">
                                                <h5>Documentation</h5>
                                                <p>Step-by-step assembly guide and technical documentation</p>
                                            </div>
                                        </div>
                                        <div className="expectation-item">
                                            <div className="expectation-icon">💻</div>
                                            <div className="expectation-content">
                                                <h5>Code & Support</h5>
                                                <p>Complete code examples and ongoing technical support</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="form-navigation">
                            {currentStep > 1 && (
                                <button type="button" className="btn btn-outline" onClick={prevStep}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="15,18 9,12 15,6"></polyline>
                                    </svg>
                                    Previous
                                </button>
                            )}

                            <div className="nav-spacer"></div>

                            {currentStep < 3 ? (
                                <button type="button" className="btn btn-primary" onClick={nextStep}>
                                    Next
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="9,18 15,12 9,6"></polyline>
                                    </svg>
                                </button>
                            ) : (
                                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                                    <span className="btn-icon">📤</span>
                                    {isSaving ? "Submitting..." : "Submit Request"}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CustomProjectModal
