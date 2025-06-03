"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore"
import { db } from "../firebase"
import "./AllUsers.css"
import { Search, RefreshCw, Eye, Trash2, Mail, X, User } from "lucide-react"

const AllUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedUser, setSelectedUser] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState("newest")
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const usersRef = collection(db, "users")
            const q = query(usersRef, orderBy("createdAt", "desc"))
            const querySnapshot = await getDocs(q)

            const fetchedUsers = []
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                let createdAt = data.createdAt
                if (createdAt && typeof createdAt.toDate === "function") {
                    createdAt = createdAt.toDate()
                }

                fetchedUsers.push({
                    id: doc.id,
                    ...data,
                    createdAt,
                })
            })

            setUsers(fetchedUsers)
        } catch (error) {
            console.error("Error fetching users:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                setUpdating(true)
                await deleteDoc(doc(db, "users", userId))
                setUsers(users.filter((user) => user.id !== userId))
                setSelectedUser(null)
            } catch (error) {
                console.error("Error deleting user:", error)
                alert("Error deleting user")
            } finally {
                setUpdating(false)
            }
        }
    }

    const filteredUsers = users.filter((user) => {
        const searchLower = searchTerm.toLowerCase()
        return (
            user.name?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower) ||
            user.phone?.includes(searchTerm)
        )
    })

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        switch (sortBy) {
            case "newest":
                return new Date(b.createdAt) - new Date(a.createdAt)
            case "oldest":
                return new Date(a.createdAt) - new Date(b.createdAt)
            case "name":
                return (a.name || "").localeCompare(b.name || "")
            case "email":
                return (a.email || "").localeCompare(b.email || "")
            default:
                return 0
        }
    })

    const formatDate = (date) => {
        if (!date) return "N/A"
        if (typeof date === "string") {
            date = new Date(date)
        }
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    if (loading) {
        return (
            <div className="admin-page-loading-container">
                <div className="admin-page-loading-spinner"></div>
                <p>Loading users...</p>
            </div>
        )
    }

    return (
        <div className="admin-page-all-users">
            <div className="admin-page-users-header">
                <div className="admin-page-header-content">
                    <h2 className="admin-page-users-title">User Management</h2>
                    <p className="admin-page-users-subtitle">Manage and monitor all registered users ({users.length} total)</p>
                </div>
                <button className="admin-page-refresh-btn" onClick={fetchUsers} disabled={updating} title="Refresh users list">
                    <RefreshCw size={18} className={updating ? "spinning" : ""} />
                    <span>Refresh</span>
                </button>
            </div>

            <div className="admin-page-users-controls">
                <div className="admin-page-search-container">
                    <Search size={20} className="admin-page-search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="admin-page-search-input"
                    />
                </div>
                <div className="admin-page-sort-container">
                    <label htmlFor="sortBy" className="admin-page-sort-label">
                        Sort by:
                    </label>
                    <select
                        id="sortBy"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="admin-page-sort-select"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name">Name (A-Z)</option>
                        <option value="email">Email (A-Z)</option>
                    </select>
                </div>
            </div>

            <div className="admin-page-users-table-container">
                <div className="admin-page-table-wrapper">
                    <table className="admin-page-users-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Contact</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedUsers.length > 0 ? (
                                sortedUsers.map((user) => (
                                    <tr key={user.id} className="admin-page-user-row">
                                        <td className="admin-page-user-info">
                                            <div className="admin-page-user-avatar">
                                                <User size={20} />
                                            </div>
                                            <div className="admin-page-user-details">
                                                <div className="admin-page-user-name">{user.name || "N/A"}</div>
                                                <div className="admin-page-user-id">ID: {user.id}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <div className="admin-page-email">{user.email || "N/A"}</div>
                                                <div className="admin-page-phone">{user.mobile || "N/A"}</div>
                                            </div>
                                        </td>
                                        <td className="admin-page-join-date">{formatDate(user.createdAt)}</td>
                                        <td className="admin-page-user-actions" style={{ justifyContent: "left" }}>
                                            <button
                                                className="admin-page-action-btn view"
                                                onClick={() => setSelectedUser(user)}
                                                title="View details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                className="admin-page-action-btn delete"
                                                onClick={() => handleDeleteUser(user.id)}
                                                disabled={updating}
                                                title="Delete user"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="admin-page-no-users">
                                        <div className="admin-page-empty-state">
                                            <User size={48} />
                                            <h3>No users found</h3>
                                            <p>{searchTerm ? "Try adjusting your search criteria" : "No users have registered yet"}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="admin-page-modal-overlay" onClick={() => setSelectedUser(null)}>
                    <div className="admin-page-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-page-modal-header">
                            <h3 className="admin-page-modal-title">User Details</h3>
                            <button className="admin-page-modal-close" onClick={() => setSelectedUser(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="admin-page-modal-body">
                            <div className="admin-page-user-profile">
                                <div className="admin-page-profile-avatar">
                                    <User size={48} />
                                </div>
                                <div className="admin-page-profile-info">
                                    <h4 className="admin-page-profile-name">{selectedUser.name || "N/A"}</h4>
                                    <p className="admin-page-profile-id">User ID: {selectedUser.id}</p>
                                </div>
                            </div>

                            <div className="admin-page-user-details-grid">
                                <div className="admin-page-detail-item">
                                    <label className="admin-page-detail-label">Email</label>
                                    <div className="admin-page-detail-value">
                                        <Mail size={16} />
                                        <span>{selectedUser.email || "N/A"}</span>
                                    </div>
                                </div>
                                <div className="admin-page-detail-item">
                                    <label className="admin-page-detail-label">Phone</label>
                                    <div className="admin-page-detail-value">
                                        <span>{selectedUser.mobile || "N/A"}</span>
                                    </div>
                                </div>
                                <div className="admin-page-detail-item">
                                    <label className="admin-page-detail-label">Address</label>
                                    <div className="admin-page-detail-value">
                                        <span>{selectedUser.address || "N/A"}</span>
                                    </div>
                                </div>
                                <div className="admin-page-detail-item">
                                    <label className="admin-page-detail-label">Joined Date</label>
                                    <div className="admin-page-detail-value">
                                        <span>{formatDate(selectedUser.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="admin-page-modal-footer">
                            <button className="admin-page-modal-btn secondary" onClick={() => setSelectedUser(null)}>
                                Close
                            </button>
                            <button
                                className="admin-page-modal-btn danger"
                                onClick={() => handleDeleteUser(selectedUser.id)}
                                disabled={updating}
                            >
                                <Trash2 size={16} />
                                <span>Delete User</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AllUsers
