import React, { useState, useEffect } from 'react';
import './GalleryView.css';

// Default portfolio items demonstrating YR Digital Enterprises' high-fidelity prints
const initialGalleryItems = [
  { id: 1, title: 'Wedding Golden Foil Invite', category: 'invitations', image: '/branding.jpg' },
  { id: 2, title: 'Vibrant Wedding Photo Frame', category: 'frames', image: '/graphic.jpg' },
  { id: 3, title: 'Premium Corporate Brand Book', category: 'corporate', image: '/web.jpg' },
  { id: 4, title: 'Gold Canvas Custom Art', category: 'frames', image: '/about-us.png' },
  { id: 5, title: 'Modern Matte Visiting Cards', category: 'cards', image: '/avatar.png' },
  { id: 6, title: 'Birthday Banner Custom Print', category: 'banners', image: '/branding.jpg' },
  { id: 7, title: 'Corporate T-Shirt Printing', category: 'apparel', image: '/graphic.jpg' },
  { id: 8, title: 'Custom Glossy Die-Cut Stickers', category: 'stickers', image: '/web.jpg' },
];

export default function GalleryView() {
  const [galleryItems, setGalleryItems] = useState(() => {
    const saved = localStorage.getItem('yr_gallery_items');
    return saved ? JSON.parse(saved) : initialGalleryItems;
  });
  const [activeFilter, setActiveFilter] = useState('all');

  // Sync state with local storage for instant crud reactions
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('yr_gallery_items');
      if (saved) {
        setGalleryItems(JSON.parse(saved));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    // Periodically poll to capture updates from admin dashboard
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const categories = [
    { slug: 'all', name: 'All Works' },
    { slug: 'frames', name: 'Photo Frames' },
    { slug: 'invitations', name: 'Invitations' },
    { slug: 'cards', name: 'Visiting Cards' },
    { slug: 'banners', name: 'Banners' },
    { slug: 'apparel', name: 'T-Shirts' },
    { slug: 'stickers', name: 'Stickers' },
    { slug: 'corporate', name: 'Corporate' },
  ];

  const filteredItems = activeFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  // Helper to split items for dual-scrolling tracks
  const firstTrackItems = filteredItems.filter((_, idx) => idx % 2 === 0);
  const secondTrackItems = filteredItems.filter((_, idx) => idx % 2 !== 0);

  return (
    <div className="ast-gallery-view-page">
      {/* Gallery Cover Hero */}
      <section className="gallery-hero-banner">
        <div className="container">
          <span className="sub-title">Our Masterpieces</span>
          <h1 className="gallery-main-title">Completed Work Showcase</h1>
          <p className="gallery-hero-desc">
            Explore our real-world layout designs, premium physical prints, custom photo albums, and tailored digital solutions built for clients worldwide.
          </p>
        </div>
      </section>

      {/* Category Filter Controls */}
      <section className="gallery-filter-section">
        <div className="container">
          <div className="filter-tags-flex">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                className={`filter-btn-tag ${activeFilter === cat.slug ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MARQUEE DOUBLE SCROLL SHOWCASE ================= */}
      <section className="marquee-portfolio-section">
        <div className="marquee-wrapper">
          {/* TRACK 1: Left Scroll */}
          {firstTrackItems.length > 0 ? (
            <div className="marquee-track left-scroll">
              <div className="marquee-stream">
                {firstTrackItems.map((item) => (
                  <div key={`track1-a-${item.id}`} className="marquee-item-card">
                    <div className="marquee-img-box">
                      <img src={item.image} alt={item.title} />
                      <div className="marquee-card-label">
                        <span>{item.category.toUpperCase()}</span>
                      </div>
                    </div>
                    <h4>{item.title}</h4>
                  </div>
                ))}
              </div>
              {/* Duplicated stream for seamless wrapping */}
              <div className="marquee-stream" aria-hidden="true">
                {firstTrackItems.map((item) => (
                  <div key={`track1-b-${item.id}`} className="marquee-item-card">
                    <div className="marquee-img-box">
                      <img src={item.image} alt={item.title} />
                      <div className="marquee-card-label">
                        <span>{item.category.toUpperCase()}</span>
                      </div>
                    </div>
                    <h4>{item.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-items-marquee">No works found under this category.</div>
          )}

          {/* TRACK 2: Right Scroll */}
          {secondTrackItems.length > 0 && (
            <div className="marquee-track right-scroll">
              <div className="marquee-stream">
                {secondTrackItems.map((item) => (
                  <div key={`track2-a-${item.id}`} className="marquee-item-card">
                    <div className="marquee-img-box">
                      <img src={item.image} alt={item.title} />
                      <div className="marquee-card-label">
                        <span>{item.category.toUpperCase()}</span>
                      </div>
                    </div>
                    <h4>{item.title}</h4>
                  </div>
                ))}
              </div>
              {/* Duplicated stream for seamless wrapping */}
              <div className="marquee-stream" aria-hidden="true">
                {secondTrackItems.map((item) => (
                  <div key={`track2-b-${item.id}`} className="marquee-item-card">
                    <div className="marquee-img-box">
                      <img src={item.image} alt={item.title} />
                      <div className="marquee-card-label">
                        <span>{item.category.toUpperCase()}</span>
                      </div>
                    </div>
                    <h4>{item.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Grid List Showcase for granular views */}
      <section className="gallery-grid-list-section section-padding">
        <div className="container">
          <div className="section-header">
            <span className="sub-title">Detailed Portfolio</span>
            <h2>Portfolio Grid</h2>
            <div className="section-bar"></div>
          </div>

          <div className="grid-cols-3 detailed-gallery-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="gallery-grid-card">
                <div className="grid-card-img-wrapper">
                  <img src={item.image} alt={item.title} className="grid-card-img" />
                  <div className="grid-card-badge">{item.category}</div>
                </div>
                <div className="grid-card-content">
                  <h3>{item.title}</h3>
                  <p>Hand-crafted customized print details designed to absolute perfection.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
