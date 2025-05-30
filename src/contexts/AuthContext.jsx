"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "../firebase"

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)

    // Sign up function
    const signup = async (email, password, additionalData) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            // Store additional user data in Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: email,
                name: additionalData.name,
                mobile: additionalData.mobile,
                college: additionalData.college,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
            })

            return userCredential
        } catch (error) {
            throw error
        }
    }

    // Login function
    const login = async (email, password) => {
        try {
            // Check for admin credentials
            if (email === "admin@kitees.com" && password === "admin123") {
                // Set admin flag in localStorage
                localStorage.setItem("isAdmin", "true")
                // Create a mock admin user
                setCurrentUser({ email: "admin@kitees.com", uid: "admin" })
                setUserData({ name: "Admin", email: "admin@kitees.com", role: "admin" })
                return { user: { email: "admin@kitees.com", uid: "admin" } }
            }

            const userCredential = await signInWithEmailAndPassword(auth, email, password)

            // Update last login time
            await setDoc(
                doc(db, "users", userCredential.user.uid),
                {
                    lastLogin: new Date().toISOString(),
                },
                { merge: true },
            )

            return userCredential
        } catch (error) {
            throw error
        }
    }

    // Logout function
    const logout = () => {
        localStorage.removeItem("isAdmin")
        return signOut(auth)
    }

    // Get user data from Firestore
    const getUserData = async (uid) => {
        try {
            const docRef = doc(db, "users", uid)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                return docSnap.data()
            } else {
                console.log("No such document!")
                return null
            }
        } catch (error) {
            console.error("Error getting user data:", error)
            return null
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            // Check if admin is logged in
            const isAdmin = localStorage.getItem("isAdmin")
            if (isAdmin && !user) {
                setCurrentUser({ email: "admin@kitees.com", uid: "admin" })
                setUserData({ name: "Admin", email: "admin@kitees.com", role: "admin" })
                setLoading(false)
                return
            }

            setCurrentUser(user)

            if (user) {
                // Fetch user data from Firestore
                const data = await getUserData(user.uid)
                setUserData(data)
            } else {
                setUserData(null)
            }

            setLoading(false)
        })

        return unsubscribe
    }, [])

    const value = {
        currentUser,
        userData,
        signup,
        login,
        logout,
        getUserData,
    }

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
