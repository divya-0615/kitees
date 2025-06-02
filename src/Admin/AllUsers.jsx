"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "../firebase"
import "./AllUsers.css"

const AllUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedUser, setSelectedUser] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
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

    const updateUserRole = async (userId, newRole) => {
        try {
            setUpdating(true)
            const userRef = doc(db, "users", userId)
            await updateDoc(userRef, {
                role: newRole,
                updatedAt: new Date(),
            })

            // Update local state
            setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))

            alert("User role updated successfully!")
        } catch (error) {
            console.error("Error updating user role:", error)
            alert("Failed to update user role")
        } finally {
            setUpdating(false)
        }
    }

    const updateUserStatus = async (userId, newStatus) => {
        try {
            setUpdating(true)
            const userRef = doc(db, "users", userId)
            await updateDoc(userRef, {
                status: newStatus,
                updatedAt: new Date(),
            })

            // Update local state
            setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))

            alert("User status updated successfully!")
        } catch (error) {
            console.error("Error updating user status:", error)
            alert("Failed to update user status")
        } finally {
            setUpdating(false)
        }
    }

    const deleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                setUpdating(true)
                await deleteDoc(doc(db, "users", userId))
                setUsers((prev) => prev.filter((user) => user.id !== userId))
                setSelectedUser(null)
                alert("User deleted successfully!")
            } catch (error) {
                console.error("Error deleting user:", error)
                alert("Failed to delete user")
            } finally {
                setUpdating(false)
            }
        }
    }

    const getRoleColor = (role) => {
        switch (role?.toLowerCase()) {
            case "admin":
                return "#dc2626"
            case "moderator":
                return "#f59e0b"
            case "premium":
                return "#7c3aed"
            case "user":
                return "#10b981"
            default:
                return "#6b7280"
        }
    }

    const getRoleIcon = (role) => {
        switch (role?.toLowerCase()) {
            case "admin":
                return "👑"
            case "moderator":
                return "🛡️"
            case "premium":
                return "⭐"
            case "user":
                return "👤"
            default:
                return "❓"
        }
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "active":
                return "#10b981"
            case "inactive":
                return "#6b7280"
            case "suspended":
                return "#ef4444"
            case "pending":
                return "#f59e0b"
            default:
                return "#6b7280"
        }
    }

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "active":
                return "✅"
            case "inactive":
                return "⏸️"
            case "suspended":
                return "🚫"
            case "pending":
                return "⏳"
            default:
                return "❓"
        }
    }

    const filteredUsers = users
        .filter((user) => {
            const matchesSearch =
                user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.college?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.mobile?.includes(searchTerm)

            const matchesRole = roleFilter === "all" || (user.role && user.role.toLowerCase() === roleFilter.toLowerCase())

            const matchesStatus =
                statusFilter === "all" ||
                (user.status && user.status.toLowerCase() === statusFilter.toLowerCase()) ||
                (statusFilter === "active" && !user.status) // Default to active if no status is set

            return matchesSearch && matchesRole && matchesStatus
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                case "oldest":
                    return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
                case "name":
                    return (a.name || "").localeCompare(b.name || "")
                case "email":
                    return (a.email || "").localeCompare(b.email || "")
                default:
                    return 0
            }
        })

    if (loading) {
        return (
            <div className="admin-page-loading">
                <div className="admin-page-loading-spinner"></div>
                <p>Loading users...</p>
            </div>
        )
    }

    return (
        <div className="admin-page-all-users">
            <div className="admin-page-users-header">
                <div className="admin-page-header-info">
                    <h2 className="admin-page-users-title">All Users Management</h2>
                    <p className="admin-page-users-subtitle">Manage user accounts, roles, and permissions</p>
                </div>
                <div className="admin-page-users-stats">
                    <div className="admin-page-stat-item">
                        <span className="admin-page-stat-number">{users.length}</span>
                        <span className="admin-page-stat-label">Total Users</span>
                    </div>
                    <div className="admin-page-stat-item">
                        <span className="admin-page-stat-number">
                            {users.filter((user) => !user.status || user.status === "active").length}
                        </span>
                        <span className="admin-page-stat-label">Active</span>
                    </div>
                    <div className="admin-page-stat-item">
                        <span className="admin-page-stat-number">{users.filter((user) => user.role === "premium").length}</span>
                        <span className="admin-page-stat-label">Premium</span>
                    </div>
                    <div className="admin-page-stat-item">
                        <span className="admin-page-stat-number">{users.filter((user) => user.role === "admin").length}</span>
                        <span className="admin-page-stat-label">Admins</span>
                    </div>
                </div>
            </div>

            <div className="admin-page-users-controls">
                <div className="admin-page-search-section">
                    <div className="admin-page-search-box">
                        <span className="admin-page-search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by name, email, college, or mobile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="admin-page-search-input"
                        />
                    </div>
                </div>

                <div className="admin-page-filters-section">
                    <div className="admin-page-filter-group">
                        <label>Role:</label>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="admin-page-filter-select"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="moderator">Moderator</option>
                            <option value="premium">Premium</option>
                            <option value="user">User</option>
                        </select>
                    </div>

                    <div className="admin-page-filter-group">
                        <label>Status:</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="admin-page-filter-select"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>

                    <div className="admin-page-filter-group">
                        <label>Sort by:</label>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="admin-page-filter-select">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name">Name A-Z</option>
                            <option value="email">Email A-Z</option>
                        </select>
                    </div>

                    <button className="admin-page-refresh-btn" onClick={fetchUsers}>
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {filteredUsers.length === 0 ? (
                <div className="admin-page-no-users">
                    <div className="admin-page-no-users-icon">👥</div>
                    <h3>No Users Found</h3>
                    <p>{users.length === 0 ? "No users have registered yet." : "No users match your current search criteria."}</p>
                </div>
            ) : (
                <div className="admin-page-users-table-container">
                    <div className="admin-page-users-table">
                        <div className="admin-page-table-header">
                            <div className="admin-page-table-row admin-page-header-row">
                                <div className="admin-page-table-cell">User</div>
                                <div className="admin-page-table-cell">Contact</div>
                                <div className="admin-page-table-cell">College</div>
                                <div className="admin-page-table-cell">Role</div>
                                <div className="admin-page-table-cell">Status</div>
                                <div className="admin-page-table-cell">Joined</div>
                                <div className="admin-page-table-cell">Actions</div>
                            </div>
                        </div>

                        <div className="admin-page-table-body">
                            {filteredUsers.map((user, index) => (
                                <div
                                    key={user.id}
                                    className="admin-page-table-row admin-page-user-row"
                                    style={{ "--delay": `${index * 0.05}s` }}
                                >
                                    <div className="admin-page-table-cell">
                                        <div className="admin-page-user-info">
                                            <div className="admin-page-user-avatar">
                                                <span className="admin-page-avatar-text">{user.name?.charAt(0)?.toUpperCase() || "?"}</span>
                                            </div>
                                            <div className="admin-page-user-details">
                                                <div className="admin-page-user-name">{user.name || "N/A"}</div>
                                                <div className="admin-page-user-id">#{user.id.slice(-8)}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="admin-page-table-cell">
                                        <div className="admin-page-contact-info">
                                            <div className="admin-page-user-email">{user.email || "N/A"}</div>
                                            <div className="admin-page-user-mobile">{user.mobile || "N/A"}</div>
                                        </div>
                                    </div>

                                    <div className="admin-page-table-cell">
                                        <div className="admin-page-user-college">{user.college || "Not specified"}</div>
                                    </div>

                                    <div className="admin-page-table-cell">
                                        <div
                                            className="admin-page-role-badge"
                                            style={{
                                                backgroundColor: `${getRoleColor(user.role)}20`,
                                                color: getRoleColor(user.role),
                                                borderColor: getRoleColor(user.role),
                                            }}
                                        >
                                            <span className="admin-page-role-icon">{getRoleIcon(user.role)}</span>
                                            <span className="admin-page-role-text">{user.role || "User"}</span>
                                        </div>
                                    </div>

                                    <div className="admin-page-table-cell">
                                        <div
                                            className="admin-page-status-badge"
                                            style={{
                                                backgroundColor: `${getStatusColor(user.status)}20`,
                                                color: getStatusColor(user.status),
                                                borderColor: getStatusColor(user.status),
                                            }}
                                        >
                                            <span className="admin-page-status-icon">{getStatusIcon(user.status)}</span>
                                            <span className="admin-page-status-text">{user.status || "Active"}</span>
                                        </div>
                                    </div>

                                    <div className="admin-page-table-cell">
                                        <div className="admin-page-user-joined">
                                            <div className="admin-page-join-date">{user.createdAt?.toString()}</div>
                                            <div className="admin-page-join-time">{user.createdAt?.toString()}</div>
                                        </div>
                                    </div>

                                    <div className="admin-page-table-cell">
                                        <button className="admin-page-view-btn" onClick={() => setSelectedUser(user)}>
                                            👁️ View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="admin-page-modal-overlay" onClick={() => setSelectedUser(null)}>
                    <div className="admin-page-modal-content admin-page-user-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-page-modal-header">
                            <div className="admin-page-modal-title-section">
                                <h2 className="admin-page-modal-title">User Details</h2>
                                <div className="admin-page-user-id-badge">#{selectedUser.id.slice(-8)}</div>
                            </div>
                            <button className="admin-page-modal-close" onClick={() => setSelectedUser(null)}>
                                <span>✕</span>
                            </button>
                        </div>

                        <div className="admin-page-modal-body">
                            <div className="admin-page-user-overview">
                                <div className="admin-page-overview-grid">
                                    <div className="admin-page-overview-card">
                                        <div className="admin-page-overview-icon">👤</div>
                                        <div className="admin-page-overview-content">
                                            <h4>Full Name</h4>
                                            <p>{selectedUser.name || "Not provided"}</p>
                                        </div>
                                    </div>

                                    <div className="admin-page-overview-card">
                                        <div className="admin-page-overview-icon">📧</div>
                                        <div className="admin-page-overview-content">
                                            <h4>Email Address</h4>
                                            <p>{selectedUser.email || "Not provided"}</p>
                                        </div>
                                    </div>

                                    <div className="admin-page-overview-card">
                                        <div className="admin-page-overview-icon">📱</div>
                                        <div className="admin-page-overview-content">
                                            <h4>Mobile Number</h4>
                                            <p>{selectedUser.mobile || "Not provided"}</p>
                                        </div>
                                    </div>

                                    <div className="admin-page-overview-card">
                                        <div className="admin-page-overview-icon">🎓</div>
                                        <div className="admin-page-overview-content">
                                            <h4>College</h4>
                                            <p>{selectedUser.college || "Not specified"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="admin-page-user-sections">
                                <div className="admin-page-section-grid">
                                    {/* Role Management */}
                                    <div className="admin-page-role-section">
                                        <h3 className="admin-page-section-title">
                                            <span className="admin-page-section-icon">👑</span>
                                            Role Management
                                        </h3>
                                        <div className="admin-page-role-content">
                                            <div className="admin-page-current-role">
                                                <span className="admin-page-role-label">Current Role:</span>
                                                <div
                                                    className="admin-page-role-badge"
                                                    style={{
                                                        backgroundColor: `${getRoleColor(selectedUser.role)}20`,
                                                        color: getRoleColor(selectedUser.role),
                                                        borderColor: getRoleColor(selectedUser.role),
                                                    }}
                                                >
                                                    <span className="admin-page-role-icon">{getRoleIcon(selectedUser.role)}</span>
                                                    <span className="admin-page-role-text">{selectedUser.role || "User"}</span>
                                                </div>
                                            </div>

                                            <div className="admin-page-role-actions">
                                                <button
                                                    onClick={() => updateUserRole(selectedUser.id, "user")}
                                                    disabled={updating}
                                                    className="admin-page-role-btn admin-page-user-btn"
                                                >
                                                    👤 User
                                                </button>
                                                <button
                                                    onClick={() => updateUserRole(selectedUser.id, "premium")}
                                                    disabled={updating}
                                                    className="admin-page-role-btn admin-page-premium-btn"
                                                >
                                                    ⭐ Premium
                                                </button>
                                                <button
                                                    onClick={() => updateUserRole(selectedUser.id, "moderator")}
                                                    disabled={updating}
                                                    className="admin-page-role-btn admin-page-moderator-btn"
                                                >
                                                    🛡️ Moderator
                                                </button>
                                                <button
                                                    onClick={() => updateUserRole(selectedUser.id, "admin")}
                                                    disabled={updating}
                                                    className="admin-page-role-btn admin-page-admin-btn"
                                                >
                                                    👑 Admin
                                                </button>
                                            </div>
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
                                                        backgroundColor: `${getStatusColor(selectedUser.status)}20`,
                                                        color: getStatusColor(selectedUser.status),
                                                        borderColor: getStatusColor(selectedUser.status),
                                                    }}
                                                >
                                                    <span className="admin-page-status-icon">{getStatusIcon(selectedUser.status)}</span>
                                                    <span className="admin-page-status-text">{selectedUser.status || "Active"}</span>
                                                </div>
                                            </div>

                                            <div className="admin-page-status-actions">
                                                <button
                                                    onClick={() => updateUserStatus(selectedUser.id, "active")}
                                                    disabled={updating}
                                                    className="admin-page-status-btn admin-page-active-btn"
                                                >
                                                    ✅ Active
                                                </button>
                                                <button
                                                    onClick={() => updateUserStatus(selectedUser.id, "inactive")}
                                                    disabled={updating}
                                                    className="admin-page-status-btn admin-page-inactive-btn"
                                                >
                                                    ⏸️ Inactive
                                                </button>
                                                <button
                                                    onClick={() => updateUserStatus(selectedUser.id, "suspended")}
                                                    disabled={updating}
                                                    className="admin-page-status-btn admin-page-suspended-btn"
                                                >
                                                    🚫 Suspended
                                                </button>
                                                <button
                                                    onClick={() => updateUserStatus(selectedUser.id, "pending")}
                                                    disabled={updating}
                                                    className="admin-page-status-btn admin-page-pending-btn"
                                                >
                                                    ⏳ Pending
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Information */}
                                <div className="admin-page-account-section">
                                    <h3 className="admin-page-section-title">
                                        <span className="admin-page-section-icon">ℹ️</span>
                                        Account Information
                                    </h3>
                                    <div className="admin-page-account-content">
                                        <div className="admin-page-account-grid">
                                            <div className="admin-page-account-item">
                                                <span className="admin-page-account-label">User ID:</span>
                                                <span className="admin-page-account-value">{selectedUser.id}</span>
                                            </div>
                                            <div className="admin-page-account-item">
                                                <span className="admin-page-account-label">Registration Date:</span>
                                                <span className="admin-page-account-value">
                                                    {selectedUser.createdAt?.toString()} at{" "}
                                                    {selectedUser.createdAt?.toString()}
                                                </span>
                                            </div>
                                            {selectedUser.lastLogin && (
                                                <div className="admin-page-account-item">
                                                    <span className="admin-page-account-label">Last Login:</span>
                                                    <span className="admin-page-account-value">
                                                        {selectedUser.lastLogin?.toString()} at{" "}
                                                        {selectedUser.lastLogin?.toString()}
                                                    </span>
                                                </div>
                                            )}
                                            {selectedUser.totalOrders && (
                                                <div className="admin-page-account-item">
                                                    <span className="admin-page-account-label">Total Orders:</span>
                                                    <span className="admin-page-account-value">{selectedUser.totalOrders}</span>
                                                </div>
                                            )}
                                            {selectedUser.totalSpent && (
                                                <div className="admin-page-account-item">
                                                    <span className="admin-page-account-label">Total Spent:</span>
                                                    <span className="admin-page-account-value">₹{selectedUser.totalSpent.toLocaleString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="admin-page-modal-footer">
                            <button
                                className="admin-page-btn admin-page-btn-danger"
                                onClick={() => deleteUser(selectedUser.id)}
                                disabled={updating}
                            >
                                🗑️ Delete User
                            </button>
                            <button className="admin-page-btn admin-page-btn-secondary" onClick={() => setSelectedUser(null)}>
                                Close
                            </button>
                            <button
                                className="admin-page-btn admin-page-btn-primary"
                                onClick={() => {
                                    window.open(`mailto:${selectedUser.email}`, "_blank")
                                }}
                            >
                                📧 Send Email
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AllUsers
