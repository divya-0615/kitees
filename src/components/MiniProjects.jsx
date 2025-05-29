"use client"

import { useState } from "react"
import { useCart } from "../contexts/CartContext"
import ProjectDetailModal from "./ProjectDetailModal"
import CustomProjectModal from "./CustomProjectModal"
import "./MiniProjects.css"

const miniProjects = [
  {
    id: 1,
    title: "Smart Home Temperature Monitor",
    price: 45.99,
    images: [
      "/placeholder.svg?height=400&width=500",
      "/placeholder.svg?height=400&width=500",
      "/placeholder.svg?height=400&width=500",
      "/placeholder.svg?height=400&width=500",
    ],
    description: "Build a WiFi-enabled temperature monitoring system with real-time alerts and data logging.",
    difficulty: "Beginner",
    duration: "2-3 hours",
    rating: 4.8,
    reviews: 1247,
    category: "IoT",
    components: [
      { name: "ESP32 Development Board", price: 15.0, quantity: 1 },
      { name: "DHT22 Temperature Sensor", price: 8.0, quantity: 1 },
      { name: 'OLED Display 0.96"', price: 12.0, quantity: 1 },
      { name: "Breadboard", price: 5.0, quantity: 1 },
      { name: "Jumper Wires", price: 5.99, quantity: 1 },
    ],
    fullDescription:
      "Create a smart temperature monitoring system that connects to your WiFi network and sends real-time temperature data to your smartphone. This project teaches you about IoT connectivity, sensor interfacing, and data visualization. The system can send alerts when temperature thresholds are exceeded and log historical data for analysis. Perfect for monitoring room temperature, greenhouse conditions, or server rooms.",
    features: [
      "WiFi connectivity for remote monitoring",
      "Real-time temperature and humidity display",
      "Mobile app integration with push notifications",
      "Historical data logging and analysis",
      "Customizable alert thresholds",
      "Low power consumption design",
    ],
    learningOutcomes: [
      "IoT device programming",
      "Sensor data acquisition",
      "WiFi communication protocols",
      "Mobile app integration",
      "Data visualization techniques",
    ],
  },
  {
    id: 2,
    title: "LED Matrix Display Clock",
    price: 38.99,
    images: [
      "/placeholder.svg?height=400&width=500",
      "/placeholder.svg?height=400&width=500",
      "/placeholder.svg?height=400&width=500",
    ],
    description: "Create a stunning LED matrix clock with customizable animations and weather display.",
    difficulty: "Intermediate",
    duration: "3-4 hours",
    rating: 4.6,
    reviews: 892,
    category: "Display",
    components: [
      { name: "Arduino Nano", price: 12.0, quantity: 1 },
      { name: "8x8 LED Matrix", price: 15.0, quantity: 1 },
      { name: "Real-Time Clock Module", price: 6.0, quantity: 1 },
      { name: "Push Buttons", price: 3.0, quantity: 3 },
      { name: "Enclosure Kit", price: 2.99, quantity: 1 },
    ],
    fullDescription:
      "Build an eye-catching LED matrix clock that displays time with smooth scrolling animations. The clock features multiple display modes, customizable brightness, and can show weather information when connected to WiFi. Learn about matrix displays, real-time clock modules, and creating smooth animations in embedded systems.",
    features: [
      "Smooth scrolling time display",
      "Multiple animation modes",
      "Brightness control",
      "Weather information display",
      "Custom message scrolling",
      "Alarm functionality",
    ],
    learningOutcomes: [
      "LED matrix programming",
      "Real-time clock integration",
      "Animation algorithms",
      "User interface design",
      "Power management",
    ],
  },
  {
    id: 3,
    title: "Bluetooth Robot Car",
    price: 67.99,
    images: [
      "/placeholder.svg?height=400&width=500",
      "/placeholder.svg?height=400&width=500",
      "/placeholder.svg?height=400&width=500",
      "/placeholder.svg?height=400&width=500",
    ],
    description: "Build and program a smartphone-controlled robot car with obstacle avoidance.",
    difficulty: "Intermediate",
    duration: "4-5 hours",
    rating: 4.9,
    reviews: 1456,
    category: "Robotics",
    components: [
      { name: "Arduino Uno", price: 20.0, quantity: 1 },
      { name: "Robot Car Chassis", price: 25.0, quantity: 1 },
      { name: "Bluetooth Module HC-05", price: 8.0, quantity: 1 },
      { name: "Ultrasonic Sensor", price: 6.0, quantity: 1 },
      { name: "Motor Driver L298N", price: 8.99, quantity: 1 },
    ],
    fullDescription:
      "Construct a versatile robot car that can be controlled via smartphone and features autonomous obstacle avoidance. This project combines mechanical assembly, electronics, and programming to create an intelligent mobile robot. Learn about motor control, sensor integration, wireless communication, and autonomous navigation algorithms.",
    features: [
      "Smartphone app control",
      "Obstacle avoidance system",
      "Speed and direction control",
      "Autonomous navigation mode",
      "Real-time sensor feedback",
      "Camera integration ready",
    ],
    learningOutcomes: [
      "Robotics programming",
      "Motor control systems",
      "Bluetooth communication",
      "Sensor integration",
      "Mobile app development",
    ],
  },
  {
    id: 4,
    title: "Voice-Controlled LED Strip",
    price: 52.99,
    images: [
      "/placeholder.svg?height=400&width=500",
      "/placeholder.svg?height=400&width=500",
      "/placeholder.svg?height=400&width=500",
    ],
    description: "Create ambient lighting that responds to voice commands and music beats.",
    difficulty: "Advanced",
    duration: "3-4 hours",
    rating: 4.7,
    reviews: 723,
    category: "Smart Home",
    components: [
      { name: "ESP32 Board", price: 18.0, quantity: 1 },
      { name: "WS2812B LED Strip 1m", price: 20.0, quantity: 1 },
      { name: "Microphone Module", price: 8.0, quantity: 1 },
      { name: "Power Supply 5V", price: 6.99, quantity: 1 },
    ],
    fullDescription:
      "Design an intelligent LED lighting system that responds to voice commands and reacts to music. The system can change colors, brightness, and patterns based on voice input or audio analysis. This advanced project teaches you about audio processing, voice recognition, and creating dynamic lighting effects.",
    features: [
      "Voice command recognition",
      "Music-reactive lighting",
      "Multiple color patterns",
      "Smartphone app integration",
      "Customizable voice commands",
      "Sound visualization",
    ],
    learningOutcomes: [
      "Voice recognition systems",
      "Audio signal processing",
      "LED strip programming",
      "Real-time audio analysis",
      "Smart home integration",
    ],
  },
  {
    id: 5,
    title: "Arduino Weather Station",
    price: 42.99,
    images: [
      "/placeholder.svg?height=400&width=500",
      "/placeholder.svg?height=400&width=500",
      "/placeholder.svg?height=400&width=500",
    ],
    description: "Build a comprehensive weather monitoring station with multiple sensors and data logging.",
    difficulty: "Beginner",
    duration: "3-4 hours",
    rating: 4.5,
    reviews: 956,
    category: "IoT",
    components: [
      { name: "Arduino Uno R3", price: 20.0, quantity: 1 },
      { name: "BME280 Sensor", price: 12.0, quantity: 1 },
      { name: "LCD Display 16x2", price: 8.0, quantity: 1 },
      { name: "SD Card Module", price: 2.99, quantity: 1 },
    ],
    fullDescription:
      "Create a complete weather monitoring station that measures temperature, humidity, pressure, and more. Features data logging to SD card and real-time display on LCD screen.",
    features: [
      "Multiple weather parameters",
      "Data logging capability",
      "Real-time LCD display",
      "Historical data analysis",
      "Expandable sensor network",
    ],
    learningOutcomes: ["Sensor interfacing", "Data logging techniques", "LCD programming", "Weather data analysis"],
  },
  {
    id: 6,
    title: "Smart Security System",
    price: 89.99,
    images: [
      "/placeholder.svg?height=400&width=500",
      "/placeholder.svg?height=400&width=500",
      "/placeholder.svg?height=400&width=500",
      "/placeholder.svg?height=400&width=500",
    ],
    description: "Build an advanced security system with motion detection, camera, and smartphone alerts.",
    difficulty: "Advanced",
    duration: "5-6 hours",
    rating: 4.9,
    reviews: 634,
    category: "Security",
    components: [
      { name: "Raspberry Pi 4", price: 45.0, quantity: 1 },
      { name: "PIR Motion Sensor", price: 8.0, quantity: 2 },
      { name: "Camera Module", price: 25.0, quantity: 1 },
      { name: "Buzzer Module", price: 3.0, quantity: 1 },
      { name: "LED Strip", price: 8.99, quantity: 1 },
    ],
    fullDescription:
      "Develop a comprehensive security system with motion detection, live camera feed, and instant smartphone notifications. Perfect for home security applications.",
    features: [
      "Motion detection alerts",
      "Live camera streaming",
      "Smartphone notifications",
      "Night vision capability",
      "Remote monitoring",
    ],
    learningOutcomes: [
      "Computer vision basics",
      "Network programming",
      "Security system design",
      "Mobile app integration",
    ],
  },
]

