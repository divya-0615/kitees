import { useEffect, useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import HeroSection from "../components/HeroSection"
import StatsSection from "../components/StatsSection"
import FeaturesSection from "../components/FeaturesSection"
import AvailableKits from "../components/AvailableKits"
import CustomizableKits from "../components/CustomizableKits"
import MiniProjects from "../components/MiniProjects"
import TestimonialsSection from "../components/TestimonialsSection"
import NewsletterSection from "../components/NewsletterSection"
import "./Home.css"

import { useAuth } from "../contexts/AuthContext"

const HomePage = () => {
    const [activeTab, setActiveTab] = useState("available-kits")

    const handleTabChange = (tab) => {
        setActiveTab(tab)
    }

    const { currentUser, userData } = useAuth()

    useEffect(() => {
        if (userData.email === "kitees@gmail.com") {
            // Redirect to admin panel if the user is an admin
            window.location.href = "/admin"
        }
    }, [])

    return (
        <div className="homepage">
            <Header />
            <HeroSection />
            <FeaturesSection />
            <main className="main-content" id="explore-kits">
                <div className="container">
                    <div className="section-header fade-in" textAlign="center">
                        <h2 className="section-title" style={{ justifyContent: "center" }}>Explore Our Electronics Universe</h2>
                        <p className="section-description">
                            From ready-made kits to custom components and exciting mini-projects, discover everything you need to
                            bring your electronic innovations to life with cutting-edge technology and premium quality.
                        </p>
                    </div>

                    <div className="tabs-container fade-in">
                        <div className="tabs-list">
                            <button
                                className={`tab-trigger ${activeTab === "available-kits" ? "active" : ""}`}
                                onClick={() => handleTabChange("available-kits")}
                            >
                                🎯 Available Kits
                            </button>
                            <button
                                className={`tab-trigger ${activeTab === "customizable-kits" ? "active" : ""}`}
                                onClick={() => handleTabChange("customizable-kits")}
                            >
                                🛠️ Custom Builder
                            </button>
                            <button
                                className={`tab-trigger ${activeTab === "mini-projects" ? "active" : ""}`}
                                onClick={() => handleTabChange("mini-projects")}
                            >
                                🚀 Mini Projects
                            </button>
                        </div>

                        <div className="tab-content">
                            {activeTab === "available-kits" && (
                                <div className="tab-panel slide-in-left">
                                    <AvailableKits />
                                </div>
                            )}

                            {activeTab === "customizable-kits" && (
                                <div className="tab-panel slide-in-right">
                                    <CustomizableKits />
                                </div>
                            )}

                            {activeTab === "mini-projects" && (
                                <div className="tab-panel slide-in-up">
                                    <MiniProjects />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <TestimonialsSection />
            <NewsletterSection />
            <StatsSection />
            <Footer />
        </div>
    )
}

export default HomePage