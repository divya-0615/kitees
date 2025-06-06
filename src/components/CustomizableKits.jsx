"use client"

import { useState, useRef, useEffect } from "react"
import { useCart } from "../contexts/CartContext"
import ComponentCard from "./ComponentCard"
import FloatingBasket from "./FloatingBasket"
import "./CustomizableKits.css"
import toast from "react-hot-toast"

const components = [
    {
        id: 1,
        title: "Arduino Uno R3",
        price: 25.0,
        image: "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
        description:
            "The heart of your projects. A microcontroller board based on the ATmega328P with 14 digital I/O pins, 6 analog inputs, and USB connection.",
        category: "Microcontroller",
        rating: 4.9,
        inStock: true,
        specifications: ["ATmega328P Processor", "14 Digital I/O Pins", "6 Analog Inputs", "USB Connection"],
    },
    {
        id: 2,
        title: "Breadboard 830 Points",
        price: 8.0,
        image: "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
        description:
            "Solderless prototyping board perfect for building and testing circuits. Features 830 tie points and power rails.",
        category: "Prototyping",
        rating: 4.7,
        inStock: true,
        specifications: ["830 Tie Points", "Power Rails", "Solderless Design", "Reusable"],
    },
    {
        id: 3,
        title: "LED Assortment Pack",
        price: 12.0,
        image: "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
        description: "50-piece LED pack with various colors (red, green, blue, yellow, white) in 3mm and 5mm sizes.",
        category: "Display",
        rating: 4.8,
        inStock: true,
        specifications: ["50 LEDs Total", "5 Colors", "3mm & 5mm Sizes", "High Brightness"],
    },
    {
        id: 4,
        title: "Resistor Kit 600pcs",
        price: 15.0,
        image: "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
        description: "Complete resistor assortment from 10Ω to 1MΩ. Includes carbon film resistors with 5% tolerance.",
        category: "Passive",
        rating: 4.6,
        inStock: true,
        specifications: ["600 Resistors", "10Ω to 1MΩ Range", "5% Tolerance", "Carbon Film"],
    },
    {
        id: 5,
        title: "Ultrasonic Sensor HC-SR04",
        price: 8.5,
        image: "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
        description: "Distance measurement sensor with 2cm-400cm range. Perfect for robotics and automation projects.",
        category: "Sensor",
        rating: 4.8,
        inStock: true,
        specifications: ["2cm-400cm Range", "Ultrasonic Technology", "5V Operation", "High Accuracy"],
    },
    {
        id: 6,
        title: "Servo Motor SG90",
        price: 12.0,
        image: "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
        description: "Micro servo motor with 180° rotation. Ideal for robotics, RC projects, and precise positioning.",
        category: "Motor",
        rating: 4.7,
        inStock: true,
        specifications: ["180° Rotation", "Micro Size", "High Torque", "Precise Control"],
    },
    {
        id: 7,
        title: "Jumper Wire Set",
        price: 10.0,
        image: "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
        description: "120-piece jumper wire set with male-to-male, male-to-female, and female-to-female connections.",
        category: "Connectivity",
        rating: 4.5,
        inStock: true,
        specifications: ["120 Wires", "3 Connection Types", "Multiple Lengths", "Flexible Design"],
    },
    {
        id: 8,
        title: "Capacitor Assortment",
        price: 18.0,
        image: "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
        description: "Mixed capacitor kit including ceramic, electrolytic, and tantalum capacitors from 1pF to 1000µF.",
        category: "Passive",
        rating: 4.6,
        inStock: true,
        specifications: ["Multiple Types", "1pF to 1000µF", "High Quality", "Assorted Values"],
    },
]

const CustomizableKits = () => {
    const { addToCart } = useCart()
    const [animatingComponent, setAnimatingComponent] = useState(null)
    const [basketItems, setBasketItems] = useState([])
    const [showNotification, setShowNotification] = useState(false)
    const basketRef = useRef(null)

    const handleAddToKit = (component) => {
        setAnimatingComponent(component.id)
        setBasketItems((prev) => [...prev, component.id])

        // Add to cart as custom kit component
        addToCart({
            id: `custom-component-${component.id}-${Date.now()}`,
            name: component.title,
            price: component.price,
            quantity: 1,
            image: component.image,
            type: "custom-component",
            category: component.category,
        })

        toast.success(`${component.title} added to your custom kit!`, {
            duration: 3500,
            position: "bottom-right",
            style: {
                background: "linear-gradient(135deg, #34d399 0%, #10b981 50%,rgb(17, 175, 125) 100%)",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: "600",
                padding: "20px 26px",
                borderRadius: "16px",
                marginBottom: "16px",
                boxShadow: "0 12px 30px rgba(52, 211, 153, 0.5), 0 6px 16px rgba(0, 0, 0, 0.2)",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(12px)",
                maxWidth: "420px",
            },
            icon: "🌟",
            iconTheme: {
                primary: "#ffffff",
                secondary: "transparent",
            },
        })

        setShowNotification(true)

        // Reset animation after delay
        setTimeout(() => {
            setAnimatingComponent(null)
            setShowNotification(false)
        }, 1500)
    }

    return (
        <div className="customizable-kits">
            {/* Kit Builder Header */}
            <div className="customizable-kits-kit-builder-header">
                <div className="customizable-kits-header-content">
                    <div className="customizable-kits-header-text">
                        <div className="customizable-kits-header-icon-wrapper">
                            <div className="customizable-kits-header-icon bounce">🛠️</div>
                            <div className="customizable-kits-header-title-wrapper">
                                <h3 className="customizable-kits-header-title">Custom Kit Builder</h3>
                                <p className="customizable-kits-header-subtitle">Build your perfect electronics kit by selecting individual components</p>
                            </div>
                        </div>
                        {/* <p className="customizable-kits-header-description">
                            Choose from our premium collection of electronics components and watch them magically float into your
                            custom kit basket! Create exactly what you need for your next project.
                        </p> */}
                    </div>
                </div>
            </div>

            {/* Floating Basket */}
            <FloatingBasket ref={basketRef} basketItems={basketItems} animatingComponent={animatingComponent} />

            {/* Components Grid */}
            <div className="customizable-kits-components-grid">
                {components.map((component, index) => (
                    <ComponentCard
                        key={component.id}
                        component={component}
                        index={index}
                        animatingComponent={animatingComponent}
                        onAddToKit={handleAddToKit}
                        basketRef={basketRef}
                    />
                ))}
            </div>
        </div>
    )
}

export default CustomizableKits
