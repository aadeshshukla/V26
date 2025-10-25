// Confetti Class for celebration
class Confetti {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    createConfetti(x, y, count = 80) {
        const colors = ['#ff1493', '#ff69b4', '#ffc0cb', '#ffd9e8', '#ffb6d9', '#ff69b4'];
        const shapes = ['circle', 'square', 'heart'];
        
        for (let i = 0; i < count; i++) {
            const particle = {
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10 - 4,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 6 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                shape: shapes[Math.floor(Math.random() * shapes.length)],
                life: 1,
                decay: Math.random() * 0.015 + 0.008
            };
            this.particles.push(particle);
        }
    }

    update() {
        this.particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15;
            p.rotation += p.rotationSpeed;
            p.life -= p.decay;
            
            if (p.life <= 0) {
                this.particles.splice(index, 1);
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            
            if (p.shape === 'circle') {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (p.shape === 'square') {
                this.ctx.fillRect(-p.size, -p.size, p.size * 2, p.size * 2);
            } else {
                // Heart shape
                this.ctx.font = (p.size * 2) + 'px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('💕', 0, 0);
            }
            
            this.ctx.restore();
        });
    }

    animate() {
        if (this.particles.length > 0) {
            this.update();
            this.draw();
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }

    burst(x, y) {
        this.createConfetti(x, y, 100);
        this.animate();
    }

    fullScreen() {
        const bursts = 6;
        for (let i = 0; i < bursts; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height * 0.6;
            setTimeout(() => {
                this.createConfetti(x, y, 60);
            }, i * 150);
        }
        this.animate();
    }
}

// Initialize confetti
const canvas = document.getElementById('confettiCanvas');
const confetti = new Confetti(canvas);

// Trigger celebration
function triggerCelebration() {
    confetti.fullScreen();
    
    // Button animation
    const btn = document.querySelector('.celebrate-btn');
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 100);
    
    // Add sound effect
    playCelebrationSound();
}

// Simple celebration sound
function playCelebrationSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Simple celebration beeps
    const notes = [
        { freq: 523, duration: 0.1 },  // C
        { freq: 659, duration: 0.1 },  // E
        { freq: 784, duration: 0.2 },  // G
    ];
    
    let currentTime = audioContext.currentTime;
    
    notes.forEach(note => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = note.freq;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.2, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
        
        oscillator.start(currentTime);
        oscillator.stop(currentTime + note.duration);
        
        currentTime += note.duration;
    });
}

// Double-click to celebrate
document.querySelector('.card').addEventListener('dblclick', triggerCelebration);

// Space key to celebrate
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        triggerCelebration();
    }
});

// Click on decorations for mini celebrations
document.querySelectorAll('.icon').forEach(icon => {
    icon.addEventListener('click', (e) => {
        confetti.burst(e.clientX, e.clientY);
    });
});

console.log('🎀 Birthday Card for Vaishuuuu is ready! 💕');
console.log('💡 Tips:');
console.log('- Click "Make a Wish" button to celebrate');
console.log('- Double-click the card to celebrate');
console.log('- Press Space to celebrate');
console.log('- Click on decorations for mini celebrations');