const MiniProjects = () => {
  const { addToCart } = useCart()
  const [selectedProject, setSelectedProject] = useState(null)
  const [showCustomProject, setShowCustomProject] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState({})

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

  const getCategoryColor = (category) => {
    const colors = {
      IoT: "#3b82f6",
      Display: "#8b5cf6",
      Robotics: "#4f46e5",
      "Smart Home": "#ec4899",
      Security: "#ef4444",
    }
    return colors[category] || "#6b7280"
  }

  const handleImageChange = (projectId, imageIndex) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [projectId]: imageIndex,
    }))
  }

  const addProjectToCart = (project) => {
    addToCart({
      id: `project-${project.id}`,
      name: project.title,
      price: project.price,
      quantity: 1,
      image: project.images[0],
      type: "project",
      category: project.category,
      components: project.components,
    })
  }

  return (
    <>
      <div className="mini-projects">
        <div className="mini-projects-container">
          {/* Projects Header */}
          <div className="projects-header">
            <div className="header-icon bounce">🚀</div>
            <h2>Mini Projects</h2>
            <p className="mini-projects-subtitle">
              Ready-to-build projects with step-by-step guides and all components included
            </p>
          </div>

          {/* Projects Grid */}
          <div className="projects-grid">
            {miniProjects.map((project, index) => (
              <div
                key={project.id}
                className="project-card"
                style={{ "--delay": `${index * 0.1}s` }}
                onClick={() => setSelectedProject(project)}
              >
                {/* Project Images with Carousel */}
                <div className="project-images">
                  {project.images.map((image, imageIndex) => (
                    <img
                      key={imageIndex}
                      src={image || "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg"}
                      alt={`${project.title} - Image ${imageIndex + 1}`}
                      className={`project-image ${(currentImageIndex[project.id] || 0) === imageIndex ? "active" : ""}`}
                    />
                  ))}

                  {/* Carousel Dots */}
                  {project.images.length > 1 && (
                    <div className="carousel-dots">
                      {project.images.map((_, imageIndex) => (
                        <div
                          key={imageIndex}
                          className={`carousel-dot ${(currentImageIndex[project.id] || 0) === imageIndex ? "active" : ""
                            }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleImageChange(project.id, imageIndex)
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="project-info">
                  <div className="project-header">
                    <h3>{project.title}</h3>
                    <div className="project-meta">
                      <span
                        className={`project-difficulty difficulty-${project.difficulty.toLowerCase()}`}
                        style={{
                          backgroundColor: `${getDifficultyColor(project.difficulty)}20`,
                          color: getDifficultyColor(project.difficulty),
                        }}
                      >
                        {project.difficulty}
                      </span>
                      <span
                        className="project-category"
                        style={{
                          backgroundColor: `${getCategoryColor(project.category)}20`,
                          color: getCategoryColor(project.category),
                        }}
                      >
                        {project.category}
                      </span>
                    </div>
                  </div>

                  <p className="project-description">{project.description}</p>

                  <div className="project-stats">
                    <div className="stat">
                      <span className="stat-icon">⭐</span>
                      <span>
                        {project.rating} ({project.reviews} reviews)
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-icon">⏱️</span>
                      <span>{project.duration}</span>
                    </div>
                  </div>

                  <div className="project-components">
                    <h4>Included Components:</h4>
                    <div className="components-list">
                      {project.components.slice(0, 3).map((component, i) => (
                        <span key={i} className="component-tag">
                          {component.name}
                        </span>
                      ))}
                      {project.components.length > 3 && (
                        <span className="component-tag more">+{project.components.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <div className="project-footer">
                    <div className="project-price">${project.price}</div>
                    <div className="project-actions">
                      <button
                        className="view-details-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedProject(project)
                        }}
                      >
                        View Details
                      </button>
                      <button
                        className="add-to-cart-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          addProjectToCart(project)
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Project Section */}
          <div className="custom-project-section">
            <div className="custom-project-icon">💡</div>
            <h3>Have Your Own Project Idea?</h3>
            <p>
              Can't find the perfect project? Create a custom project request and our experts will help you build
              exactly what you need with the right components and guidance.
            </p>
            <button className="create-project-btn" onClick={() => setShowCustomProject(true)}>
              <span className="btn-icon">✨</span>
              Create Custom Project
            </button>
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onAddToCart={addProjectToCart}
        />
      )}

      {/* Custom Project Modal */}
      {showCustomProject && <CustomProjectModal onClose={() => setShowCustomProject(false)} />}
    </>
  )
}

export default MiniProjects
