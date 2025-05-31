import "./Footer.css"

// Icon components to replace Lucide React icons
const ZapIcon = () => (
    <svg
        className="footer-section-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
)

const MailIcon = () => (
    <svg
        className="footer-section-icon-sm"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
)

const PhoneIcon = () => (
    <svg
        className="footer-section-icon-sm"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
)

const MapPinIcon = () => (
    <svg
        className="footer-section-icon-sm"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
)

const FacebookIcon = () => (
    <svg
        className="footer-section-social-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
)

const TwitterIcon = () => (
    <svg
        className="footer-section-social-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
    </svg>
)

const InstagramIcon = () => (
    <svg
        className="footer-section-social-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
)

const YoutubeIcon = () => (
    <svg
        className="footer-section-social-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
    </svg>
)

export default function Footer() {
    return (
        <footer className="footer-section-footer">
            <div className="footer-section-container">
                <div className="footer-section-footer-grid">
                    {/* Company Info */}
                    <div className="footer-section-footer-section">
                        <div className="footer-section-logo-container">
                            <div className="footer-section-logo-icon">
                                <ZapIcon />
                            </div>
                            <span className="footer-section-logo-text">Kitees</span>
                        </div>
                        <p className="footer-section-company-description">
                            Your trusted partner for electronics kits, components, and innovative projects. Empowering makers and
                            engineers worldwide since 2020.
                        </p>
                        {/* <div className="footer-section-social-links">
                            <a href="#" className="footer-section-social-link">
                                <FacebookIcon />
                            </a>
                            <a href="#" className="footer-section-social-link">
                                <TwitterIcon />
                            </a>
                            <a href="#" className="footer-section-social-link">
                                <InstagramIcon />
                            </a>
                            <a href="#" className="footer-section-social-link">
                                <YoutubeIcon />
                            </a>
                        </div> */}
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section-footer-section">
                        <h3 className="footer-section-footer-heading">Quick Links</h3>
                        <ul className="footer-section-footer-links">
                            <li>
                                <a href="#" className="footer-section-footer-link">
                                    Available Kits
                                </a>
                            </li>
                            <li>
                                <a href="#" className="footer-section-footer-link">
                                    Custom Components
                                </a>
                            </li>
                            <li>
                                <a href="#" className="footer-section-footer-link">
                                    Mini Projects
                                </a>
                            </li>
                            <li>
                                <a href="/contact-us" className="footer-section-footer-link">
                                    Support Center
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div className="footer-section-footer-section">
                        <h3 className="footer-section-footer-heading">Customer Support</h3>
                        <ul className="footer-section-footer-links">
                            <li>
                                <a href="/contact-us" className="footer-section-footer-link">
                                    Custom Mini Projects
                                </a>
                            </li>
                            <li>
                                <a href="/contact-us" className="footer-section-footer-link">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="/myorders" className="footer-section-footer-link">
                                    Track Your Order
                                </a>
                            </li>
                            <li>
                                <a href="/faq" className="footer-section-footer-link">
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-section-footer-section">
                        <h3 className="footer-section-footer-heading">Contact Us</h3>
                        <div className="footer-section-contact-info">
                            <div className="footer-section-contact-item">
                                <MailIcon />
                                <span className="footer-section-contact-text">support@kitees.com</span>
                            </div>
                            <div className="footer-section-contact-item">
                                <PhoneIcon />
                                <span className="footer-section-contact-text">+1 (555) 123-4567</span>
                            </div>
                            <div className="footer-section-contact-item">
                                <MapPinIcon />
                                <span className="footer-section-contact-text">
                                    123 Electronics Ave
                                    <br />
                                    Tech City, TC 12345
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-section-footer-bottom">
                    <div className="footer-section-footer-bottom-content">
                        <p className="footer-section-copyright">© {new Date().getFullYear()} Kitees. All rights reserved.</p>
                        <div className="footer-section-policy-links">
                            <a href="#" className="footer-section-policy-link"> 🔒 Secure Payments</a>
                            <a href="#" className="footer-section-policy-link"> 🚚 Fast Shipping</a>
                            <a href="#" className="footer-section-policy-link"> 💰 No Hidden Charges</a>
                            <a href="#" className="footer-section-policy-link"> ✅ Quality Guaranteed</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
