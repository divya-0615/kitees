"use client"

import { motion } from "framer-motion"
import React from "react"
import "./TestimonialsSection.css"
const testimonials = [
    {
        id: 1,
        name: "Sarah Chen",
        role: "Electronics Engineer",
        company: "TechCorp",
        image: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
        rating: 5,
        text: "Kitees has been my go-to source for electronics components. The quality is exceptional, and their custom kit builder saved me hours of sourcing individual parts. Highly recommended!",
    },
    {
        id: 2,
        name: "Michael Rodriguez",
        role: "Maker & Educator",
        company: "MakerSpace Academy",
        image: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
        rating: 5,
        text: "As an educator, I love how Kitees makes electronics accessible to students. The project guides are clear, and the components are always high quality. My students have built amazing projects!",
    },
    {
        id: 3,
        name: "Emily Watson",
        role: "IoT Developer",
        company: "Smart Solutions Inc",
        image: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
        rating: 5,
        text: "The IoT kits from Kitees are fantastic! Everything works perfectly out of the box, and the documentation is thorough. It's helped me prototype ideas much faster.",
    },
]

// Star Icon Component
const StarIcon = ({ filled }) => (
    <svg
        className={`testinomal-section-star-icon ${filled ? "testinomal-section-star-filled" : ""}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

// Quote Icon Component
const QuoteIcon = () => (
    <svg className="testinomal-section-quote-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-quote w-8 h-8 text-blue-400 mb-4"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
)

export default function TestimonialsSection() {
    return (
        <section className="testinomal-section-testimonials-section">
            <div className="testinomal-section-container">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="testinomal-section-header"
                >
                    <h2 className="testinomal-section-title">What Our Customers Say</h2>
                    <p className="testinomal-section-subtitle">Join thousands of satisfied makers and engineers worldwide</p>
                </motion.div>

                <div className="testinomal-section-testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            whileHover={{ scale: 1.05 }}
                            className="testinomal-section-testimonial-card"
                        >
                            <div className="testinomal-section-rating">
                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                    <StarIcon key={i} filled={true} />
                                ))}
                            </div>

                            <QuoteIcon />

                            <p className="testinomal-section-testimonial-text">"{testimonial.text}"</p>

                            <div className="testinomal-section-author">
                                <img src={testimonial.image || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"} alt={testimonial.name} className="testinomal-section-author-image" />
                                <div className="testinomal-section-author-info">
                                    <div className="testinomal-section-author-name">{testimonial.name}</div>
                                    <div className="testinomal-section-author-role">{testimonial.role}</div>
                                    <div className="testinomal-section-author-company">{testimonial.company}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
