import React, { useState, useEffect } from 'react';
import { auth, db, isFirebaseConfigured } from '../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import './AdminDashboard.css';

// Default initial items in case localStorage is empty
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

export default function AdminDashboard() {
  // Helper to dynamically resolve and redirect to the public main website
  const handleRedirectToPublicSite = () => {
    const { hostname, protocol } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Local development fallback: go to default Vite client port
      window.location.href = 'http://localhost:5173';
    } else {
      // Production fallback: strip 'yradmin.' or 'YRadmin.' dynamically to return to the parent domain
      const parentDomain = hostname.replace(/^(yradmin|YRadmin)\./i, '');
      window.location.href = `${protocol}//${parentDomain}`;
    }
  };

  // Authorization State
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard Tabs: 'overview' | 'gallery' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');

  // Business Config & Stats States
  const [businessName, setBusinessName] = useState(() => localStorage.getItem('yr_business_name') || 'YR Digital Enterprises');
  const [businessSubtitle, setBusinessSubtitle] = useState(() => localStorage.getItem('yr_business_subtitle') || 'Digital Designing & Prints');
  const [heroTitle, setHeroTitle] = useState(() => localStorage.getItem('yr_hero_title') || 'YR Digital Enterprises');
  const [businessEmail, setBusinessEmail] = useState(() => localStorage.getItem('yr_business_email') || 'contact@yrdigital.com');
  const [businessPhone, setBusinessPhone] = useState(() => localStorage.getItem('yr_business_phone') || '+91 98765 43210');
  const [businessAddress, setBusinessAddress] = useState(() => localStorage.getItem('yr_business_address') || '123 Main Street, Townsville');
  const [businessHours, setBusinessHours] = useState(() => localStorage.getItem('yr_business_hours') || 'Mon - Sat: 9:00 AM - 8:00 PM');
  const [successMsg, setSuccessMsg] = useState('');

  // Custom Image URL Input State
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Cloudinary & Photo Upload States
  const [cloudinaryCloudName, setCloudinaryCloudName] = useState(() => import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || localStorage.getItem('yr_cloudinary_cloud_name') || '');
  const [cloudinaryUploadPreset, setCloudinaryUploadPreset] = useState(() => import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || localStorage.getItem('yr_cloudinary_upload_preset') || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageSelectMethod, setImageSelectMethod] = useState('upload'); // 'upload' | 'url' | 'preset'

  // Dashboard Activity Logs
  const [activities, setActivities] = useState(() => {
    const logs = localStorage.getItem('yr_dashboard_logs');
    return logs ? JSON.parse(logs) : [
      { id: 1, time: 'Just Now', icon: '📊', text: 'Dashboard console loaded in secure sandbox mode' },
      { id: 2, time: '10 mins ago', icon: '🛠️', text: 'Local storage database synchronized successfully' },
      { id: 3, time: '1 hour ago', icon: '🔒', text: 'Security login block cleared for Master Administrator' }
    ];
  });

  const addActivity = (icon, text) => {
    const newLog = {
      id: Date.now(),
      time: 'Just Now',
      icon,
      text
    };
    setActivities(prev => {
      const updated = [newLog, ...prev.slice(0, 3)];
      localStorage.setItem('yr_dashboard_logs', JSON.stringify(updated));
      return updated;
    });
  };

  // Gallery CRUD States
  const [galleryItems, setGalleryItems] = useState([]);
  const [newWork, setNewWork] = useState({ title: '', category: 'frames', image: '/branding.jpg' });
  const [editWork, setEditWork] = useState(null);

  // Authentication Checking
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      });
      return () => unsubscribe();
    } else {
      // Local Mock Auth Session
      const session = localStorage.getItem('yr_admin_session');
      if (session === 'active') {
        setIsAdmin(true);
      }
    }
  }, []);

  // Fetch Gallery Items
  useEffect(() => {
    if (isAdmin) {
      loadGalleryItems();
    }
  }, [isAdmin]);

  const loadGalleryItems = async () => {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'gallery'));
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setGalleryItems(items);
        localStorage.setItem('yr_gallery_items', JSON.stringify(items));
      } catch (error) {
        console.error("Firestore read error, falling back to Local Storage", error);
        loadLocalGallery();
      }
    } else {
      loadLocalGallery();
    }
  };

  const loadLocalGallery = () => {
    const saved = localStorage.getItem('yr_gallery_items');
    if (saved) {
      setGalleryItems(JSON.parse(saved));
    } else {
      setGalleryItems(initialGalleryItems);
      localStorage.setItem('yr_gallery_items', JSON.stringify(initialGalleryItems));
    }
  };

  // Sign In Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');

    // 1. Check local mock credentials first (failsafe bypass, takes precedence)
    const isLocalAdminValid = 
      (email === 'digital@yr.com' && password === 'YR@2023');

    if (isLocalAdminValid) {
      setIsAdmin(true);
      localStorage.setItem('yr_admin_session', 'active');
      return;
    }

    // 2. If not local credentials, authenticate via Google Firebase if configured
    if (isFirebaseConfigured && auth) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setIsAdmin(true);
      } catch (error) {
        setAuthError('Invalid administrator credentials.');
      }
    } else {
      setAuthError('Invalid administrator credentials (local fallback).');
    }
  };

  // Sign Out Handler
  const handleLogout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Firebase logout error", error);
      }
    }
    setIsAdmin(false);
    localStorage.removeItem('yr_admin_session');
    setEmail('');
    setPassword('');
    handleRedirectToPublicSite();
  };

  // CRUD: Add Gallery Item
  const handleAddWork = async (e) => {
    e.preventDefault();
    if (!newWork.title) return;

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, 'gallery'), newWork);
        const updatedItems = [...galleryItems, { id: docRef.id, ...newWork }];
        setGalleryItems(updatedItems);
        localStorage.setItem('yr_gallery_items', JSON.stringify(updatedItems));
      } catch (error) {
        console.error("Firestore write error, saving locally", error);
        addLocalWork();
      }
    } else {
      addLocalWork();
    }
    addActivity('🖼️', `Published new portfolio card: "${newWork.title}" under ${newWork.category.toUpperCase()}`);
    setNewWork({ title: '', category: 'frames', image: '/branding.jpg' });
    setCustomImageUrl('');
    setUploadProgress(null);
    setUploadError(null);
    triggerSuccess('New portfolio item added successfully!');
  };

  const addLocalWork = () => {
    const nextId = galleryItems.length > 0 ? Math.max(...galleryItems.map(i => i.id)) + 1 : 1;
    const item = { id: nextId, ...newWork };
    const updated = [...galleryItems, item];
    setGalleryItems(updated);
    localStorage.setItem('yr_gallery_items', JSON.stringify(updated));
  };

  const handleCloudinaryUpload = (file) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    const cloudName = cloudinaryCloudName;
    const preset = cloudinaryUploadPreset;

    if (!cloudName || !preset) {
      // Mock Sandbox upload
      let fakeProgress = 0;
      const interval = setInterval(() => {
        fakeProgress += 10;
        if (fakeProgress >= 100) {
          clearInterval(interval);
          const reader = new FileReader();
          reader.onload = (e) => {
            setNewWork(prev => ({ ...prev, image: e.target.result }));
            setIsUploading(false);
            setUploadProgress(100);
            addActivity('🧪', `Sandbox mock upload processed successfully (Base64 URL created)`);
            triggerSuccess('Mock upload successful! Enter Cloudinary keys in Settings to connect.');
          };
          reader.onerror = () => {
            setUploadError('Failed to read local file.');
            setIsUploading(false);
          };
          reader.readAsDataURL(file);
        } else {
          setUploadProgress(fakeProgress);
        }
      }, 100);
      return;
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', preset);

    xhr.open('POST', url, true);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percentComplete = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        setNewWork(prev => ({ ...prev, image: response.secure_url }));
        setIsUploading(false);
        setUploadProgress(100);
        addActivity('☁️', `Uploaded portfolio photo to Cloudinary cloud repository`);
        triggerSuccess('Photo uploaded to Cloudinary successfully!');
      } else {
        let errMsg = 'Failed to upload photo to Cloudinary.';
        try {
          const errResponse = JSON.parse(xhr.responseText);
          if (errResponse.error && errResponse.error.message) {
            errMsg = `Cloudinary Error: ${errResponse.error.message}`;
          }
        } catch (e) {}
        setUploadError(errMsg);
        setIsUploading(false);
      }
    };

    xhr.onerror = () => {
      setUploadError('Network error occurred during Cloudinary upload.');
      setIsUploading(false);
    };

    xhr.send(formData);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleCloudinaryUpload(files[0]);
    }
  };

  // CRUD: Delete Gallery Item
  const handleDeleteWork = async (id) => {
    const itemToDelete = galleryItems.find(item => item.id === id);
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'gallery', id.toString()));
      } catch (error) {
        console.error("Firestore delete error", error);
      }
    }
    const updated = galleryItems.filter(item => item.id !== id);
    setGalleryItems(updated);
    localStorage.setItem('yr_gallery_items', JSON.stringify(updated));
    addActivity('🗑️', `Deleted portfolio card: "${itemToDelete ? itemToDelete.title : id}"`);
    triggerSuccess('Portfolio item deleted successfully!');
  };

  // CRUD: Save General Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('yr_business_name', businessName);
    localStorage.setItem('yr_business_subtitle', businessSubtitle);
    localStorage.setItem('yr_hero_title', heroTitle);
    localStorage.setItem('yr_business_email', businessEmail);
    localStorage.setItem('yr_business_phone', businessPhone);
    localStorage.setItem('yr_business_address', businessAddress);
    localStorage.setItem('yr_business_hours', businessHours);
    localStorage.setItem('yr_cloudinary_cloud_name', cloudinaryCloudName);
    localStorage.setItem('yr_cloudinary_upload_preset', cloudinaryUploadPreset);

    // Dispatch storage event to alert Header component in real time!
    window.dispatchEvent(new Event('storage'));
    addActivity('⚙️', `Updated business contact and Cloudinary storage settings`);
    triggerSuccess('Configuration settings updated successfully!');
  };

  const triggerSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Count active stats
  const totalReviews = JSON.parse(localStorage.getItem('yr_reviews_count') || '3');

  // =========================================================================
  // VIEW: AUTH LOGIN PANEL
  // =========================================================================
  if (!isAdmin) {
    return (
      <div className="admin-login-page">
        <div className="login-card">
          <div className="login-brand">
            <img src="/logo.png" alt="YR Logo" className="login-logo-img" />
            <h2>YR Admin Panel</h2>
            <p>Enter administrator details to open dashboard</p>
          </div>

          {authError && <div className="auth-error-alert">{authError}</div>}

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Admin Email</label>
              <input
                type="email"
                id="email"
                required
                placeholder="admin@yr.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Security Password</label>
              <input
                type="password"
                id="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary btn-solid login-btn">
              Unlock Dashboard
            </button>
          </form>

          <button
            type="button"
            onClick={handleRedirectToPublicSite}
            className="back-to-site-btn"
            style={{
              marginTop: '16px',
              background: 'rgba(37, 99, 235, 0.05)',
              border: '1px solid rgba(37, 99, 235, 0.15)',
              borderRadius: '8px',
              padding: '10px 16px',
              color: '#2563eb',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'block',
              width: '100%',
              textAlign: 'center',
              transition: 'background 0.2s'
            }}
          >
            🌐 Back to Public Website
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: MAIN SECURE DASHBOARD VIEW
  // =========================================================================
  return (
    <div className="admin-dashboard-page">
      <div className="admin-sidebar">
        <div className="admin-profile">
          <img src="/logo.png" alt="YR Logo" className="admin-logo-avatar" />
          <div>
            <h3>YR Control</h3>
            <span>{isFirebaseConfigured ? 'Firebase Active' : 'Local Sandbox Mode'}</span>
          </div>
        </div>

        <nav className="admin-nav-menu">
          <button
            className={`admin-menu-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Analytics Overview
          </button>
          <button
            className={`admin-menu-link ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            🖼️ Portfolio Manager
          </button>
          <button
            className={`admin-menu-link ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Business Settings
          </button>
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <button
            onClick={handleRedirectToPublicSite}
            className="admin-menu-link"
            style={{
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              textAlign: 'left',
              width: '100%',
              color: '#475569'
            }}
          >
            🌐 View Public Website
          </button>
          <button onClick={handleLogout} className="admin-signout-btn" style={{ marginTop: 0, width: '100%' }}>
            🔒 Sign Out
          </button>
        </div>
      </div>

      <div className="admin-main-content">
        <header className="admin-top-header">
          <h2>Dashboard Control Panel</h2>
          <span className="admin-badge">ADMIN ACTIVE</span>
        </header>

        {successMsg && <div className="admin-success-alert">🎉 {successMsg}</div>}

        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="tab-pane-content" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Database Connection Info Status Card */}
            <div className="dashboard-info-panel" style={{ borderLeft: isFirebaseConfigured ? '5px solid #10b981' : '5px solid #f5b041' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isFirebaseConfigured ? '🟢 Live Production Database Active' : '🟠 Sandbox Local Database Active'}
                  </h3>
                  <p style={{ margin: '6px 0 0 0', fontSize: '0.9rem', color: '#64748b' }}>
                    {isFirebaseConfigured
                      ? 'Connected live to Google Firebase cloud database. Changes populate instantly across servers.'
                      : 'Running in failsafe local environment. Operations persist in browser storage until Firebase keys are pasted.'}
                  </p>
                </div>
                {!isFirebaseConfigured && (
                  <details style={{ width: '100%', marginTop: '12px' }}>
                    <summary style={{ cursor: 'pointer', fontSize: '0.85rem', color: '#2563eb', fontWeight: 600 }}>
                      💡 Need to link your Google Firebase live server? View Config Steps
                    </summary>
                    <div style={{ marginTop: '12px', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#475569', lineHeight: '1.6' }}>
                      <strong>Follow these quick steps:</strong>
                      <ol style={{ paddingLeft: '20px', margin: '8px 0' }}>
                        <li>Create a project in the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>Google Firebase Console</a>.</li>
                        <li>Add a new Web App under project settings and retrieve your configuration credentials.</li>
                        <li>Open the folder <code>src/firebase.js</code> inside your code editor.</li>
                        <li>Replace the placeholders inside the <code>firebaseConfig</code> object with your API credentials.</li>
                        <li>Save the file and refresh this page. The system will connect dynamically!</li>
                      </ol>
                    </div>
                  </details>
                )}
              </div>
            </div>

            {/* Metrics Counters */}
            <div className="stats-grid-4">
              <div className="stat-box">
                <span className="stat-label">Portfolio Items</span>
                <span className="stat-val">{galleryItems.length}</span>
                <span className="stat-trend text-green" style={{ fontWeight: 600 }}>Active in Marquee</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Customer Reviews</span>
                <span className="stat-val">{totalReviews}</span>
                <span className="stat-trend text-green" style={{ fontWeight: 600 }}>5.0 average stars</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Total Services Offered</span>
                <span className="stat-val">3</span>
                <span className="stat-trend" style={{ fontWeight: 600 }}>Prints, Graphic, Web</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">System Health</span>
                <span className="stat-val">Online</span>
                <span className="stat-trend text-blue" style={{ fontWeight: 600 }}>Responsive & synced</span>
              </div>
            </div>

            {/* CMS Activity Log Feed Card */}
            <div className="dashboard-info-panel" style={{ padding: '24px 32px' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📋 Administrator Activity Feed Log
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activities.map((act) => (
                  <div key={act.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '1.4rem' }}>{act.icon}</span>
                    <div style={{ flexGrow: 1 }}>
                      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>{act.text}</p>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PORTFOLIO MANAGER ================= */}
        {activeTab === 'gallery' && (
          <div className="tab-pane-content">
            <div className="crud-dashboard-split">
              {/* Left Column: Form to Add Portfolio Item */}
              <div className="crud-form-card">
                <h3>Add New Completed Work</h3>
                <form onSubmit={handleAddWork} className="crud-form">
                  <div className="form-group">
                    <label>Product Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wedding Golden Foil Invite"
                      value={newWork.title}
                      onChange={(e) => setNewWork({ ...newWork, title: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Category Tag</label>
                    <select
                      value={newWork.category}
                      onChange={(e) => setNewWork({ ...newWork, category: e.target.value })}
                    >
                      <option value="frames">Photo Frames</option>
                      <option value="invitations">Invitations</option>
                      <option value="cards">Visiting Cards</option>
                      <option value="banners">Banners</option>
                      <option value="apparel">T-Shirt Printing</option>
                      <option value="stickers">Stickers</option>
                      <option value="corporate">Corporate & Branding</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Portfolio Photo Resource</label>
                    <div className="photo-source-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                      <button
                        type="button"
                        className={`source-tab-btn ${imageSelectMethod === 'upload' ? 'active' : ''}`}
                        onClick={() => {
                          setImageSelectMethod('upload');
                          setNewWork(prev => ({ ...prev, image: '' }));
                        }}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '8px',
                          border: imageSelectMethod === 'upload' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                          background: imageSelectMethod === 'upload' ? 'rgba(37, 99, 235, 0.05)' : '#ffffff',
                          color: imageSelectMethod === 'upload' ? '#2563eb' : '#475569',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        ☁️ Upload File
                      </button>
                      <button
                        type="button"
                        className={`source-tab-btn ${imageSelectMethod === 'url' ? 'active' : ''}`}
                        onClick={() => {
                          setImageSelectMethod('url');
                          setNewWork(prev => ({ ...prev, image: customImageUrl || '' }));
                        }}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '8px',
                          border: imageSelectMethod === 'url' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                          background: imageSelectMethod === 'url' ? 'rgba(37, 99, 235, 0.05)' : '#ffffff',
                          color: imageSelectMethod === 'url' ? '#2563eb' : '#475569',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        🔗 Image URL
                      </button>
                      <button
                        type="button"
                        className={`source-tab-btn ${imageSelectMethod === 'preset' ? 'active' : ''}`}
                        onClick={() => {
                          setImageSelectMethod('preset');
                          setNewWork(prev => ({ ...prev, image: '/branding.jpg' }));
                        }}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '8px',
                          border: imageSelectMethod === 'preset' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                          background: imageSelectMethod === 'preset' ? 'rgba(37, 99, 235, 0.05)' : '#ffffff',
                          color: imageSelectMethod === 'preset' ? '#2563eb' : '#475569',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        🖼️ Presets
                      </button>
                    </div>

                    {/* METHOD 1: DRAG & DROP CLOUDINARY UPLOAD ZONE */}
                    {imageSelectMethod === 'upload' && (
                      <div
                        className={`drag-drop-upload-zone ${isDragOver ? 'dragover' : ''} ${newWork.image ? 'has-preview' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        style={{
                          border: isDragOver ? '2px dashed #2563eb' : '2px dashed #cbd5e1',
                          borderRadius: '16px',
                          padding: '24px 16px',
                          textAlign: 'center',
                          background: isDragOver ? 'rgba(37, 99, 235, 0.05)' : '#f8fafc',
                          transition: 'all 0.2s ease',
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                          cursor: 'pointer',
                          minHeight: '180px'
                        }}
                        onClick={() => document.getElementById('portfolio-file-input').click()}
                      >
                        <input
                          type="file"
                          id="portfolio-file-input"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleCloudinaryUpload(e.target.files[0]);
                            }
                          }}
                        />

                        {newWork.image ? (
                          <div className="upload-preview-container" style={{ position: 'relative', width: '100%', maxWidth: '200px' }}>
                            <img
                              src={newWork.image}
                              alt="Portfolio Preview"
                              style={{
                                width: '100%',
                                height: '120px',
                                objectFit: 'cover',
                                borderRadius: '12px',
                                border: '1px solid #cbd5e1',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                              }}
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setNewWork(prev => ({ ...prev, image: '' }));
                                setUploadProgress(null);
                                setUploadError(null);
                              }}
                              style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: '#ef4444',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                              }}
                              title="Clear Photo"
                            >
                              ✕
                            </button>
                            <span style={{ fontSize: '0.8rem', color: '#10b981', display: 'block', marginTop: '8px', fontWeight: '700' }}>
                              ✓ Upload Completed!
                            </span>
                          </div>
                        ) : isUploading ? (
                          <div className="upload-progress-container" style={{ width: '100%', padding: '10px' }}>
                            <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                              Uploading photo to server...
                            </span>
                            <div className="progress-bar-track" style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                              <div
                                className="progress-bar-fill"
                                style={{
                                  width: `${uploadProgress || 0}%`,
                                  height: '100%',
                                  background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
                                  transition: 'width 0.2s ease-out'
                                }}
                              ></div>
                            </div>
                            <span style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 'bold', display: 'block', marginTop: '6px' }}>
                              {uploadProgress || 0}%
                            </span>
                          </div>
                        ) : (
                          <>
                            <div style={{ fontSize: '2.2rem', margin: '0' }}>📸</div>
                            <div style={{ textAlign: 'center' }}>
                              <p style={{ margin: '0', fontWeight: '600', color: '#1e293b', fontSize: '0.9rem' }}>
                                Drag & Drop Photo Here
                              </p>
                              <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.75rem' }}>
                                or click to select image file from computer
                              </p>
                            </div>
                            <span
                              className="integration-badge"
                              style={{
                                fontSize: '0.7rem',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontWeight: '600',
                                background: (cloudinaryCloudName && cloudinaryUploadPreset) ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 176, 65, 0.08)',
                                color: (cloudinaryCloudName && cloudinaryUploadPreset) ? '#10b981' : '#f5b041',
                                border: (cloudinaryCloudName && cloudinaryUploadPreset) ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid rgba(245, 176, 65, 0.15)'
                              }}
                            >
                              {(cloudinaryCloudName && cloudinaryUploadPreset) ? '🟢 Cloudinary Cloud Connected' : '🟠 Failsafe Local Sandbox Active'}
                            </span>
                          </>
                        )}

                        {uploadError && (
                          <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: '600', marginTop: '4px', textAlign: 'center', width: '100%' }}>
                            ❌ {uploadError}
                          </div>
                        )}
                      </div>
                    )}

                    {/* METHOD 2: CUSTOM IMAGE URL INPUT */}
                    {imageSelectMethod === 'url' && (
                      <div className="url-input-container">
                        <input
                          type="text"
                          required={imageSelectMethod === 'url'}
                          placeholder="e.g. https://images.unsplash.com/photo-..."
                          value={customImageUrl}
                          onChange={(e) => {
                            setCustomImageUrl(e.target.value);
                            setNewWork({ ...newWork, image: e.target.value });
                          }}
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.9rem',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                          }}
                        />
                        {newWork.image && (
                          <div style={{ marginTop: '12px', textAlign: 'center' }}>
                            <img
                              src={newWork.image}
                              alt="URL Preview"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                              style={{
                                maxWidth: '100%',
                                maxHeight: '100px',
                                objectFit: 'contain',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* METHOD 3: LOCAL PRESET SELECTOR */}
                    {imageSelectMethod === 'preset' && (
                      <select
                        value={newWork.image || '/branding.jpg'}
                        onChange={(e) => setNewWork({ ...newWork, image: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                          background: '#ffffff',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="/branding.jpg">Branding Background (/branding.jpg)</option>
                        <option value="/graphic.jpg">Graphic Canvas (/graphic.jpg)</option>
                        <option value="/web.jpg">Web Layout (/web.jpg)</option>
                        <option value="/about-us.png">Creative Printing Banner (/about-us.png)</option>
                        <option value="/avatar.png">Portrait Graphic (/avatar.png)</option>
                      </select>
                    )}
                  </div>
                  <button type="submit" className="btn-primary btn-solid crud-btn">
                    Publish Portfolio Card
                  </button>
                </form>
              </div>

              {/* Right Column: Manage / List Items */}
              <div className="crud-list-card">
                <h3>Active Works List ({galleryItems.length})</h3>
                <div className="crud-scroll-list">
                  {galleryItems.map((item) => (
                    <div key={item.id} className="crud-list-row">
                      <img src={item.image} alt={item.title} className="crud-row-thumbnail" />
                      <div className="crud-row-info">
                        <h4>{item.title}</h4>
                        <span>{item.category.toUpperCase()}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteWork(item.id)}
                        className="crud-delete-btn"
                        title="Delete Card"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: BUSINESS SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="tab-pane-content" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="crud-form-card" style={{ maxWidth: '800px' }}>
              <h3>General Configuration Settings</h3>
              <form onSubmit={handleSaveSettings} className="crud-form">

                <h4 style={{ margin: '10px 0 0 0', color: '#2563eb', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>Public Website Copy</h4>

                <div className="form-group">
                  <label>Business Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. YR Digital Enterprises"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Business Subtitle (Prints / Designs description)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Designing & Printing Solutions"
                    value={businessSubtitle}
                    onChange={(e) => setBusinessSubtitle(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Hero Welcome Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. YR Digital Enterprises"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                  />
                </div>

                <h4 style={{ margin: '20px 0 0 0', color: '#2563eb', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>Enterprise Contact Details</h4>

                <div className="form-group">
                  <label>Corporate Support Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. contact@yrdigital.com"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Business Telephone Support Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Corporate Address Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 123 Main Street, Townsville"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Operational Weekly Hours</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mon - Sat: 9:00 AM - 8:00 PM"
                    value={businessHours}
                    onChange={(e) => setBusinessHours(e.target.value)}
                  />
                </div>

                <h4 style={{ margin: '30px 0 0 0', color: '#2563eb', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>☁️ Cloudinary Cloud Storage Integration</h4>
                <p style={{ margin: '8px 0 16px 0', fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                  Enable direct drag-and-drop portfolio photo uploads to Cloudinary cloud servers. If empty, the system runs in <strong>Local Sandbox Mode</strong> (creating dynamic temporary test previews).
                </p>

                <div className="form-group">
                  <label>Cloudinary Cloud Name</label>
                  <input
                    type="text"
                    placeholder="e.g. drlddwgpb"
                    value={cloudinaryCloudName}
                    onChange={(e) => setCloudinaryCloudName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Cloudinary Unsigned Upload Preset</label>
                  <input
                    type="text"
                    placeholder="e.g. ml_default"
                    value={cloudinaryUploadPreset}
                    onChange={(e) => setCloudinaryUploadPreset(e.target.value)}
                  />
                  <small style={{ display: 'block', marginTop: '6px', fontSize: '0.75rem', color: '#64748b', lineHeight: '1.4' }}>
                    💡 <strong>Unsigned Upload Preset setup</strong>: Log in to your Cloudinary console, navigate to <em>Settings ➔ Upload</em>, scroll down to <em>Upload presets</em>, click "Add upload preset", set the mode to <strong>Unsigned</strong>, and paste the preset name here.
                  </small>
                </div>

                <button type="submit" className="btn-primary btn-solid crud-btn" style={{ marginTop: '20px' }}>
                  Save Settings & Update Site
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
