// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close nav on link click (mobile)
navLinks?.addEventListener('click', (e) => {
  if (e.target.tagName === 'A' && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
  }
});

// Smooth scroll offset fix for sticky nav
const links = document.querySelectorAll('.nav-links a');
links.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const id = link.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;
    const y = target.getBoundingClientRect().top + window.pageYOffset - 70;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});

// Simple form handler (demo only)
async function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const status = form.querySelector('.form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;

  status.textContent = 'Sending...';
  status.className = 'form-status sending';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    const formData = new FormData(form);

    // The backend expects multipart/form-data which fetch handles automatically with FormData
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      status.textContent = 'Message sent successfully!';
      status.className = 'form-status success';
      form.reset();
    } else {
      throw new Error(data.error || 'Failed to send message');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    status.textContent = 'Error: ' + error.message;
    status.className = 'form-status error';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;

    // Clear status after 5 seconds
    setTimeout(() => {
      status.textContent = '';
      status.className = 'form-status';
    }, 5000);
  }
  return false;
}

// Set current year
document.getElementById('year').textContent = new Date().getFullYear();

// Generic infinite marquee with controls
const initMarquee = (trackSelector, windowSelector, prevSelector, nextSelector, interval = 2800, transition = 450) => {
  const track = document.querySelector(trackSelector);
  const win = document.querySelector(windowSelector);
  const prevBtn = document.querySelector(prevSelector);
  const nextBtn = document.querySelector(nextSelector);
  if (!track || !win) return;

  const baseCards = Array.from(track.children);
  const baseCount = baseCards.length;
  baseCards.forEach((card) => track.appendChild(card.cloneNode(true)));

  let index = 0;
  let cardWidth = 0;
  let gap = 16;

  const measure = () => {
    const first = track.querySelector(':scope > *');
    if (!first) return;
    const rect = first.getBoundingClientRect();
    cardWidth = rect.width;
    const style = window.getComputedStyle(track);
    gap = parseInt(style.columnGap || style.gap || '16', 10) || 16;
    move(false);
  };

  const move = (animate = true) => {
    if (!cardWidth) return;
    track.style.transition = animate ? `transform ${transition}ms ease` : 'none';
    const offset = -(index * (cardWidth + gap));
    track.style.transform = `translateX(${offset}px)`;
    if (!animate) {
      // force reflow to re-enable transition
      // eslint-disable-next-line no-unused-expressions
      track.offsetHeight;
    }
  };

  const next = () => {
    index += 1;
    move();
    if (index >= baseCount) {
      setTimeout(() => {
        index = 0;
        move(false);
      }, transition + 10);
    }
  };

  const prev = () => {
    index -= 1;
    if (index < 0) {
      index = baseCount - 1;
      move(false);
    }
    move();
  };

  let timer = setInterval(next, interval);
  const pause = () => clearInterval(timer);
  const resume = () => {
    clearInterval(timer);
    timer = setInterval(next, interval);
  };

  nextBtn?.addEventListener('click', () => {
    pause();
    next();
    resume();
  });

  prevBtn?.addEventListener('click', () => {
    pause();
    prev();
    resume();
  });

  win.addEventListener('mouseenter', pause);
  win.addEventListener('mouseleave', resume);
  window.addEventListener('resize', measure);
  measure();
};

initMarquee('.cert-track', '.cert-window', '.cert-btn.prev', '.cert-btn.next', 3200, 450);
initMarquee('.skill-track', '.skill-window', '.skill-btn.prev', '.skill-btn.next', 2600, 420);


// Background particles for Projects section
function createParticles() {
  const container = document.getElementById('projects-bg');
  if (!container) return;

  const particleCount = 25;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random size between 4px and 12px
    const size = Math.random() * 8 + 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random position
    particle.style.left = `${Math.random() * 100}%`;
    
    // Random animation properties
    const duration = Math.random() * 10 + 10; // 10-20s
    particle.style.animationDuration = `${duration}s`;
    
    const delay = Math.random() * 5;
    particle.style.animationDelay = `${delay}s`;
    
    // Random opacity
    particle.style.opacity = Math.random() * 0.5 + 0.1;
    
    container.appendChild(particle);
  }
}

document.addEventListener('DOMContentLoaded', createParticles);

