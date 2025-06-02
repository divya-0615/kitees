"use client"

import { useState } from "react"
import KitDetailModal from "./KitDetailModel"
import "./AvailableKits.css"

const availableKits = [
  {
    id: 1,
    title: "Arduino Starter Kit Pro",
    price: 89.99,
    originalPrice: 129.99,
    image: "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
    description: "Complete Arduino kit with sensors, LEDs, and components for 15+ projects",
    category: "Microcontroller",
    rating: 4.8,
    reviews: 1247,
    difficulty: "Beginner",
    estimatedTime: "2-4 hours",
    components: [
      { name: "Arduino Uno R3", price: 25.0, quantity: 1 },
      { name: "Breadboard", price: 8.0, quantity: 2 },
      { name: "LED Assortment", price: 12.0, quantity: 1 },
      { name: "Resistor Pack", price: 15.0, quantity: 1 },
      { name: "Jumper Wires", price: 10.0, quantity: 1 },
      { name: "Sensors Kit", price: 19.99, quantity: 1 },
    ],
    fullDescription:
      "This comprehensive Arduino Starter Kit Pro is perfect for beginners and intermediate makers. It includes everything you need to start building amazing electronic projects. The kit comes with a genuine Arduino Uno R3, high-quality components, and detailed project guides. You'll learn programming, circuit design, and electronic prototyping through hands-on experience.",
    features: ["15+ Project Guides", "Video Tutorials", "Online Support", "Premium Components"],
    images: [
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
    ],
  },
  {
    id: 2,
    title: "Raspberry Pi IoT Kit",
    price: 129.99,
    originalPrice: 159.99,
    image: "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
    description: "Build IoT projects with Raspberry Pi 4, sensors, and wireless modules",
    category: "IoT",
    rating: 4.9,
    reviews: 892,
    difficulty: "Intermediate",
    estimatedTime: "3-6 hours",
    components: [
      { name: "Raspberry Pi 4", price: 75.0, quantity: 1 },
      { name: "MicroSD Card 32GB", price: 15.0, quantity: 1 },
      { name: "WiFi Module", price: 12.0, quantity: 1 },
      { name: "Temperature Sensor", price: 8.0, quantity: 2 },
      { name: "Camera Module", price: 19.99, quantity: 1 },
    ],
    fullDescription:
      "Create connected devices and smart home solutions with this comprehensive Raspberry Pi IoT Kit. Perfect for learning Internet of Things development, home automation, and remote monitoring systems.",
    features: ["IoT Cloud Integration", "Mobile App", "Real-time Monitoring", "Smart Home Ready"],
    images: [
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
    ],
  },
  {
    id: 3,
    title: "Electronics Lab Kit",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
    description: "Professional electronics lab with oscilloscope, multimeter, and components",
    category: "Professional",
    rating: 4.7,
    reviews: 456,
    difficulty: "Advanced",
    estimatedTime: "1-2 hours setup",
    components: [
      { name: "Digital Oscilloscope", price: 120.0, quantity: 1 },
      { name: "Digital Multimeter", price: 45.0, quantity: 1 },
      { name: "Power Supply Module", price: 25.0, quantity: 1 },
      { name: "Component Assortment", price: 9.99, quantity: 1 },
    ],
    fullDescription:
      "Set up your own electronics laboratory with this professional-grade kit. Includes precision instruments and a wide variety of components for advanced circuit analysis and design.",
    features: ["Professional Tools", "Calibration Certificate", "Lab Manual", "Lifetime Support"],
    images: [
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
    ],
  },
  {
    id: 4,
    title: "Robotics Starter Kit",
    price: 159.99,
    originalPrice: 199.99,
    image: "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
    description: "Build and program robots with motors, sensors, and control boards",
    category: "Robotics",
    rating: 4.8,
    reviews: 723,
    difficulty: "Intermediate",
    estimatedTime: "4-8 hours",
    components: [
      { name: "Robot Chassis", price: 35.0, quantity: 1 },
      { name: "Servo Motors", price: 40.0, quantity: 4 },
      { name: "Ultrasonic Sensor", price: 15.0, quantity: 2 },
      { name: "Motor Driver", price: 20.0, quantity: 1 },
      { name: "Control Board", price: 49.99, quantity: 1 },
    ],
    fullDescription:
      "Enter the world of robotics with this comprehensive starter kit. Build autonomous robots, learn programming, and explore artificial intelligence concepts through hands-on projects.",
    features: ["AI Programming", "Autonomous Navigation", "Remote Control", "Expandable Design"],
    images: [
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
    ],
  },
]

const AvailableKits = () => {
  const [selectedKit, setSelectedKit] = useState(null)

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "#10b981"
      case "Intermediate":
        return "#f59e0b"
      case "Advanced":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  return (
    <>
      <div className="available-kits">
        {availableKits.map((kit, index) => (
          <div key={kit.id} className="kit-card-wrapper" style={{ "--delay": `${index * 0.1}s` }}>
            <div className="kit-card">
              <div className="kit-card-header">
                <div className="kit-image-container">
                  <img src={kit.image || "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg"} alt={kit.title} className="kit-image" />

                  {/* Overlays */}
                  <div className="kit-image-overlay"></div>

                  {/* Badges */}
                  <div className="kit-category-badge">{kit.category}</div>

                  <div className="kit-difficulty-badge" style={{ backgroundColor: getDifficultyColor(kit.difficulty) }}>
                    {kit.difficulty}
                  </div>

                  {/* Discount Badge */}
                  {kit.originalPrice && (
                    <div className="kit-discount-badge">
                      {Math.round(((kit.originalPrice - kit.price) / kit.originalPrice) * 100)}% OFF
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="kit-quick-stats">
                    <div className="kit-rating-badge">
                      <span className="star">⭐</span>
                      {kit.rating}
                    </div>
                    <div className="kit-reviews-badge">
                      <span className="users-icon">👥</span>
                      {kit.reviews}
                    </div>
                  </div>
                </div>
              </div>

              <div className="kit-card-content">
                <div className="kit-content-inner">
                  <div className="kit-title-section">
                    <h3 className="kit-title">{kit.title}</h3>
                    <p className="kit-description">{kit.description}</p>
                  </div>

                  <div className="kit-stats">
                    <div className="kit-rating">
                      <span className="star">⭐</span>
                      <span className="rating-value">{kit.rating}</span>
                      <span className="rating-count">({kit.reviews})</span>
                    </div>
                    <div className="kit-time">
                      <span className="clock-icon">🕐</span>
                      {kit.estimatedTime}
                    </div>
                  </div>

                  <div className="kit-pricing">
                    <div className="kit-price-section">
                      <div className="kit-price">₹{kit.price}</div>
                      {kit.originalPrice && <div className="kit-original-price">₹{kit.originalPrice}</div>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="kit-card-footer">
                <button className="kit-view-btn" onClick={() => setSelectedKit(kit)}>
                  <span className="btn-icon">👁️</span>
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedKit && <KitDetailModal kit={selectedKit} isOpen={!!selectedKit} onClose={() => setSelectedKit(null)} />}
    </>
  )
}

export default AvailableKits
