class PasswordManager {
    constructor() {
        this.passwords = this.loadPasswords();
        this.init();
        this.createParticles();
    }

    init() {
        this.form = document.getElementById('passwordForm');
        this.passwordsList = document.getElementById('passwordsList');
        this.emptyState = document.getElementById('emptyState');
        this.generateBtn = document.getElementById('generateBtn');
        this.generatorOptions = document.getElementById('generatorOptions');
        this.passwordLengthInput = document.getElementById('passwordLength');
        this.lengthValue = document.getElementById('lengthValue');

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.generateBtn.addEventListener('click', () => this.toggleGeneratorOptions());
        this.passwordLengthInput.addEventListener('input', (e) => {
            this.lengthValue.textContent = e.target.value;
        });

        this.renderPasswords();
        this.addStaggerAnimation();
    }

    createParticles() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const container = document.createElement('div');
        container.className = 'floating-particles';
        document.body.appendChild(container);

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.bottom = `-${Math.random() * 100}px`;
            particle.style.animationDelay = `${Math.random() * 20}s`;
            particle.style.animationDuration = `${Math.random() * 15 + 15}s`;
            
            container.appendChild(particle);
        }
    }

    addStaggerAnimation() {
        const items = document.querySelectorAll('.password-item');
        items.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }

    loadPasswords() {
        const stored = localStorage.getItem('passwords');
        return stored ? JSON.parse(stored) : [];
    }

    savePasswords() {
        localStorage.setItem('passwords', JSON.stringify(this.passwords));
    }

    handleSubmit(e) {
        e.preventDefault();

        const website = document.getElementById('website').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!website || !username || !password) {
            this.showNotification('Please fill in all fields', 'error');
            this.shakeForm();
            return;
        }

        const exists = this.passwords.some(p => 
            p.website.toLowerCase() === website.toLowerCase() && 
            p.username.toLowerCase() === username.toLowerCase()
        );
        if (exists) {
            this.showNotification('A password for this website and username combination already exists', 'error');
            this.shakeForm();
            return;
        }

        const newPassword = {
            id: Date.now(),
            website,
            username,
            password,
            createdAt: new Date().toISOString()
        };

        this.passwords.unshift(newPassword);
        this.savePasswords();
        this.renderPasswords();
        this.form.reset();
        this.generatorOptions.classList.remove('show');
        this.showNotification('Password saved successfully!', 'success');
        this.createConfetti();
    }

    deletePassword(id) {
        const index = this.passwords.findIndex(p => p.id === id);
        if (index !== -1) {
            const website = this.passwords[index].website;

            this.passwords.splice(index, 1);
            this.savePasswords();
            this.renderPasswords();

            this.showNotification(`Password for ${website} deleted`, 'success');
        } else {
            this.showNotification('Password not found', 'error');
        }
    }



    togglePassword(id) {
        const passwordElement = document.getElementById(`password-${id}`);
        const toggleBtn = document.querySelector(`[data-action="toggle"][data-id="${id}"]`);
        
        if (passwordElement.textContent === '••••••••') {
            const password = this.passwords.find(p => p.id === id);
            passwordElement.style.filter = 'blur(0px)';
            passwordElement.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                passwordElement.textContent = password.password;
            }, 150);
            toggleBtn.textContent = 'Hide';
            toggleBtn.setAttribute('aria-label', 'Hide password');
            toggleBtn.setAttribute('aria-pressed', 'true');
        } else {
            passwordElement.style.filter = 'blur(5px)';
            setTimeout(() => {
                passwordElement.textContent = '••••••••';
                passwordElement.style.filter = 'blur(0px)';
            }, 150);
            toggleBtn.textContent = 'Show';
            toggleBtn.setAttribute('aria-label', 'Show password');
            toggleBtn.setAttribute('aria-pressed', 'false');
        }
    }

    generatePassword() {
        const length = parseInt(this.passwordLengthInput.value);
        const includeNumbers = document.getElementById('includeNumbers').checked;
        const includeSymbols = document.getElementById('includeSymbols').checked;

        let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeNumbers) chars += '0123456789';
        if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const passwordInput = document.getElementById('password');
        passwordInput.value = password;
        passwordInput.style.animation = 'none';
        setTimeout(() => {
            passwordInput.style.animation = 'pulse 0.5s ease-in-out';
        }, 10);
        
        this.showNotification('Password generated!', 'success');
    }

    toggleGeneratorOptions() {
        const isShowing = this.generatorOptions.classList.toggle('show');
        if (isShowing) {
            this.generatePassword();
        }
    }

    shakeForm() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        const form = this.form;
        form.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
    }

    createConfetti() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const colors = ['#667eea', '#764ba2', '#f093fb', '#48bb78'];
        const confettiCount = 30;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = '50%';
            confetti.style.top = '30%';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            
            document.body.appendChild(confetti);
            
            const angle = (Math.random() * 360) * (Math.PI / 180);
            const velocity = Math.random() * 300 + 200;
            const xVel = Math.cos(angle) * velocity;
            const yVel = Math.sin(angle) * velocity;
            
            let xPos = 0;
            let yPos = 0;
            let opacity = 1;
            let rotation = 0;
            
            const animate = () => {
                yPos += yVel * 0.02;
                xPos += xVel * 0.02;
                opacity -= 0.02;
                rotation += 10;
                
                confetti.style.transform = `translate(${xPos}px, ${yPos}px) rotate(${rotation}deg)`;
                confetti.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    confetti.remove();
                }
            };
            
            animate();
        }
    }

    renderPasswords() {
        if (this.passwords.length === 0) {
            this.emptyState.style.display = 'block';
            this.passwordsList.innerHTML = '';
            return;
        }

        this.emptyState.style.display = 'none';
        this.passwordsList.innerHTML = this.passwords.map((pwd, index) => `
            <div class="password-item" style="animation-delay: ${index * 0.1}s" data-id="${pwd.id}">
                <div class="password-header">
                    <div class="website-name">${this.escapeHtml(pwd.website)}</div>
                    <button class="delete-btn" data-action="delete" data-id="${pwd.id}" aria-label="Delete password for ${this.escapeHtml(pwd.website)}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Delete
                    </button>
                </div>
                <div class="password-details">
                    <div class="detail-row">
                        <span class="detail-label">Username:</span>
                        <div class="value-with-copy">
                            <span class="detail-value">${this.escapeHtml(pwd.username)}</span>
                            <button class="copy-btn" data-action="copy" data-id="${pwd.id}" data-field="username" aria-label="Copy username">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Password:</span>
                        <div class="password-display">
                            <span class="detail-value" id="password-${pwd.id}">••••••••</span>
                            <button class="toggle-password" data-action="toggle" data-id="${pwd.id}" aria-label="Show password" aria-pressed="false">Show</button>
                            <button class="copy-btn" data-action="copy" data-id="${pwd.id}" data-field="password" aria-label="Copy password">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Delete buttons
        document.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = Number(btn.dataset.id);
                this.deletePassword(id);
            });
        });

        // Toggle show/hide buttons
        document.querySelectorAll('[data-action="toggle"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = Number(btn.dataset.id);
                this.togglePassword(id);
            });
        });

        // Copy buttons
        document.querySelectorAll('[data-action="copy"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = Number(btn.dataset.id);
                const field = btn.dataset.field;
                this.copyToClipboardById(id, field, btn);
            });
        });
    }


    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    copyToClipboardById(id, field, button) {
        const password = this.passwords.find(p => p.id === id);
        if (!password) return;
        
        const text = password[field];
        
        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = button.innerHTML;
            button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            button.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.background = '';
            }, 1500);
            
            this.showNotification(`${field.charAt(0).toUpperCase() + field.slice(1)} copied to clipboard!`, 'success');
        }).catch(() => {
            this.showNotification('Failed to copy', 'error');
        });
    }

    showNotification(message, type) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

const passwordManager = new PasswordManager();
