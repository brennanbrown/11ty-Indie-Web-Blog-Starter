// Easter eggs and fun interactions
class EasterEggs {
  constructor() {
    this.konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA'
    ];
    this.konamiIndex = 0;
    this.init();
  }

  init() {
    this.setupKonamiCode();
    this.setupClickEasterEgg();
    this.setupTypingEasterEgg();
  }

  setupKonamiCode() {
    document.addEventListener('keydown', (e) => {
      if (e.code === this.konamiCode[this.konamiIndex]) {
        this.konamiIndex++;
        if (this.konamiIndex === this.konamiCode.length) {
          this.triggerKonamiEasterEgg();
          this.konamiIndex = 0;
        }
      } else {
        this.konamiIndex = 0;
      }
    });
  }

  triggerKonamiEasterEgg() {
    // Create rainbow effect
    document.body.style.animation = 'rainbow 2s infinite';
    
    // Add rainbow keyframes if not already present
    if (!document.querySelector('#rainbow-styles')) {
      const style = document.createElement('style');
      style.id = 'rainbow-styles';
      style.textContent = `
        @keyframes rainbow {
          0% { filter: hue-rotate(0deg); }
          25% { filter: hue-rotate(90deg); }
          50% { filter: hue-rotate(180deg); }
          75% { filter: hue-rotate(270deg); }
          100% { filter: hue-rotate(360deg); }
        }
        .easter-egg-message {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
          background-size: 400% 400%;
          animation: rainbow-bg 2s ease infinite;
          color: white;
          padding: 20px;
          border-radius: 10px;
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          z-index: 9999;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        @keyframes rainbow-bg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `;
      document.head.appendChild(style);
    }

    // Show message
    const message = document.createElement('div');
    message.className = 'easter-egg-message';
    message.innerHTML = '🎉 Konami Code Activated! 🎉<br><small>You found the secret!</small>';
    document.body.appendChild(message);

    // Remove effects after 3 seconds
    setTimeout(() => {
      document.body.style.animation = '';
      message.remove();
    }, 3000);
  }

  setupClickEasterEgg() {
    let clickCount = 0;
    let resetTimer;
    
    // Use a more specific selector that won't interfere with navigation
    const logo = document.querySelector('header h1 a, header .site-title a');
    
    if (logo) {
      logo.addEventListener('click', (e) => {
        // Only trigger easter egg if we're already on the home page
        if (window.location.pathname === '/') {
          clickCount++;
          if (clickCount === 7) {
            e.preventDefault();
            this.triggerClickEasterEgg();
            clickCount = 0;
          }
          
          // Reset counter after 3 seconds of no clicks
          clearTimeout(resetTimer);
          resetTimer = setTimeout(() => {
            clickCount = 0;
          }, 3000);
        }
      });
    }
  }

  triggerClickEasterEgg() {
    // Make all images spin
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.style.transition = 'transform 2s ease';
      img.style.transform = 'rotate(360deg)';
      setTimeout(() => {
        img.style.transform = '';
      }, 2000);
    });

    // Show message
    this.showTemporaryMessage('🌟 Images are spinning! 🌟');
  }

  setupTypingEasterEgg() {
    let typedSequence = '';
    const secretWord = 'blog';
    
    document.addEventListener('keypress', (e) => {
      typedSequence += e.key.toLowerCase();
      
      if (typedSequence.length > secretWord.length) {
        typedSequence = typedSequence.slice(-secretWord.length);
      }
      
      if (typedSequence === secretWord) {
        this.triggerTypingEasterEgg();
        typedSequence = '';
      }
    });
  }

  triggerTypingEasterEgg() {
    // Add floating hearts
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        this.createFloatingHeart();
      }, i * 200);
    }
    
    this.showTemporaryMessage('💖 You typed the magic word! 💖');
  }

  createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '💖';
    heart.style.cssText = `
      position: fixed;
      font-size: 24px;
      pointer-events: none;
      z-index: 9999;
      left: ${Math.random() * window.innerWidth}px;
      top: ${window.innerHeight}px;
      animation: float-up 3s ease-out forwards;
    `;
    
    // Add floating animation if not present
    if (!document.querySelector('#float-styles')) {
      const style = document.createElement('style');
      style.id = 'float-styles';
      style.textContent = `
        @keyframes float-up {
          to {
            transform: translateY(-${window.innerHeight + 100}px) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
      heart.remove();
    }, 3000);
  }

  showTemporaryMessage(text) {
    const message = document.createElement('div');
    message.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      font-size: 16px;
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;
    message.textContent = text;
    
    // Add slide animation if not present
    if (!document.querySelector('#slide-styles')) {
      const style = document.createElement('style');
      style.id = 'slide-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.style.animation = 'slideIn 0.3s ease reverse';
      setTimeout(() => message.remove(), 300);
    }, 2000);
  }
}

// Initialize easter eggs when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new EasterEggs());
} else {
  new EasterEggs();
}
