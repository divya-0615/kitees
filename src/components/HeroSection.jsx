import "./HeroSection.css"

const HeroSection = () => {
    return (
        <section className="hero-section">
            <div className="hero-background">
                <div className="floating-elements">
                    <div className="floating-element element-1"></div>
                    <div className="floating-element element-2"></div>
                    <div className="floating-element element-3"></div>
                    <div className="floating-element element-4"></div>
                    <div className="floating-element element-5"></div>
                </div>
            </div>

            <div className="hero-container">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Build Amazing Electronics Projects with
                        <span className="gradient-text"> Kitees</span>
                    </h1>
                    <p className="hero-subtitle">
                        Discover premium electronics kits, components, and guided projects. From beginner-friendly circuits to
                        advanced robotics - start your journey today!
                    </p>

                    <div className="hero-buttons">
                        <button className="btn-primary">
                            Explore Kits
                            <span className="btn-icon">→</span>
                        </button>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="circuit-board">
                        <div className="component component-1"></div>
                        <div className="component component-2"></div>
                        <div className="component component-3"></div>
                        <div className="component component-4"></div>
                        <div className="wire wire-1"></div>
                        <div className="wire wire-2"></div>
                        <div className="wire wire-3"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
