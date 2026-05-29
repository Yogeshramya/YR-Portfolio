import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import GalleryView from './components/GalleryView';
import './App.css';

// Stunning animated text rotator & reveal engine for the hero section
function AnimatedHeroTitle({ title }) {
  const defaultServices = [
    'Printing Shop',
    'Graphic Design Works',
    'Custom T-Shirts',
    'Photo Frames',
    'Flex Banners',
    'Invitation Cards'
  ];

  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  const safeTitle = title || 'YR Digital Enterprises';
  const isDefaultPattern = safeTitle.includes('YR Digital Enterprises');

  useEffect(() => {
    if (!isDefaultPattern) {
      setDisplayedText(safeTitle);
      return;
    }

    const currentService = defaultServices[currentServiceIndex];
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayedText(prev => prev.slice(0, -1));
        setTypingSpeed(30);
      }, typingSpeed);
    } else {
      timer = setTimeout(() => {
        setDisplayedText(currentService.slice(0, displayedText.length + 1));
        setTypingSpeed(80);
      }, typingSpeed);
    }

    if (!isDeleting && displayedText === currentService) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayedText === '') {
      setIsDeleting(false);
      setCurrentServiceIndex((prev) => (prev + 1) % defaultServices.length);
      setTypingSpeed(120);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentServiceIndex, safeTitle, isDefaultPattern]);

  if (!isDefaultPattern) {
    return (
      <span className="animated-custom-title">
        {safeTitle.split(' ').map((word, wIdx) => (
          <span key={wIdx} className="word-wrapper">
            {word.split('').map((char, cIdx) => (
              <span 
                key={cIdx} 
                className="char-animate" 
                style={{ animationDelay: `${(wIdx * 5 + cIdx) * 0.04}s` }}
              >
                {char}
              </span>
            ))}
            &nbsp;
          </span>
        ))}
      </span>
    );
  }

  return (
    <span className="animated-hero-container">
      <span className="brand-glow-text">YR Digital Enterprises</span>
      <span className="service-dynamic-wrapper">
        <span className="service-prefix">Premium</span>{' '}
        <span className="typed-text-gradient">{displayedText}</span>
        <span className="cursor-blink">|</span>
      </span>
      <span className="location-suffix">in Kumbakonam</span>
    </span>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [businessName, setBusinessName] = useState(() => localStorage.getItem('yr_business_name') || 'YR Digital Enterprises');
  const [businessSubtitle, setBusinessSubtitle] = useState(() => localStorage.getItem('yr_business_subtitle') || 'Premium Printing Shop, Custom T-Shirt Printing & Graphic Designing Services in Kumbakonam, Tamil Nadu');
  const [heroTitle, setHeroTitle] = useState(() => localStorage.getItem('yr_hero_title') || 'YR Digital Enterprises - Printing Shop & Graphic Designer in Kumbakonam');

  useEffect(() => {
    const handleStorage = () => {
      setBusinessName(localStorage.getItem('yr_business_name') || 'YR Digital Enterprises');
      setBusinessSubtitle(localStorage.getItem('yr_business_subtitle') || 'Digital Desingning & Prints');
      setHeroTitle(localStorage.getItem('yr_hero_title') || 'YR Digital Enterprises');
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 1000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Review Board State Management
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Wade Warren',
      role: 'Verified Customer',
      rating: 5,
      date: 'May 12, 2026',
      comment: 'The design precision and vibrant print output from YR Digital Enterprises exceeded all our expectations! Our personalized photo frames, wedding invitations, and marketing banners turned out absolutely breathtaking. A truly professional team.',
      avatar: '/avatar.png'
    },
    {
      id: 2,
      name: 'Sarah Jenkins',
      role: 'Bride / Wedding Client',
      rating: 5,
      date: 'May 20, 2026',
      comment: 'We ordered custom gold foil wedding invitations and circular photo frames. The paper thickness, color saturation, and elegant custom borders were spectacular! All our guests loved them.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    {
      id: 3,
      name: 'Michael Chang',
      role: 'Corporate Partner',
      rating: 5,
      date: 'May 26, 2026',
      comment: 'Exceptional service for our commercial lighting banners and visiting cards! The vector clarity of our corporate logo printed on the massive banners was perfectly sharp. Turnaround was incredibly fast.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    }
  ]);
  const [reviewForm, setReviewForm] = useState({ name: '', role: '', comment: '', rating: 5 });
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 4000);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewForm.name && reviewForm.comment) {
      const newReview = {
        id: reviews.length + 1,
        name: reviewForm.name,
        role: reviewForm.role || 'Verified Customer',
        rating: reviewForm.rating,
        date: 'Just Now',
        comment: reviewForm.comment,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
      };
      setReviews([newReview, ...reviews]);
      setReviewForm({ name: '', role: '', comment: '', rating: 5 });
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    }
  };

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div id="top" className="ast-site-container">
      {/* Navigation Header */}
      <Header currentView={currentView} setCurrentView={setCurrentView} />

      <main>
            {/* ================= HERO COVER SECTION ================= */}
            <section className="ast-hero-section">
              <div className="container hero-grid-container">
                <div className="hero-content-col">
                  <h1 className="hero-title animate-fade-in">
                    <AnimatedHeroTitle title={heroTitle} />
                  </h1>
                  <p className="hero-description animate-fade-in-delayed">
                    {businessSubtitle}
                  </p>
                  <div className="hero-actions animate-fade-in-delayed">
                    <a
                      href="#contact"
                      onClick={(e) => handleSmoothScroll(e, '#contact')}
                      className="btn-primary btn-solid hero-btn"
                    >
                      Contact Us
                    </a>
                  </div>
                </div>
                <div className="hero-media-col animate-float">
                  <img src="/hero-img.svg" alt={businessName} className="hero-img floating-image" />
                </div>
              </div>
              <div className="hero-wave">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z" fill="#F9FAFC"></path>
                </svg>
              </div>
            </section>

            {/* ================= WHAT WE OFFER SECTION ================= */}
            <section className="ast-offers-section">
              <div className="container">
                <h2 className="screen-reader-text">Our Premium Custom Prints & Photo Frame Designs</h2>
                <div className="grid-cols-4 offers-grid">
                  {/* Feature 1 */}
                  <div className="offer-card">
                    <div className="offer-icon-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="offer-icon">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                    <h3>Photo Frame Design</h3>
                    <p>High quality custom Photo Frame Designs in Kumbakonam in all sizes.</p>
                  </div>

                  {/* Feature 2 */}
                  <div className="offer-card">
                    <div className="offer-icon-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="offer-icon">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <h3>Wedding Album & Invites</h3>
                    <p>Customized wedding invitations, cards, and Wedding Album Designs.</p>
                  </div>

                  {/* Feature 3 */}
                  <div className="offer-card">
                    <div className="offer-icon-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="offer-icon">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                        <circle cx="7" cy="15" r="1" />
                        <circle cx="12" cy="15" r="1" />
                        <circle cx="17" cy="15" r="1" />
                      </svg>
                    </div>
                    <h3>Visiting & Business Cards</h3>
                    <p>Professional visiting cards designed and printed with premium finishes.</p>
                  </div>

                  {/* Feature 4 */}
                  <div className="offer-card">
                    <div className="offer-icon-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="offer-icon">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    </div>
                    <h3>SEO & Web Services</h3>
                    <p>Professional SEO Services and custom business website development.</p>
                  </div>
                  
                  {/* Feature 5 */}
                  <div className="offer-card">
                    <div className="offer-icon-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="offer-icon">
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                        <line x1="4" y1="22" x2="4" y2="15" />
                      </svg>
                    </div>
                    <h3>Flex Banner Printing</h3>
                    <p>High-resolution Flex Banner Printing for weddings, festivals, and events.</p>
                  </div>

                  {/* Feature 6 */}
                  <div className="offer-card">
                    <div className="offer-icon-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="offer-icon">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                    </div>
                    <h3>Digital Printing</h3>
                    <p>Vibrant Digital Printing, photo book albums, and high-fidelity canvases.</p>
                  </div>

                  {/* Feature 7 */}
                  <div className="offer-card">
                    <div className="offer-icon-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="offer-icon">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <h3>Custom Gifting</h3>
                    <p>Custom printed calendars, mugs, and personalized corporate gifts.</p>
                  </div>

                  {/* Feature 8 */}
                  <div className="offer-card">
                    <div className="offer-icon-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="offer-icon">
                        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                        <line x1="9" y1="18" x2="15" y2="18" />
                        <line x1="10" y1="22" x2="14" y2="22" />
                      </svg>
                    </div>
                    <h3>Lighting Banners & Signs</h3>
                    <p>LED signage and glowing lighting banners with outdoor durability.</p>
                  </div>

                  {/* Feature 9 */}
                  <div className="offer-card">
                    <div className="offer-icon-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="offer-icon">
                        <path d="M20.37 4.65a2 2 0 0 0-1.88-1.48H15.5a2 2 0 0 1-3 0H9.51a2 2 0 0 0-1.88 1.48L5.4 12.2a1 1 0 0 0 .93 1.3H9v6.5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V13.5h2.67a1 1 0 0 0 .93-1.3z" />
                      </svg>
                    </div>
                    <h3>T-Shirt Printing Near Me</h3>
                    <p>Customized T-Shirt printing with premium DTF/Sublimation quality.</p>
                  </div>

                  {/* Feature 10 */}
                  <div className="offer-card">
                    <div className="offer-icon-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="offer-icon">
                        <path d="M12 22a10 10 0 1 0-10-10l5.5 5.5a4 4 0 0 0 5.66 0z" />
                        <path d="M2 12h5.5A4 4 0 0 1 11.5 16V21.5" />
                      </svg>
                    </div>
                    <h3>Stickers & Labels</h3>
                    <p>Custom die-cut labels, product packaging stickers, and decals.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ================= OUR SERVICES SECTION ================= */}
            <section id="services" className="ast-services-section section-padding">
              <div className="container">
                <div className="section-header">
                  <span className="sub-title">Expert Solutions</span>
                  <h2>Professional Printing & Designing Services in Kumbakonam, Tamil Nadu</h2>
                  <div className="section-bar"></div>
                </div>

                <div className="grid-cols-3 services-grid">
                  {/* Service 1 */}
                  <div className="service-card">
                    <div className="service-img-wrapper">
                      <img src="/branding.jpg" alt="Expert Graphic Designer in Kumbakonam - YR Digital Enterprises" className="service-img" />
                    </div>
                    <div className="service-info">
                      <h3>Graphic Designer in Kumbakonam</h3>
                      <p>Stunning, tailored visual designs for wedding invitations, visiting cards, flex banner designs, promotional assets, photo frames, and complete brand identity packages.</p>
                    </div>
                  </div>

                  {/* Service 2 */}
                  <div className="service-card">
                    <div className="service-img-wrapper">
                      <img src="/graphic.jpg" alt="Digital Printing Shop in Kumbakonam - YR Digital Enterprises" className="service-img" />
                    </div>
                    <div className="service-info">
                      <h3>Printing Shop in Kumbakonam</h3>
                      <p>Premium, high-speed digital printing services for custom photo frame designs, wedding albums, custom T-shirt printing, brochures, stickers, and outdoor flex banners.</p>
                    </div>
                  </div>

                  {/* Service 3 */}
                  <div className="service-card">
                    <div className="service-img-wrapper">
                      <img src="/web.jpg" alt="SEO Services and Web Development in Kumbakonam - YR Digital Enterprises" className="service-img" />
                    </div>
                    <div className="service-info">
                      <h3>SEO Service & Web Development</h3>
                      <p>Drive organic traffic and maximize customer calls with professional SEO Services, customized business websites, and complete Google Business Profile Optimization in Kumbakonam.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ================= ABOUT US SECTION ================= */}
            <section id="about" className="ast-about-section">
              <div className="container about-grid-container">
                <div className="about-content-col">
                  <span className="sub-title">Dream Big, Print Bigger</span>
                  <h2>Kumbakonam's Trusted Partner for Printing & Graphic Design</h2>
                  <p className="about-text-lead">
                    At YR Digital Enterprises, we believe every memorable brand and beautiful home starts with creative layouts. As Kumbakonam's leading digital printing shop and graphic design studio, we convert your boldest ideas into premium physical prints, stunning wedding albums, custom photo frames, and modern web solutions.
                  </p>
                  <p className="about-text-body">
                    Equipped with advanced high-speed digital printers and a passionate creative design team, we craft custom poster printing, flex banners, corporate visiting cards, personalized t-shirt prints, and promotional graphics. We also help your business stand out online with professional SEO services and Google Business Profile optimization to ensure your brand dominates local search results in Tamil Nadu.
                  </p>
                </div>
                <div className="about-media-col">
                  <div className="about-image-frame">
                    <img src="/about-us.png" alt="Premium Printing Shop & Graphic Design Studio in Kumbakonam - YR Digital Enterprises" className="about-img" />
                  </div>
                </div>
              </div>
            </section>

            {/* ================= TESTIMONIALS SECTION ================= */}
            <section id="reviews" className="ast-testimonials-section section-padding">
              <div className="container testimonial-inner">
                <div className="quote-mark">“</div>
                <p className="testimonial-quote">
                  "The design precision and vibrant print output from YR Digital Enterprises exceeded all our expectations! Our personalized photo frames, wedding invitations, and marketing banners turned out absolutely breathtaking. A truly professional team."
                </p>
                <div className="testimonial-author">
                  <img src="/avatar.png" alt="Wade Warren Avatar" className="author-avatar" />
                  <div className="author-details">
                    <h4 className="author-name">Wade Warren</h4>
                    <span className="author-title">Verified Customer</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ================= WHY CHOOSE US SECTION ================= */}
            <section id="whyus" className="ast-why-section section-padding">
              <div className="container">
                <div className="section-header">
                  <span className="sub-title">Why Partners Choose Us</span>
                  <h2>Why Choose Us</h2>
                  <div className="section-bar"></div>
                </div>

                <div className="grid-cols-3 why-grid">
                  {/* Feature 1 */}
                  <div className="why-card">
                    <div className="why-icon-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="why-icon">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                    <h3>Vibrant Quality</h3>
                    <p>We use cutting-edge, high-resolution printing technology to ensure rich, vibrant colors and flawless, durable details on every print.</p>
                  </div>

                  {/* Feature 2 */}
                  <div className="why-card">
                    <div className="why-icon-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="why-icon">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </div>
                    <h3>Custom Creativity</h3>
                    <p>Every invitation, visiting card, and photo album is custom-designed from scratch by our experts to match your unique design vision.</p>
                  </div>

                  {/* Feature 3 */}
                  <div className="why-card">
                    <div className="why-icon-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="why-icon">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <h3>On-Time Delivery</h3>
                    <p>Whether it is an upcoming wedding event, a birthday party banner, or an urgent corporate order, we guarantee fast and reliable turnaround times.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ================= COMPLETED WORKS GALLERY SHOWCASE ================= */}
            <div id="gallery">
              <GalleryView />
            </div>

            {/* ================= CUSTOMER REVIEW CENTER SECTION ================= */}
            <section id="reviews-board" className="ast-reviews-board-section section-padding">
              <div className="container">
                <div className="section-header">
                  <span className="sub-title">Feedback & Stories</span>
                  <h2>Client Review Board</h2>
                  <div className="section-bar"></div>
                </div>

                <div className="reviews-board-grid">
                  {/* Collected Reviews List */}
                  <div className="collected-reviews-col">
                    <h3 className="reviews-board-subtitle">Collected Customer Reviews</h3>
                    <div className="reviews-scroll-container">
                      {reviews.map((rev) => (
                        <div key={rev.id} className="board-review-card">
                          <div className="board-review-header">
                            <img src={rev.avatar} alt={rev.name} className="board-review-avatar" />
                            <div className="board-review-meta">
                              <h4>{rev.name}</h4>
                              <span>{rev.role} • {rev.date}</span>
                            </div>
                            <div className="board-review-rating">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill={i < rev.rating ? "url(#yr-gold)" : "none"}
                                  stroke={i < rev.rating ? "url(#yr-gold)" : "#cbd5e1"}
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="board-review-star"
                                >
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="board-review-text">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit a Review Form */}
                  <div className="submit-review-col">
                    <h3 className="reviews-board-subtitle">Share Your Experience</h3>
                    {reviewSuccess ? (
                      <div className="review-success-alert">
                        <h4>🎉 Review Posted!</h4>
                        <p>Thank you for sharing your experience! Your review is now live in the board above.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleReviewSubmit} className="submit-review-form">
                        <div className="form-group">
                          <label htmlFor="rev-name">Your Name</label>
                          <input
                            type="text"
                            id="rev-name"
                            required
                            placeholder="e.g. Sarah Jenkins"
                            value={reviewForm.name}
                            onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="rev-role">Event / Project (Role)</label>
                          <input
                            type="text"
                            id="rev-role"
                            placeholder="e.g. Wedding Client, Business Owner"
                            value={reviewForm.role}
                            onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Your Rating</label>
                          <div className="interactive-stars-selector">
                            {[...Array(5)].map((_, i) => {
                              const starValue = i + 1;
                              return (
                                <button
                                  type="button"
                                  key={i}
                                  className="interactive-star-btn"
                                  onClick={() => setReviewForm({ ...reviewForm, rating: starValue })}
                                  onMouseEnter={() => setHoveredRating(starValue)}
                                  onMouseLeave={() => setHoveredRating(0)}
                                  aria-label={`Rate ${starValue} Stars`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill={starValue <= (hoveredRating || reviewForm.rating) ? "url(#yr-gold)" : "none"}
                                    stroke={starValue <= (hoveredRating || reviewForm.rating) ? "url(#yr-gold)" : "#cbd5e1"}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="interactive-star-svg"
                                  >
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                  </svg>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="rev-comment">Your Feedback</label>
                          <textarea
                            id="rev-comment"
                            rows="3"
                            required
                            placeholder="Tell us about the design and print quality..."
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          ></textarea>
                        </div>
                        <button type="submit" className="btn-primary btn-solid submit-btn">
                          Post Review
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
              {/* Custom SVG Gradient reference for the stars fill! */}
              <svg style={{ height: 0, width: 0, position: 'absolute' }}>
                <defs>
                  <linearGradient id="yr-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFE082" />
                    <stop offset="50%" stopColor="#F5B041" />
                    <stop offset="100%" stopColor="#DC7633" />
                  </linearGradient>
                </defs>
              </svg>
            </section>

            {/* ================= CONTACT & LEAD FORM SECTION ================= */}
            <section id="contact" className="ast-contact-section">
              <div className="container contact-grid-container">
                <div className="contact-info-col">
                  <h2>Get Your Premium Custom Prints & Designing Quotes Today!</h2>
                  <p>
                    Ready to elevate your branding, promotional events, wedding milestones, or home decor? Contact YR Digital Enterprises—your expert printing shop and graphic designer in Kumbakonam, Tamil Nadu. Reach out to us via phone, email, or WhatsApp, and let's bring your creative visions to life!
                  </p>
                  <div className="contact-accent-bar"></div>
                  <div style={{ 
                    marginTop: '32px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '16px',
                    padding: '24px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '1.05rem', color: '#ffffff' }}>
                      <span style={{ fontSize: '1.4rem' }}>📍</span> 
                      <span style={{ lineHeight: '1.5', fontWeight: '500' }}>13/B Kuttiyan Palayam Street, Kumbakonam, Tamil Nadu - 612001</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '1.05rem' }}>
                      <span style={{ fontSize: '1.4rem' }}>📞</span> 
                      <a href="tel:+919360619459" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center' }} onMouseEnter={(e) => e.target.style.color = '#7dd3fc'} onMouseLeave={(e) => e.target.style.color = '#38bdf8'}>
                        +91 93606 19459
                      </a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '1.05rem' }}>
                      <span style={{ fontSize: '1.4rem' }}>💬</span> 
                      <a href="https://wa.me/919360619459?text=Hi%20YR%20Digital%20Enterprises,%20I'm%20interested%20in%20your%20design%20and%20printing%20services." target="_blank" rel="noopener noreferrer" style={{ color: '#4ade80', textDecoration: 'none', fontWeight: '700', fontSize: '1.1rem', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center' }} onMouseEnter={(e) => e.target.style.color = '#86efac'} onMouseLeave={(e) => e.target.style.color = '#4ade80'}>
                        Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>

                <div className="contact-form-col">
                  {formSubmitted ? (
                    <div className="form-success-alert">
                      <h4>🎉 Message Received!</h4>
                      <p>Thank you! Our expert design team will contact you within the next 24 hours.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="contact-lead-form">
                      <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          required
                          placeholder="e.g. Ramesh kumar"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          required
                          placeholder="contactyrdigital@gmail.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="message">Project Requirements (Optional)</label>
                        <textarea
                          id="message"
                          rows="3"
                          placeholder="Tell us about the website of your dreams..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        ></textarea>
                      </div>
                      <button type="submit" className="btn-primary btn-solid submit-btn">
                        Contact Us
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </section>
      </main>

      {/* Sticky Floating Call & WhatsApp Quick-Action Widget */}
      <div className="floating-contact-widget">
        <a
          href="https://wa.me/919360619459?text=Hi%20YR%20Digital%20Enterprises,%20I'm%20interested%20in%20your%20design%20and%20printing%20services."
          target="_blank"
          rel="noopener noreferrer"
          className="floating-action-btn whatsapp"
          data-tooltip="Chat on WhatsApp"
          aria-label="Chat with YR Digital Enterprises on WhatsApp"
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.453L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.977 14.053.954 11.43.954c-5.438 0-9.863 4.37-9.868 9.8-.001 1.714.461 3.39 1.337 4.873l-.99 3.618 3.733-.967c1.448.786 2.937 1.196 4.415 1.196zm10.742-7.235c-.29-.145-1.716-.838-1.982-.933-.267-.096-.462-.145-.658.145-.196.29-.757.933-.928 1.12-.172.19-.344.214-.635.069-.29-.145-1.226-.446-2.336-1.424-.863-.759-1.447-1.697-1.616-1.983-.17-.29-.018-.447.127-.591.13-.13.29-.344.436-.516.145-.172.19-.29.287-.482.097-.19.048-.362-.024-.508-.073-.145-.658-1.56-.902-2.128-.238-.567-.48-.49-.658-.499-.17-.008-.365-.01-.56-.01-.196 0-.518.073-.79.362-.27.29-1.037.999-1.037 2.434 0 1.436 1.058 2.822 1.206 3.012.148.19 2.083 3.141 5.044 4.407.704.301 1.254.481 1.684.615.708.223 1.353.191 1.863.116.568-.083 1.716-.69 1.957-1.356.242-.667.242-1.238.17-1.356-.073-.119-.267-.19-.558-.335z" />
          </svg>
        </a>
        <a
          href="tel:+919360619459"
          className="floating-action-btn call"
          data-tooltip="Call Us Now"
          aria-label="Call YR Digital Enterprises"
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.384 17.791l-3.72-2.657a1 1 0 0 0-1.38.188l-1.377 1.836c-2.64-1.234-4.812-3.407-6.046-6.046l1.836-1.377a1 1 0 0 0 .188-1.38L7.629 2.635a1 1 0 0 0-1.38-.188L2.091 5.253a3 3 0 0 0-1.127 3.535 24 24 0 0 0 15.248 15.248 3 3 0 0 0 3.535-1.127l2.809-4.158a1 1 0 0 0-.172-1.36z" />
          </svg>
        </a>
      </div>

      {/* Footer Navigation */}
      <Footer />
    </div>
  );
}
