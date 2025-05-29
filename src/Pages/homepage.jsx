import { useState } from "react"
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
import "./HomePage.css"

const HomePage = () => {
    const [activeTab, setActiveTab] = useState("available-kits")

    const handleTabChange = (tab) => {
        setActiveTab(tab)
    }

    return (
        <div className="homepage">
            <Header />
            <HeroSection />
            <StatsSection />
            <FeaturesSection />

            <main className="main-content">
                <div className="container">
                    <div className="section-header fade-in" textAlign="center">
                        <h2 className="section-title" style={{justifyContent: "center"}}>Explore Our Electronics Universe</h2>
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
            <Footer />
        </div>
    )
}

export default HomePage