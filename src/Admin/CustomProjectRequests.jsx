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
  const [activeTab, setActiveTab] = useState("all") // "all" or "accepted"
  const [viewMode, setViewMode] = useState("card") // "card" or "table"

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

      setRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: newStatus } : req)))

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

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "🔴"
      case "medium":
        return "🟡"
      case "low":
        return "🟢"
      default:
        return "⚪"
    }
  }

  const getFilteredRequests = () => {
    let filtered = requests

    // Filter by tab
    if (activeTab === "accepted") {
      filtered = filtered.filter((req) => req.status === "completed" || req.status === "in-progress")
    }

    // Filter by search and status
    filtered = filtered
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

    return filtered
  }

  const filteredRequests = getFilteredRequests()
  const acceptedCount = requests.filter((req) => req.status === "completed" || req.status === "in-progress").length

  if (loading) {
    return (
      <div className="admin-project-request-loading-container">
        <div className="admin-project-request-loading-spinner"></div>
        <p className="admin-project-request-loading-text">Loading custom project requests...</p>
      </div>
    )
  }

  return (
    <div className="admin-project-request-project-requests-container">
      <div className="admin-project-request-main-content">
        {/* Header Section */}
        <div className="admin-project-request-header-section">
          <div className="admin-project-request-header-content">
            <div className="admin-project-request-header-info">
              <h1 className="admin-project-request-main-title">Custom Project Requests</h1>
              <p className="admin-project-request-main-subtitle">Manage and respond to custom electronics project requests</p>
            </div>

            <div className="admin-project-request-stats-container">
              <div className="admin-project-request-stat-card">
                <div className="admin-project-request-stat-number">{requests.length}</div>
                <div className="admin-project-request-stat-label">Total Requests</div>
              </div>
              <div className="admin-project-request-stat-card">
                <div className="admin-project-request-stat-number">{requests.filter((req) => req.status === "pending").length}</div>
                <div className="admin-project-request-stat-label">Pending</div>
              </div>
              <div className="admin-project-request-stat-card">
                <div className="admin-project-request-stat-number">{acceptedCount}</div>
                <div className="admin-project-request-stat-label">Accepted</div>
              </div>
              <div className="admin-project-request-stat-card">
                <div className="admin-project-request-stat-number">{requests.filter((req) => req.status === "completed").length}</div>
                <div className="admin-project-request-stat-label">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="admin-project-request-tabs-section">
          <div className="admin-project-request-tabs-container">
            <button className={`admin-project-request-tab-button ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
              <span className="admin-project-request-tab-icon">📋</span>
              All Projects
              <span className="admin-project-request-tab-count">{requests.length}</span>
            </button>
            <button
              className={`admin-project-request-tab-button ${activeTab === "accepted" ? "active" : ""}`}
              onClick={() => setActiveTab("accepted")}
            >
              <span className="admin-project-request-tab-icon">✅</span>
              Accepted Projects
              <span className="admin-project-request-tab-count">{acceptedCount}</span>
            </button>
          </div>

          <div className="admin-project-request-view-controls">
            <div className="admin-project-request-view-toggle">
              <button
                className={`admin-project-request-view-button ${viewMode === "card" ? "active" : ""}`}
                onClick={() => setViewMode("card")}
                title="Card View"
              >
                <span className="admin-project-request-view-icon">⊞</span>
              </button>
              <button
                className={`admin-project-request-view-button ${viewMode === "table" ? "active" : ""}`}
                onClick={() => setViewMode("table")}
                title="Table View"
              >
                <span className="view-icon">☰</span>
              </button>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="admin-project-request-controls-section">
          <div className="admin-project-request-search-container">
            <div className="admin-project-request-search-box">
              <span className="admin-project-request-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by project title, customer name, email, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-project-request-search-input"
              />
            </div>
          </div>

          <div className="admin-project-request-filters-container">
            <div className="admin-project-request-filter-group">
              <label className="admin-project-request-filter-label">Status:</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="admin-project-request-filter-select">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="admin-project-request-filter-group">
              <label className="admin-project-request-filter-label">Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="admin-project-request-filter-select">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="budget-high">Budget: High to Low</option>
                <option value="budget-low">Budget: Low to High</option>
              </select>
            </div>

            <button className="admin-project-request-refresh-button" onClick={fetchRequests}>
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Content Section */}
        {filteredRequests.length === 0 ? (
          <div className="admin-project-request-no-requests">
            <div className="admin-project-request-no-requests-icon">📝</div>
            <h3 className="admin-project-request-no-requests-title">No Requests Found</h3>
            <p className="admin-project-request-no-requests-text">
              {requests.length === 0
                ? "No custom project requests have been submitted yet."
                : `No ${activeTab === "accepted" ? "accepted " : ""}requests match your current search criteria.`}
            </p>
          </div>
        ) : viewMode === "card" ? (
          <div className="admin-project-request-cards-container">
            {filteredRequests.map((request, index) => (
              <div
                key={request.id}
                className="admin-project-request-request-card"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedRequest(request)}
              >
                <div className="admin-project-request-card-header">
                  <div className="admin-project-request-card-title-section">
                    <h3 className="admin-project-request-card-title">{request.projectTitle}</h3>
                    <div className="admin-project-request-card-id">#{request.id.slice(-8)}</div>
                  </div>
                  <div className="admin-project-request-card-badges">
                    <span className={`admin-project-request-status-badge status-${request.status || "pending"}`}>
                      <span className="admin-project-request-badge-icon">{getStatusIcon(request.status)}</span>
                      {request.status || "Pending"}
                    </span>
                    {request.priority && (
                      <span className={`admin-project-request-priority-badge priority-${request.priority.toLowerCase()}`}>
                        <span className="admin-project-request-badge-icon">{getPriorityIcon(request.priority)}</span>
                        {request.priority}
                      </span>
                    )}
                  </div>
                </div>

                <div className="admin-project-request-card-customer">
                  <div className="admin-project-request-customer-avatar">
                    <span className="admin-project-request-avatar-text">{request.customerName?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <div className="admin-project-request-customer-details">
                    <div className="admin-project-request-customer-name">{request.customerName}</div>
                    <div className="admin-project-request-customer-email">{request.customerEmail}</div>
                    {request.customerPhone && <div className="admin-project-request-customer-phone">📱 {request.customerPhone}</div>}
                  </div>
                </div>

                <div className="admin-project-request-card-description">
                  <p>{request.description}</p>
                </div>

                <div className="admin-project-request-card-details">
                  <div className="admin-project-request-detail-grid">
                    {request.budget && (
                      <div className="admin-project-request-detail-item">
                        <span className="admin-project-request-detail-icon">💰</span>
                        <span className="admin-project-request-detail-value">₹{request.budget.toLocaleString()}</span>
                      </div>
                    )}
                    {request.timeline && (
                      <div className="admin-project-request-detail-item">
                        <span className="admin-project-request-detail-icon">⏱️</span>
                        <span className="admin-project-request-detail-value">{request.timeline}</span>
                      </div>
                    )}
                    {request.category && (
                      <div className="admin-project-request-detail-item">
                        <span className="admin-project-request-detail-icon">📂</span>
                        <span className="admin-project-request-detail-value">{request.category}</span>
                      </div>
                    )}
                    <div className="admin-project-request-detail-item">
                      <span className="admin-project-request-detail-icon">📅</span>
                      <span className="admin-project-request-detail-value">{request.createdAt?.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="admin-project-request-card-actions">
                  <button
                    className="admin-project-request-action-button view-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedRequest(request)
                    }}
                  >
                    👁️ View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-project-request-table-container">
            <div className="admin-project-request-table-wrapper">
              <table className="admin-project-request-requests-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Budget</th>
                    <th>Timeline</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request, index) => (
                    <tr key={request.id} className="admin-project-request-table-row" style={{ animationDelay: `${index * 0.05}s` }}>
                      <td className="admin-project-request-project-cell">
                        <div className="admin-project-request-project-info">
                          <div className="admin-project-request-project-title">{request.projectTitle}</div>
                          <div className="admin-project-request-project-id">#{request.id.slice(-8)}</div>
                        </div>
                      </td>
                      <td className="admin-project-request-customer-cell">
                        <div className="admin-project-request-customer-info">
                          <div className="admin-project-request-customer-name">{request.customerName}</div>
                          <div className="admin-project-request-customer-email">{request.customerEmail}</div>
                        </div>
                      </td>
                      <td className="admin-project-request-status-cell">
                        <span className={`admin-project-request-status-badge status-${request.status || "pending"}`}>
                          <span className="admin-project-request-badge-icon">{getStatusIcon(request.status)}</span>
                          {request.status || "Pending"}
                        </span>
                      </td>
                      <td className="admin-project-request-priority-cell">
                        {request.priority && (
                          <span className={`admin-project-request-priority-badge priority-${request.priority.toLowerCase()}`}>
                            <span className="admin-project-request-badge-icon">{getPriorityIcon(request.priority)}</span>
                            {request.priority}
                          </span>
                        )}
                      </td>
                      <td className="admin-project-request-budget-cell">{request.budget ? `₹${request.budget.toLocaleString()}` : "-"}</td>
                      <td className="admin-project-request-timeline-cell">{request.timeline || "-"}</td>
                      <td className="admin-project-request-date-cell">{request.createdAt?.toLocaleDateString()}</td>
                      <td className="admin-project-request-actions-cell">
                        <button
                          className="admin-project-request-table-action-button"
                          onClick={() => setSelectedRequest(request)}
                          title="View Details"
                        >
                          👁️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {selectedRequest && (
          <div className="admin-project-request-modal-overlay" onClick={() => setSelectedRequest(null)}>
            <div className="admin-project-request-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="admin-project-request-modal-header">
                <div className="admin-project-request-modal-title-section">
                  <h2 className="admin-project-request-modal-title">Project Request Details</h2>
                  <div className="admin-project-request-modal-id">#{selectedRequest.id.slice(-8)}</div>
                </div>
                <button className="admin-project-request-modal-close" onClick={() => setSelectedRequest(null)}>
                  ✕
                </button>
              </div>

              <div className="admin-project-request-modal-body">
                <div className="admin-project-request-modal-overview">
                  <div className="admin-project-request-overview-grid">
                    <div className="admin-project-request-overview-card">
                      <div className="admin-project-request-overview-icon">📝</div>
                      <div className="admin-project-request-overview-content">
                        <h4>Project Title</h4>
                        <p>{selectedRequest.projectTitle}</p>
                      </div>
                    </div>
                    <div className="admin-project-request-overview-card">
                      <div className="admin-project-request-overview-icon">💰</div>
                      <div className="admin-project-request-overview-content">
                        <h4>Budget</h4>
                        <p>₹{selectedRequest.budget?.toLocaleString() || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="admin-project-request-overview-card">
                      <div className="admin-project-request-overview-icon">⏱️</div>
                      <div className="admin-project-request-overview-content">
                        <h4>Timeline</h4>
                        <p>{selectedRequest.timeline || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="admin-project-request-overview-card">
                      <div className="admin-project-request-overview-icon">📂</div>
                      <div className="admin-project-request-overview-content">
                        <h4>Category</h4>
                        <p>{selectedRequest.category || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="admin-project-request-modal-sections">
                  <div className="admin-project-request-modal-section">
                    <h3 className="admin-project-request-section-title">
                      <span className="admin-project-request-section-icon">👤</span>
                      Customer Information
                    </h3>
                    <div className="admin-project-request-section-content">
                      <div className="admin-project-request-info-grid">
                        <div className="admin-project-request-info-item">
                          <label>Name:</label>
                          <span>{selectedRequest.customerName}</span>
                        </div>
                        <div className="admin-project-request-info-item">
                          <label>Email:</label>
                          <span>{selectedRequest.customerEmail}</span>
                        </div>
                        {selectedRequest.customerPhone && (
                          <div className="admin-project-request-info-item">
                            <label>Phone:</label>
                            <span>{selectedRequest.customerPhone}</span>
                          </div>
                        )}
                        {selectedRequest.company && (
                          <div className="admin-project-request-info-item">
                            <label>Company:</label>
                            <span>{selectedRequest.company}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="admin-project-request-modal-section">
                    <h3 className="admin-project-request-section-title">
                      <span className="admin-project-request-section-icon">📄</span>
                      Project Description
                    </h3>
                    <div className="admin-project-request-section-content">
                      <div className="admin-project-request-description-text">{selectedRequest.description}</div>
                    </div>
                  </div>

                  <div className="admin-project-request-modal-section">
                    <h3 className="admin-project-request-section-title">
                      <span className="admin-project-request-section-icon">⚙️</span>
                      Status Management
                    </h3>
                    <div className="admin-project-request-section-content">
                      <div className="admin-project-request-status-actions">
                        {["pending", "in-progress", "completed", "rejected"].map((status) => (
                          <button
                            key={status}
                            onClick={() => updateRequestStatus(selectedRequest.id, status)}
                            disabled={updating}
                            className={`admin-project-request-status-action-button ${selectedRequest.status === status ? "active" : ""
                              } admin-project-request-status-${status}`}
                          >
                            <span className="admin-project-request-status-icon">{getStatusIcon(status)}</span>
                            {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-project-request-modal-footer">
                <button
                  className="admin-project-request-footer-button admin-project-request-delete-button"
                  onClick={() => deleteRequest(selectedRequest.id)}
                  disabled={updating}
                >
                  🗑️ Delete Request
                </button>
                <button className="admin-project-request-footer-button admin-project-request-secondary-button" onClick={() => setSelectedRequest(null)}>
                  Close
                </button>
                <button className="admin-project-request-footer-button admin-project-request-primary-button">📧 Send Response</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomProjectRequests
