import "./FeaturesSection.css"

const FeaturesSection = () => {
    const features = [
        {
            icon: "🔧",
            title: "Premium Quality Components",
            description: "Hand-picked, tested components from trusted manufacturers worldwide.",
            color: "#ff6b6b",
        },
        {
            icon: "📚",
            title: "Detailed Guides",
            description: "Step-by-step tutorials with videos, schematics, and code examples.",
            color: "#4ecdc4",
        },
        {
            icon: "🚀",
            title: "Fast Shipping",
            description: "Quick delivery worldwide with tracking and secure packaging.",
            color: "#45b7d1",
        },
        {
            icon: "💡",
            title: "Innovation Support",
            description: "24/7 technical support and active community forums.",
            color: "#f9ca24",
        },
        {
            icon: "🎯",
            title: "Skill Building",
            description: "Progressive difficulty levels from beginner to expert.",
            color: "#6c5ce7",
        },
        {
            icon: "🌟",
            title: "Lifetime Access",
            description: "Unlimited access to all resources and future updates.",
            color: "#fd79a8",
        },
    ]

    return (
        <section className="features-section">
            <div className="features-container">
                <div className="features-header">
                    <h2>Why Choose Kitees?</h2>
                    <p>Everything you need to succeed in electronics and robotics</p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card" style={{ "--accent-color": feature.color }}>
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                            <div className="feature-hover-effect"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection
