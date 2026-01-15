

// DOM Elements
const modal = document.getElementById('hireModal');
const joinModal = document.getElementById('joinModal');
const closeBtn = document.querySelector('.close-btn');
const hireForm = document.getElementById('hireForm');
const joinForm = document.getElementById('joinForm');
const submitBtn = hireForm ? hireForm.querySelector('.submit-btn') : null;

// Open modal when any "Hire Team" button is clicked
document.addEventListener('click', function(e) {
  if (e.target.matches('button') && e.target.textContent.includes('Hire Team')) {
    openModal();
  }
  
  // Open join modal when any "Join" button is clicked
  if (e.target.matches('.join-btn')) {
    const role = e.target.getAttribute('data-role');
    openJoinModal(role);
  }

  // Scroll to designs section when "See Templates" button is clicked
  if (e.target.matches('button') && e.target.textContent.includes('See Templates')) {
    const designsSection = document.getElementById('designs');
    if (designsSection) {
      designsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

// Close modal function
function closeModal() {
  if (modal) {
    modal.style.display = 'none';
  }
  if (hireForm) {
    hireForm.reset();
  }
}

// Open modal function
function openModal() {
  if (modal) {
    modal.style.display = 'flex';
  }
}

// Close button click
if (closeBtn) {
  closeBtn.addEventListener('click', closeModal);
}

// Close modal when clicking outside
if (modal) {
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
    closeModal();
  }
});

// Handle form submission
if (hireForm) {
  hireForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      message: document.getElementById('message').value.trim(),
      created_at: new Date().toISOString()
    };

    // Log form data (replace with actual submission as needed)
    console.log('Form submitted:', formData);
    alert('Thank you! Your request has been sent. We will contact you soon.');
    closeModal();
  });
}

// ==========================================
// Developer Join Modal Functions
// ==========================================

// Close join modal function
function closeJoinModal() {
  if (joinModal) {
    joinModal.style.display = 'none';
  }
  if (joinForm) {
    joinForm.reset();
  }
}

// Open join modal function with role
function openJoinModal(role) {
  if (joinModal) {
    joinModal.style.display = 'flex';
    // Set the hidden role field
    const modalRoleInput = document.getElementById('modalRole');
    if (modalRoleInput) {
      modalRoleInput.value = role || '';
    }
  }
}

// Close join modal button
const joinCloseBtn = joinModal ? joinModal.querySelector('.close-btn') : null;
if (joinCloseBtn) {
  joinCloseBtn.addEventListener('click', closeJoinModal);
}

// Close join modal when clicking outside
if (joinModal) {
  window.addEventListener('click', function(e) {
    if (e.target === joinModal) {
      closeJoinModal();
    }
  });
}

// Close join modal with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && joinModal && joinModal.style.display === 'flex') {
    closeJoinModal();
  }
});

// Handle join form submission
if (joinForm) {
  joinForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = {
      role: document.getElementById('modalRole').value,
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      experience: document.getElementById('experience').value,
      type: document.getElementById('type').value,
      skills: document.getElementById('skills').value.trim(),
      created_at: new Date().toISOString()
    };

    // Log form data (replace with actual submission as needed)
    console.log('Join Form submitted:', formData);
    alert('Thank you! Your application to join our community has been submitted. We will contact you soon.');
    closeJoinModal();
  });
}

