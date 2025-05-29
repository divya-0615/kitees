"use client"

import { useState, useEffect } from "react"
import "./StatsSection.css"

const StatsSection = () => {
    const [counters, setCounters] = useState({
        kits: 0,
        customers: 0,
        projects: 0,
        countries: 0,
    })

    const finalValues = {
        kits: 50,
        customers: 10000,
        projects: 100,
        countries: 25,
    }

    useEffect(() => {
        const duration = 2000 // 2 seconds
        const steps = 60
        const stepDuration = duration / steps

        const intervals = Object.keys(finalValues).map((key) => {
            const increment = finalValues[key] / steps
            let currentValue = 0

            return setInterval(() => {
                currentValue += increment
                if (currentValue >= finalValues[key]) {
                    currentValue = finalValues[key]
                    clearInterval(intervals.find((interval) => interval === this))
                }

                setCounters((prev) => ({
                    ...prev,
                    [key]: Math.floor(currentValue),
                }))
            }, stepDuration)
        })

        return () => intervals.forEach((interval) => clearInterval(interval))
    }, [])

    const stats = [
        {
            number: counters.kits,
            suffix: "+",
            label: "Premium Kits",
            icon: "📦",
            color: "#ff6b6b",
        },
        {
            number: counters.customers,
            suffix: "+",
            label: "Happy Customers",
            icon: "👥",
            color: "#4ecdc4",
        },
        {
            number: counters.projects,
            suffix: "+",
            label: "Project Guides",
            icon: "🚀",
            color: "#45b7d1",
        },
        {
            number: counters.countries,
            suffix: "+",
            label: "Countries Served",
            icon: "🌍",
            color: "#f9ca24",
        },
    ]

    return (
        <section className="stats-section">
            <div className="stats-background">
                <div className="stats-pattern"></div>
            </div>

            <div className="stats-container">
                <div className="stats-header">
                    <h2>Trusted by Makers Worldwide</h2>
                    <p>Join thousands of electronics enthusiasts who have chosen Kitees</p>
                </div>

                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card" style={{ "--stat-color": stat.color }}>
                            <div className="stat-icon">{stat.icon}</div>
                            <div className="stat-number">
                                {stat.number.toLocaleString()}
                                {stat.suffix}
                            </div>
                            <div className="stat-label" style={{color: "white"}}>{stat.label}</div>
                            <div className="stat-glow"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default StatsSection
