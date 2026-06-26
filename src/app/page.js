"use client";

import { useState, useEffect, useRef } from "react";

const DAILY_RATES = [
  { name: "Copper Armoured Cables", price: "₹480 - ₹525/kg", trend: "up" },
  { name: "IT Server Blade Units", price: "₹3,200 - ₹4,500/unit", trend: "up" },
  { name: "Aluminium Section Scrap", price: "₹145 - ₹168/kg", trend: "up" },
  { name: "Split AC Units (1.5 Ton)", price: "₹4,200 - ₹5,500/unit", trend: "stable" },
  { name: "Used Diesel Generator (DG)", price: "₹75,000 - ₹3,50,000/set", trend: "up" },
  { name: "Lead-Acid Battery Cells", price: "₹92 - ₹105/kg", trend: "up" },
  { name: "Heavy Brass Castings", price: "₹340 - ₹385/kg", trend: "stable" },
  { name: "Heavy Structural Steel", price: "₹38 - ₹44/kg", trend: "up" },
  { name: "IT Corporate Laptops", price: "₹2,500 - ₹4,800/unit", trend: "stable" }
];

const ITEM_VALUATIONS = {
  // IT
  "Laptops": { unit: "unit", defaultQty: 5 },
  "Desktop Computers": { unit: "unit", defaultQty: 5 },
  "Server Racks": { unit: "unit", defaultQty: 1 },
  "UPS & Lead Batteries": { unit: "kg", defaultQty: 100 },
  "Office Printers": { unit: "unit", defaultQty: 2 },
  
  // AC
  "Split AC Units": { unit: "unit", defaultQty: 2 },
  "Window AC Units": { unit: "unit", defaultQty: 2 },
  "Centralized Chiller Plants": { unit: "unit", defaultQty: 1 },
  "Outdoor AC Condenser Units": { unit: "unit", defaultQty: 2 },
  "AHU & Ducting": { unit: "kg", defaultQty: 200 },
  "AC Copper Tubing": { unit: "kg", defaultQty: 50 },
  
  // Cables & Wires
  "Armoured Copper Cables": { unit: "kg", defaultQty: 100 },
  "Aluminium Cables": { unit: "kg", defaultQty: 150 },
  "Transformers": { unit: "unit", defaultQty: 1 },
  "Distribution Panels": { unit: "unit", defaultQty: 1 },
  
  // Generators
  "Used Industrial DG Sets": { unit: "set", defaultQty: 1 },
  "Portable & Commercial Generators": { unit: "unit", defaultQty: 1 },
  "Large Alternators & Dynamos": { unit: "unit", defaultQty: 1 },
  "Diesel Engine Parts": { unit: "kg", defaultQty: 200 },
  
  // Metals
  "Iron & Steel Scrap": { unit: "kg", defaultQty: 500 },
  "Pure Copper Scrap": { unit: "kg", defaultQty: 50 },
  "Brass Casting Scrap": { unit: "kg", defaultQty: 100 },
  "Aluminium Scrap": { unit: "kg", defaultQty: 150 }
};

const CATEGORIES = {
  it: {
    label: "IT Scrap",
    icon: "fa-solid fa-desktop",
    title: "IT & Corporate Scrap",
    desc: "Complete e-waste disposal and asset recovery for IT companies, call centers, and corporate office parks.",
    instruction: "Select items and enter quantity to sell:",
    items: [
      { value: "Laptops", label: "Laptops (Old/Broken)" },
      { value: "Desktop Computers", label: "Desktop Computers" },
      { value: "Server Racks", label: "Server Racks & Blade Servers" },
      { value: "UPS & Lead Batteries", label: "UPS & Lead-Acid Batteries" },
      { value: "Office Printers", label: "Printers & Copiers" }
    ]
  },
  ac: {
    label: "AC Plants",
    icon: "fa-solid fa-snowflake",
    title: "AC Scrap & Chillers",
    desc: "Dismantling, recycling, and purchasing of all AC types (split AC, window AC, package units, and central chillers).",
    instruction: "Select items and enter quantity to sell:",
    items: [
      { value: "Split AC Units", label: "Split AC Units (Indoor/Outdoor)" },
      { value: "Window AC Units", label: "Window AC Units" },
      { value: "Centralized Chiller Plants", label: "Centralized Chiller Plants" },
      { value: "Outdoor AC Condenser Units", label: "Outdoor Condensers & Compressors" },
      { value: "AHU & Ducting", label: "Air Handling Units (AHU) & Ducting" },
      { value: "AC Copper Tubing", label: "AC Copper Tubing & Coils" }
    ]
  },
  electrical: {
    label: "Cables & Wires",
    icon: "fa-solid fa-bolt",
    title: "Electric Cables & Wires",
    desc: "Buying copper and aluminium conductors with certified recovery and eco-friendly processing.",
    instruction: "Select items and enter quantity to sell:",
    items: [
      { value: "Armoured Copper Cables", label: "Armoured Copper Cables" },
      { value: "Aluminium Cables", label: "Aluminium Cables" },
      { value: "Transformers", label: "Industrial Transformers" },
      { value: "Distribution Panels", label: "Electrical Control Panels" }
    ]
  },
  machinery: {
    label: "Used Generators",
    icon: "fa-solid fa-plug-circle-bolt",
    title: "Used Generators",
    desc: "We buy all types of second-hand and used generators, second-hand diesel generator (DG) sets, large alternators, dynamos, and engines.",
    instruction: "Select items and enter quantity to sell:",
    items: [
      { value: "Used Industrial DG Sets", label: "Used Industrial DG Sets" },
      { value: "Portable & Commercial Generators", label: "Portable & Commercial Generators" },
      { value: "Large Alternators & Dynamos", label: "Large Alternators & Dynamos" },
      { value: "Diesel Engine Parts", label: "Diesel Engine & Stator Parts" }
    ]
  },
  metals: {
    label: "Bulk Metals",
    icon: "fa-solid fa-cubes",
    title: "Bulk Scrap Metals",
    desc: "Highly accurate weighments and top pricing for raw metals from demolitions and turnarounds.",
    instruction: "Select items and enter quantity to sell:",
    items: [
      { value: "Iron & Steel Scrap", label: "Iron / Steel Scrap" },
      { value: "Pure Copper Scrap", label: "Copper Scrap & Tubes" },
      { value: "Brass Casting Scrap", label: "Brass Castings & Scrap" },
      { value: "Aluminium Scrap", label: "Aluminium Sections & Sheets" }
    ]
  }
};


