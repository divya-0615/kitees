"use client"

import { useState, useEffect } from "react"
import "./TestimonialsSection.css"

const TestimonialsSection = () => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0)

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Electronics Student",
            image: "/placeholder.svg?height=80&width=80",
            rating: 5,
            text: "Kitees transformed my understanding of electronics. The step-by-step guides are incredible, and the components are top quality. I've built 5 projects already!",
        },
        {
            name: "Mike Chen",
            role: "Robotics Engineer",
            image: "/placeholder.svg?height=80&width=80",
            rating: 5,
            text: "As a professional engineer, I appreciate the quality and precision of Kitees products. Perfect for prototyping and teaching my team new concepts.",
        },
        {
            name: "Emma Davis",
            role: "Maker & Educator",
            image: "/placeholder.svg?height=80&width=80",
            rating: 5,
            text: "I use Kitees in my classroom to teach kids about electronics. The projects are engaging, safe, and educational. My students love them!",
        },
        {
            name: "Alex Rodriguez",
            role: "Hobbyist",
            image: "/placeholder.svg?height=80&width=80",
            rating: 5,
            text: "Started as a complete beginner and now I'm building complex IoT projects. Kitees made the learning curve smooth and enjoyable.",
        },
        {
            name: "Dr. Lisa Park",
            role: "University Professor",
            image: "/placeholder.svg?height=80&width=80",
            rating: 5,
            text: "Excellent educational resource. I recommend Kitees to all my students. The documentation is thorough and the support is outstanding.",
        },
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [testimonials.length])

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    return (
        <section className="testimonials-section">
            <div className="testimonials-container">
                <div className="testimonials-header">
                    <h2>What Our Makers Say</h2>
                    <p>Join thousands of satisfied customers worldwide</p>
                </div>

                <div className="testimonials-carousel">
                    <button className="carousel-btn prev-btn" onClick={prevTestimonial}>
                        ‹
                    </button>

                    <div className="testimonial-card">
                        <div className="testimonial-content">
                            <div className="quote-icon">"</div>
                            <p className="testimonial-text">{testimonials[currentTestimonial].text}</p>
                            <div className="rating">
                                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                    <span key={i} className="star">
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="testimonial-author">
                            <img
                                src={testimonials[currentTestimonial].image || "/placeholder.svg"}
                                alt={testimonials[currentTestimonial].name}
                                className="author-image"
                            />
                            <div className="author-info">
                                <h4>{testimonials[currentTestimonial].name}</h4>
                                <p>{testimonials[currentTestimonial].role}</p>
                            </div>
                        </div>
                    </div>

                    <button className="carousel-btn next-btn" onClick={nextTestimonial}>
                        ›
                    </button>
                </div>

                <div className="testimonial-dots">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentTestimonial ? "active" : ""}`}
                            onClick={() => setCurrentTestimonial(index)}
                        />
                    ))}
                </div>

                <div className="testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className={`testimonial-mini ${index === currentTestimonial ? "active" : ""}`}>
                            <img src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                            <div className="mini-content">
                                <h5>{testimonial.name}</h5>
                                <p>{testimonial.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TestimonialsSection
