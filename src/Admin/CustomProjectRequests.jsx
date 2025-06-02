"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "../firebase"
import "./CustomProjectRequests.css"

const CustomProjectRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const requestsRef = collection(db, "custom-project-requests")
      const q = query(requestsRef, orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)

      const fetchedRequests = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        let createdAt = data.createdAt
        if (createdAt && typeof createdAt.toDate === "function") {
          createdAt = createdAt.toDate()
        }

        fetchedRequests.push({
          id: doc.id,
          ...data,
          createdAt,
        })
      })

      setRequests(fetchedRequests)
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      setUpdating(true)
      const requestRef = doc(db, "custom-project-requests", requestId)
      await updateDoc(requestRef, {
        status: newStatus,
        updatedAt: new Date(),
      })

      // Update local state
      setRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: newStatus } : req))
      )

      alert("Request status updated successfully!")
    } catch (error) {
      console.error("Error updating request status:", error)
      alert("Failed to update request status")
    } finally {
      setUpdating(false)
    }
  }

  const deleteRequest = async (requestId) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        setUpdating(true)
        await deleteDoc(doc(db, "custom-project-requests", requestId))
        setRequests((prev) => prev.filter((req) => req.id !== requestId))
        setSelectedRequest(null)
        alert("Request deleted successfully!")
      } catch (error) {
        console.error("Error deleting request:", error)
        alert("Failed to delete request")
      } finally {
        setUpdating(false)
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "#f59e0b"
      case "in-progress":
        return "#3b82f6"
      case "completed":
        return "#10b981"
      case "rejected":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "⏳"
      case "in-progress":
        return "⚙️"
      case "completed":
        return "✅"
      case "rejected":
        return "❌"
      default:
        return "📋"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "#ef4444"
      case "medium":
        return "#f59e0b"
      case "low":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  const filteredRequests = requests
    .filter((request) => {
      const matchesSearch =
        request.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        statusFilter === "all" || (request.status && request.status.toLowerCase() === statusFilter.toLowerCase())

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "budget-high":
          return (b.budget || 0) - (a.budget || 0)
        case "budget-low":
          return (a.budget || 0) - (b.budget || 0)
        default:
          return 0
      }
    })

  if (loading) {
    return (
      <div className="admin-page-loading">
        <div className="admin-page-loading-spinner"></div>
        <p>Loading custom project requests...</p>
      </div>
    )
  }

  return (
    <div className="admin-page-custom-requests">
      <div className="admin-page-requests-header">
        <div className="admin-page-header-info">
          <h2 className="admin-page-requests-title">Custom Project Requests</h2>
          <p className="admin-page-requests-subtitle">Manage and respond to custom electronics project requests</p>
        </div>
        <div className="admin-page-requests-stats">
          <div className="admin-page-stat-item">
            <span className="admin-page-stat-number">{requests.length}</span>
            <span className="admin-page-stat-label">Total Requests</span>
          </div>
          <div className="admin-page-stat-item">
            <span className="admin-page-stat-number">
              {requests.filter((req) => req.status === "pending").length}
            </span>
            <span className="admin-page-stat-label">Pending</span>
          </div>
          <div className="admin-page-stat-item">
            <span className="admin-page-stat-number">
              {requests.filter((req) => req.status === "completed").length}
            </span>
            <span className="admin-page-stat-label">Completed</span>
          </div>
        </div>
      </div>

      <div className="admin-page-requests-controls">
        <div className="admin-page-search-section">
          <div className="admin-page-search-box">
            <span className="admin-page-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by project title, customer name, email, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-page-search-input"
            />
          </div>
        </div>

        <div className="admin-page-filters-section">
          <div className="admin-page-filter-group">
            <label>Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-page-filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="admin-page-filter-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="admin-page-filter-select">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="budget-high">Budget: High to Low</option>
              <option value="budget-low">Budget: Low to High</option>
            </select>
          </div>

          <button className="admin-page-refresh-btn" onClick={fetchRequests}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="admin-page-no-requests">
          <div className="admin-page-no-requests-icon">📝</div>
          <h3>No Requests Found</h3>
          <p>
            {requests.length === 0
              ? "No custom project requests have been submitted yet."
              : "No requests match your current search criteria."}
          </p>
        </div>
      ) : (
        <div className="admin-page-requests-grid">
          {filteredRequests.map((request, index) => (
            <div
              key={request.id}
              className="admin-page-request-card"
              style={{ "--delay": `${index * 0.1}s` }}
              onClick={() => setSelectedRequest(request)}
            >
              <div className="admin-page-request-header">
                <div className="admin-page-request-title-section">
                  <h4 className="admin-page-request-title">{request.projectTitle}</h4>
                  <div className="admin-page-request-badges">
                    <span
                      className="admin-page-status-badge"
                      style={{
                        backgroundColor: `${getStatusColor(request.status)}20`,
                        color: getStatusColor(request.status),
                        borderColor: getStatusColor(request.status),
                      }}
                    >
                      <span className="admin-page-status-icon">{getStatusIcon(request.status)}</span>
                      <span className="admin-page-status-text">{request.status || "Pending"}</span>
                    </span>
                    {request.priority && (
                      <span
                        className="admin-page-priority-badge"
                        style={{
                          backgroundColor: `${getPriorityColor(request.priority)}20`,
                          color: getPriorityColor(request.priority),
                          borderColor: getPriorityColor(request.priority),
                        }}
                      >
                        {request.priority}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="admin-page-request-content">
                <div className="admin-page-customer-info">
                  <div className="admin-page-customer-name">👤 {request.customerName}</div>
                  <div className="admin-page-customer-email">📧 {request.customerEmail}</div>
                  {request.customerPhone && (
                    <div className="admin-page-customer-phone">📱 {request.customerPhone}</div>
                  )}
                </div>

                <div className="admin-page-request-description">
                  <p>{request.description}</p>
                </div>

                <div className="admin-page-request-details">
                  {request.budget && (
                    <div className="admin-page-request-budget">
                      <span className="admin-page-detail-label">Budget:</span>
                      <span className="admin-page-detail-value">₹{request.budget.toLocaleString()}</span>
                    </div>
                  )}
                  {request.timeline && (
                    <div className="admin-page-request-timeline">
                      <span className="admin-page-detail-label">Timeline:</span>
                      <span className="admin-page-detail-value">{request.timeline}</span>
                    </div>
                  )}
                  {request.category && (
                    <div className="admin-page-request-category">
                      <span className="admin-page-detail-label">Category:</span>
                      <span className="admin-page-detail-value">{request.category}</span>
                    </div>
                  )}
                </div>

                <div className="admin-page-request-footer">
                  <div className="admin-page-request-date">
                    📅 {request.createdAt?.toLocaleDateString()} at {request.createdAt?.toLocaleTimeString()}
                  </div>
                  <div className="admin-page-request-actions">
                    <button
                      className="admin-page-action-btn admin-page-view-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedRequest(request)
                      }}
                    >
                      👁️ View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="admin-page-modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="admin-page-modal-content admin-page-request-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-page-modal-header">
              <div className="admin-page-modal-title-section">
                <h2 className="admin-page-modal-title">Custom Project Request Details</h2>
                <div className="admin-page-request-id-badge">#{selectedRequest.id.slice(-8)}</div>
              </div>
              <button className="admin-page-modal-close" onClick={() => setSelectedRequest(null)}>
                <span>✕</span>
              </button>
            </div>

            <div className="admin-page-modal-body">
              <div className="admin-page-request-overview">
                <div className="admin-page-overview-grid">
                  <div className="admin-page-overview-card">
                    <div className="admin-page-overview-icon">📝</div>
                    <div className="admin-page-overview-content">
                      <h4>Project Title</h4>
                      <p>{selectedRequest.projectTitle}</p>
                    </div>
                  </div>

                  <div className="admin-page-overview-card">
                    <div className="admin-page-overview-icon">💰</div>
                    <div className="admin-page-overview-content">
                      <h4>Budget</h4>
                      <p>₹{selectedRequest.budget?.toLocaleString() || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="admin-page-overview-card">
                    <div className="admin-page-overview-icon">⏱️</div>
                    <div className="admin-page-overview-content">
                      <h4>Timeline</h4>
                      <p>{selectedRequest.timeline || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="admin-page-overview-card">
                    <div className="admin-page-overview-icon">📂</div>
                    <div className="admin-page-overview-content">
                      <h4>Category</h4>
                      <p>{selectedRequest.category || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-page-request-sections">
                <div className="admin-page-section-grid">
                  {/* Customer Information */}
                  <div className="admin-page-info-section">
                    <h3 className="admin-page-section-title">
                      <span className="admin-page-section-icon">👤</span>
                      Customer Information
                    </h3>
                    <div className="admin-page-info-content">
                      <div className="admin-page-info-row">
                        <span className="admin-page-info-label">Name:</span>
                        <span className="admin-page-info-value">{selectedRequest.customerName}</span>
                      </div>
                      <div className="admin-page-info-row">
                        <span className="admin-page-info-label">Email:</span>
                        <span className="admin-page-info-value">{selectedRequest.customerEmail}</span>
                      </div>
                      {selectedRequest.customerPhone && (
                        <div className="admin-page-info-row">
                          <span className="admin-page-info-label">Phone:</span>
                          <span className="admin-page-info-value">{selectedRequest.customerPhone}</span>
                        </div>
                      )}
                      {selectedRequest.company && (
                        <div className="admin-page-info-row">
                          <span className="admin-page-info-label">Company:</span>
                          <span className="admin-page-info-value">{selectedRequest.company}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Management */}
                  <div className="admin-page-status-section">
                    <h3 className="admin-page-section-title">
                      <span className="admin-page-section-icon">📋</span>
                      Status Management
                    </h3>
                    <div className="admin-page-status-content">
                      <div className="admin-page-current-status">
                        <span className="admin-page-status-label">Current Status:</span>
                        <div
                          className="admin-page-status-badge"
                          style={{
                            backgroundColor: `${getStatusColor(selectedRequest.status)}20`,
                            color: getStatusColor(selectedRequest.status),
                            borderColor: getStatusColor(selectedRequest.status),
                          }}
                        >
                          <span className="admin-page-status-icon">{getStatusIcon(selectedRequest.status)}</span>
                          <span className="admin-page-status-text">{selectedRequest.status || "Pending"}</span>
                        </div>
                      </div>

                      <div className="admin-page-status-actions">
                        <button
                          onClick={() => updateRequestStatus(selectedRequest.id, "pending")}
                          disabled={updating}
                          className="admin-page-status-btn admin-page-pending-btn"
                        >
                          ⏳ Pending
                        </button>
                        <button
                          onClick={() => updateRequestStatus(selectedRequest.id, "in-progress")}
                          disabled={updating}
                          className="admin-page-status-btn admin-page-progress-btn"
                        >
                          ⚙️ In Progress
                        </button>
                        <button
                          onClick={() => updateRequestStatus(selectedRequest.id, "completed")}
                          disabled={updating}
                          className="admin-page-status-btn admin-page-completed-btn"
                        >
                          ✅ Completed
                        </button>
                        <button
                          onClick={() => updateRequestStatus(selectedRequest.id, "rejected")}
                          disabled={updating}
                          className="admin-page-status-btn admin-page-rejected-btn"
                        >
                          ❌ Rejected
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Description */}
                <div className="admin-page-description-section">
                  <h3 className="admin-page-section-title">
                    <span className="admin-page-section-icon">📄</span>
                    Project Description
                  </h3>
                  <div className="admin-page-description-content">
                    <p>{selectedRequest.description}</p>
                  </div>
                </div>

                {/* Technical Requirements */}
                {selectedRequest.technicalRequirements && (
                  <div className="admin-page-technical-section">
                    <h3 className="admin-page-section-title">
                      <span className="admin-page-section-icon">⚙️</span>
                      Technical Requirements
                    </h3>
                    <div className="admin-page-technical-content">
                      <p>{selectedRequest.technicalRequirements}</p>
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                {selectedRequest.additionalInfo && (
                  <div className="admin-page-additional-section">
                    <h3 className="admin-page-section-title">
                      <span className="admin-page-section-icon">ℹ️</span>
                      Additional Information
                    </h3>
                    <div className="admin-page-additional-content">
                      <p>{selectedRequest.additionalInfo}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="admin-page-modal-footer">
              <button
                className="admin-page-btn admin-page-btn-danger"
                onClick={() => deleteRequest(selectedRequest.id)}
                disabled={updating}
              >
                🗑️ Delete Request
              </button>
              <button className="admin-page-btn admin-page-btn-secondary" onClick={() => setSelectedRequest(null)}>
                Close
              </button>
              <button className="admin-page-btn admin-page-btn-primary">📧 Send Response</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomProjectRequests
