/**
 * ==========================================================================
 * CLASSICAL & ROMANTIC INTERACTION ENGINE
 * For Giorgi Kharshiladze from Elene Bregvadze
 * Handles:
 * 1. Background Canvas: Gentle Drifting Hearts & Gold Stars
 * 2. Button 1 ("დააწირე აქ ❤️"): 15-20 Heart Burst with Golden "ელენე + გიორგი = უსასრულო სიყვარული"
 * 3. Button 2 ("გაუგზავნე ელენეს ჩახუტება 💌"): Golden Envelope Drop, Unfold & Notification
 * 4. Letter Modal: Classical Parchment Poem Reader
 * 5. Web Audio API Chimes & Ambient Romantic Lullaby
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. Web Audio API Synthesizer (Chimes & Ambient Melodies)
     ------------------------------------------------------------------------ */
  let audioCtx = null;
  let isPlayingMusic = false;
  let musicInterval = null;
  let musicStep = 0;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Soft romantic chime note
  function playNote(freq, duration = 1.2, gainPeak = 0.05, type = 'sine') {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);

      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      // Audio fallback silent handling
    }
  }

  // Romantic arpeggio sound effect for button clicks
  function playRomanticArpeggio() {
    const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C major pentatonic
    chord.forEach((freq, idx) => {
      setTimeout(() => {
        playNote(freq, 1.4, 0.05);
      }, idx * 75);
    });
  }

  // Envelope delivery chime sound
  function playEnvelopeChime() {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playNote(freq, 1.8, 0.06);
      }, idx * 110);
    });
  }

  // Toggle ambient gentle lullaby
  const melodyNotes = [329.63, 392.00, 440.00, 523.25, 659.25, 523.25, 440.00, 392.00];
  function toggleMusic() {
    const musicBtn = document.getElementById('music-toggle-btn');
    const musicLabel = document.getElementById('music-label');
    const ctx = getAudioContext();
    if (!ctx) return;

    if (isPlayingMusic) {
      isPlayingMusic = false;
      clearInterval(musicInterval);
      if (musicBtn) musicBtn.classList.remove('playing');
      if (musicLabel) musicLabel.textContent = 'მელოდია';
    } else {
      isPlayingMusic = true;
      if (musicBtn) musicBtn.classList.add('playing');
      if (musicLabel) musicLabel.textContent = 'მელოდია ♫';

      musicStep = 0;
      musicInterval = setInterval(() => {
        if (!isPlayingMusic) return;
        const note = melodyNotes[musicStep % melodyNotes.length];
        playNote(note, 2.0, 0.035, 'triangle');
        musicStep++;
      }, 700);
    }
  }

  const musicBtn = document.getElementById('music-toggle-btn');
  if (musicBtn) {
    musicBtn.addEventListener('click', toggleMusic);
  }

  /* ------------------------------------------------------------------------
     2. Ambient Drifting Canvas: Deep Red Hearts & Soft Gold Stars
     ------------------------------------------------------------------------ */
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 28;

    class AmbientParticle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : height + 20;
        this.type = Math.random() > 0.45 ? 'heart' : 'star';
        this.size = this.type === 'heart' ? 8 + Math.random() * 8 : 6 + Math.random() * 7;
        this.vy = -(0.25 + Math.random() * 0.45);
        this.vx = (Math.random() - 0.5) * 0.35;
        this.alpha = 0.2 + Math.random() * 0.45;
        this.alphaSpeed = 0.005 + Math.random() * 0.008;
        this.growing = Math.random() > 0.5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.01;
        this.color = this.type === 'heart' ? '#c41e3a' : '#daa520';
      }

      update() {
        this.y += this.vy;
        this.x += this.vx;
        this.rotation += this.rotSpeed;

        if (this.growing) {
          this.alpha += this.alphaSpeed;
          if (this.alpha >= 0.65) this.growing = false;
        } else {
          this.alpha -= this.alphaSpeed;
          if (this.alpha <= 0.15) this.growing = true;
        }

        if (this.y < -30 || this.x < -30 || this.x > width + 30) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;

        if (this.type === 'heart') {
          const s = this.size;
          ctx.beginPath();
          ctx.moveTo(0, s * 0.3);
          ctx.bezierCurveTo(-s * 0.5, -s * 0.3, -s, s * 0.2, 0, s);
          ctx.bezierCurveTo(s, s * 0.2, s * 0.5, -s * 0.3, 0, s * 0.3);
          ctx.fill();
        } else {
          // 4-pointed golden sparkle star
          const s = this.size * 0.85;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new AmbientParticle());
    }

    function renderAmbient() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(renderAmbient);
    }

    requestAnimationFrame(renderAmbient);
  }

  /* ------------------------------------------------------------------------
     3. Button 1: "დააწირე აქ ❤️" (Burst of 15-20 Hearts with Golden Inscription)
     ------------------------------------------------------------------------ */
  const burstBtn = document.getElementById('btn-burst-hearts');
  const burstStage = document.getElementById('hearts-burst-stage');

  if (burstBtn && burstStage) {
    burstBtn.addEventListener('click', (e) => {
      playRomanticArpeggio();

      // Get origin position
      const rect = burstBtn.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;

      // Create 18 large floating hearts
      const heartCount = 18;
      for (let i = 0; i < heartCount; i++) {
        createBurstHeart(originX, originY, i, heartCount);
      }
    });
  }

  function createBurstHeart(originX, originY, index, total) {
    const heart = document.createElement('div');
    heart.className = 'burst-heart-item';

    // Spread angles across 360 degrees, favoring upward direction
    const angle = (index / total) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
    const distance1 = 120 + Math.random() * 160;
    const distance2 = 280 + Math.random() * 320;

    const startX = originX + (Math.random() - 0.5) * 40;
    const startY = originY + (Math.random() - 0.5) * 20;

    const midX = startX + Math.cos(angle) * distance1;
    const midY = startY + Math.sin(angle) * distance1 - 80;

    const endX = startX + Math.cos(angle) * distance2;
    const endY = startY - 260 - Math.random() * 300;

    const fadeX = endX + (Math.random() - 0.5) * 60;
    const fadeY = endY - 120;

    heart.style.setProperty('--startX', `${startX}px`);
    heart.style.setProperty('--startY', `${startY}px`);
    heart.style.setProperty('--midX', `${midX}px`);
    heart.style.setProperty('--midY', `${midY}px`);
    heart.style.setProperty('--endX', `${endX}px`);
    heart.style.setProperty('--endY', `${endY}px`);
    heart.style.setProperty('--fadeX', `${fadeX}px`);
    heart.style.setProperty('--fadeY', `${fadeY}px`);

    heart.style.setProperty('--rotStart', `${(Math.random() - 0.5) * 30}deg`);
    heart.style.setProperty('--rotMid', `${(Math.random() - 0.5) * 25}deg`);
    heart.style.setProperty('--rotEnd', `${(Math.random() - 0.5) * 35}deg`);

    // SVG Heart with Warm Crimson Red
    const heartSize = 52 + Math.random() * 26;
    heart.innerHTML = `
      <svg class="burst-heart-svg" width="${heartSize}" height="${heartSize}" viewBox="0 0 100 90">
        <defs>
          <radialGradient id="heartGrad${index}" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#ff3b5c" />
            <stop offset="60%" stop-color="#c41e3a" />
            <stop offset="100%" stop-color="#880e22" />
          </radialGradient>
        </defs>
        <path d="M50,85 C20,60 0,40 0,22 C0,9 10,0 23,0 C34,0 44,7 50,16 C56,7 66,0 77,0 C90,0 100,9 100,22 C100,40 80,60 50,85 Z"
              fill="url(#heartGrad${index})" />
      </svg>
      <div class="burst-heart-label">
        ელენე + გიორგი = უსასრულო სიყვარული ❤️
      </div>
    `;

    burstStage.appendChild(heart);

    // Remove element after animation ends (~3.3 seconds)
    setTimeout(() => {
      if (heart.parentNode) {
        heart.parentNode.removeChild(heart);
      }
    }, 3300);
  }

  /* ------------------------------------------------------------------------
     4. Button 2: "გაუგზავნე ელენეს ჩახუტება 💌" (Envelope Flight & Notification)
     ------------------------------------------------------------------------ */
  const hugBtn = document.getElementById('btn-send-hug');
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const vintageEnvelope = document.getElementById('vintage-envelope');
  const deliveryStatusBox = document.getElementById('delivery-status-box');
  let isEnvelopeAnimating = false;

  function triggerHugEnvelope() {
    if (isEnvelopeAnimating) return;
    isEnvelopeAnimating = true;

    playEnvelopeChime();

    // Reset classes
    vintageEnvelope.classList.remove('open');
    deliveryStatusBox.classList.remove('show');
    envelopeOverlay.classList.add('active');

    // Step 1: Open Envelope Flap after dropping down
    setTimeout(() => {
      vintageEnvelope.classList.add('open');
      playNote(880, 1.2, 0.05);

      // Spawn burst sparkles and hearts from envelope
      spawnEnvelopeSparkles();
    }, 550);

    // Step 2: Show green delivery status
    setTimeout(() => {
      deliveryStatusBox.classList.add('show');
    }, 1100);

    // Step 3: Fade out and restore
    setTimeout(() => {
      envelopeOverlay.classList.remove('active');
      setTimeout(() => {
        vintageEnvelope.classList.remove('open');
        deliveryStatusBox.classList.remove('show');
        isEnvelopeAnimating = false;
      }, 500);
    }, 3200);
  }

  if (hugBtn) {
    hugBtn.addEventListener('click', triggerHugEnvelope);
  }

  function spawnEnvelopeSparkles() {
    const stage = document.getElementById('envelope-card-stage');
    if (!stage) return;

    const sparkleIcons = ['❤️', '✨', '⭐', '💖', '💌'];
    for (let i = 0; i < 14; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'envelope-sparkle';
      sparkle.textContent = sparkleIcons[Math.floor(Math.random() * sparkleIcons.length)];

      const angle = Math.random() * Math.PI * 2;
      const dist = 70 + Math.random() * 110;
      const destX = Math.cos(angle) * dist;
      const destY = Math.sin(angle) * dist - 30;

      sparkle.style.setProperty('--destX', `${destX}px`);
      sparkle.style.setProperty('--destY', `${destY}px`);
      sparkle.style.fontSize = `${1.1 + Math.random() * 0.7}rem`;
      sparkle.style.left = '50%';
      sparkle.style.top = '40%';

      stage.appendChild(sparkle);

      setTimeout(() => {
        if (sparkle.parentNode) sparkle.parentNode.removeChild(sparkle);
      }, 1600);
    }
  }

  /* ------------------------------------------------------------------------
     5. Letter Modal Reader: Romantic Parchment & Poem
     ------------------------------------------------------------------------ */
  const openLetterBtn = document.getElementById('btn-open-letter');
  const headerLetterBtn = document.getElementById('header-letter-btn');
  const letterModal = document.getElementById('letter-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalHugReplyBtn = document.getElementById('modal-hug-reply-btn');

  function openLetterModal() {
    playNote(659.25, 1.2, 0.04);
    if (letterModal) {
      letterModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLetterModal() {
    if (letterModal) {
      letterModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (openLetterBtn) openLetterBtn.addEventListener('click', openLetterModal);
  if (headerLetterBtn) headerLetterBtn.addEventListener('click', openLetterModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeLetterModal);

  // Close when clicking outside of parchment sheet
  if (letterModal) {
    letterModal.addEventListener('click', (e) => {
      if (e.target === letterModal) {
        closeLetterModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && letterModal && letterModal.classList.contains('open')) {
      closeLetterModal();
    }
  });

  // Hug Reply Button inside modal
  if (modalHugReplyBtn) {
    modalHugReplyBtn.addEventListener('click', () => {
      closeLetterModal();
      setTimeout(() => {
        triggerHugEnvelope();
      }, 350);
    });
  }

});
