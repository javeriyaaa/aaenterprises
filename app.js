// Application Controller for AA Enterprises Website

let uploadedFiles = [];

document.addEventListener("DOMContentLoaded", () => {
  // Navigation scrolling effects
  window.addEventListener("scroll", handleScroll);
  
  // Mobile Nav Toggle
  const mobileToggle = document.getElementById("mobile-toggle");
  const navLinks = document.getElementById("nav-links");
  
  mobileToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    const icon = mobileToggle.querySelector("i");
    if (navLinks.classList.contains("active")) {
      icon.classList.replace("fa-bars", "fa-xmark");
    } else {
      icon.classList.replace("fa-xmark", "fa-bars");
    }
  });

  // Nav Links click helper to close mobile menu
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      mobileToggle.querySelector("i").classList.replace("fa-xmark", "fa-bars");
    });
  });

  // Category Tab Switching Logic
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".items-tab-content");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Deactivate all buttons
      tabButtons.forEach(b => b.classList.remove("active"));
      // Activate clicked button
      btn.classList.add("active");

      // Hide all contents
      tabContents.forEach(content => content.classList.remove("active"));
      
      // Show matching category contents
      const category = btn.getAttribute("data-category");
      const targetContent = document.getElementById(`items-${category}`);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });

  // 3D Visual Ring Dot click events to auto-select checklist items
  const ringDots = document.querySelectorAll(".ring-dot");
  ringDots.forEach(dot => {
    dot.addEventListener("click", () => {
      const category = dot.getAttribute("data-category");
      const item = dot.getAttribute("data-item");

      if (category && item) {
        // Scroll to estimator section
        const estimatorSection = document.getElementById("estimator");
        if (estimatorSection) {
          estimatorSection.scrollIntoView({ behavior: "smooth" });
        }

        // Programmatically select tab button
        const tabBtn = document.querySelector(`.tab-btn[data-category="${category}"]`);
        if (tabBtn) {
          tabBtn.click();
        }

        // Programmatically find and check checkbox
        const checkbox = document.querySelector(`#items-${category} input[value="${item}"]`);
        if (checkbox) {
          if (!checkbox.checked) {
            checkbox.checked = true;
            showToast(`Selected "${item}" to sell!`, "success");
          } else {
            showToast(`"${item}" is already selected!`, "success");
          }
        }
      }
    });
  });

  // Pickup Inquiry Form Submit
  const pickupForm = document.getElementById("pickup-inquiry-form");
  if (pickupForm) {
    pickupForm.addEventListener("submit", handlePickupSubmit);
  }

  // Direct Contact Form Submit
  const contactForm = document.getElementById("contact-direct-form");
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);
  }



  // File Dropzone Setup
  setupFileDropzone();

  // Success Ticket Reset and Print Buttons
  const ticketPrintBtn = document.getElementById("btn-ticket-print");
  if (ticketPrintBtn) {
    ticketPrintBtn.addEventListener("click", () => {
      window.print();
    });
  }

  const ticketResetBtn = document.getElementById("btn-ticket-reset");
  if (ticketResetBtn) {
    ticketResetBtn.addEventListener("click", resetPickupForm);
  }
});

