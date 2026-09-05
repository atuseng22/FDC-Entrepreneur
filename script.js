// ===== INTERSECTION OBSERVER UNTUK REVEAL ANIMATION =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe semua elemen dengan class reveal
document.querySelectorAll('.reveal').forEach((el) => {
  observer.observe(el);
});

// ===== SMOOTH SCROLL & ACTIVE NAV =====
const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, {
  threshold: 0.3
});

sections.forEach((section) => {
  navObserver.observe(section);
});

// ===== SMOOTH SCROLL UNTUK LINK =====
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== PARALLAX EFFECT =====
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      
      // Parallax untuk orbs
      const orbOne = document.querySelector('.orb-one');
      const orbTwo = document.querySelector('.orb-two');
      
      if (orbOne) {
        orbOne.style.transform = `translateY(${scrollY * 0.5}px)`;
      }
      if (orbTwo) {
        orbTwo.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
      
      ticking = false;
    });
    ticking = true;
  }
});

// ===== HERO VISUAL - CANVAS 3D (OPTIONAL) =====
const canvas = document.getElementById('fdc-webgl');

if (canvas && canvas.getContext) {
  const ctx = canvas.getContext('2d');
  
  const resizeCanvas = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  let animationId;
  const particles = [];
  
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.radius = Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }
    
    draw() {
      ctx.fillStyle = `rgba(0, 217, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Buat particles
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
  }
  
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((particle) => {
      particle.update();
      particle.draw();
      
      // Draw connections
      particles.forEach((otherParticle) => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          ctx.strokeStyle = `rgba(0, 217, 255, ${0.1 * (1 - distance / 100)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.stroke();
        }
      });
    });
    
    animationId = requestAnimationFrame(animate);
  };
  
  animate();
}

// ===== WHATSAPP BUTTON TRACKING =====
const whatsappButton = document.querySelector('.whatsapp-button');
if (whatsappButton) {
  whatsappButton.addEventListener('click', (e) => {
    // Optional: track atau log click
    console.log('WhatsApp button clicked');
  });
}

// ===== SCROLL TO TOP BUTTON FUNCTIONALITY =====
const scrollToTopLink = document.querySelector('footer a[href="#home"]');
if (scrollToTopLink) {
  scrollToTopLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ===== ANIMATE NUMBERS =====
function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = (timestamp - startTimestamp) / duration;
    
    if (progress < 1) {
      element.textContent = Math.floor(start + (end - start) * progress);
      requestAnimationFrame(step);
    } else {
      element.textContent = end;
    }
  };
  
  requestAnimationFrame(step);
}

// ===== HOVER EFFECTS =====
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card) => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-10px)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
  });
});

// ===== LIGHT EFFECT FOLLOW MOUSE =====
const serviceGrid = document.querySelector('.service-grid');
if (serviceGrid) {
  serviceGrid.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.left = `${x - 100}px`;
        glow.style.top = `${y - 100}px`;
      }
    });
  });
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Bisa tambah fitur lainnya
  }
});

// ===== LOAD EVENT =====
window.addEventListener('load', () => {
  // Semua elemen sudah loaded
  console.log('FDC Entrepreneur website loaded');
});

// ===== CUSTOM CURSOR EFFECT (OPTIONAL) =====
const customCursorEnabled = true;

if (customCursorEnabled) {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);
  
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });
  
  // Style cursor via inline atau CSS
  Object.assign(cursor.style, {
    position: 'fixed',
    width: '30px',
    height: '30px',
    border: '2px solid rgba(0, 217, 255, 0.5)',
    borderRadius: '50%',
    pointerEvents: 'none',
    transform: 'translate(-50%, -50%)',
    zIndex: '10000',
    display: 'none'
  });
  
  // Show cursor on page
  document.addEventListener('mouseenter', () => {
    cursor.style.display = 'block';
  });
  
  document.addEventListener('mouseleave', () => {
    cursor.style.display = 'none';
  });
}

// ===== FORM VALIDATION (JIKA ADA) =====
const form = document.querySelector('form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Tambah validasi sesuai kebutuhan
    console.log('Form submitted');
  });
}

// ===== ACCESSIBILITY - SKIP TO MAIN =====
const skipLink = document.createElement('a');
skipLink.href = '#home';
skipLink.textContent = 'Skip to main content';
skipLink.style.cssText = `
  position: absolute;
  top: -40px;
  left: 0;
  background: #00d9ff;
  color: #080512;
  padding: 8px;
  z-index: 100;
`;

skipLink.addEventListener('focus', () => {
  skipLink.style.top = '0';
});

skipLink.addEventListener('blur', () => {
  skipLink.style.top = '-40px';
});

document.body.insertBefore(skipLink, document.body.firstChild);

console.log('FDC Entrepreneur - Script loaded successfully');
