// Standalone Language Toggle System for PA System Website
// Self-contained with all necessary CSS inline
// Supports Arabic and English with RTL/LTR switching

class StandaloneLanguageToggle {
    constructor() {
        this.currentLang = localStorage.getItem('pa-system-lang') || 'en';
        this.init();
    }

    init() {
        console.log('Initializing with language:', this.currentLang);
        this.addInlineCSS();
        this.createToggleButton();
        this.bindEvents();
        // Set language after everything is set up
        this.setLanguage(this.currentLang);
    }

    addInlineCSS() {
        // Remove any existing toggle CSS
        const existingCSS = document.querySelector('#standalone-language-toggle-css');
        if (existingCSS) {
            existingCSS.remove();
        }

        const css = document.createElement('style');
        css.id = 'standalone-language-toggle-css';
        css.textContent = `
            .standalone-language-toggle {
                display: flex !important;
                justify-content: center !important;
                gap: 15px !important;
                margin: 20px 0 !important;
                padding: 20px !important;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                border-radius: 12px !important;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
                width: 100% !important;
                box-sizing: border-box !important;
            }

            .standalone-lang-btn {
                padding: 15px 25px !important;
                border: 2px solid #ddd !important;
                background: white !important;
                color: #333 !important;
                border-radius: 30px !important;
                cursor: pointer !important;
                font-weight: 600 !important;
                font-size: 16px !important;
                font-family: inherit !important;
                transition: all 0.3s ease !important;
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
                box-shadow: 0 3px 10px rgba(0,0,0,0.1) !important;
                min-width: 140px !important;
                justify-content: center !important;
                text-decoration: none !important;
                outline: none !important;
            }

            .standalone-lang-btn:hover {
                transform: translateY(-3px) !important;
                box-shadow: 0 6px 20px rgba(0,0,0,0.25) !important;
                border-color: #3498db !important;
                background: #f8f9fa !important;
            }

            .standalone-lang-btn.active {
                background: linear-gradient(135deg, #3498db, #2980b9) !important;
                color: white !important;
                border-color: #2980b9 !important;
                box-shadow: 0 6px 20px rgba(52, 152, 219, 0.5) !important;
                transform: translateY(-2px) !important;
            }

            .standalone-lang-btn.active:hover {
                background: linear-gradient(135deg, #2980b9, #1f6391) !important;
                transform: translateY(-4px) !important;
            }

            .standalone-flag {
                font-size: 22px !important;
                filter: drop-shadow(1px 1px 3px rgba(0,0,0,0.3)) !important;
                line-height: 1 !important;
            }

            /* RTL Support */
            [dir="rtl"] .standalone-language-toggle {
                direction: rtl !important;
            }

            [dir="rtl"] .standalone-lang-btn {
                flex-direction: row-reverse !important;
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                .standalone-language-toggle {
                    flex-direction: column !important;
                    align-items: center !important;
                    gap: 10px !important;
                }
                
                .standalone-lang-btn {
                    min-width: 200px !important;
                    justify-content: center !important;
                }
            }

            /* Language content visibility - Higher specificity rules */
            [data-lang] { 
                display: none !important; 
                visibility: hidden !important;
            }
            
            [data-lang].active-lang {
                display: block !important;
                visibility: visible !important;
            }
            
            /* Fallback body class rules */
            body.en [data-lang="en"] { 
                display: block !important; 
                visibility: visible !important;
            }
            
            body.ar [data-lang="ar"] { 
                display: block !important; 
                visibility: visible !important;
            }
        `;
        document.head.appendChild(css);
    }

    createToggleButton() {
        // Remove any existing toggle
        const existingToggle = document.querySelector('.standalone-language-toggle');
        if (existingToggle) {
            existingToggle.remove();
        }

        // Create language toggle container
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'standalone-language-toggle';
        toggleContainer.innerHTML = `
            <button class="standalone-lang-btn ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en" type="button">
                <span class="standalone-flag">🇺🇸</span>
                <span>English</span>
            </button>
            <button class="standalone-lang-btn ${this.currentLang === 'ar' ? 'active' : ''}" data-lang="ar" type="button">
                <span class="standalone-flag">🇸🇾</span>
                <span>العربية</span>
            </button>
        `;

        // Insert after the first h1 or at the beginning of container
        const container = document.querySelector('.container') || document.body;
        const firstH1 = container.querySelector('h1');
        
        if (firstH1 && firstH1.parentNode) {
            firstH1.parentNode.insertBefore(toggleContainer, firstH1.nextSibling);
        } else if (container.firstChild) {
            container.insertBefore(toggleContainer, container.firstChild);
        } else {
            container.appendChild(toggleContainer);
        }
    }

    bindEvents() {
        // Remove existing event listeners if they exist
        if (this.handleClick) {
            document.removeEventListener('click', this.handleClick);
        }
        
        // Create properly bound event handler
        this.handleClick = (e) => {
            const btn = e.target.closest('.standalone-lang-btn');
            if (btn) {
                e.preventDefault();
                e.stopPropagation();
                const lang = btn.getAttribute('data-lang');
                console.log('Language button clicked:', lang, 'Button element:', btn);
                this.setLanguage(lang);
            }
        };
        
        document.addEventListener('click', this.handleClick);
        
        // Also add direct event listeners to buttons for better reliability
        document.querySelectorAll('.standalone-lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const lang = btn.getAttribute('data-lang');
                console.log('Direct button click:', lang);
                this.setLanguage(lang);
            });
        });
    }

    setLanguage(lang) {
        console.log('Setting language to:', lang);
        this.currentLang = lang;
        localStorage.setItem('pa-system-lang', lang);

        // Update document attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.body.className = lang;

        // Update active button
        document.querySelectorAll('.standalone-lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        // Show/hide language content
        this.toggleContent(lang);

        // Update page title
        this.updateTitle(lang);

        console.log('Language switched to:', lang, 'Body class:', document.body.className);
    }

    toggleContent(lang) {
        console.log('Toggling content for language:', lang);
        
        // Hide all language content first using both CSS classes and inline styles
        document.querySelectorAll('[data-lang]').forEach(el => {
            el.style.display = 'none';
            el.classList.remove('active-lang');
        });

        // Show content for selected language with higher priority
        const elementsToShow = document.querySelectorAll(`[data-lang="${lang}"]`);
        console.log(`Found ${elementsToShow.length} elements for language ${lang}`);
        
        elementsToShow.forEach(el => {
            el.style.display = 'block';
            el.style.visibility = 'visible';
            el.classList.add('active-lang');
            console.log('Showing element:', el.tagName, el.textContent.substring(0, 50) + '...');
        });

        // Force a reflow to ensure changes are applied
        document.body.offsetHeight;
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

    // Public methods
    getCurrentLanguage() {
        return this.currentLang;
    }

    getText(enText, arText) {
        return this.currentLang === 'ar' ? arText : enText;
    }
}

// Single initialization - prevent multiple instances
(function() {
    // Prevent multiple initializations
    if (window.standaloneLanguageToggle) {
        console.log('Language toggle already initialized, skipping...');
        return;
    }
    
    function initializeToggle() {
        console.log('Initializing standalone language toggle...');
        window.standaloneLanguageToggle = new StandaloneLanguageToggle();
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeToggle);
    } else {
        initializeToggle();
    }
})();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StandaloneLanguageToggle;
}