// Scroll Effects (Navbar shrinking and active link highlights)
function handleScroll() {
  const header = document.getElementById("header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  // Active section detection
  const sections = document.querySelectorAll("section");
  const scrollPosition = window.scrollY + 120; // offset

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");

    if (scrollPosition >= top && scrollPosition < top + height) {
      document.querySelectorAll(".nav-links a").forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${id}`) {
          link.classList.add("active");
        }
      });
    }
  });
}

// Handle Pickup Inquiry Submission (Checkboxes + Contact Info + Ticket Output)
function handlePickupSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("pick-name").value;
  const phone = document.getElementById("pick-phone").value;
  const email = document.getElementById("pick-email").value;
  const company = document.getElementById("pick-company").value;
  const msg = document.getElementById("pick-msg").value;

  // Gather selected checkbox values
  const checkedBoxes = document.querySelectorAll(".scrap-checkbox:checked");
  const selectedItems = Array.from(checkedBoxes).map(cb => cb.value);

  if (!name || !phone) {
    showToast("Name and Phone number are required fields.", "error");
    return;
  }

  const submitBtn = document.getElementById("btn-submit-pickup");
  submitBtn.innerHTML = `Generating Ticket... <i class="fa-solid fa-spinner fa-spin"></i>`;
  submitBtn.disabled = true;

  setTimeout(() => {
    // Generate Unique Ticket Number
    const randomId = Math.floor(10000 + Math.random() * 90000);
    const ticketId = `AAE-2026-${randomId}`;

    // Populate Ticket Details in UI
    document.getElementById("ticket-id-val").textContent = ticketId;
    document.getElementById("ticket-name-val").textContent = name;
    document.getElementById("ticket-phone-val").textContent = phone;
    
    const emailRow = document.getElementById("ticket-email-row");
    if (email) {
      document.getElementById("ticket-email-val").textContent = email;
      emailRow.style.display = "block";
    } else {
      emailRow.style.display = "none";
    }

    const companyRow = document.getElementById("ticket-company-row");
    if (company) {
      document.getElementById("ticket-company-val").textContent = company;
      companyRow.style.display = "block";
    } else {
      companyRow.style.display = "none";
    }

    const msgSection = document.getElementById("ticket-msg-section");
    if (msg) {
      document.getElementById("ticket-msg-val").textContent = msg;
      msgSection.style.display = "block";
    } else {
      msgSection.style.display = "none";
    }

    // Populate Selected Scrap Items
    const tagsContainer = document.getElementById("ticket-items-val");
    tagsContainer.innerHTML = "";
    if (selectedItems.length > 0) {
      selectedItems.forEach(item => {
        const tag = document.createElement("span");
        tag.className = "ticket-tag";
        tag.innerHTML = `<i class="fa-solid fa-check"></i> ${item}`;
        tagsContainer.appendChild(tag);
      });
    } else {
      const tag = document.createElement("span");
      tag.className = "ticket-tag";
      tag.style.borderColor = "var(--secondary)";
      tag.style.color = "var(--secondary)";
      tag.innerHTML = `<i class="fa-solid fa-circle-info"></i> General Site Clearance Audit`;
      tagsContainer.appendChild(tag);
    }

    // Populate Uploaded Images Previews
    const photoSection = document.getElementById("ticket-photos-section");
    const photoGrid = document.getElementById("ticket-photos-val");
    photoGrid.innerHTML = "";
    
    if (uploadedFiles.length > 0) {
      uploadedFiles.forEach(file => {
        const img = document.createElement("img");
        img.className = "ticket-photo-item";
        img.src = URL.createObjectURL(file);
        img.alt = file.name;
        photoGrid.appendChild(img);
      });
      photoSection.style.display = "block";
    } else {
      photoSection.style.display = "none";
    }

    // Format WhatsApp Pre-filled Text URL
    const waPhone = "919845267440";
    const itemsList = selectedItems.length > 0 
      ? selectedItems.map(item => `• ${item}`).join("\n") 
      : "• General Bulk Scrap Audit";
    
    const waMessage = `Hi AA Enterprises! I have submitted a scrap pickup inquiry.

*Ticket ID:* ${ticketId}
*Client Name:* ${name}
*Phone:* ${phone}
${email ? `*Email:* ${email}\n` : ""}${company ? `*Company:* ${company}\n` : ""}*Items to Sell:*
${itemsList}

*Location & Details:*
${msg || "Not specified"}${uploadedFiles.length > 0 ? `\n\n[Attached: ${uploadedFiles.length} photos of scrap]` : ""}`;

    const waUrl = `https://api.whatsapp.com/send?phone=${waPhone}&text=${encodeURIComponent(waMessage)}`;
    document.getElementById("btn-ticket-whatsapp").href = waUrl;

    // Switch Form View to Success Ticket View
    document.getElementById("pickup-form-wrapper").style.display = "none";
    document.getElementById("pickup-success-ticket").style.display = "block";

    // Reset Submit Button
    submitBtn.innerHTML = `Schedule Callback <i class="fa-solid fa-paper-plane"></i>`;
    submitBtn.disabled = false;

    showToast(`Ticket ${ticketId} generated successfully!`, "success");
    document.getElementById("estimator").scrollIntoView({ behavior: 'smooth' });
  }, 1500);
}