// ==========================================
// Interactive Components & Datasets
// ==========================================

function CountUpNumber({ end, duration = 1500, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setStarted(true);
  }, []);

  useEffect(() => {
    if (!started) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration, started]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  // Navigation & Scroll states
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Estimator Form states
  const [activeTab, setActiveTab] = useState("it");
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemQuantities, setItemQuantities] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  const [pickupForm, setPickupForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    message: ""
  });
  const [isSubmittingPickup, setIsSubmittingPickup] = useState(false);
  const [successTicket, setSuccessTicket] = useState(null);

  // Direct Contact Form states
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Toasts state
  const [toasts, setToasts] = useState([]);

  const fileInputRef = useRef(null);

  // 3D Mouse Movement Tilt State & Handlers
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setTilt({ x: x * 20, y: -y * 20 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Toast utility
  const showToast = (message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Scroll handler for navbar shrink & highlight
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      const sections = ["home", "services", "estimator", "about", "why-us", "contact"];
      const scrollPosition = window.scrollY + 120;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3D Capsule click behavior
  const handle3DNodeClick = (category, item) => {
    const el = document.getElementById("estimator");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setActiveTab(category);
    setSelectedItems(prev => {
      if (!prev.includes(item)) {
        setItemQuantities(q => ({
          ...q,
          [item]: ITEM_VALUATIONS[item]?.defaultQty || 1
        }));
        showToast(`Selected "${item}" to sell!`, "success");
        return [...prev, item];
      } else {
        showToast(`"${item}" is already selected!`, "success");
        return prev;
      }
    });
  };

  // Checkbox toggle
  const handleCheckboxChange = (itemVal) => {
    setSelectedItems(prev => {
      if (prev.includes(itemVal)) {
        setItemQuantities(q => {
          const newQ = { ...q };
          delete newQ[itemVal];
          return newQ;
        });
        return prev.filter(i => i !== itemVal);
      } else {
        setItemQuantities(q => ({
          ...q,
          [itemVal]: ITEM_VALUATIONS[itemVal]?.defaultQty || 1
        }));
        return [...prev, itemVal];
      }
    });
  };

  // Dropzone file handlers
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(f => f.type.startsWith("image/"));
    if (imageFiles.length < files.length) {
      showToast("Please upload image files only.", "error");
    }
    setUploadedFiles(prev => [...prev, ...imageFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(f => f.type.startsWith("image/"));
    if (imageFiles.length < files.length) {
      showToast("Please upload image files only.", "error");
    }
    setUploadedFiles(prev => [...prev, ...imageFiles]);
  };

  const removeUploadedFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Form Submissions
  const handlePickupSubmit = (e) => {
    e.preventDefault();
    if (!pickupForm.name || !pickupForm.phone) {
      showToast("Name and Phone number are required fields.", "error");
      return;
    }

    setIsSubmittingPickup(true);

    setTimeout(() => {
      const randomId = Math.floor(10000 + Math.random() * 90000);
      const ticketId = `AAE-2026-${randomId}`;

      const waPhone = "919845189902"; // Ashfaque Ahmed

      const itemsList = selectedItems.length > 0 
        ? selectedItems.map(item => `• ${item}: ${itemQuantities[item]} ${ITEM_VALUATIONS[item]?.unit || "units"}`).join("\n") 
        : "• General Bulk Scrap Audit";

      const waMessage = `Hi AA Enterprises! I have submitted a scrap pickup inquiry.

*Ticket ID:* ${ticketId}
*Client Name:* ${pickupForm.name}
*Phone:* ${pickupForm.phone}
${pickupForm.email ? `*Email:* ${pickupForm.email}\n` : ""}${pickupForm.company ? `*Company:* ${pickupForm.company}\n` : ""}*Items to Sell:*
${itemsList}

*Location & Details:*
${pickupForm.message || "Not specified"}${uploadedFiles.length > 0 ? `\n\n[Attached: ${uploadedFiles.length} photos of scrap]` : ""}`;

      const waUrl = `https://api.whatsapp.com/send?phone=${waPhone}&text=${encodeURIComponent(waMessage)}`;

      // Create preview object URLs for the success ticket display
      const photoUrls = uploadedFiles.map(file => URL.createObjectURL(file));

      setSuccessTicket({
        id: ticketId,
        name: pickupForm.name,
        phone: pickupForm.phone,
        email: pickupForm.email,
        company: pickupForm.company,
        message: pickupForm.message,
        items: selectedItems,
        quantities: { ...itemQuantities },
        photoUrls: photoUrls,
        whatsappUrl: waUrl
      });

      setIsSubmittingPickup(false);
      showToast(`Ticket ${ticketId} generated successfully!`, "success");

      // Scroll to estimator section top
      const el = document.getElementById("estimator");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 1500);
  };

  const handleResetPickup = () => {
    setPickupForm({
      name: "",
      phone: "",
      email: "",
      company: "",
      message: ""
    });
    setSelectedItems([]);
    setItemQuantities({});
    setUploadedFiles([]);
    setSuccessTicket(null);
    showToast("Form reset. You can submit another request.", "success");
    
    const el = document.getElementById("estimator");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone) {
      showToast("Name and Phone number are required.", "error");
      return;
    }

    setIsSubmittingContact(true);

    setTimeout(() => {
      setContactSuccess(true);
      setIsSubmittingContact(false);
      showToast("Message sent! We will call you soon.", "success");
    }, 1200);
  };

  const handleResetContact = () => {
    setContactForm({
      name: "",
      phone: "",
      email: "",
      message: ""
    });
    setContactSuccess(false);
  };

  const handlePrintTicket = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const genericWaUrl = `https://api.whatsapp.com/send?phone=919845189902&text=${encodeURIComponent(
    "Hi AA Enterprises, I have bulk scrap to sell and would like to schedule an inspection."
  )}`;

  return (
    <>
      {/* Header Navigation */}
      <header id="header" className={scrolled ? "scrolled" : ""}>
        <div className="nav-container">
          <a href="#home" className="logo" onClick={() => setMobileMenuOpen(false)}>
            <img 
              src={`${basePath}/logo.png`} 
              alt="AA Enterprises Logo" 
              style={{ height: "38px", width: "38px", objectFit: "contain", marginRight: "0.25rem" }} 
            />
            <div className="logo-text">AA<span>Enterprises</span></div>
          </a>
          
          <button 
            className="mobile-nav-toggle" 
            id="mobile-toggle" 
            aria-label="Toggle navigation"
            onClick={() => setMobileMenuOpen(prev => !prev)}
          >
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
          
          <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`} id="nav-links">
            <li>
              <a 
                href="#home" 
                className={activeSection === "home" ? "active" : ""}
                onClick={() => setMobileMenuOpen(false)}
              >Home</a>
            </li>
            <li>
              <a 
                href="#services" 
                className={activeSection === "services" ? "active" : ""}
                onClick={() => setMobileMenuOpen(false)}
              >Services</a>
            </li>
            <li>
              <a 
                href="#estimator" 
                className={activeSection === "estimator" ? "active" : ""}
                onClick={() => setMobileMenuOpen(false)}
              >Schedule Pickup</a>
            </li>

            <li>
              <a 
                href="#about" 
                className={activeSection === "about" ? "active" : ""}
                onClick={() => setMobileMenuOpen(false)}
              >About Us</a>
            </li>
            <li>
              <a 
                href="#contact" 
                className={activeSection === "contact" ? "active" : ""}
                onClick={() => setMobileMenuOpen(false)}
              >Contact</a>
            </li>
            <li>
              <a href="tel:+919845267440" className="nav-btn pulse-btn">
                <i className="fa-solid fa-phone"></i> Call Now
              </a>
            </li>
          </ul>
        </div>
      </header>

      {/* Live Scrap Rates Ticker */}
      <div className="rate-ticker-section">
        <div className="ticker-wrap">
          <div className="ticker">
            {[...DAILY_RATES, ...DAILY_RATES].map((item, idx) => (
              <div key={idx} className="ticker-item">
                <span className="item-name">{item.name}</span>
                <span className="item-price">
                  {item.price}
                  {item.trend === "up" ? (
                    <span className="price-up"><i className="fa-solid fa-caret-up"></i> Live</span>
                  ) : (
                    <span className="price-up" style={{ color: "var(--text-muted)" }}><i className="fa-solid fa-minus"></i> Stable</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-tagline">
                <span></span> Corporate Bulk Scrap Buying & Disposal
              </div>
              <h1 className="hero-title">
                Turn Bulk Industrial & Corporate <span>Scrap into Value</span>
              </h1>
              <p className="hero-desc">
                Led by co-founders Altaf Ahmed & Ashfaque Ahmed, AA Enterprises is your trusted partner for high-valuation, eco-compliant scrap disposal. We buy IT company assets, centralized AC plants, electric copper cables, and used generators.
              </p>
              <div className="hero-buttons">
                <a href="#estimator" className="btn-primary">
                  Schedule Scrap Pickup <i className="fa-solid fa-truck-pickup"></i>
                </a>
                <a href="#contact" className="btn-outline">
                  Schedule Site Audit <i className="fa-solid fa-calendar-days"></i>
                </a>
              </div>
              
              <div className="trust-badge-row">
                <span className="trust-badge">
                  <i className="fa-solid fa-star" style={{ color: "var(--secondary)" }}></i> Rated 4.8/5 on Justdial (JD)
                </span>
                <span className="trust-badge">
                  <i className="fa-solid fa-award"></i> Highly Ranked Everywhere
                </span>
              </div>

              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number"><CountUpNumber end={35} suffix="+" /></span>
                  <span className="stat-label">Years Experience</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number"><CountUpNumber end={100000} suffix="+" /></span>
                  <span className="stat-label">Clients Served</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number"><CountUpNumber end={100} suffix="%" /></span>
                  <span className="stat-label">Eco-Compliance</span>
                </div>
              </div>
            </div>
            
            <div className="hero-visual">
              <div className="visual-container">
                <div 
                  ref={containerRef}
                  className="gyro-perspective-container"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                    transition: "transform 0.1s ease-out"
                  }}
                >
                  {/* Depth Particles */}
                  <div className="space-particles">
                    <div className="particle p-1"></div>
                    <div className="particle p-2"></div>
                    <div className="particle p-3"></div>
                    <div className="particle p-4"></div>
                    <div className="particle p-5"></div>
                  </div>

                  {/* 3D Translucent Orbital Rings */}
                  <div className="orbital-ring-3d ring-a"></div>
                  <div className="orbital-ring-3d ring-b"></div>

                  {/* Central 3D Glowing Node */}
                  <div className="flow-center-3d">
                    <div className="flow-center-inner-3d">
                      <img src={`${basePath}/logo.png`} alt="AA Logo" className="flow-center-logo-3d" />
                      <span className="flow-center-text-3d">AA Enterprises</span>
                    </div>
                  </div>
                  
                  {/* 3D Orbit nodes wrapper */}
                  <div className="orbit-nodes-wrapper">
                    {/* Node capsules (Interactive 3D) */}
                    <div 
                      className="flow-node-3d node-it-3d" 
                      onClick={() => handle3DNodeClick("it", "Laptops")}
                      title="Click to select IT Scrap"
                    >
                      <i className="fa-solid fa-desktop"></i> <span>IT Scrap</span>
                    </div>
                    <div 
                      className="flow-node-3d node-ac-3d" 
                      onClick={() => handle3DNodeClick("ac", "Split AC Units")}
                      title="Click to select AC Scrap"
                    >
                      <i className="fa-solid fa-snowflake"></i> <span>AC Scrap</span>
                    </div>
                    <div 
                      className="flow-node-3d node-cables-3d" 
                      onClick={() => handle3DNodeClick("electrical", "Armoured Copper Cables")}
                      title="Click to select Cables"
                    >
                      <i className="fa-solid fa-bolt"></i> <span>Cables</span>
                    </div>
                    <div 
                      className="flow-node-3d node-generators-3d" 
                      onClick={() => handle3DNodeClick("machinery", "Used Industrial DG Sets")}
                      title="Click to select Generators"
                    >
                      <i className="fa-solid fa-plug-circle-bolt"></i> <span>Generators</span>
                    </div>
                    <div 
                      className="flow-node-3d node-metals-3d" 
                      onClick={() => handle3DNodeClick("metals", "Iron & Steel Scrap")}
                      title="Click to select Metals"
                    >
                      <i className="fa-solid fa-cubes"></i> <span>Metals</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scrap Categories Section */}
      <section id="services">
        <div className="container">
          <div className="section-header">
            <span className="subtitle">Our Services</span>
            <h2 className="section-title">What Scrap We Buy</h2>
            <p class="section-desc">We offer competitive pricing, swift on-site evaluation, and immediate logistical clearance for all bulk commercial and industrial scrap categories.</p>
          </div>
          
          <div className="categories-grid">
            {Object.keys(CATEGORIES).map((key) => {
              const cat = CATEGORIES[key];
              // Map key to local image name
              let imgName = "it_scrap.png";
              if (key === "ac") imgName = "ac_scrap.png";
              else if (key === "electrical") imgName = "scrap_cables.png";
              else if (key === "machinery") imgName = "generators_scrap.png";
              else if (key === "metals") imgName = "metal_scrap.png";

              return (
                <div 
                  key={key} 
                  className="category-card" 
                  onClick={() => {
                    const el = document.getElementById("estimator");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                    setActiveTab(key);
                  }}
                >
                  <div className="card-image-box">
                    <img src={`${basePath}/${imgName}`} alt={cat.title} />
                    <div className="card-image-overlay"></div>
                    <span className="card-category-icon"><i className={cat.icon}></i></span>
                  </div>
                  <div className="card-content">
                    <h3 className="category-title">{cat.title}</h3>
                    <p className="category-desc">{cat.desc}</p>
                    <ul className="category-items-list">
                      {cat.items.slice(0, 4).map((item, idx) => (
                        <li key={idx}>{item.label}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* Scrap pickup & callback request Section */}
      <section id="estimator">
        <div className="container">
          <div className="section-header">
            <span className="subtitle">Quick Inquiry</span>
            <h2 class="section-title">Schedule Scrap Pickup & Callback</h2>
            <p className="section-desc">Select the category list and specific item list under different sectioning tabs. Fill in your details and we will call you back to schedule an inspection.</p>
          </div>
          
          <div className="estimator-layout">
            {/* Column 1: Select Scrap Categories & Items */}
            <div className="estimator-card">
              <h3 className="estimator-title"><i className="fa-solid fa-list-check"></i> 1. Select Items to Sell</h3>
              
              {/* Category Tabs */}
              <div className="category-tabs" id="category-tabs">
                {Object.keys(CATEGORIES).map(key => (
                  <button 
                    key={key}
                    type="button" 
                    className={`tab-btn ${activeTab === key ? "active" : ""}`}
                    onClick={() => setActiveTab(key)}
                  >
                    <i className={CATEGORIES[key].icon}></i> {CATEGORIES[key].label}
                  </button>
                ))}
              </div>
              
              {/* Specific Items Checklist Grid */}
              <div className="items-selection-panel">
                {Object.keys(CATEGORIES).map(key => {
                  const cat = CATEGORIES[key];
                  return (
                    <div 
                      key={key} 
                      className={`items-tab-content ${activeTab === key ? "active" : ""}`}
                    >
                      <p className="selection-instruction">{cat.instruction}</p>
                      <div className="items-checkbox-grid">
                        {cat.items.map((item, idx) => {
                          const isChecked = selectedItems.includes(item.value);
                          return (
                            <div key={idx} className="checkbox-card-wrapper" style={{ display: "flex", flexDirection: "column", gap: "0.25rem", width: "100%" }}>
                              <label className="checkbox-card">
                                <input 
                                  type="checkbox" 
                                  className="scrap-checkbox" 
                                  checked={isChecked}
                                  onChange={() => handleCheckboxChange(item.value)}
                                />
                                <span className="checkmark"><i className="fa-solid fa-check"></i></span>
                                <span className="label-text">{item.label}</span>
                              </label>
                              
                              {isChecked && (
                                <div className="quantity-control-panel" onClick={(e) => e.stopPropagation()}>
                                  <span className="qty-label">Est. Quantity:</span>
                                  <div className="qty-actions">
                                    <button 
                                      type="button" 
                                      className="qty-btn"
                                      onClick={() => {
                                        setItemQuantities(prev => ({
                                          ...prev,
                                          [item.value]: Math.max(1, (prev[item.value] || 1) - (item.value.includes("Cables") || item.value.includes("Scrap") || item.value.includes("Tubing") || item.value.includes("AHU") || item.value.includes("Parts") ? 10 : 1))
                                        }));
                                      }}
                                    >
                                      -
                                    </button>
                                    <input 
                                      type="number" 
                                      className="qty-input-box" 
                                      value={itemQuantities[item.value] || 0}
                                      onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        setItemQuantities(prev => ({
                                          ...prev,
                                          [item.value]: Math.max(1, val)
                                        }));
                                      }}
                                    />
                                    <button 
                                      type="button" 
                                      className="qty-btn"
                                      onClick={() => {
                                        setItemQuantities(prev => ({
                                          ...prev,
                                          [item.value]: (prev[item.value] || 1) + (item.value.includes("Cables") || item.value.includes("Scrap") || item.value.includes("Tubing") || item.value.includes("AHU") || item.value.includes("Parts") ? 10 : 1)
                                        }));
                                      }}
                                    >
                                      +
                                    </button>
                                    <span className="qty-unit">{ITEM_VALUATIONS[item.value]?.unit || "unit"}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Column 2: Pickup Form & Success Ticket */}
            <div className="estimator-summary" style={{ backgroundColor: "var(--bg-surface)", padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "flex-start", border: "1px solid var(--border-color)", borderRadius: "20px", position: "relative" }}>
              {!successTicket ? (
                <div id="pickup-form-wrapper">
                  <h3 className="estimator-title" style={{ marginBottom: "2rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
                    <i className="fa-solid fa-user-pen"></i> 2. Contact Details
                  </h3>
                  
                  <form id="pickup-inquiry-form" onSubmit={handlePickupSubmit}>
                    <div className="form-group">
                      <label htmlFor="pick-name">Your Name *</label>
                      <input 
                        type="text" 
                        id="pick-name" 
                        value={pickupForm.name}
                        onChange={e => setPickupForm(prev => ({ ...prev, name: e.target.value }))}
                        required 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="pick-phone">Phone Number *</label>
                      <input 
                        type="tel" 
                        id="pick-phone" 
                        value={pickupForm.phone}
                        onChange={e => setPickupForm(prev => ({ ...prev, phone: e.target.value }))}
                        required 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="pick-email">Email Address</label>
                      <input 
                        type="email" 
                        id="pick-email" 
                        value={pickupForm.email}
                        onChange={e => setPickupForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="pick-company">Company Name</label>
                      <input 
                        type="text" 
                        id="pick-company" 
                        value={pickupForm.company}
                        onChange={e => setPickupForm(prev => ({ ...prev, company: e.target.value }))}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="pick-msg">Pickup Location & Details</label>
                      <textarea 
                        id="pick-msg" 
                        placeholder="Specify pickup location or approximate weight (e.g., 500 kg cables, 10 computers)..."
                        value={pickupForm.message}
                        onChange={e => setPickupForm(prev => ({ ...prev, message: e.target.value }))}
                      ></textarea>
                    </div>

                    {/* Photo Uploader */}
                    <div className="form-group">
                      <label>Upload Scrap Photos (Optional)</label>
                      <div 
                        className="file-dropzone" 
                        id="file-dropzone"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        onDragOver={e => e.preventDefault()}
                        onDrop={handleDrop}
                      >
                        <i className="fa-solid fa-cloud-arrow-up dropzone-icon"></i>
                        <p>Drag & drop photos or <span className="browse-link">Browse Files</span></p>
                        <input 
                          type="file" 
                          id="pick-photos" 
                          accept="image/*" 
                          multiple 
                          style={{ display: "none" }} 
                          ref={fileInputRef}
                          onChange={handleFileChange}
                        />
                      </div>
                      <div className="file-previews" id="file-previews">
                        {uploadedFiles.map((file, idx) => (
                          <div key={idx} className="preview-thumb">
                            <img src={URL.createObjectURL(file)} alt={file.name} />
                            <button 
                              type="button" 
                              className="remove-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeUploadedFile(idx);
                              }}
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      id="btn-submit-pickup" 
                      className="btn-submit-estimate" 
                      style={{ marginTop: "1.5rem" }}
                      disabled={isSubmittingPickup}
                    >
                      {isSubmittingPickup ? (
                        <>Generating Ticket... <i className="fa-solid fa-spinner fa-spin"></i></>
                      ) : (
                        <>Schedule Callback <i className="fa-solid fa-paper-plane"></i></>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                /* Digital Inspection Receipt Ticket */
                <div id="pickup-success-ticket" className="manifest-receipt">
                  <div className="receipt-header">
                    <div className="receipt-title-badge"><i className="fa-solid fa-receipt"></i> Manifest Logged</div>
                    <div className="receipt-id" id="ticket-id-val">{successTicket.id}</div>
                  </div>
                  
                  <div className="receipt-body">
                    <div className="receipt-section">
                      <h4>Client Information</h4>
                      <p className="receipt-info-text">
                        <strong>Name:</strong> {successTicket.name}<br />
                        <strong>Phone:</strong> {successTicket.phone}<br />
                        {successTicket.email && <><strong>Email:</strong> {successTicket.email}<br /></>}
                        {successTicket.company && <><strong>Company:</strong> {successTicket.company}<br /></>}
                      </p>
                    </div>
                    
                    <div className="receipt-section">
                      <h4>Materials Log & Quantities</h4>
                      <div className="receipt-tags-list">
                        {successTicket.items.length > 0 ? (
                          successTicket.items.map((item, idx) => {
                            const qty = successTicket.quantities[item] || 0;
                            const valInfo = ITEM_VALUATIONS[item];
                            return (
                              <div key={idx} className="receipt-tag" style={{ display: "block", marginBottom: "0.5rem" }}>
                                <i className="fa-solid fa-check" style={{ color: "var(--primary-light)" }}></i> 
                                <strong style={{ color: "var(--text-primary)" }}> {item}</strong>: {qty} {valInfo?.unit || "units"} 
                              </div>
                            );
                          })
                        ) : (
                          <div className="receipt-tag">
                            <i className="fa-solid fa-circle-info"></i> General Site Clearance Audit
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {successTicket.message && (
                      <div className="receipt-section">
                        <h4>Location & Logistics Notes</h4>
                        <p className="receipt-note">{successTicket.message}</p>
                      </div>
                    )}
                    
                    {successTicket.photoUrls.length > 0 && (
                      <div className="receipt-section">
                        <h4>Uploaded Media Logs</h4>
                        <div className="ticket-photos-grid" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                          {successTicket.photoUrls.map((url, idx) => (
                            <img key={idx} className="ticket-photo-item" src={url} alt={`Upload ${idx}`} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px", border: "1px solid var(--border-color)" }} />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* CSS Barcode */}
                    <div className="receipt-barcode-box">
                      <div className="barcode-lines"></div>
                      <div className="barcode-val">{successTicket.id}</div>
                    </div>

                    <div className="official-seal">
                      <span>AAE Verified</span>
                      <span style={{ fontSize: "0.38rem", marginTop: "2px" }}>Bangalore</span>
                    </div>

                    <div className="ticket-disclaimer" style={{ fontSize: "0.75rem", color: "var(--text-muted)", borderTop: "1px solid var(--border-color)", paddingTop: "1rem", marginTop: "1rem" }}>
                      <i className="fa-solid fa-info-circle"></i> AA Enterprises logistics crew will contact you within 2 hours. Final payment is issued via instantaneous online IMPS/NEFT transfer on-site.
                    </div>
                  </div>
                  
                  <div className="ticket-actions" style={{ padding: "0 1.5rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <a 
                      href={successTicket.whatsappUrl} 
                      id="btn-ticket-whatsapp" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-ticket-primary"
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", color: "white", padding: "0.85rem", borderRadius: "8px", fontWeight: "600" }}
                    >
                      <i className="fa-brands fa-whatsapp"></i> Send Manifest to WhatsApp
                    </a>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button 
                        type="button" 
                        id="btn-ticket-print" 
                        className="btn-ticket-secondary"
                        style={{ flex: 1, padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-primary)", cursor: "pointer" }}
                        onClick={handlePrintTicket}
                      >
                        <i className="fa-solid fa-print"></i> Print Receipt
                      </button>
                      <button 
                        type="button" 
                        id="btn-ticket-reset" 
                        className="btn-ticket-link"
                        style={{ flex: 1, padding: "0.75rem", borderRadius: "8px", border: "none", background: "transparent", color: "var(--text-muted)", cursor: "pointer", textDecoration: "underline" }}
                        onClick={handleResetPickup}
                      >
                        Submit Another
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>





      {/* About Us Section */}
      <section id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-visual">
              <div className="founders-frame">
                <h3 style={{ textAlign: "center", marginBottom: "2rem", fontFamily: "var(--font-heading)" }}>Our Leadership Team</h3>
                <div className="founders-container">
                  <div className="founder-card">
                    <div className="founder-avatar">AA</div>
                    <h4 className="founder-name">Altaf Ahmed</h4>
                    <span className="founder-role">Co-Founder & Director</span>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>Spearheads IT evaluations & corporate relations.</p>
                  </div>
                  
                  <div className="founder-card">
                    <div className="founder-avatar alt">AA</div>
                    <h4 className="founder-name">Ashfaque Ahmed</h4>
                    <span className="founder-role">Co-Founder & Director</span>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>Manages site clearance, dismantling, & logistics.</p>
                  </div>
                </div>
                
                {/* Trust Seal */}
                <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.8rem", color: "var(--primary)" }}>
                  <i className="fa-solid fa-circle-check"></i> Transparent weighing and instant bank transfer settlement.
                </div>
              </div>
            </div>
            
            <div className="about-content">
              <span className="subtitle">About AA Enterprises</span>
              <h2 className="section-title">Building Relationships Built on Transparency</h2>
              <p className="section-desc" style={{ marginBottom: "1.5rem" }}>
                Established by co-founders <strong>Altaf Ahmed</strong> and <strong>Ashfaque Ahmed</strong>, AA Enterprises has risen to become a premier scrap buying entity, offering compliant site disposal services to leading IT hubs, manufacturing plants, and commercial offices.
              </p>
              <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
                We operate with a simple philosophy: provide maximum fair market value, execute operations with certified safety protocols, and ensure zero-waste landfill outcomes through authorized eco-friendly recycling streams.
              </p>
              
              <div className="about-features">
                <div className="about-feature-item">
                  <div className="feature-icon"><i className="fa-solid fa-recycle"></i></div>
                  <div>
                    <h4 className="feature-title">Eco-friendly Disposals</h4>
                    <p className="feature-desc">Compliant with recycling standards and certified recycling pathways.</p>
                  </div>
                </div>
                
                <div className="about-feature-item">
                  <div className="feature-icon"><i className="fa-solid fa-scale-balanced"></i></div>
                  <div>
                    <h4 className="feature-title">Certified Weighment</h4>
                    <p className="feature-desc">Calibrated digital scale verification on-site in front of you.</p>
                  </div>
                </div>
                
                <div className="about-feature-item">
                  <div className="feature-icon"><i className="fa-solid fa-truck-ramp-box"></i></div>
                  <div>
                    <h4 className="feature-title">In-house Logistical Team</h4>
                    <p className="feature-desc">Own trucks, loaders, and expert dismantling crews.</p>
                  </div>
                </div>
                
                <div className="about-feature-item">
                  <div className="feature-icon"><i className="fa-solid fa-money-bill-transfer"></i></div>
                  <div>
                    <h4 className="feature-title">Immediate Payouts</h4>
                    <p className="feature-desc">Instant online bank transfers before any scrap leaves your premises.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Why Choose Us Grid */}
      <section id="why-us" style={{ backgroundColor: "rgba(255,255,255,0.01)", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}>
        <div className="container">
          <div className="section-header">
            <span className="subtitle">Why Choose Us</span>
            <h2 className="section-title">The AA Enterprises Advantage</h2>
            <p className="section-desc">How we set the benchmark for commercial scrap procurement in the region.</p>
          </div>
          
          <div className="why-us-grid">
            <div className="why-card">
              <span className="why-icon"><i className="fa-solid fa-handshake-angle"></i></span>
              <h3 className="why-title">Fair Price Match</h3>
              <p className="why-desc">We offer direct-to-smelter prices, bypassing intermediate dealers to give you maximum margins.</p>
            </div>
            
            <div className="why-card">
              <span className="why-icon"><i className="fa-solid fa-helmet-safety"></i></span>
              <h3 className="why-title">Safe Dismantling</h3>
              <p className="why-desc">Our crew is insured and fully trained to dismantle massive central AC plants and heavy machinery safely.</p>
            </div>
            
            <div className="why-card">
              <span className="why-icon"><i className="fa-solid fa-shield-halved"></i></span>
              <h3 className="why-title">Compliant Disposal</h3>
              <p className="why-desc">We issue disposal certificates and data destruction logs for all retired corporate computing units.</p>
            </div>
            
            <div className="why-card">
              <span className="why-icon"><i className="fa-solid fa-truck-fast"></i></span>
              <h3 className="why-title">Rapid Clearance</h3>
              <p className="why-desc">Large volume scrap operations are cleared in less than 24-48 hours from the approval of quote.</p>
            </div>
          </div>
        </div>
      </section>



      {/* Contact Us Section */}
      <section id="contact">
        <div className="container">
          <div className="section-header">
            <span className="subtitle">Get In Touch</span>
            <h2 className="section-title">Initiate Scrap Clearance</h2>
            <p className="section-desc">Connect directly with Altaf & Ashfaque Ahmed to schedule a site valuation visit.</p>
          </div>
          
          <div className="contact-grid">
            {/* Contact details */}
            <div className="contact-info-cards">
              {/* Phone Info */}
              <div className="info-card">
                <div className="info-icon"><i className="fa-solid fa-phone-volume"></i></div>
                <div className="info-details">
                  <span className="info-label">Direct Lines (Altaf Ahmed)</span>
                  <a href="tel:+919845267440" className="info-value phone-link">+91 98452 67440</a>
                  <span className="info-label" style={{ marginTop: "0.5rem" }}>Direct Lines (Ashfaque Ahmed)</span>
                  <a href="tel:+919845189902" className="info-value phone-link">+91 98451 89902</a>
                </div>
              </div>
              
              {/* Email Info */}
              <div className="info-card">
                <div className="info-icon"><i className="fa-solid fa-envelope"></i></div>
                <div className="info-details">
                  <span className="info-label">Corporate Email</span>
                  <a href="mailto:aaenterprises21@rocketmail.com" className="info-value" style={{ color: "var(--primary-light)" }}>aaenterprises21@rocketmail.com</a>
                </div>
              </div>
              
              {/* Location Info */}
              <div className="info-card">
                <div className="info-icon"><i className="fa-solid fa-location-dot"></i></div>
                <div className="info-details">
                  <span className="info-label">Operational Office & Warehouse</span>
                  <span className="info-value" style={{ fontSize: "0.95rem", fontWeight: "normal", color: "var(--text-secondary)" }}>
                    #23, 1st cross coffee board colony,<br />Shampura main road, Bangalore - 560045, Karnataka
                  </span>
                </div>
              </div>
            </div>
            
            {/* Standard Contact Form */}
            <div className="contact-form-card">
              {!contactSuccess ? (
                <form id="contact-direct-form" onSubmit={handleContactSubmit}>
                  <h3 style={{ marginBottom: "1.5rem", fontFamily: "var(--font-heading)" }}>Send a Message</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="c-name">Full Name *</label>
                      <input 
                        type="text" 
                        id="c-name" 
                        value={contactForm.name}
                        onChange={e => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="c-phone">Phone Number *</label>
                      <input 
                        type="tel" 
                        id="c-phone" 
                        value={contactForm.phone}
                        onChange={e => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="c-email">Email Address</label>
                    <input 
                      type="email" 
                      id="c-email" 
                      value={contactForm.email}
                      onChange={e => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="c-msg">Inquiry Description *</label>
                    <textarea 
                      id="c-msg" 
                      placeholder="Describe the types of scrap, estimated weight/quantities, or ask a general query..." 
                      value={contactForm.message}
                      onChange={e => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      required
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    style={{ width: "100%", justifyContent: "center" }}
                    disabled={isSubmittingContact}
                  >
                    {isSubmittingContact ? (
                      <>Sending... <i className="fa-solid fa-spinner fa-spin"></i></>
                    ) : (
                      <>Send Direct Message <i className="fa-solid fa-paper-plane"></i></>
                    )}
                  </button>
                </form>
              ) : (
                /* Success State */
                <div className="success-state" id="contact-success" style={{ display: "block" }}>
                  <div className="success-icon"><i className="fa-solid fa-check"></i></div>
                  <h3 className="success-title">Message Sent!</h3>
                  <p className="success-desc">Thank you for contacting AA Enterprises. Altaf Ahmed or Ashfaque Ahmed will get back to you with pricing details shortly.</p>
                  <button className="btn-outline" onClick={handleResetContact}>Send Another Message</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-grid">
          <div className="footer-col">
            <a href="#home" className="logo" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <img src={`${basePath}/logo.png`} alt="AA Enterprises Logo" style={{ height: "38px", width: "38px", objectFit: "contain" }} />
              <div className="logo-text">AA<span>Enterprises</span></div>
            </a>
            <p className="footer-desc">
              Professional scrap recycling partners operating transparent, eco-friendly procurement for IT, commercial, and industrial sites.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="social-link" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
              <a 
                href={genericWaUrl} 
                className="social-link" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="WhatsApp"
              >
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-col">
            <h4>Key Items We Buy</h4>
            <ul className="footer-links">
              <li><a href="#services">IT & Corporate Scrap</a></li>
              <li><a href="#services">AC Scrap & Chillers</a></li>
              <li><a href="#services">Electric Cables & Wires</a></li>
              <li><a href="#services">Used Generators</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#why-us">Why Choose Us</a></li>

              <li><a href="#estimator">Schedule Pickup</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>Working Hours</h4>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Monday - Saturday:</p>
            <p style={{ color: "var(--text-primary)", fontSize: "0.95rem", fontWeight: "600", marginBottom: "1rem" }}>8:00 AM - 8:00 PM</p>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Sunday:</p>
            <p style={{ color: "var(--text-primary)", fontSize: "0.95rem", fontWeight: "600" }}>Closed (Pickups by appointment)</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; 2026 AA Enterprises. All rights reserved. Run by Altaf Ahmed & Ashfaque Ahmed.
          </p>
          <div className="footer-meta-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Widget */}
      <a 
        href={genericWaUrl}
        className="whatsapp-float-widget" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <span className="whatsapp-tooltip">Chat with Ashfaque Ahmed</span>
        <i className="fa-brands fa-whatsapp"></i>
      </a>

      {/* Render Toast Notifications */}
      <div className="toast-container" id="toast-holder">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type === "error" ? "error" : ""}`}>
            <i className={`fa-solid ${t.type === "error" ? "fa-circle-exclamation" : "fa-circle-check"}`}></i>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}
