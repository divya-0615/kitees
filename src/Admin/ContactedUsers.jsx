"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "../firebase"
import "./ContactedUsers.css"

const ContactedUsers = () => {
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedContact, setSelectedContact] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [sortBy, setSortBy] = useState("newest")
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        fetchContacts()
    }, [])

    const fetchContacts = async () => {
        try {
            setLoading(true)
            const contactsRef = collection(db, "contact-messages")
            const q = query(contactsRef, orderBy("createdAt", "desc"))
            const querySnapshot = await getDocs(q)

            const fetchedContacts = []
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                let createdAt = data.createdAt
                if (createdAt && typeof createdAt.toDate === "function") {
                    createdAt = createdAt.toDate()
                }

                fetchedContacts.push({
                    id: doc.id,
                    ...data,
                    createdAt,
                })
            })

            setContacts(fetchedContacts)
        } catch (error) {
            console.error("Error fetching contacts:", error)
        } finally {
            setLoading(false)
        }
    }

    const updateContactStatus = async (contactId, newStatus) => {
        try {
            setUpdating(true)
            const contactRef = doc(db, "contact-messages", contactId)
            await updateDoc(contactRef, {
                status: newStatus,
                updatedAt: new Date(),
            })

            // Update local state
            setContacts((prev) => prev.map((contact) => (contact.id === contactId ? { ...contact, status: newStatus } : contact)))

            alert("Contact status updated successfully!")
        } catch (error) {
            console.error("Error updating contact status:", error)
            alert("Failed to update contact status")
        } finally {
            setUpdating(false)
        }
    }

    const deleteContact = async (contactId) => {
        if (window.confirm("Are you sure you want to delete this contact message?")) {
            try {
                setUpdating(true)
                await deleteDoc(doc(db, "contact-messages", contactId))
                setContacts((prev) => prev.filter((contact) => contact.id !== contactId))
                setSelectedContact(null)
                alert("Contact message deleted successfully!")
            } catch (error) {
                console.error("Error deleting contact:", error)
                alert("Failed to delete contact message")
            } finally {
                setUpdating(false)
            }
        }
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "new":
                return "#3b82f6"
            case "replied":
                return "#10b981"
            case "pending":
                return "#f59e0b"
            case "resolved":
                return "#059669"
            default:
                return "#6b7280"
        }
    }

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "new":
                return "🆕"
            case "replied":
                return "✅"
            case "pending":
                return "⏳"
            case "resolved":
                return "🎯"
            default:
                return "📧"
        }
    }

    const getSubjectIcon = (subject) => {
        const lowerSubject = subject?.toLowerCase() || ""
        if (lowerSubject.includes("order") || lowerSubject.includes("purchase")) return "🛒"
        if (lowerSubject.includes("support") || lowerSubject.includes("help")) return "🆘"
        if (lowerSubject.includes("technical") || lowerSubject.includes("bug")) return "🔧"
        if (lowerSubject.includes("feedback") || lowerSubject.includes("suggestion")) return "💡"
        if (lowerSubject.includes("partnership") || lowerSubject.includes("business")) return "🤝"
        return "📧"
    }

    const filteredContacts = contacts
        .filter((contact) => {
            const matchesSearch =
                contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.message?.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus =
                statusFilter === "all" || (contact.status && contact.status.toLowerCase() === statusFilter.toLowerCase())

            return matchesSearch && matchesStatus
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.createdAt) - new Date(a.createdAt)
                case "oldest":
                    return new Date(a.createdAt) - new Date(b.createdAt)
                case "name":
                    return (a.name || "").localeCompare(b.name || "")
                default:
                    return 0
            }
        })

    if (loading) {
        return (
            <div className="admin-page-loading">
                <div className="admin-page-loading-spinner"></div>
                <p>Loading contact messages...</p>
            </div>
        )
    }

    return (
        <div className="admin-page-contacted-users">
            <div className="admin-page-contacts-header">
                <div className="admin-page-header-info">
                    <h2 className="admin-page-contacts-title">Contact Messages</h2>
                    <p className="admin-page-contacts-subtitle">Manage and respond to customer inquiries and messages</p>
                </div>
                <div className="admin-page-contacts-stats">
                    <div className="admin-page-stat-item">
                        <span className="admin-page-stat-number">{contacts.length}</span>
                        <span className="admin-page-stat-label">Total Messages</span>
                    </div>
                    <div className="admin-page-stat-item">
                        <span className="admin-page-stat-number">{contacts.filter((contact) => contact.status === "new").length}</span>
                        <span className="admin-page-stat-label">New</span>
                    </div>
                    <div className="admin-page-stat-item">
                        <span className="admin-page-stat-number">
                            {contacts.filter((contact) => contact.status === "pending").length}
                        </span>
                        <span className="admin-page-stat-label">Pending</span>
                    </div>
                    <div className="admin-page-stat-item">
                        <span className="admin-page-stat-number">
                            {contacts.filter((contact) => contact.status === "resolved").length}
                        </span>
                        <span className="admin-page-stat-label">Resolved</span>
                    </div>
                </div>
            </div>

            <div className="admin-page-contacts-controls">
                <div className="admin-page-search-section">
                    <div className="admin-page-search-box">
                        <span className="admin-page-search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by name, email, subject, or message..."
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
                            <option value="new">New</option>
                            <option value="replied">Replied</option>
                            <option value="pending">Pending</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>

                    <div className="admin-page-filter-group">
                        <label>Sort by:</label>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="admin-page-filter-select">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name">Name A-Z</option>
                        </select>
                    </div>

                    <button className="admin-page-refresh-btn" onClick={fetchContacts}>
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {filteredContacts.length === 0 ? (
                <div className="admin-page-no-contacts">
                    <div className="admin-page-no-contacts-icon">📧</div>
                    <h3>No Contact Messages Found</h3>
                    <p>
                        {contacts.length === 0
                            ? "No contact messages have been received yet."
                            : "No messages match your current search criteria."}
                    </p>
                </div>
            ) : (
                <div className="admin-page-contacts-list">
                    {filteredContacts.map((contact, index) => (
                        <div
                            key={contact.id}
                            className="admin-page-contact-card"
                            style={{ "--delay": `${index * 0.05}s` }}
                            onClick={() => setSelectedContact(contact)}
                        >
                            <div className="admin-page-contact-header">
                                <div className="admin-page-contact-avatar">
                                    <span className="admin-page-avatar-text">{contact.name?.charAt(0)?.toUpperCase() || "?"}</span>
                                </div>
                                <div className="admin-page-contact-info">
                                    <div className="admin-page-contact-name">{contact.name}</div>
                                    <div className="admin-page-contact-email">{contact.email}</div>
                                    <div className="admin-page-contact-date">
                                        📅 {contact.createdAt?.toLocaleDateString()} at {contact.createdAt?.toLocaleTimeString()}
                                    </div>
                                </div>
                                <div className="admin-page-contact-badges">
                                    <span
                                        className="admin-page-status-badge"
                                        style={{
                                            backgroundColor: `${getStatusColor(contact.status)}20`,
                                            color: getStatusColor(contact.status),
                                            borderColor: getStatusColor(contact.status),
                                        }}
                                    >
                                        <span className="admin-page-status-icon">{getStatusIcon(contact.status)}</span>
                                        <span className="admin-page-status-text">{contact.status || "New"}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="admin-page-contact-content">
                                <div className="admin-page-contact-subject">
                                    <span className="admin-page-subject-icon">{getSubjectIcon(contact.subject)}</span>
                                    <span className="admin-page-subject-text">{contact.subject}</span>
                                </div>
                                <div className="admin-page-contact-message">
                                    <p>{contact.message}</p>
                                </div>
                            </div>

                            <div className="admin-page-contact-footer">
                                {contact.phone && (
                                    <div className="admin-page-contact-phone">
                                        📱 {contact.phone}
                                    </div>
                                )}
                                <div className="admin-page-contact-actions">
                                    <button
                                        className="admin-page-action-btn admin-page-reply-btn"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            window.open(`mailto:${contact.email}?subject=Re: ${contact.subject}`, "_blank")
                                        }}
                                    >
                                        📧 Reply
                                    </button>
                                    <button
                                        className="admin-page-action-btn admin-page-view-btn"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setSelectedContact(contact)
                                        }}
                                    >
                                        👁️ View
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Contact Detail Modal */}
            {selectedContact && (
                <div className="admin-page-modal-overlay" onClick={() => setSelectedContact(null)}>
                    <div className="admin-page-modal-content admin-page-contact-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-page-modal-header">
                            <div className="admin-page-modal-title-section">
                                <h2 className="admin-page-modal-title">Contact Message Details</h2>
                                <div className="admin-page-contact-id-badge">#{selectedContact.id.slice(-8)}</div>
                            </div>
                            <button className="admin-page-modal-close" onClick={() => setSelectedContact(null)}>
                                <span>✕</span>
                            </button>
                        </div>

                        <div className="admin-page-modal-body">
                            <div className="admin-page-contact-overview">
                                <div className="admin-page-overview-grid">
                                    <div className="admin-page-overview-card">
                                        <div className="admin-page-overview-icon">👤</div>
                                        <div className="admin-page-overview-content">
                                            <h4>Contact Name</h4>
                                            <p>{selectedContact.name}</p>
                                        </div>
                                    </div>

                                    <div className="admin-page-overview-card">
                                        <div className="admin-page-overview-icon">📧</div>
                                        <div className="admin-page-overview-content">
                                            <h4>Email Address</h4>
                                            <p>{selectedContact.email}</p>
                                        </div>
                                    </div>

                                    <div className="admin-page-overview-card">
                                        <div className="admin-page-overview-icon">📱</div>
                                        <div className="admin-page-overview-content">
                                            <h4>Phone Number</h4>
                                            <p>{selectedContact.phone || "Not provided"}</p>
                                        </div>
                                    </div>

                                    <div className="admin-page-overview-card">
                                        <div className="admin-page-overview-icon">📅</div>
                                        <div className="admin-page-overview-content">
                                            <h4>Date Received</h4>
                                            <p>
                                                {selectedContact.createdAt?.toLocaleDateString()} at{" "}
                                                {selectedContact.createdAt?.toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="admin-page-contact-sections">
                                <div className="admin-page-section-grid">
                                    {/* Subject Section */}
                                    <div className="admin-page-info-section">
                                        <h3 className="admin-page-section-title">
                                            <span className="admin-page-section-icon">{getSubjectIcon(selectedContact.subject)}</span>
                                            Subject
                                        </h3>
                                        <div className="admin-page-info-content">
                                            <p className="admin-page-subject-display">{selectedContact.subject}</p>
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
                                                        backgroundColor: `${getStatusColor(selectedContact.status)}20`,
                                                        color: getStatusColor(selectedContact.status),
                                                        borderColor: getStatusColor(selectedContact.status),
                                                    }}
                                                >
                                                    <span className="admin-page-status-icon">{getStatusIcon(selectedContact.status)}</span>
                                                    <span className="admin-page-status-text">{selectedContact.status || "New"}</span>
                                                </div>
                                            </div>

                                            <div className="admin-page-status-actions">
                                                <button
                                                    onClick={() => updateContactStatus(selectedContact.id, "new")}
                                                    disabled={updating}
                                                    className="admin-page-status-btn admin-page-new-btn"
                                                >
                                                    🆕 New
                                                </button>
                                                <button
                                                    onClick={() => updateContactStatus(selectedContact.id, "replied")}
                                                    disabled={updating}
                                                    className="admin-page-status-btn admin-page-replied-btn"
                                                >
                                                    ✅ Replied
                                                </button>
                                                <button
                                                    onClick={() => updateContactStatus(selectedContact.id, "pending")}
                                                    disabled={updating}
                                                    className="admin-page-status-btn admin-page-pending-btn"
                                                >
                                                    ⏳ Pending
                                                </button>
                                                <button
                                                    onClick={() => updateContactStatus(selectedContact.id, "resolved")}
                                                    disabled={updating}
                                                    className="admin-page-status-btn admin-page-resolved-btn"
                                                >
                                                    🎯 Resolved
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Message Content */}
                                <div className="admin-page-message-section">
                                    <h3 className="admin-page-section-title">
                                        <span className="admin-page-section-icon">💬</span>
                                        Message Content
                                    </h3>
                                    <div className="admin-page-message-content">
                                        <p>{selectedContact.message}</p>
                                    </div>
                                </div>

                                {/* Additional Information */}
                                {selectedContact.company && (
                                    <div className="admin-page-additional-section">
                                        <h3 className="admin-page-section-title">
                                            <span className="admin-page-section-icon">🏢</span>
                                            Company Information
                                        </h3>
                                        <div className="admin-page-additional-content">
                                            <p>{selectedContact.company}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="admin-page-modal-footer">
                            <button
                                className="admin-page-btn admin-page-btn-danger"
                                onClick={() => deleteContact(selectedContact.id)}
                                disabled={updating}
                            >
                                🗑️ Delete Message
                            </button>
                            <button className="admin-page-btn admin-page-btn-secondary" onClick={() => setSelectedContact(null)}>
                                Close
                            </button>
                            <button
                                className="admin-page-btn admin-page-btn-primary"
                                onClick={() => {
                                    window.open(`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`, "_blank")
                                }}
                            >
                                📧 Reply via Email
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ContactedUsers