// Setup File Drag & Drop Upload
function setupFileDropzone() {
  const dropzone = document.getElementById("file-dropzone");
  const fileInput = document.getElementById("pick-photos");
  
  if (!dropzone || !fileInput) return;

  // Trigger input click on dropzone click
  dropzone.addEventListener("click", (e) => {
    // Prevent double trigger if clicking label/input directly
    if (e.target !== fileInput && !e.target.closest(".browse-link")) {
      fileInput.click();
    }
  });

  // File Input selection change
  fileInput.addEventListener("change", (e) => {
    handleFilesSelected(e.target.files);
  });

  // Drag-over styling events
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    }, false);
  });

  // Drop handler
  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFilesSelected(files);
  }, false);
}

// Handle files selected via drop or dialog
function handleFilesSelected(files) {
  if (!files || files.length === 0) return;

  Array.from(files).forEach(file => {
    // Validate image types
    if (file.type.startsWith('image/')) {
      uploadedFiles.push(file);
    } else {
      showToast("Please upload image files only.", "error");
    }
  });

  renderFilePreviews();
}

// Render thumbnail previews of files in the form
function renderFilePreviews() {
  const previewContainer = document.getElementById("file-previews");
  if (!previewContainer) return;

  previewContainer.innerHTML = "";

  uploadedFiles.forEach((file, index) => {
    const thumb = document.createElement("div");
    thumb.className = "preview-thumb";

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.alt = file.name;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-btn";
    removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent opening file dialog
      uploadedFiles.splice(index, 1);
      renderFilePreviews();
    });

    thumb.appendChild(img);
    thumb.appendChild(removeBtn);
    previewContainer.appendChild(thumb);
  });
}



// Reset Pickup Form & Success Ticket
function resetPickupForm() {
  const pickupForm = document.getElementById("pickup-inquiry-form");
  if (pickupForm) {
    pickupForm.reset();
  }

  // Uncheck all boxes
  document.querySelectorAll(".scrap-checkbox").forEach(cb => {
    cb.checked = false;
  });

  // Clear files
  uploadedFiles = [];
  renderFilePreviews();

  // Reset view
  document.getElementById("pickup-form-wrapper").style.display = "block";
  document.getElementById("pickup-success-ticket").style.display = "none";
  
  showToast("Form reset. You can submit another request.", "success");
  document.getElementById("estimator").scrollIntoView({ behavior: 'smooth' });
}

// Handle Contact Form Submission
function handleContactSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("c-name").value;
  const phone = document.getElementById("c-phone").value;
  const contactDirectForm = document.getElementById("contact-direct-form");
  const contactSuccess = document.getElementById("contact-success");
  
  if (!name || !phone) {
    showToast("Name and Phone number are required.", "error");
    return;
  }

  const submitBtn = contactDirectForm.querySelector('button[type="submit"]');
  submitBtn.innerHTML = `Sending... <i class="fa-solid fa-spinner fa-spin"></i>`;
  submitBtn.disabled = true;

  setTimeout(() => {
    contactDirectForm.style.display = "none";
    contactSuccess.style.display = "block";
    showToast("Message sent! We will call you soon.", "success");
  }, 1200);
}

// Reset contact form success state back to original form
function resetContactForm() {
  const contactDirectForm = document.getElementById("contact-direct-form");
  const contactSuccess = document.getElementById("contact-success");
  
  contactDirectForm.reset();
  contactDirectForm.style.display = "block";
  contactSuccess.style.display = "none";
  
  const submitBtn = contactDirectForm.querySelector('button[type="submit"]');
  submitBtn.innerHTML = `Send Direct Message <i class="fa-solid fa-paper-plane"></i>`;
  submitBtn.disabled = false;
}

// Show feedback toasts dynamically
function showToast(message, type = "success") {
  const toastHolder = document.getElementById("toast-holder");
  const toast = document.createElement("div");
  toast.className = `toast ${type === "error" ? "error" : ""}`;
  
  const icon = type === "error" ? "fa-circle-exclamation" : "fa-circle-check";
  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;

  toastHolder.appendChild(toast);

  // Remove toast after animation completes
  setTimeout(() => {
    toast.style.animation = "slideIn 0.3s reverse forwards";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}
