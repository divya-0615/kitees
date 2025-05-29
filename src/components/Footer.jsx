import "./Footer.css"

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-section">
                        <div className="footer-logo">
                            <h3>Kitees</h3>
                            <p>Empowering makers with premium electronics kits and comprehensive learning resources.</p>
                        </div>
                        <div className="social-links">
                            <a href="#" className="social-link">
                                <span>📘</span>
                            </a>
                            <a href="#" className="social-link">
                                <span>🐦</span>
                            </a>
                            <a href="#" className="social-link">
                                <span>📷</span>
                            </a>
                            <a href="#" className="social-link">
                                <span>💼</span>
                            </a>
                            <a href="#" className="social-link">
                                <span>📺</span>
                            </a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4>Products</h4>
                        <ul>
                            <li>
                                <a href="#">Arduino Kits</a>
                            </li>
                            <li>
                                <a href="#">Raspberry Pi Kits</a>
                            </li>
                            <li>
                                <a href="#">IoT Projects</a>
                            </li>
                            <li>
                                <a href="#">Robotics Kits</a>
                            </li>
                            <li>
                                <a href="#">Sensors & Components</a>
                            </li>
                            <li>
                                <a href="#">Custom Kits</a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Support</h4>
                        <ul>
                            <li>
                                <a href="#">Help Center</a>
                            </li>
                            <li>
                                <a href="#">Documentation</a>
                            </li>
                            <li>
                                <a href="#">Video Tutorials</a>
                            </li>
                            <li>
                                <a href="#">Community Forum</a>
                            </li>
                            <li>
                                <a href="#">Contact Support</a>
                            </li>
                            <li>
                                <a href="#">Warranty</a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Company</h4>
                        <ul>
                            <li>
                                <a href="#">About Us</a>
                            </li>
                            <li>
                                <a href="#">Our Mission</a>
                            </li>
                            <li>
                                <a href="#">Careers</a>
                            </li>
                            <li>
                                <a href="#">Press Kit</a>
                            </li>
                            <li>
                                <a href="#">Blog</a>
                            </li>
                            <li>
                                <a href="#">Partners</a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Legal</h4>
                        <ul>
                            <li>
                                <a href="#">Privacy Policy</a>
                            </li>
                            <li>
                                <a href="#">Terms of Service</a>
                            </li>
                            <li>
                                <a href="#">Shipping Policy</a>
                            </li>
                            <li>
                                <a href="#">Return Policy</a>
                            </li>
                            <li>
                                <a href="#">Cookie Policy</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <p>&copy; 2024 Kitees. All rights reserved.</p>
                        <div className="footer-badges">
                            <span className="badge">🔒 Secure Payments</span>
                            <span className="badge">🚚 Fast Shipping</span>
                            <span className="badge">✅ Quality Guaranteed</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
