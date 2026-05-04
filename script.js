// ─── GOOGLE APPS SCRIPT SETUP ───
// ⚠️ REPLACE THIS WITH YOUR GOOGLE APPS SCRIPT URL
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxp-aVvUvceYaYmouyVwr2Bwg0UNYEQvTtcN3wPezKA9rfJYU-FuRaOAroVHLoD91iU/exec";

// ─── CURSOR ───
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .chip, .work-item, .service-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    follower.style.opacity = '0.2';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.transform = 'translate(-50%, -50%) scale(1)';
    follower.style.opacity = '0.5';
  });
});

// ─── NAV SCROLL ───
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ─── HAMBURGER / MOBILE MENU ───
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('.mm-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ─── REVEAL ON SCROLL ───
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, parseInt(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => revealObserver.observe(el));

// ─── TOOL BARS ANIMATION ───
const toolBars = document.querySelectorAll('.tool-fill');
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
toolBars.forEach(bar => barObserver.observe(bar));

// ─── HIGHLIGHT REVEAL ───
const highlightObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.highlight').forEach(el => highlightObserver.observe(el));

// ─── WORK FILTER (Updated with Mobile Logic) ───
const filterBtns = document.querySelectorAll('.filter-btn');
const workItems = document.querySelectorAll('.work-item');
const workGrid = document.querySelector('.work-grid'); 
const gridVideos = document.querySelectorAll('.portfolio-video'); 

// Check if the screen is mobile size on load
const isMobile = window.innerWidth <= 768;

if (isMobile) {
  // Mobile: Remove active state from "All" and hide all works initially
  document.querySelector('.filter-btn[data-filter="all"]').classList.remove('active');
  workGrid.setAttribute('data-active-filter', 'none');
  workItems.forEach(item => item.classList.add('hidden'));
} else {
  // Desktop: Load with "All" active
  workGrid.setAttribute('data-active-filter', 'all');
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    workGrid.setAttribute('data-active-filter', filter);

    // Hide or Show the grid items
    workItems.forEach(item => {
      const cat = item.dataset.cat;
      if (filter === 'all' || cat === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });

    // Handle Thumbnail Autoplay Logic
    if (['video', 'video-edit', 'client-edit', 'web', 'ai-series', 'story-animation', 'client-story'].includes(filter)) {
      gridVideos.forEach(vid => {
        vid.play().catch(err => console.log("Waiting for user interaction..."));
      }); 
    } else {
      gridVideos.forEach(vid => {
        vid.load();
      });
    }
  });
});

// ─── CONTACT FORM (Email Integration via Google Apps Script) ───
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = "Sending... <i class='fa-solid fa-spinner fa-spin'></i>";
    submitBtn.disabled = true;

    // Grab values from the HTML inputs
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      service: document.getElementById('service').value,
      message: document.getElementById('message').value,
      timestamp: new Date().toISOString()
    };

    try {
      // Send Email via Google Apps Script
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8", 
        },
        body: JSON.stringify(formData),
      });

      // Show Success Message
      submitBtn.innerHTML = "✓ Message Sent!";
      submitBtn.style.background = "#7fffd4";
      submitBtn.style.color = "#0e0e0e";
      submitBtn.style.borderColor = "#7fffd4";
      contactForm.reset();

    } catch (error) {
      console.error("Error:", error);
      submitBtn.innerHTML = "Error! Try Again.";
      submitBtn.style.background = "#ff6b6b"; 
      submitBtn.style.color = "#fff";
      submitBtn.style.borderColor = "#ff6b6b";
    } finally {
      // Reset button back to normal after 3 seconds
      setTimeout(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.style.background = "";
        submitBtn.style.color = "";
        submitBtn.style.borderColor = "";
        submitBtn.disabled = false;
      }, 3000);
    }
  });
}

// ─── HERO TITLE STAGGER ───
document.querySelectorAll('.hero-title .line').forEach((line, i) => {
  line.style.opacity = '0';
  line.style.transform = 'translateY(30px)';
  line.style.transition = `opacity 0.7s ease ${0.3 + i * 0.15}s, transform 0.7s ease ${0.3 + i * 0.15}s`;
  setTimeout(() => {
    line.style.opacity = '1';
    line.style.transform = 'translateY(0)';
  }, 1700);
});

// Stagger hero elements too
['.hero-eyebrow', '.hero-bio', '.hero-actions', '.hero-stats'].forEach((sel, i) => {
  const el = document.querySelector(sel);
  if (!el) return;
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity 0.6s ease ${1.9 + i * 0.12}s, transform 0.6s ease ${1.9 + i * 0.12}s`;
  setTimeout(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }, 100);
});

// ─── SMOOTH ANCHOR SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── VIDEO MODAL LOGIC (The Pop-up) ───
const playBtns = document.querySelectorAll('.play-btn');
const videoModal = document.getElementById('video-modal');
const modalVideo = document.getElementById('modal-video');
const closeModal = document.getElementById('close-modal');
const modalBackdrop = document.getElementById('modal-backdrop');

// 1. Open modal and play video
playBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    const videoSrc = btn.getAttribute('data-video');
    if (videoSrc) {
      modalVideo.src = videoSrc;
      videoModal.classList.add('active');
      modalVideo.play();
    }
  });
});

// 2. Close modal function
const closeVideoModal = () => {
  videoModal.classList.remove('active');
  modalVideo.pause();
  modalVideo.src = ''; 
};

// 3. Triggers to close the modal
closeModal.addEventListener('click', closeVideoModal); 
modalBackdrop.addEventListener('click', closeVideoModal); 

// Close when pressing the 'Escape' key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && videoModal.classList.contains('active')) {
    closeVideoModal();
  }
});

// ─── LOADER ───
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 800);
});