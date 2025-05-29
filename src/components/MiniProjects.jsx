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
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
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
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
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
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
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
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
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
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
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
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
      "https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg",
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "#059669"
      case "Intermediate":
        return "#d97706"
      case "Advanced":
        return "#dc2626"
      default:
        return "#6b7280"
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      IoT: "#2563eb",
      Display: "#7c3aed",
      Robotics: "#4338ca",
      "Smart Home": "#db2777",
      Security: "#dc2626",
    }
    return colors[category] || "#6b7280"
  }

  return (
    <>
      <div className="mini-projects">
        <div className="mini-projects-container">
          {/* Projects Header */}
          <div className="projects-header">
            <div className="header-badge">
              <span className="badge-icon">🚀</span>
              <span className="badge-text">Featured Projects</span>
            </div>
            <h2>Mini Projects Collection</h2>
            <p className="mini-projects-subtitle">
              Professional-grade electronics projects with comprehensive guides, quality components, and expert support
            </p>
          </div>

          {/* Projects Grid */}
          <div className="projects-grid">
            {miniProjects.map((project, index) => (
              <div key={project.id} className="project-card" style={{ "--delay": `${index * 0.1}s` }}>
                {/* Project Image */}
                <div className="project-image-container">
                  <img src={project.images[0] || "/placeholder.svg"} alt={project.title} className="project-image" />
                  <div className="category-badge" style={{ backgroundColor: getCategoryColor(project.category) }}>
                    {project.category}
                  </div>
                  <div className="rating-badge">
                    <span className="star">⭐</span>
                    <span>{project.rating}</span>
                  </div>
                </div>

                {/* Project Info */}
                <div className="project-info">
                  <div className="project-header">
                    <h3>{project.title}</h3>
                    <span
                      className={`difficulty-badge difficulty-${project.difficulty.toLowerCase()}`}
                      style={{
                        backgroundColor: `${getDifficultyColor(project.difficulty)}15`,
                        color: getDifficultyColor(project.difficulty),
                        borderColor: getDifficultyColor(project.difficulty),
                      }}
                    >
                      {project.difficulty}
                    </span>
                  </div>

                  <p className="project-description">{project.description}</p>

                  <div className="project-stats">
                    <div className="stat">
                      <span className="stat-icon">⏱️</span>
                      <span>{project.duration}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-icon">📦</span>
                      <span>{project.components.length} components</span>
                    </div>
                  </div>

                  <div className="project-footer">
                    <div className="project-price">
                      <span className="price-currency">$</span>
                      <span className="price-value">{project.price}</span>
                    </div>
                    <button className="view-details-btn" onClick={() => setSelectedProject(project)}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Project Section */}
          <div className="custom-project-section">
            <div className="custom-project-content">
              <div className="custom-project-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
                </svg>
              </div>
              <h3>Custom Project Development</h3>
              <p>
                Need something specific? Our engineering team specializes in creating custom electronics projects
                tailored to your exact requirements with professional documentation and support.
              </p>
              <button className="create-project-btn" onClick={() => setShowCustomProject(true)}>
                Start Custom Project
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Custom Project Modal */}
      {showCustomProject && (
        <CustomProjectModal isOpen={showCustomProject} onClose={() => setShowCustomProject(false)} />
      )}
    </>
  )
}

export default MiniProjects
