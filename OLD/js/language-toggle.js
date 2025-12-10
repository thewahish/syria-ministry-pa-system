// Language Toggle System for PA System Website
// Supports Arabic and English with RTL/LTR switching

class LanguageToggle {
    constructor() {
        this.currentLang = localStorage.getItem('pa-system-lang') || 'en';
        this.init();
    }

    init() {
        this.createToggleButton();
        this.setLanguage(this.currentLang);
        this.bindEvents();
    }

    createToggleButton() {
        // Create language toggle container
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'language-toggle';
        toggleContainer.innerHTML = `
            <button class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en">
                <span class="flag">🇺🇸</span> English
            </button>
            <button class="lang-btn ${this.currentLang === 'ar' ? 'active' : ''}" data-lang="ar">
                <span class="flag">🇸🇾</span> العربية
            </button>
        `;

        // Insert after the first h1 or at the beginning of container
        const container = document.querySelector('.container') || document.body;
        const firstH1 = container.querySelector('h1');
        
        if (firstH1) {
            firstH1.parentNode.insertBefore(toggleContainer, firstH1.nextSibling);
        } else {
            container.insertBefore(toggleContainer, container.firstChild);
        }

        // Add CSS if not already present
        if (!document.querySelector('#language-toggle-css')) {
            this.addToggleCSS();
        }
    }

    addToggleCSS() {
        const css = document.createElement('style');
        css.id = 'language-toggle-css';
        css.textContent = `
            .language-toggle {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin: 20px 0;
                padding: 15px;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }

            .lang-btn {
                padding: 12px 24px;
                border: 2px solid #ddd;
                background: white;
                color: #333;
                border-radius: 25px;
                cursor: pointer;
                font-weight: 600;
                font-size: 16px;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }

            .lang-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                border-color: #3498db;
            }

            .lang-btn.active {
                background: linear-gradient(135deg, #3498db, #2980b9);
                color: white;
                border-color: #2980b9;
                box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
            }

            .flag {
                font-size: 20px;
                filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.3));
            }

            /* RTL Support */
            [dir="rtl"] .language-toggle {
                direction: rtl;
            }

            [dir="rtl"] .lang-btn {
                flex-direction: row-reverse;
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                .language-toggle {
                    flex-direction: column;
                    align-items: center;
                }
                
                .lang-btn {
                    min-width: 150px;
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(css);
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.lang-btn')) {
                const btn = e.target.closest('.lang-btn');
                const lang = btn.getAttribute('data-lang');
                this.setLanguage(lang);
            }
        });
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('pa-system-lang', lang);

        // Update document attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.body.className = lang;

        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        // Show/hide language content
        this.toggleContent(lang);

        // Update page title
        this.updateTitle(lang);
    }

    toggleContent(lang) {
        // Hide all language content
        document.querySelectorAll('[data-lang]').forEach(el => {
            el.style.display = 'none';
        });

        // Show content for selected language
        document.querySelectorAll(`[data-lang="${lang}"]`).forEach(el => {
            el.style.display = 'block';
        });

        // Handle elements without data-lang (keep visible)
        document.querySelectorAll('*:not([data-lang])').forEach(el => {
            // Skip if element has data-lang children
            if (el.querySelector('[data-lang]')) return;
            
            // Skip if element is a language-specific child
            if (el.closest('[data-lang]')) return;
            
            // Keep visible
            if (el.style.display === 'none') {
                el.style.display = '';
            }
        });
    }

    updateTitle(lang) {
        const titles = {
            'en': 'Syria Ministry PA System - Professional Audio Solutions',
            'ar': 'نظام الصوتيات لوزارة الداخلية السورية - حلول الصوت المهنية'
        };

        if (titles[lang]) {
            document.title = titles[lang];
        }
    }

    // Method to get current language
    getCurrentLanguage() {
        return this.currentLang;
    }

    // Method to get text in current language
    getText(enText, arText) {
        return this.currentLang === 'ar' ? arText : enText;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.languageToggle = new LanguageToggle();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageToggle;
}