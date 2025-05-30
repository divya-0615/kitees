"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([])

    // Load cart from localStorage on component mount
    useEffect(() => {
        const savedCart = localStorage.getItem("kitees-cart")
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart)
                setItems(parsedCart)
            } catch (error) {
                console.error("Error loading cart from localStorage:", error)
                localStorage.removeItem("kitees-cart")
            }
        }
    }, [])

    // Save cart to localStorage whenever items change
    useEffect(() => {
        localStorage.setItem("kitees-cart", JSON.stringify(items))
    }, [items])

    const addToCart = (newItem) => {
        setItems((currentItems) => {
            // Check if it's a custom component
            if (newItem.type === "custom-component") {
                // Find existing custom kit or create new one
                const existingCustomKit = currentItems.find((item) => item.type === "custom-kit")

                if (existingCustomKit) {
                    // Add component to existing custom kit
                    return currentItems.map((item) =>
                        item.type === "custom-kit"
                            ? {
                                ...item,
                                components: [...item.components, newItem],
                                price: item.price + newItem.price,
                                quantity: 1,
                            }
                            : item,
                    )
                } else {
                    // Create new custom kit
                    const customKit = {
                        id: `custom-kit-${Date.now()}`,
                        name: "Custom Electronics Kit",
                        price: newItem.price,
                        quantity: 1,
                        image: "/placeholder.svg?height=100&width=100",
                        type: "custom-kit",
                        components: [newItem],
                    }
                    return [...currentItems, customKit]
                }
            } else {
                // Handle regular items
                const existingItem = currentItems.find((item) => item.id === newItem.id)

                if (existingItem) {
                    return currentItems.map((item) =>
                        item.id === newItem.id ? { ...item, quantity: item.quantity + (newItem.quantity || 1) } : item,
                    )
                }

                return [...currentItems, { ...newItem, quantity: newItem.quantity || 1 }]
            }
        })
    }

    const removeFromCart = (id) => {
        setItems((currentItems) => currentItems.filter((item) => item.id !== id))
    }

    const removeComponentFromCustomKit = (componentId) => {
        setItems((currentItems) => {
            return currentItems
                .map((item) => {
                    if (item.type === "custom-kit") {
                        const updatedComponents = item.components.filter((comp) => comp.id !== componentId)

                        if (updatedComponents.length === 0) {
                            return null // Will be filtered out
                        }

                        const newPrice = updatedComponents.reduce((sum, comp) => sum + comp.price, 0)

                        return {
                            ...item,
                            components: updatedComponents,
                            price: newPrice,
                        }
                    }
                    return item
                })
                .filter(Boolean)
        })
    }

    const updateQuantity = (id, quantity) => {
        if (quantity <= 0) {
            removeFromCart(id)
            return
        }

        setItems((currentItems) => currentItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }

    const clearCart = () => {
        setItems([])
        localStorage.removeItem("kitees-cart")
    }

    const getTotalPrice = () => {
        return items.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0)
    }

    const getTotalItems = () => {
        return items.reduce((total, item) => total + (item.quantity || 1), 0)
    }

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                removeComponentFromCustomKit,
                updateQuantity,
                clearCart,
                getTotalPrice,
                getTotalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}
